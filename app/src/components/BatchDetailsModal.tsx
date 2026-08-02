import type { BatchResult } from "../types/batch";

import HeroSummary from "./HeroSummary";
import MetricCard from "./MetricCard";
import AgentAccordion from "./AgentAccordion";
import EvidencePanel from "./EvidencePanel";
import HallucinationPanel from "./HallucinationPanel";
import VerdictCard from "./VerdictCard";

interface Props {
  result: BatchResult | null;
  onClose: () => void;
}

const BatchDetailsModal = ({
  result,
  onClose,
}: Props) => {

  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-slate-950 p-8 shadow-2xl">

        {/* Close Button */}

        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Close
        </button>

        {/* Hero */}

        <HeroSummary
          overallScore={result.evaluation.verdict.overall_score}
          verdict={result.evaluation.verdict.verdict}
          confidence={
            (
              result.evaluation.relevance.confidence +
              result.evaluation.accuracy.confidence +
              result.evaluation.hallucination.confidence +
              result.evaluation.completeness.confidence
            ) / 4
          }
        />

        {/* Question */}

        <div className="mt-8">

          <h2 className="text-xl font-bold text-violet-400">
            Question
          </h2>

          <p className="mt-3 text-slate-300">
            {result.question}
          </p>

        </div>

        {/* AI Response */}

        <div className="mt-8">

          <h2 className="text-xl font-bold text-violet-400">
            AI Response
          </h2>

          <p className="mt-3 whitespace-pre-wrap text-slate-300">
            {result.response}
          </p>

        </div>

        {/* Metric Cards */}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">

          <MetricCard
            title="Relevance"
            score={result.evaluation.relevance.score}
            confidence={result.evaluation.relevance.confidence}
            reason={result.evaluation.relevance.reason}
            color="text-blue-400"
          />

          <MetricCard
            title="Accuracy"
            score={result.evaluation.accuracy.score}
            confidence={result.evaluation.accuracy.confidence}
            reason={result.evaluation.accuracy.reason}
            color="text-yellow-400"
          />

          <MetricCard
            title="Hallucination"
            score={result.evaluation.hallucination.score}
            confidence={result.evaluation.hallucination.confidence}
            reason={result.evaluation.hallucination.reason}
            color="text-red-400"
          />

          <MetricCard
            title="Completeness"
            score={result.evaluation.completeness.score}
            confidence={result.evaluation.completeness.confidence}
            reason={result.evaluation.completeness.reason}
            color="text-green-400"
          />

        </div>

        {/* Agent Reasoning */}

        <div className="mt-10 space-y-5">

          <AgentAccordion title="Relevance Agent">
            {result.evaluation.relevance.reason}
          </AgentAccordion>

          <AgentAccordion title="Accuracy Agent">
            {result.evaluation.accuracy.reason}
          </AgentAccordion>

          <AgentAccordion title="Hallucination Agent">
            {result.evaluation.hallucination.reason}
          </AgentAccordion>

          <AgentAccordion title="Completeness Agent">
            {result.evaluation.completeness.reason}
          </AgentAccordion>

        </div>

        {/* Supporting Evidence */}

        <div className="mt-10">

          <EvidencePanel
            evidence={result.evaluation.accuracy.supporting_evidence}
          />

        </div>

        {/* Hallucination */}

        <div className="mt-10">

          <HallucinationPanel
            hallucinatedClaims={
              result.evaluation.hallucination.hallucinated_claims
            }
            supportedClaims={
              result.evaluation.hallucination.supported_claims
            }
          />

        </div>

        {/* Completeness */}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">

          <div className="rounded-xl border border-green-700 p-5">

            <h2 className="mb-4 text-xl font-bold text-green-400">
              Covered Aspects
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-slate-300">

              {result.evaluation.completeness.covered_aspects.map(
                (aspect, index) => (
                  <li key={index}>{aspect}</li>
                )
              )}

            </ul>

          </div>

          <div className="rounded-xl border border-red-700 p-5">

            <h2 className="mb-4 text-xl font-bold text-red-400">
              Missing Aspects
            </h2>

            <ul className="list-disc space-y-2 pl-6 text-slate-300">

              {result.evaluation.completeness.missing_aspects.length === 0 ? (
                <li className="text-green-400">
                  No missing aspects.
                </li>
              ) : (
                result.evaluation.completeness.missing_aspects.map(
                  (aspect, index) => (
                    <li key={index}>{aspect}</li>
                  )
                )
              )}

            </ul>

          </div>

        </div>

        {/* Verdict */}

        <div className="mt-10">

          <VerdictCard
            verdict={result.evaluation.verdict.verdict}
            overallScore={result.evaluation.verdict.overall_score}
            strengths={result.evaluation.verdict.strengths}
            weaknesses={result.evaluation.verdict.weaknesses}
            recommendation={result.evaluation.verdict.recommendation}
          />

        </div>

      </div>

    </div>
  );
};

export default BatchDetailsModal;