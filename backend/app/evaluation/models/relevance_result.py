from pydantic import BaseModel, Field


class RelevanceResult(BaseModel):
    score: float = Field(
        description="Relevance score between 0 and 10"
    )

    label: str = Field(
        description="Relevance category"
    )

    confidence: float = Field(
        description="Confidence score between 0 and 1"
    )

    reason: str = Field(
        description="Reason for assigning the score"
    )