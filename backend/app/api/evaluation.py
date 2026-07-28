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
from app.knowledgebase.retriever import Retriever
from app.knowledgebase.embeddings.embedder import Embedder
from app.knowledgebase.vectorstore.chroma_store import ChromaVectorStore

vector_store = ChromaVectorStore()
embedder = Embedder()

engine = EvaluationEngine()
retriever=Retriever(vector_store=vector_store,
                    embedder=embedder)


@router.post("/", response_model=CombinedEvaluationResult)
def evaluate(request: EvaluationRequest):
    evidence=retriever.retrieve(request.question)
    # print("Request received from client:",request)
    result=engine.evaluate(
        request.question,
        request.response,
        evidence="\n\n".join(evidence))
    return result