from pydantic import BaseModel
from typing import Optional

class EvaluationRequest(BaseModel):
    question:str
    response:str
    reference_answer:Optional[str] = None

class EvaluationResponse(BaseModel):
    overall_score:float
    grammar:float
    similarity:float
    reasoning:float
    feedback:list[str]