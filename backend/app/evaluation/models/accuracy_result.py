from typing import List

from pydantic import BaseModel, Field


class AccuracyResult(BaseModel):

    score: float = Field(
        description="Accuracy score between 0 and 10"
    )

    confidence: float = Field(
        description="Confidence score between 0 and 1"
    )

    supporting_evidence: List[str] = Field(
        description="Evidence supporting the assigned score"
    )

    reason: str = Field(
        description="Reason for assigning the score"
    )