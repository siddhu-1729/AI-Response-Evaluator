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
from app.evaluation.models.combined_result import CombinedEvaluationResult

engine = EvaluationEngine()


@router.post("/", response_model=CombinedEvaluationResult)
def evaluate(request: EvaluationRequest):
    print("Request received from client:",request)
    return engine.evaluate(request.question,request.response)