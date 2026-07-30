from app.evaluation.models.relevance_result import RelevanceResult
from app.evaluation.models.accuracy_result import AccuracyResult
from app.evaluation.models.hallucination_result import HallucinationResult
from app.evaluation.models.completeness_result import CompletenessResult
from app.evaluation.models.verdict_result import VerdictResult


class VerdictAgent:

    def generate_verdict(
        self,
        relevance: RelevanceResult,
        accuracy: AccuracyResult,
        hallucination: HallucinationResult,
        completeness: CompletenessResult
    ) -> VerdictResult:

        overall_score = round(
            (
                relevance.score
                + accuracy.score
                + hallucination.score
                + completeness.score
            )
            / 4,
            2
        )

        # ---------------------------------------
        # Overall Verdict
        # ---------------------------------------

        if overall_score >= 9:
            verdict = "Excellent"

        elif overall_score >= 8:
            verdict = "Very Good"

        elif overall_score >= 7:
            verdict = "Good"

        elif overall_score >= 5:
            verdict = "Fair"

        else:
            verdict = "Poor"

        # ---------------------------------------
        # Strengths
        # ---------------------------------------

        strengths = []

        if relevance.score >= 8:
            strengths.append(
                "The response is highly relevant to the user's question."
            )

        if accuracy.score >= 8:
            strengths.append(
                "The response is well supported by the reference evidence."
            )

        if hallucination.score >= 8:
            strengths.append(
                "The response contains little or no hallucinated information."
            )

        if completeness.score >= 8:
            strengths.append(
                "The response covers most of the important aspects of the expected answer."
            )

        if len(strengths) == 0:
            strengths.append(
                "No major strengths were identified."
            )

        # ---------------------------------------
        # Weaknesses
        # ---------------------------------------

        weaknesses = []

        if relevance.score < 7:
            weaknesses.append(
                "The response does not sufficiently address the user's question."
            )

        if accuracy.score < 7:
            weaknesses.append(
                "Some information is unsupported by the reference evidence."
            )

        if hallucination.score < 7:
            weaknesses.append(
                "The response contains unsupported or hallucinated claims."
            )

        if completeness.score < 7:
            weaknesses.append(
                "The response omits important aspects of the expected answer."
            )

        if len(weaknesses) == 0:
            weaknesses.append(
                "No significant weaknesses were identified."
            )

        # ---------------------------------------
        # Recommendation
        # ---------------------------------------

        if overall_score >= 9:
            recommendation = (
                "The response is highly reliable and can be used with confidence."
            )

        elif overall_score >= 8:
            recommendation = (
                "The response is reliable with only minor improvements needed."
            )

        elif overall_score >= 7:
            recommendation = (
                "The response is generally acceptable but could be improved for better quality."
            )

        elif overall_score >= 5:
            recommendation = (
                "The response should be reviewed and revised before use."
            )

        else:
            recommendation = (
                "The response should be regenerated because it contains significant issues."
            )

        return VerdictResult(
            overall_score=overall_score,
            verdict=verdict,
            strengths=strengths,
            weaknesses=weaknesses,
            recommendation=recommendation
        )