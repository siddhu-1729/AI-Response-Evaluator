from typing import List

from pydantic import BaseModel

from app.schemas.batch_summary import BatchSummary
from app.schemas.batch_result import BatchResult


class BatchEvaluationResponse(BaseModel):

    summary: BatchSummary

    results: List[BatchResult]