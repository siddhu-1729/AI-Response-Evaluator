from typing import List

from pydantic import BaseModel, Field


class HallucinatedClaim(BaseModel):

    claim: str = Field(
        description="Claim extracted from the response"
    )

    reason: str = Field(
        description="Why this claim is unsupported"
    )


class SupportedClaim(BaseModel):

    claim: str = Field(
        description="Claim verified by the evidence"
    )


class HallucinationResult(BaseModel):

    score: float = Field(
        description="Hallucination score between 0 and 10"
    )

    confidence: float = Field(
        description="Confidence between 0 and 1"
    )

    hallucinated_claims: List[HallucinatedClaim]

    supported_claims: List[SupportedClaim]

    reason: str