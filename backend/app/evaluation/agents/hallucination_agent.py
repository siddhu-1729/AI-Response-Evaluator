import json
import os

from dotenv import load_dotenv
from google import genai

from app.evaluation.models.hallucination_result import (
    HallucinationResult
)


class HallucinationAgent:

    def __init__(self):

        load_dotenv()

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found.")

        self.client = genai.Client(api_key=api_key)

    def evaluate(
        self,
        question: str,
        response: str,
        evidence: str
    ) -> HallucinationResult:

        prompt = f"""
You are an AI Hallucination Detection Judge.

Your task is to identify unsupported factual claims.

Instructions:

1. Read the QUESTION.

2. Read the EVIDENCE.

3. Read the RESPONSE.

4. Break the response into factual claims.

5. Compare every claim with the evidence.

6. If a claim is not supported by the evidence,
mark it as hallucinated.

7. If a claim is supported,
mark it as supported.

Return ONLY valid JSON.

JSON format:

{{
    "score": 8.5,
    "confidence": 0.96,

    "hallucinated_claims":[
        {{
            "claim":"...",
            "reason":"..."
        }}
    ],

    "supported_claims":[
        {{
            "claim":"..."
        }}
    ],

    "reason":"Overall explanation."
}}

Scoring Guide

9-10 :
Almost no hallucination.

7-8 :
Minor unsupported claims.

4-6 :
Several unsupported claims.

1-3 :
Mostly hallucinated.

0 :
Entire response unsupported.

QUESTION

{question}

EVIDENCE

{evidence}

RESPONSE

{response}
"""

        result = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = result.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        data = json.loads(text)

        return HallucinationResult(**data)