from pydantic import BaseModel

from app.evaluation.models.combined_result import CombinedEvaluationResult


class BatchResult(BaseModel):

    question: str

    response: str

    evaluation: CombinedEvaluationResult