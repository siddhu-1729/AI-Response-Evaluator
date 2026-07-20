# from app.schemas.evaluations import EvaluationRequest, EvaluationResponse


# class EvaluationEngine:

#     def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:

#         # Mock scores (we'll replace these later)
#         grammar_score = 10.0
#         similarity_score = 9.0
#         reasoning_score = 9.5

#         overall_score = (
#             grammar_score +
#             similarity_score +
#             reasoning_score
#         ) / 3

#         feedback = [
#             "Good explanation.",
#             "Consider adding an example."
#         ]

#         return EvaluationResponse(
#             overall_score=overall_score,
#             grammar=grammar_score,
#             similarity=similarity_score,
#             reasoning=reasoning_score,
#             feedback=feedback
#         )

from app.evaluation.agents.relevance_agent import RelevanceAgent
from app.evaluation.agents.accuracy_agent import AccuracyAgent
from app.evaluation.agents.hallucination_agent import HallucinationAgent

from app.evaluation.models.evaluation_result import EvaluationResult


class EvaluationEngine:

    def __init__(self):

        self.relevance_agent = RelevanceAgent()

        self.accuracy_agent = AccuracyAgent()

        self.hallucination_agent = HallucinationAgent()

    def evaluate(

        self,

       question,
       response,
       evidence

    ) -> EvaluationResult:

        relevance = self.relevance_agent.evaluate(

            question,

            response
        )

        accuracy = self.accuracy_agent.evaluate(

           question,

            response,

            evidence
        )

        hallucination = self.hallucination_agent.evaluate(

            question,

            response,

            evidence
        )

        return EvaluationResult(

            relevance=relevance,

            accuracy=accuracy,

            hallucination=hallucination
        )