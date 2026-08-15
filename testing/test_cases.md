# AI Response Evaluator - End-to-End Test Cases

## 1. Purpose

This document defines the test cases used to validate the
AI Response Evaluator platform across single evaluation,
batch evaluation, RAG retrieval, agent scoring,
hallucination detection, dashboard functionality,
PDF report generation, and error handling.

---

## 2. Test Environment

Frontend:
React + TypeScript + Vite

Backend:
FastAPI

Evaluation:
Multi-agent evaluation pipeline

RAG:
Knowledge Base + Retriever

LLM:
Gemini

PDF:
ReportLab

---

## 3. Functional Test Cases

| ID | Test Case | Input | Expected Result | Actual Result | Status |
|----|-----------|-------|-----------------|---------------|--------|
| TC-01 | Single valid evaluation | Valid question and AI response | Evaluation completes successfully | Evaluation completed and result displayed | PASS |
| TC-02 | Empty question | Question is empty | Invalid input handled safely | | |
| TC-03 | Empty response | Response is empty | Invalid input handled safely | | |
| TC-04 | Valid batch evaluation | valid_batch.csv | All valid rows evaluated | | |
| TC-05 | Invalid batch input | invalid_batch.csv | Invalid input handled safely | | |
| TC-06 | Dashboard update | Batch evaluation results | Dashboard reflects new evaluations | | |
| TC-07 | Dashboard statistics | Known evaluation results | Calculated values are correct | | |
| TC-08 | Dashboard charts | Evaluation results | Charts reflect current data | | |
| TC-09 | RAG retrieval | Knowledge-base question | Relevant evidence retrieved | | |
| TC-10 | Agent scoring | Valid response | Evaluation dimensions returned | | |
| TC-11 | Hallucination detection | hallucination_test.csv | Incorrect claims are flagged | | |
| TC-12 | Verdict generation | Evaluated response | Overall verdict is generated | | |
| TC-13 | PDF report generation | Dashboard evaluations | PDF is generated successfully | | |
| TC-14 | PDF report correctness | Existing evaluations | PDF values match dashboard | | |
| TC-15 | Clear dashboard history | Existing evaluations | Dashboard resets correctly | | |

---

## 4. Scoring Consistency Test

| Run | Relevance | Accuracy | Completeness | Hallucination | Overall | Verdict |
|-----|-----------|----------|--------------|---------------|---------|---------|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

The same question and AI response must be used for all five runs.

---

## 5. Consistency Metrics

The following metrics will be calculated:

- Mean
- Minimum
- Maximum
- Range
- Standard deviation

These metrics will be calculated for:

- Relevance
- Accuracy
- Completeness
- Hallucination
- Overall score

---

## 6. Hallucination Testing

The hallucination test dataset contains intentionally
incorrect responses.

The following will be recorded:

- Number of hallucinated responses
- Number of hallucinated claims
- Hallucination detection result
- Reason provided by the evaluator
- Detection consistency across repeated runs

---

## 7. Dashboard Validation

The dashboard will be validated against the actual evaluation
results.

The following metrics will be compared:

- Total evaluations
- Average relevance
- Average accuracy
- Average completeness
- Average hallucination
- Overall score
- Verdict counts
- Hallucination frequency

---

## 8. PDF Report Validation

The generated PDF will be checked for:

- Project details
- Batch summary
- Dimension-wise scores
- Individual evaluation results
- Overall verdicts
- Hallucinated claims
- Improvement recommendations

Dashboard values and PDF values will be compared.

---

## 9. Final Test Summary

Total Test Cases:

Passed:

Failed:

Pass Percentage:

Overall Testing Result: