from pydantic import BaseModel

class VerdictResult(BaseModel):
    overall_score :float
    verdict:str
    strengths: list[str]
    weaknesses: list[str]
    recommendation: str