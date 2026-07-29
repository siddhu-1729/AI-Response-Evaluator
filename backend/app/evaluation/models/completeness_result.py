from pydantic import BaseModel
from typing import List


class CompletenessResult(BaseModel):

    score: int

    confidence: int

    covered_aspects: List[str]

    missing_aspects: List[str]

    reason: str