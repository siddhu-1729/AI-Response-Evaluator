from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.schemas.batch_result import BatchResult
from app.reports.pdf_report import generate_pdf_report


router = APIRouter(
    tags=["Reports"]
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ReportRequest(BaseModel):
    results: list[BatchResult]


# ============================================================
# BATCH PDF REPORT
# ============================================================

@router.post(
    "/batch",
    summary="Generate PDF report for batch evaluations",
)
async def generate_batch_report(
    request: ReportRequest,
):

    # --------------------------------------------------------
    # Validate
    # --------------------------------------------------------

    if not request.results:

        raise HTTPException(
            status_code=400,
            detail="No evaluation results were provided.",
        )

    # --------------------------------------------------------
    # Generate PDF
    # --------------------------------------------------------

    try:

        pdf_buffer = generate_pdf_report(
            request.results
        )

    except Exception as exc:

        print(
            "PDF generation error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate evaluation report."
            ),
        )

    # --------------------------------------------------------
    # Return PDF
    # --------------------------------------------------------

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                'attachment; '
                'filename="evaluation-report.pdf"'
            )
        },
    )