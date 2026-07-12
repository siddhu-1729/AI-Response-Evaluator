from fastapi import APIRouter
from app.schemas.evaluations import EvaluationRequest

router = APIRouter()

# @router.post("/")
# def evaluate(request:EvaluationRequest):
#     return {
#         "message":"Evaluation Request received",
#         "question":request.question,
#         "response":request.response,
#          "reference":request.reference_answer
#     }

from app.schemas.evaluations import (
    EvaluationRequest,
    EvaluationResponse
)

from app.engine.evaluation_engine import EvaluationEngine

engine = EvaluationEngine()


@router.post("/", response_model=EvaluationResponse)
def evaluate(request: EvaluationRequest):

    return engine.evaluate(request)