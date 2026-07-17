import json
import os

from dotenv import load_dotenv
from google import genai

from app.evaluation.models.relevance_result import RelevanceResult


class RelevanceAgent:

    def __init__(self):

        load_dotenv()

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in .env")

        self.client = genai.Client(api_key=api_key)

    def evaluate(
        self,
        question: str,
        response: str
    ) -> RelevanceResult:

        prompt = f"""
You are an AI Response Evaluation Judge.

Evaluate ONLY the relevance of the response.

Ignore:
- factual correctness
- grammar
- hallucinations

Question:
{question}

Response:
{response}

Return ONLY valid JSON.

The JSON format must be:

{{
    "score": 9.5,
    "label": "Highly Relevant",
    "confidence": 0.97,
    "reason": "The response directly answers the user's question."
}}

Scoring Scale:

0-2   -> Not Relevant

3-5   -> Slightly Relevant

6-8   -> Relevant

9-10  -> Highly Relevant
"""

        result = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = result.text.strip()

        # Remove markdown if Gemini returns ```json
        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        data = json.loads(text)

        return RelevanceResult(**data)