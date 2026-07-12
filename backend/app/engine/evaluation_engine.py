from app.schemas.evaluations import EvaluationRequest, EvaluationResponse


class EvaluationEngine:

    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:

        # Mock scores (we'll replace these later)
        grammar_score = 10.0
        similarity_score = 9.0
        reasoning_score = 9.5

        overall_score = (
            grammar_score +
            similarity_score +
            reasoning_score
        ) / 3

        feedback = [
            "Good explanation.",
            "Consider adding an example."
        ]

        return EvaluationResponse(
            overall_score=overall_score,
            grammar=grammar_score,
            similarity=similarity_score,
            reasoning=reasoning_score,
            feedback=feedback
        )