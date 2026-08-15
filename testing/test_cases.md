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
| TC-02 | Empty question | Question is empty | Invalid input handled safely | Empty question was rejected and handled without server failure | PASS |
| TC-03 | Empty response | Response is empty | Invalid input handled safely | Empty response was rejected and handled without server failure | PASS |
| TC-04 | Valid batch evaluation | valid_batch.csv | All valid rows evaluated | 10 valid CSV entries were evaluated successfully | PASS |
| TC-05 | Invalid batch input | invalid_batch.csv | Invalid input handled safely | Invalid CSV entries were handled without application crash | PASS |
| TC-06 | Dashboard update | Batch evaluation results | Dashboard reflects new evaluations | Batch results were added to the dashboard successfully | PASS |
| TC-07 | Dashboard statistics | Known evaluation results | Calculated values are correct | Dashboard averages and evaluation counts matched the evaluation results | PASS |
| TC-08 | Dashboard charts | Evaluation results | Charts reflect current data | Charts and visual statistics updated correctly with evaluation results | PASS |
| TC-09 | RAG retrieval | Knowledge-base question | Relevant evidence retrieved | Relevant supporting evidence was retrieved from the knowledge base | PASS |
| TC-10 | Agent scoring | Valid response | Evaluation dimensions returned | Relevance, accuracy, completeness and hallucination scores were generated successfully | PASS |
| TC-11 | Hallucination detection | hallucination_test.csv | Incorrect claims are flagged | Intentionally incorrect claims were identified and flagged | PASS |
| TC-12 | Verdict generation | Evaluated response | Overall verdict is generated | Overall verdict and recommendation were generated successfully | PASS |
| TC-13 | PDF report generation | Dashboard evaluations | PDF is generated successfully | PDF report was generated and downloaded successfully | PASS |
| TC-14 | PDF report correctness | Existing evaluations | PDF values match dashboard | PDF summary, scores and evaluation results matched dashboard data | PASS |
| TC-15 | Clear dashboard history | Existing evaluations | Dashboard resets correctly | Evaluation history and dashboard statistics were cleared successfully | PASS |

---

## 4. Scoring Consistency Test

| Run | Relevance | Accuracy | Completeness | Hallucination | Overall | Verdict |
|-----|-----------|----------|--------------|---------------|---------|---------|
| 1 | 9.0 | 9.0 | 8.0 | 9.0 | 8.75 | Pass |
| 2 | 9.0 | 8.9 | 8.0 | 9.0 | 8.73 | Pass |
| 3 | 8.9 | 9.0 | 8.1 | 9.0 | 8.75 | Pass |
| 4 | 9.0 | 8.9 | 8.0 | 9.0 | 8.73 | Pass |
| 5 | 9.0 | 9.0 | 8.1 | 9.0 | 8.78 | Pass |

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

Total Test Cases:15

Passed:15

Failed:0

Pass Percentage:100%

Overall Testing Result:Successfull / Positive

The end-to-end testing confirmed that the AI Response Evaluator
successfully supports single evaluation, batch evaluation,
RAG retrieval, multi-agent scoring, hallucination detection,
verdict generation, dashboard visualization, PDF report
generation, and dashboard history management.