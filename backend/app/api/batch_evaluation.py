from fastapi import APIRouter, UploadFile, File, HTTPException

from app.engine.evaluation_engine import EvaluationEngine

from app.knowledgebase.retriever import Retriever

from app.schemas.batch_response import BatchEvaluationResponse
from app.schemas.batch_result import BatchResult
from app.schemas.batch_summary import BatchSummary
from app.knowledgebase.embeddings.embedder import Embedder
from app.knowledgebase.vectorstore.chroma_store import ChromaVectorStore

from app.services.csv_reader import CSVReader


router = APIRouter(
    prefix="/api/v1/batch-evaluations",
    tags=["Batch Evaluation"]
)

engine = EvaluationEngine()
verctor_store=ChromaVectorStore()
embedder=Embedder()
retriever = Retriever(verctor_store,embedder)


@router.post(
    "/",
    response_model=BatchEvaluationResponse
)
async def batch_evaluate(
    file: UploadFile = File(...)
):

    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV file."
        )

    # Read CSV
    rows = await CSVReader.read(file)

    if len(rows) == 0:
        raise HTTPException(
            status_code=400,
            detail="CSV contains no valid rows."
        )

    results = []

    relevance_total = 0.0
    accuracy_total = 0.0
    hallucination_total = 0.0
    completeness_total = 0.0
    overall_total = 0.0

    for row in rows:

        question = row["question"]
        response = row["response"]

        # Retrieve evidence using RAG
        evidence = retriever.retrieve(question)

        # Evaluate using existing pipeline
        evaluation = engine.evaluate(
            question=question,
            response=response,
            evidence="\n\n".join(evidence)
        )

        results.append(

            BatchResult(

                question=question,

                response=response,

                evaluation=evaluation

            )

        )

        relevance_total += evaluation.relevance.score
        accuracy_total += evaluation.accuracy.score
        hallucination_total += evaluation.hallucination.score
        completeness_total += evaluation.completeness.score
        overall_total += evaluation.verdict.overall_score

    total = len(results)

    summary = BatchSummary(

        total_evaluations=total,

        average_relevance=round(
            relevance_total / total,
            2
        ),

        average_accuracy=round(
            accuracy_total / total,
            2
        ),

        average_hallucination=round(
            hallucination_total / total,
            2
        ),

        average_completeness=round(
            completeness_total / total,
            2
        ),

        average_overall=round(
            overall_total / total,
            2
        )

    )

    return BatchEvaluationResponse(

        summary=summary,

        results=results

    )