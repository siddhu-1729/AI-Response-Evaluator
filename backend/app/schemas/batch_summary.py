from pydantic import BaseModel


class BatchSummary(BaseModel):

    total_evaluations: int

    average_relevance: float

    average_accuracy: float

    average_hallucination: float

    average_completeness: float

    average_overall: float