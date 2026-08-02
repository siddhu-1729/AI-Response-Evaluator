import { useMemo } from "react";

import { useEvaluation } from "../context/EvaluationContext";

import HeroSummary from "../components/HeroSummary";
import MetricCard from "../components/MetricCard";
import AgentAccordion from "../components/AgentAccordion";
import EvidencePanel from "../components/EvidencePanel";
import HallucinationPanel from "../components/HallucinationPanel";
import VerdictCard from "../components/VerdictCard";

export const Dashboard = () => {
  const { evaluations, clearEvaluations } = useEvaluation();

  const averages = useMemo(() => {
    if (evaluations.length === 0) {
      return {
        relevance: 0,
        accuracy: 0,
        hallucination: 0,
        completeness: 0,
        overall: 0,
      };
    }

    return {
      relevance:
        evaluations.reduce(
          (sum, item) => sum + item.result.relevance.score,
          0
        ) / evaluations.length,

      accuracy:
        evaluations.reduce(
          (sum, item) => sum + item.result.accuracy.score,
          0
        ) / evaluations.length,

      hallucination:
        evaluations.reduce(
          (sum, item) => sum + item.result.hallucination.score,
          0
        ) / evaluations.length,

      completeness:
        evaluations.reduce(
          (sum, item) => sum + item.result.completeness.score,
          0
        ) / evaluations.length,

      overall:
        evaluations.reduce(
          (sum, item) =>
            sum + item.result.verdict.overall_score,
          0
        ) / evaluations.length,
    };
  }, [evaluations]);

  return (
    <div className="mx-auto max-w-7xl p-8">

      {/* Header */}

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Evaluation Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Total Evaluations : {evaluations.length}
          </p>

        </div>

        <button
          onClick={clearEvaluations}
          className="rounded-xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
        >
          Clear History
        </button>

      </div>

      {/* Overall Analytics */}

      <div className="mb-10">

        <HeroSummary
          overallScore={averages.overall}
          verdict="Average Evaluation Quality"
          confidence={1}
        />

      </div>

      {/* Average Metrics */}

      <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Relevance"
          score={averages.relevance}
          confidence={1}
          reason="Average relevance score across all evaluations."
          color="text-blue-400"
        />

        <MetricCard
          title="Accuracy"
          score={averages.accuracy}
          confidence={1}
          reason="Average factual accuracy across all evaluations."
          color="text-yellow-400"
        />

        <MetricCard
          title="Hallucination"
          score={averages.hallucination}
          confidence={1}
          reason="Average hallucination score."
          color="text-red-400"
        />

        <MetricCard
          title="Completeness"
          score={averages.completeness}
          confidence={1}
          reason="Average completeness score."
          color="text-green-400"
        />

      </div>

      {evaluations.length === 0 ? (

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-10 text-center text-slate-400">

          No evaluations yet.

        </div>

      ) : (

        <div className="space-y-10">

          {evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-lg"
            >

              <HeroSummary
                overallScore={
                  evaluation.result.verdict.overall_score
                }
                verdict={
                  evaluation.result.verdict.verdict
                }
                confidence={
                  (
                    evaluation.result.relevance.confidence +
                    evaluation.result.accuracy.confidence +
                    evaluation.result.hallucination.confidence +
                    evaluation.result.completeness.confidence
                  ) / 4
                }
              />

              <div className="mt-8">

                <h2 className="text-xl font-semibold text-violet-400">
                  Question
                </h2>

                <p className="mt-3 text-slate-300">
                  {evaluation.question}
                </p>

              </div>

              <div className="mt-8">

                <h2 className="text-xl font-semibold text-violet-400">
                  AI Response
                </h2>

                <p className="mt-3 whitespace-pre-wrap text-slate-300">
                  {evaluation.response}
                </p>

              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                                <MetricCard
                  title="Relevance"
                  score={evaluation.result.relevance.score}
                  confidence={
                    evaluation.result.relevance.confidence
                  }
                  reason={
                    evaluation.result.relevance.reason
                  }
                  color="text-blue-400"
                />

                <MetricCard
                  title="Accuracy"
                  score={evaluation.result.accuracy.score}
                  confidence={
                    evaluation.result.accuracy.confidence
                  }
                  reason={
                    evaluation.result.accuracy.reason
                  }
                  color="text-yellow-400"
                />

                <MetricCard
                  title="Hallucination"
                  score={
                    evaluation.result.hallucination.score
                  }
                  confidence={
                    evaluation.result.hallucination.confidence
                  }
                  reason={
                    evaluation.result.hallucination.reason
                  }
                  color="text-red-400"
                />

                <MetricCard
                  title="Completeness"
                  score={
                    evaluation.result.completeness.score
                  }
                  confidence={
                    evaluation.result.completeness.confidence
                  }
                  reason={
                    evaluation.result.completeness.reason
                  }
                  color="text-green-400"
                />

              </div>

              {/* Agent Analysis */}

              <div className="mt-10 space-y-5">

                <AgentAccordion
                  title="Relevance Agent"
                >
                  {evaluation.result.relevance.reason}
                </AgentAccordion>

                <AgentAccordion
                  title="Accuracy Agent"
                >
                  {evaluation.result.accuracy.reason}
                </AgentAccordion>

                <AgentAccordion
                  title="Hallucination Agent"
                >
                  {evaluation.result.hallucination.reason}
                </AgentAccordion>

                <AgentAccordion
                  title="Completeness Agent"
                >
                  {evaluation.result.completeness.reason}
                </AgentAccordion>

              </div>

              {/* Evidence */}

              <div className="mt-10">

                <EvidencePanel
                  evidence={
                    evaluation.result.accuracy
                      .supporting_evidence
                  }
                />

              </div>

              {/* Completeness Details */}

              <div className="mt-10 grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border border-green-700 bg-slate-900 p-6">

                  <h2 className="mb-5 text-xl font-bold text-green-400">
                    Covered Aspects
                  </h2>

                  {evaluation.result.completeness
                    .covered_aspects.length === 0 ? (

                    <p className="text-slate-400">
                      No covered aspects.
                    </p>

                  ) : (

                    <ul className="list-disc space-y-2 pl-6 text-slate-300">

                      {evaluation.result.completeness.covered_aspects.map(
                        (aspect, index) => (
                          <li key={index}>
                            {aspect}
                          </li>
                        )
                      )}

                    </ul>

                  )}

                </div>

                <div className="rounded-2xl border border-red-700 bg-slate-900 p-6">

                  <h2 className="mb-5 text-xl font-bold text-red-400">
                    Missing Aspects
                  </h2>

                  {evaluation.result.completeness
                    .missing_aspects.length === 0 ? (

                    <p className="text-green-400">
                      No missing aspects detected.
                    </p>

                  ) : (

                    <ul className="list-disc space-y-2 pl-6 text-slate-300">

                      {evaluation.result.completeness.missing_aspects.map(
                        (aspect, index) => (
                          <li key={index}>
                            {aspect}
                          </li>
                        )
                      )}

                    </ul>

                  )}

                </div>

              </div>
                            {/* Hallucination Panel */}

              <div className="mt-10">

                <HallucinationPanel
                  hallucinatedClaims={
                    evaluation.result.hallucination
                      .hallucinated_claims
                  }
                  supportedClaims={
                    evaluation.result.hallucination
                      .supported_claims
                  }
                />

              </div>

              {/* Verdict */}

              <div className="mt-10">

                <VerdictCard
                  verdict={
                    evaluation.result.verdict.verdict
                  }
                  overallScore={
                    evaluation.result.verdict
                      .overall_score
                  }
                  strengths={
                    evaluation.result.verdict
                      .strengths
                  }
                  weaknesses={
                    evaluation.result.verdict
                      .weaknesses
                  }
                  recommendation={
                    evaluation.result.verdict
                      .recommendation
                  }
                />

              </div>

              {/* Footer */}

              <div className="mt-10 flex justify-end">

                <p className="text-sm text-slate-500">
                  Evaluated on{" "}
                  {new Date(
                    evaluation.evaluatedAt
                  ).toLocaleString()}
                </p>

              </div>

            </div>
          ))}

        </div>

      )}

    </div>
  );
};