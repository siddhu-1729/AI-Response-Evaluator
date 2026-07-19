import json
import os

from dotenv import load_dotenv
from google import genai

from app.evaluation.models.accuracy_result import AccuracyResult


class AccuracyAgent:

    def __init__(self):

        load_dotenv()

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY not found")

        self.client = genai.Client(api_key=api_key)

    def evaluate(
        self,
        question: str,
        response: str,
        evidence: str
    ) -> AccuracyResult:

        prompt = f"""
You are an AI Accuracy Evaluation Judge.

Evaluate ONLY factual accuracy.

Do NOT evaluate:

- relevance
- grammar
- writing style
- hallucination separately

Your task is to compare the RESPONSE against the REFERENCE.

Question:
{question}

Evidence:
{evidence}

Response:
{response}

Return ONLY valid JSON.

JSON Format:

{{
    "score": 9.8,
    "confidence": 0.98,
    "supporting_evidence": [
        "..."
    ],
    "reason": "..."
}}

Scoring Guide

9-10 : Completely accurate

7-8 : Mostly accurate with minor issues

4-6 : Partially accurate

1-3 : Mostly inaccurate

0 : Completely incorrect
"""

        result = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = result.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        data = json.loads(text)

        return AccuracyResult(**data)