from pydantic import BaseModel

from app.evaluation.models.relevance_result import RelevanceResult
from app.evaluation.models.accuracy_result import AccuracyResult
from app.evaluation.models.hallucination_result import HallucinationResult


class EvaluationResult(BaseModel):

    relevance: RelevanceResult

    accuracy: AccuracyResult

    hallucination: HallucinationResult