
# from app.evaluation.agents.relevance_agent import RelevanceAgent
# from app.evaluation.agents.accuracy_agent import AccuracyAgent
# from app.evaluation.agents.hallucination_agent import HallucinationAgent

# from app.evaluation.models.evaluation_result import EvaluationResult


# class EvaluationEngine:

#     def __init__(self):

#         self.relevance_agent = RelevanceAgent()

#         self.accuracy_agent = AccuracyAgent()

#         self.hallucination_agent = HallucinationAgent()

#     def evaluate(

#         self,

#        question,
#        response,
#        evidence

#     ) -> EvaluationResult:

#         relevance = self.relevance_agent.evaluate(

#             question,

#             response
#         )

#         accuracy = self.accuracy_agent.evaluate(

#            question,

#             response,

#             evidence
#         )

#         hallucination = self.hallucination_agent.evaluate(

#             question,

#             response,

#             evidence
#         )

#         return EvaluationResult(

#             relevance=relevance,

#             accuracy=accuracy,

#             hallucination=hallucination
#         )

# previous code has multiple api calls - makes 3 gemini api calls for each sample Now it is optimised to make just 1 call for three agents.
from app.evaluation.agents.combined_judge_agent import CombinedJudgeAgent


class EvaluationEngine:

    def __init__(self):
        self.judge = CombinedJudgeAgent()
           
    def evaluate(
        self,
        question: str,
        response: str,
        evidence: str,
    ):

        return self.judge.evaluate(
            question,
            response,
            evidence
        )