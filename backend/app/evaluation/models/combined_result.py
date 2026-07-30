from pydantic import BaseModel

from app.evaluation.models.relevance_result import RelevanceResult
from app.evaluation.models.accuracy_result import AccuracyResult
from app.evaluation.models.hallucination_result import HallucinationResult
from app.evaluation.models.completeness_result import CompletenessResult
from app.evaluation.models.verdict_result import VerdictResult

class CombinedEvaluationResult(BaseModel):

    relevance: RelevanceResult

    accuracy: AccuracyResult

    hallucination: HallucinationResult

    completeness: CompletenessResult

    verdict:VerdictResult