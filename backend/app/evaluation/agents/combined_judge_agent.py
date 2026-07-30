import json
import os

from dotenv import load_dotenv
from google import genai

# from app.evaluation.models.evaluation_result import EvaluationResult
from app.evaluation.models.combined_result import CombinedEvaluationResult,RelevanceResult,HallucinationResult,AccuracyResult,CompletenessResult
from app.evaluation.agents.verdict_agent import VerdictAgent

load_dotenv()


class CombinedJudgeAgent:

    def __init__(self):

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )
        self.verdict_agent=VerdictAgent()

    def _build_prompt(
    self,
    question: str,
    response: str,
    evidence: str
) -> str:

     return f"""
You are an expert AI Response Evaluator.

Your task is to independently evaluate an AI-generated response using FOUR metrics.

==========================================================
QUESTION
==========================================================

{question}

==========================================================
AI RESPONSE
==========================================================

{response}

==========================================================
REFERENCE EVIDENCE
==========================================================

{evidence}

==========================================================
INSTRUCTIONS
==========================================================

Evaluate the response independently for:

1. RELEVANCE
2. ACCURACY
3. HALLUCINATION
4. COMPLETENESS

Do NOT let one metric influence another.

----------------------------------------------------------
RELEVANCE
----------------------------------------------------------

Evaluate how well the response answers the user's question.

Return

- score (0-10)
- label
- confidence (0-1)
- reason

----------------------------------------------------------
ACCURACY
----------------------------------------------------------

Compare ONLY against the provided evidence.

Return

- score (0-10)
- confidence (0-1)
- supporting_evidence (list)
- reason

----------------------------------------------------------
HALLUCINATION
----------------------------------------------------------

Break the response into factual claims.

For every claim determine whether it is

- supported
- unsupported

Return

- score (0-10)
- confidence (0-1)
- supported_claims
- hallucinated_claims
- reason

IMPORTANT

Hallucination score meaning:

10 = no hallucination

0 = severe hallucination

----------------------------------------------------------
COMPLETENESS
----------------------------------------------------------

Evaluate whether the AI response completely answers the user's question using ONLY the provided reference evidence.

Determine:

- Which important aspects of the expected answer are covered.
- Which important aspects are missing.
- Ignore grammar.
- Ignore writing style.
- Ignore hallucinations.
- Ignore factual correctness unless it affects completeness.

Return

- score (0-10)
- confidence (0-1)
- covered_aspects (list)
- missing_aspects (list)
- reason

Metric Guidelines

- Relevance: Did the response address the user's question?
- Accuracy: Is the information supported by the reference evidence?
- Hallucination: Did the response introduce unsupported factual claims?
- Completeness: Did the response cover all major aspects expected from the reference evidence?

==========================================================
OUTPUT FORMAT
==========================================================

Return ONLY valid JSON.

{{
    "relevance": {{
        "score": 0,
        "label": "",
        "confidence": 0,
        "reason": ""
    }},
    "accuracy": {{
        "score": 0,
        "confidence": 0,
        "supporting_evidence": [],
        "reason": ""
    }},
    "hallucination": {{
        "score": 0,
        "confidence": 0,
        "hallucinated_claims": [
            {{
                "claim": "",
                "reason": ""
            }}
        ],
        "supported_claims": [
            {{
                "claim": ""
            }}
        ],
        "reason": ""
    }},
    "completeness": {{
        "score": 0,
        "confidence": 0,
        "covered_aspects": [],
        "missing_aspects": [],
        "reason": ""
    }}
}}
"""

    def evaluate(
        self,
        question: str,
        response: str,
        evidence: str
    ) -> CombinedEvaluationResult:

        prompt = self._build_prompt(
            question,
            response,
            evidence
        )

        result = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        print("\n========== GEMINI RAW RESPONSE ==========\n")
        print(result.text)
        print("\n=========================================\n")

        text = result.text.strip()

        # Remove markdown fences if Gemini adds them
        if text.startswith("```json"):
            text = text.replace("```json", "", 1)

        if text.endswith("```"):
            text = text[:-3]

        text = text.strip()

        data = json.loads(text)

        # Compute the verdict score (Overall score of all agents)
        verdict=self.verdict_agent.generate_verdict(
            relevance=RelevanceResult(**data["relevance"]),
            accuracy=AccuracyResult(**data["accuracy"]),
            hallucination=HallucinationResult(**data["hallucination"]),
            completeness=CompletenessResult(**data["completeness"])
            )
        
        # Attach the verdict to the data
        data["verdict"]=verdict.model_dump()
       # Returning the final result
        return CombinedEvaluationResult.model_validate(data)