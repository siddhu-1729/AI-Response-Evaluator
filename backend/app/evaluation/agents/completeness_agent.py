import json
import os
from google import genai

from dotenv import load_dotenv
from app.evaluation.models.completeness_result import CompletenessResult
from app.evaluation.prompts.completeness_prompt import COMPLETENESS_PROMPT


class CompletenessAgent:

    def __init__(self):
        load_dotenv()

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.model = "gemini-2.5-flash"

    def evaluate(
        self,
        question: str,
        response: str,
        evidence: str
    ) -> CompletenessResult:

        prompt = f"""
{COMPLETENESS_PROMPT}

Question:
{question}

AI Response:
{response}

Reference Evidence:
{evidence}
"""

        result = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        text = result.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        elif text.startswith("```"):
            text = text.replace("```", "").strip()

        data = json.loads(text)

        return CompletenessResult(**data)