import { useState } from "react";
import { Loader2 } from "lucide-react";

import { apiPost } from "../services/api";
import { useEvaluation } from "../context/EvaluationContext";

import HeroSummary from "../components/HeroSummary";
import MetricCard from "../components/MetricCard";
import AgentAccordion from "../components/AgentAccordion";
import EvidencePanel from "../components/EvidencePanel";
import HallucinationPanel from "../components/HallucinationPanel";
import VerdictCard from "../components/VerdictCard";

interface RelevanceResult {
  score: number;
  label: string;
  confidence: number;
  reason: string;
}

interface AccuracyResult {
  score: number;
  confidence: number;
  supporting_evidence: string[];
  reason: string;
}

interface HallucinatedClaim {
  claim: string;
  reason: string;
}

interface SupportedClaim {
  claim: string;
}

interface HallucinationResult {
  score: number;
  confidence: number;
  hallucinated_claims: HallucinatedClaim[];
  supported_claims: SupportedClaim[];
  reason: string;
}

interface CompletenessResult {
  score: number;
  confidence: number;
  covered_aspects: string[];
  missing_aspects: string[];
  reason: string;
}

interface VerdictResult {
  overall_score: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export interface EvaluationResponse {
  relevance: RelevanceResult;
  accuracy: AccuracyResult;
  hallucination: HallucinationResult;
  completeness: CompletenessResult;
  verdict: VerdictResult;
}

export const Evaluate = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const [isEvaluating, setIsEvaluating] =
    useState(false);

  const [result, setResult] =
    useState<EvaluationResponse | null>(null);

  const { addEvaluation } = useEvaluation();

  const isDisabled =
    !question.trim() ||
    !response.trim() ||
    isEvaluating;

  const handleEvaluate = async () => {
    if (isDisabled) return;

    setIsEvaluating(true);

    try {
      const evaluation =
        await apiPost<EvaluationResponse>(
          "/api/v1/evaluations",
          {
            question,
            response,
          }
        );

      setResult(evaluation);

      addEvaluation({
        id: crypto.randomUUID(),
        question,
        response,
        evaluatedAt: new Date().toISOString(),
        result: evaluation,
      });

    } catch (err) {
      console.error(err);
      alert("Evaluation Failed");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
  <div className="mx-auto max-w-7xl p-8">

  {/* Header */}

  <div className="mb-10">

    <h1 className="text-4xl font-bold text-white">
      AI Response Evaluator
    </h1>

    <p className="mt-2 text-slate-400">
      Evaluate AI generated responses using Retrieval-Augmented
      Generation (RAG) and multiple evaluation agents.
    </p>

  </div>

  {/* Input Section */}

  <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

    <div>

      <label className="mb-2 block font-medium text-slate-300">
        Question
      </label>

      <textarea
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question..."
        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-violet-500"
      />

    </div>

    <div className="mt-8">

      <label className="mb-2 block font-medium text-slate-300">
        AI Response
      </label>

      <textarea
        rows={10}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Paste AI response..."
        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-violet-500"
      />

    </div>

    <button
      onClick={handleEvaluate}
      disabled={isDisabled}
      className="mt-8 flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
    >
      {isEvaluating ? (
        <>
          <Loader2
            size={18}
            className="animate-spin"
          />

          Evaluating...
        </>
      ) : (
        "Evaluate Response"
      )}
    </button>

  </div>

  {/* Result */}

  {result && (

    <div className="mt-12 space-y-10">

      {/* Hero */}

      <HeroSummary
        overallScore={result.verdict.overall_score}
        verdict={result.verdict.verdict}
        confidence={(
          result.relevance.confidence +
          result.accuracy.confidence +
          result.hallucination.confidence +
          result.completeness.confidence
        ) / 4}
      />

      {/* Metrics */}

      <div className="grid gap-6 lg:grid-cols-2">

        <MetricCard
          title="Relevance"
          score={result.relevance.score}
          confidence={result.relevance.confidence}
          reason={result.relevance.reason}
          color="text-blue-400"
        />

        <MetricCard
          title="Accuracy"
          score={result.accuracy.score}
          confidence={result.accuracy.confidence}
          reason={result.accuracy.reason}
          color="text-yellow-400"
        />

        <MetricCard
          title="Hallucination"
          score={result.hallucination.score}
          confidence={result.hallucination.confidence}
          reason={result.hallucination.reason}
          color="text-red-400"
        />

        <MetricCard
          title="Completeness"
          score={result.completeness.score}
          confidence={result.completeness.confidence}
          reason={result.completeness.reason}
          color="text-emerald-400"
        />

      </div>

      {/* Agent Analysis */}

      <div className="space-y-5">

        <AgentAccordion title="Relevance Agent">

          {result.relevance.reason}

        </AgentAccordion>

        <AgentAccordion title="Accuracy Agent">

          {result.accuracy.reason}

        </AgentAccordion>

        <AgentAccordion title="Hallucination Agent">

          {result.hallucination.reason}

        </AgentAccordion>

        <AgentAccordion title="Completeness Agent">

          {result.completeness.reason}

        </AgentAccordion>

      </div>

      {/* Evidence */}

      <EvidencePanel
        evidence={result.accuracy.supporting_evidence}
      />

      {/* Completeness */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-green-700 bg-slate-900 p-6">

          <h2 className="mb-5 text-xl font-bold text-green-400">
            Covered Aspects
          </h2>

          {result.completeness.covered_aspects.length === 0 ? (

            <p className="text-slate-400">
              None
            </p>

          ) : (

            <ul className="list-disc space-y-3 pl-6 text-slate-300">

              {result.completeness.covered_aspects.map(
                (item, index) => (

                  <li key={index}>
                    {item}
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

          {result.completeness.missing_aspects.length === 0 ? (

            <p className="text-green-400">
              No missing aspects detected.
            </p>

          ) : (

            <ul className="list-disc space-y-3 pl-6 text-slate-300">

              {result.completeness.missing_aspects.map(
                (item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                )
              )}

            </ul>

          )}

        </div>

      </div>
            {/* Hallucination Detection */}

      <HallucinationPanel
        hallucinatedClaims={
          result.hallucination.hallucinated_claims
        }
        supportedClaims={
          result.hallucination.supported_claims
        }
      />

      {/* Final Verdict */}

      <VerdictCard
        verdict={result.verdict.verdict}
        overallScore={result.verdict.overall_score}
        strengths={result.verdict.strengths}
        weaknesses={result.verdict.weaknesses}
        recommendation={
          result.verdict.recommendation
        }
      />

    </div>

  )}

</div>
  );
};