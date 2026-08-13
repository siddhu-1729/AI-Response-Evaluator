from io import BytesIO
from datetime import datetime
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
)

from app.schemas.batch_result import BatchResult
from app.schemas.batch_summary import BatchSummary


# ============================================================
# SAFE HELPERS
# ============================================================

def get_field(obj: Any, field: str, default=None):
    """
    Works with both Pydantic models and dictionaries.
    """

    if obj is None:
        return default

    if isinstance(obj, dict):
        return obj.get(field, default)

    return getattr(obj, field, default)


def get_score(evaluation: Any, dimension: str) -> float:
    """
    Get score from a dimension result.
    """

    dimension_result = get_field(
        evaluation,
        dimension,
    )

    value = get_field(
        dimension_result,
        "score",
        0,
    )

    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def get_reason(evaluation: Any, dimension: str) -> str:
    dimension_result = get_field(
        evaluation,
        dimension,
    )

    reason = get_field(
        dimension_result,
        "reason",
        "No reasoning provided.",
    )

    return str(
        reason or "No reasoning provided."
    )


def get_verdict(evaluation: Any) -> str:
    verdict = get_field(
        evaluation,
        "verdict",
    )

    value = get_field(
        verdict,
        "verdict",
        "Not Available",
    )

    return str(
        value or "Not Available"
    )


def get_overall_score(evaluation: Any) -> float:
    """
    Prefer the VerdictAgent's overall score.

    If unavailable, calculate from the four dimensions.
    """

    verdict = get_field(
        evaluation,
        "verdict",
    )

    overall = get_field(
        verdict,
        "overall_score",
    )

    if overall is not None:
        try:
            return float(overall)
        except (TypeError, ValueError):
            pass

    scores = [
        get_score(evaluation, "relevance"),
        get_score(evaluation, "accuracy"),
        get_score(evaluation, "completeness"),
        get_score(evaluation, "hallucination"),
    ]

    return sum(scores) / len(scores)


def get_hallucinated_claims(evaluation: Any) -> list:
    hallucination = get_field(
        evaluation,
        "hallucination",
    )

    claims = get_field(
        hallucination,
        "hallucinated_claims",
        [],
    )

    return claims or []


def get_recommendation(evaluation: Any) -> str:
    verdict = get_field(
        evaluation,
        "verdict",
    )

    recommendation = get_field(
        verdict,
        "recommendation",
        "No recommendation provided.",
    )

    return str(
        recommendation or
        "No recommendation provided."
    )


def escape_text(value: Any) -> str:
    """
    Prevent HTML-like text from breaking ReportLab Paragraphs.
    """

    if value is None:
        return ""

    text = str(value)

    return (
        text
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


# ============================================================
# SUMMARY
# ============================================================

def calculate_summary(
    results: list[BatchResult],
) -> BatchSummary:

    total = len(results)

    if total == 0:
        return BatchSummary(
            total_evaluations=0,
            average_relevance=0,
            average_accuracy=0,
            average_hallucination=0,
            average_completeness=0,
            average_overall=0,
        )

    relevance = 0.0
    accuracy = 0.0
    hallucination = 0.0
    completeness = 0.0
    overall = 0.0

    for item in results:

        evaluation = item.evaluation

        relevance += get_score(
            evaluation,
            "relevance",
        )

        accuracy += get_score(
            evaluation,
            "accuracy",
        )

        hallucination += get_score(
            evaluation,
            "hallucination",
        )

        completeness += get_score(
            evaluation,
            "completeness",
        )

        overall += get_overall_score(
            evaluation
        )

    return BatchSummary(
        total_evaluations=total,

        average_relevance=
            relevance / total,

        average_accuracy=
            accuracy / total,

        average_hallucination=
            hallucination / total,

        average_completeness=
            completeness / total,

        average_overall=
            overall / total,
    )


# ============================================================
# VERDICT COUNTS
# ============================================================

def calculate_verdict_counts(
    results: list[BatchResult],
) -> dict[str, int]:

    counts = {
        "Pass": 0,
        "Needs Improvement": 0,
        "Fail": 0,
    }

    for item in results:

        evaluation = item.evaluation

        verdict = get_verdict(
            evaluation
        ).lower()

        if (
            "pass" in verdict
            or "excellent" in verdict
            or "good" in verdict
        ):
            counts["Pass"] += 1

        elif (
            "needs" in verdict
            or "improvement" in verdict
            or "review" in verdict
        ):
            counts["Needs Improvement"] += 1

        elif "fail" in verdict:
            counts["Fail"] += 1

        else:

            score = get_overall_score(
                evaluation
            )

            if score >= 8:
                counts["Pass"] += 1

            elif score >= 5:
                counts["Needs Improvement"] += 1

            else:
                counts["Fail"] += 1

    return counts


# ============================================================
# IMPROVEMENT RECOMMENDATIONS
# ============================================================

def generate_recommendations(
    results: list[BatchResult],
    summary: BatchSummary,
) -> list[str]:

    recommendations = []

    if summary.average_relevance < 7:
        recommendations.append(
            "Improve relevance by ensuring that responses "
            "directly address the user's question."
        )

    if summary.average_accuracy < 7:
        recommendations.append(
            "Improve factual accuracy by grounding responses "
            "more strongly in retrieved evidence."
        )

    if summary.average_completeness < 7:
        recommendations.append(
            "Improve completeness by covering all important "
            "aspects of the requested question."
        )

    hallucinated_count = sum(
        1
        for item in results
        if len(
            get_hallucinated_claims(
                item.evaluation
            )
        ) > 0
    )

    if results:
        hallucination_frequency = (
            hallucinated_count /
            len(results)
        )

        if hallucination_frequency > 0.20:
            recommendations.append(
                "Reduce unsupported claims and improve "
                "grounding against the reference knowledge base."
            )

    if not recommendations:
        recommendations.append(
            "Overall evaluation quality is strong. "
            "Continue monitoring accuracy, completeness, "
            "relevance, and hallucination rates."
        )

    return recommendations


# ============================================================
# PDF GENERATOR
# ============================================================

def generate_pdf_report(
    results: list[BatchResult],
) -> BytesIO:

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,

        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,

        title="AI Response Evaluator Report",
        author="AI Response Evaluator",
    )

    # --------------------------------------------------------
    # STYLES
    # --------------------------------------------------------

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontSize=23,
        leading=28,
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=12,
        alignment=TA_CENTER,
        textColor=colors.grey,
        spaceAfter=20,
    )

    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontSize=16,
        leading=20,
        spaceBefore=10,
        spaceAfter=10,
        textColor=colors.HexColor("#5B21B6"),
    )

    subheading_style = ParagraphStyle(
        "SubHeading",
        parent=styles["Heading3"],
        fontSize=11,
        leading=14,
        spaceBefore=7,
        spaceAfter=5,
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontSize=9,
        leading=13,
        spaceAfter=5,
    )

    small_style = ParagraphStyle(
        "Small",
        parent=styles["BodyText"],
        fontSize=8,
        leading=10,
        textColor=colors.grey,
    )

    story = []

    # ========================================================
    # TITLE
    # ========================================================

    story.append(
        Paragraph(
            "AI Response Evaluator",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "Evaluation Report",
            subtitle_style,
        )
    )

    story.append(
        Paragraph(
            "<b>Project:</b> "
            "AI Response Evaluation Platform",
            body_style,
        )
    )

    story.append(
        Paragraph(
            "<b>Generated:</b> "
            f"{datetime.now().strftime('%d %B %Y, %H:%M')}",
            body_style,
        )
    )

    story.append(
        Spacer(1, 12)
    )

    # ========================================================
    # SUMMARY
    # ========================================================

    summary = calculate_summary(
        results
    )

    verdict_counts = calculate_verdict_counts(
        results
    )

    recommendations = generate_recommendations(
        results,
        summary,
    )

    story.append(
        Paragraph(
            "Batch Summary",
            heading_style,
        )
    )

    summary_data = [
        [
            "Metric",
            "Value",
        ],
        [
            "Total Evaluations",
            str(
                summary.total_evaluations
            ),
        ],
        [
            "Pass",
            str(
                verdict_counts["Pass"]
            ),
        ],
        [
            "Needs Improvement",
            str(
                verdict_counts[
                    "Needs Improvement"
                ]
            ),
        ],
        [
            "Fail",
            str(
                verdict_counts["Fail"]
            ),
        ],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[
            90 * mm,
            60 * mm,
        ],
    )

    summary_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#5B21B6"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        colors.HexColor("#F8F7FC"),
                    ],
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(
        summary_table
    )

    story.append(
        Spacer(1, 15)
    )

    # ========================================================
    # DIMENSION SCORES
    # ========================================================

    story.append(
        Paragraph(
            "Dimension-wise Scores",
            heading_style,
        )
    )

    dimension_data = [
        [
            "Dimension",
            "Average Score",
        ],
        [
            "Relevance",
            f"{summary.average_relevance:.2f}",
        ],
        [
            "Accuracy",
            f"{summary.average_accuracy:.2f}",
        ],
        [
            "Completeness",
            f"{summary.average_completeness:.2f}",
        ],
        [
            "Hallucination",
            f"{summary.average_hallucination:.2f}",
        ],
        [
            "Overall",
            f"{summary.average_overall:.2f}",
        ],
    ]

    dimension_table = Table(
        dimension_data,
        colWidths=[
            90 * mm,
            60 * mm,
        ],
    )

    dimension_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#5B21B6"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "ALIGN",
                    (1, 1),
                    (1, -1),
                    "CENTER",
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        colors.HexColor("#F8F7FC"),
                    ],
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(
        dimension_table
    )

    # ========================================================
    # HALLUCINATION FREQUENCY
    # ========================================================

    hallucinated_responses = sum(
        1
        for item in results
        if len(
            get_hallucinated_claims(
                item.evaluation
            )
        ) > 0
    )

    hallucination_frequency = (
        (
            hallucinated_responses /
            len(results)
        ) * 100
        if results
        else 0
    )

    story.append(
        Spacer(1, 15)
    )

    story.append(
        Paragraph(
            "Hallucination Analysis",
            heading_style,
        )
    )

    hallucination_data = [
        [
            "Metric",
            "Value",
        ],
        [
            "Responses with Hallucinations",
            str(hallucinated_responses),
        ],
        [
            "Hallucination Frequency",
            f"{hallucination_frequency:.2f}%",
        ],
        [
            "Total Flagged Claims",
            str(
                sum(
                    len(
                        get_hallucinated_claims(
                            item.evaluation
                        )
                    )
                    for item in results
                )
            ),
        ],
    ]

    hallucination_table = Table(
        hallucination_data,
        colWidths=[
            90 * mm,
            60 * mm,
        ],
    )

    hallucination_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#7F1D1D"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        colors.HexColor("#FEF2F2"),
                    ],
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(
        hallucination_table
    )

    story.append(
        PageBreak()
    )

    # ========================================================
    # INDIVIDUAL EVALUATIONS
    # ========================================================

    story.append(
        Paragraph(
            "Individual Evaluation Results",
            heading_style,
        )
    )

    for index, item in enumerate(
        results,
        start=1,
    ):

        evaluation = item.evaluation

        overall = get_overall_score(
            evaluation
        )

        verdict = get_verdict(
            evaluation
        )

        recommendation = get_recommendation(
            evaluation
        )

        elements = []

        elements.append(
            Paragraph(
                f"Evaluation #{index}",
                subheading_style,
            )
        )

        elements.append(
            Paragraph(
                f"<b>Question:</b><br/>"
                f"{escape_text(item.question)}",
                body_style,
            )
        )

        elements.append(
            Paragraph(
                f"<b>AI Response:</b><br/>"
                f"{escape_text(item.response)}",
                body_style,
            )
        )

        # ----------------------------------------------------
        # Scores
        # ----------------------------------------------------

        score_data = [
            [
                "Relevance",
                "Accuracy",
                "Completeness",
                "Hallucination",
                "Overall",
            ],
            [
                f"{get_score(evaluation, 'relevance'):.2f}",
                f"{get_score(evaluation, 'accuracy'):.2f}",
                f"{get_score(evaluation, 'completeness'):.2f}",
                f"{get_score(evaluation, 'hallucination'):.2f}",
                f"{overall:.2f}",
            ],
        ]

        score_table = Table(
            score_data,
            colWidths=[
                29 * mm,
                29 * mm,
                29 * mm,
                29 * mm,
                29 * mm,
            ],
        )

        score_table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.HexColor("#EDE9FE"),
                    ),
                    (
                        "FONTNAME",
                        (0, 0),
                        (-1, 0),
                        "Helvetica-Bold",
                    ),
                    (
                        "ALIGN",
                        (0, 0),
                        (-1, -1),
                        "CENTER",
                    ),
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.grey,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        5,
                    ),
                ]
            )
        )

        elements.append(
            score_table
        )

        elements.append(
            Spacer(1, 7)
        )

        # ----------------------------------------------------
        # Reasoning
        # ----------------------------------------------------

        for dimension in [
            "relevance",
            "accuracy",
            "completeness",
            "hallucination",
        ]:

            elements.append(
                Paragraph(
                    f"<b>{dimension.title()} Reason</b>",
                    subheading_style,
                )
            )

            elements.append(
                Paragraph(
                    escape_text(
                        get_reason(
                            evaluation,
                            dimension,
                        )
                    ),
                    body_style,
                )
            )

        # ----------------------------------------------------
        # Verdict
        # ----------------------------------------------------

        elements.append(
            Paragraph(
                f"<b>Overall Verdict:</b> "
                f"{escape_text(verdict)}",
                body_style,
            )
        )

        elements.append(
            Paragraph(
                f"<b>Recommendation:</b> "
                f"{escape_text(recommendation)}",
                body_style,
            )
        )

        # ----------------------------------------------------
        # Hallucinated claims
        # ----------------------------------------------------

        claims = get_hallucinated_claims(
            evaluation
        )

        if claims:

            elements.append(
                Paragraph(
                    "Flagged Hallucinated Claims",
                    subheading_style,
                )
            )

            for claim in claims:

                claim_text = get_field(
                    claim,
                    "claim",
                    "",
                )

                claim_reason = get_field(
                    claim,
                    "reason",
                    "",
                )

                elements.append(
                    Paragraph(
                        f"<b>Claim:</b> "
                        f"{escape_text(claim_text)}",
                        body_style,
                    )
                )

                elements.append(
                    Paragraph(
                        f"<b>Reason:</b> "
                        f"{escape_text(claim_reason)}",
                        body_style,
                    )
                )

        story.append(
            KeepTogether(
                elements
            )
        )

        story.append(
            Spacer(1, 12)
        )

    # ========================================================
    # IMPROVEMENT RECOMMENDATIONS
    # ========================================================

    story.append(
        PageBreak()
    )

    story.append(
        Paragraph(
            "Improvement Recommendations",
            heading_style,
        )
    )

    for recommendation in recommendations:

        story.append(
            Paragraph(
                f"• {escape_text(recommendation)}",
                body_style,
            )
        )

    story.append(
        Spacer(1, 15)
    )

    story.append(
        Paragraph(
            "Generated by AI Response Evaluator.",
            small_style,
        )
    )

    # ========================================================
    # BUILD PDF
    # ========================================================

    document.build(
        story
    )

    buffer.seek(0)

    return buffer