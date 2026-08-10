import { useMemo, useState } from "react";
import { useEvaluation } from "../context/EvaluationContext";

import DashboardStats from "../components/DashboardStats";
import AverageScoreChart from "../components/AverageScoreChart";
import VerdictPieChart from "../components/VerdictPieChart";
import TrendChart from "../components/TrendChart";
import HallucinationAnalytics from "../components/HallucinationAnalytics";
import DashboardFilters from "../components/DashboardFilters";

export const Dashboard = () => {
  const { evaluations, clearEvaluations } = useEvaluation();

  const [search, setSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("");

  /*
   * ---------------------------------------------------------
   * FILTERED EVALUATIONS
   * ---------------------------------------------------------
   */

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((evaluation) => {
      const matchesSearch =
        search.trim() === "" ||
        evaluation.question
          .toLowerCase()
          .includes(search.toLowerCase());

      const verdict = getVerdictLabel(evaluation);

      const matchesVerdict =
        verdictFilter === "" || verdict === verdictFilter;

      return matchesSearch && matchesVerdict;
    });
  }, [evaluations, search, verdictFilter]);

  /*
   * ---------------------------------------------------------
   * AVERAGES
   * ---------------------------------------------------------
   */

  const averages = useMemo(() => {
    if (filteredEvaluations.length === 0) {
      return {
        relevance: 0,
        accuracy: 0,
        hallucination: 0,
        completeness: 0,
        overall: 0,
      };
    }

    const relevance =
      filteredEvaluations.reduce(
        (sum, evaluation) =>
          sum + evaluation.result.relevance.score,
        0
      ) / filteredEvaluations.length;

    const accuracy =
      filteredEvaluations.reduce(
        (sum, evaluation) =>
          sum + evaluation.result.accuracy.score,
        0
      ) / filteredEvaluations.length;

    const hallucination =
      filteredEvaluations.reduce(
        (sum, evaluation) =>
          sum + evaluation.result.hallucination.score,
        0
      ) / filteredEvaluations.length;

    const completeness =
      filteredEvaluations.reduce(
        (sum, evaluation) =>
          sum + getCompletenessScore(evaluation),
        0
      ) / filteredEvaluations.length;

    const overall =
      (relevance +
        accuracy +
        hallucination +
        completeness) /
      4;

    return {
      relevance,
      accuracy,
      hallucination,
      completeness,
      overall,
    };
  }, [filteredEvaluations]);

  /*
   * ---------------------------------------------------------
   * VERDICT COUNTS
   * ---------------------------------------------------------
   */

  const verdictCounts = useMemo(() => {
    let excellent = 0;
    let good = 0;
    let needsImprovement = 0;
    let fail = 0;

    filteredEvaluations.forEach((evaluation) => {
      const verdict = getVerdictLabel(evaluation);

      if (verdict === "Excellent") {
        excellent++;
      } else if (verdict === "Good") {
        good++;
      } else if (verdict === "Needs Improvement") {
        needsImprovement++;
      } else if (verdict === "Fail") {
        fail++;
      }
    });

    return {
      excellent,
      good,
      needsImprovement,
      fail,
    };
  }, [filteredEvaluations]);

  /*
   * ---------------------------------------------------------
   * HALLUCINATION ANALYTICS
   * ---------------------------------------------------------
   */

  const hallucinationAnalytics = useMemo(() => {
    const totalResponses = filteredEvaluations.length;

    const hallucinatedResponses = filteredEvaluations.filter(
      (evaluation) =>
        evaluation.result.hallucination.hallucinated_claims
          .length > 0
    ).length;

    const totalHallucinatedClaims =
      filteredEvaluations.reduce(
        (sum, evaluation) =>
          sum +
          evaluation.result.hallucination.hallucinated_claims
            .length,
        0
      );

    return {
      totalResponses,
      hallucinatedResponses,
      totalHallucinatedClaims,
    };
  }, [filteredEvaluations]);

  /*
   * ---------------------------------------------------------
   * TREND DATA
   * ---------------------------------------------------------
   */

  const trendData = useMemo(() => {
    return [...filteredEvaluations]
      .sort(
        (a, b) =>
          new Date(a.evaluatedAt).getTime() -
          new Date(b.evaluatedAt).getTime()
      )
      .map((evaluation, index) => ({
        index: index + 1,
        overall: getOverallScore(evaluation),
      }));
  }, [filteredEvaluations]);

  /*
   * ---------------------------------------------------------
   * CLEAR FILTERS
   * ---------------------------------------------------------
   */

  const clearFilters = () => {
    setSearch("");
    setVerdictFilter("");
  };

  return (
    <div className="mx-auto max-w-7xl p-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Evaluation Dashboard
          </h1>

          <p className="mt-1 text-slate-400">
            Total Evaluations: {evaluations.length}
          </p>
        </div>

        <button
          onClick={clearEvaluations}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Clear History
        </button>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="mb-8">

        <DashboardFilters
          search={search}
          verdict={verdictFilter}
          onSearchChange={setSearch}
          onVerdictChange={setVerdictFilter}
        />

        {(search || verdictFilter) && (
          <div className="mt-3 flex items-center justify-between">

            <p className="text-sm text-slate-400">
              Showing {filteredEvaluations.length} of{" "}
              {evaluations.length} evaluations
            </p>

            <button
              onClick={clearFilters}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Clear Filters
            </button>

          </div>
        )}

      </div>

      {/* =====================================================
          DASHBOARD STATISTICS
      ====================================================== */}

      <div className="mb-8">

        <DashboardStats
          totalEvaluations={filteredEvaluations.length}
          excellent={verdictCounts.excellent}
          good={verdictCounts.good}
          needsImprovement={verdictCounts.needsImprovement}
          fail={verdictCounts.fail}
          averageOverall={averages.overall}
          hallucinationFrequency={
            hallucinationAnalytics.totalResponses === 0
              ? 0
              : (hallucinationAnalytics.hallucinatedResponses /
                  hallucinationAnalytics.totalResponses) *
                100
          }
        />

      </div>

      {/* =====================================================
          CHARTS
      ====================================================== */}

      {filteredEvaluations.length > 0 && (
        <>
          <div className="mb-8 grid gap-8 lg:grid-cols-2">

            <AverageScoreChart
              relevance={averages.relevance}
              accuracy={averages.accuracy}
              hallucination={averages.hallucination}
              completeness={averages.completeness}
              overall={averages.overall}
            />

            <VerdictPieChart
              excellent={verdictCounts.excellent}
              good={verdictCounts.good}
              needsImprovement={
                verdictCounts.needsImprovement
              }
              fail={verdictCounts.fail}
            />

          </div>

          {/* =================================================
              QUALITY TREND
          ================================================== */}

          <div className="mb-8">
            <TrendChart data={trendData} />
          </div>

          {/* =================================================
              HALLUCINATION ANALYTICS
          ================================================== */}

          <div className="mb-8">
            <HallucinationAnalytics
              totalResponses={
                hallucinationAnalytics.totalResponses
              }
              hallucinatedResponses={
                hallucinationAnalytics.hallucinatedResponses
              }
              totalHallucinatedClaims={
                hallucinationAnalytics.totalHallucinatedClaims
              }
            />
          </div>
        </>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {evaluations.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
          No evaluations yet. Run an evaluation to see the
          dashboard analytics.
        </div>
      ) : filteredEvaluations.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">

          <p className="text-slate-400">
            No evaluations match the selected filters.
          </p>

          <button
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700"
          >
            Clear Filters
          </button>

        </div>
      ) : null}

      {/* =====================================================
          EVALUATION HISTORY
      ====================================================== */}

      {filteredEvaluations.length > 0 && (
        <div className="space-y-6">

          <div className="mb-4">

            <h2 className="text-2xl font-bold text-white">
              Evaluation History
            </h2>

            <p className="text-sm text-slate-400">
              Detailed results for each evaluation
            </p>

          </div>

          {filteredEvaluations.map((evaluation) => {

            const overall = getOverallScore(evaluation);

            const verdict = getVerdictLabel(evaluation);

            return (
              <div
                key={evaluation.id}
                className="rounded-xl border border-slate-700 bg-slate-900 p-6"
              >

                {/* =============================================
                    EVALUATION HEADER
                ============================================== */}

                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-center gap-4">

                    <h2 className="text-xl font-semibold text-white">
                      Overall Score: {overall.toFixed(2)}
                    </h2>

                    <VerdictBadge verdict={verdict} />

                  </div>

                  <span className="text-sm text-slate-400">
                    {new Date(
                      evaluation.evaluatedAt
                    ).toLocaleString()}
                  </span>

                </div>

                {/* =============================================
                    QUESTION
                ============================================== */}

                <div className="mb-4">

                  <h3 className="font-semibold text-violet-400">
                    Question
                  </h3>

                  <p className="text-slate-300">
                    {evaluation.question}
                  </p>

                </div>

                {/* =============================================
                    AI RESPONSE
                ============================================== */}

                <div className="mb-4">

                  <h3 className="font-semibold text-violet-400">
                    AI Response
                  </h3>

                  <p className="whitespace-pre-wrap text-slate-300">
                    {evaluation.response}
                  </p>

                </div>

                {/* =============================================
                    DIMENSION SCORES
                ============================================== */}

                <div className="mb-6 grid gap-4 md:grid-cols-4">

                  <Score
                    title="Relevance"
                    value={evaluation.result.relevance.score}
                  />

                  <Score
                    title="Accuracy"
                    value={evaluation.result.accuracy.score}
                  />

                  <Score
                    title="Hallucination"
                    value={
                      evaluation.result.hallucination.score
                    }
                  />

                  <Score
                    title="Completeness"
                    value={getCompletenessScore(evaluation)}
                  />

                </div>

                {/* =============================================
                    REASONS
                ============================================== */}

                <Section title="Relevance Reason">
                  {evaluation.result.relevance.reason}
                </Section>

                <Section title="Accuracy Reason">
                  {evaluation.result.accuracy.reason}
                </Section>

                <Section title="Hallucination Reason">
                  {evaluation.result.hallucination.reason}
                </Section>

                {evaluation.result.completeness && (
                  <Section title="Completeness Reason">
                    {evaluation.result.completeness.reason}
                  </Section>
                )}

                {/* =============================================
                    SUPPORTING EVIDENCE
                ============================================== */}

                <div className="mt-5">

                  <h3 className="mb-2 font-semibold text-white">
                    Supporting Evidence
                  </h3>

                  <ul className="ml-6 list-disc space-y-1">

                    {evaluation.result.accuracy
                      .supporting_evidence.length === 0 ? (

                      <li className="text-slate-400">
                        No evidence returned.
                      </li>

                    ) : (

                      evaluation.result.accuracy
                        .supporting_evidence.map(
                          (e, i) => (
                            <li
                              key={i}
                              className="text-slate-300"
                            >
                              {e}
                            </li>
                          )
                        )
                    )}

                  </ul>

                </div>

                {/* =============================================
                    HALLUCINATED CLAIMS
                ============================================== */}

                {evaluation.result.hallucination
                  .hallucinated_claims.length > 0 && (

                  <div className="mt-5">

                    <h3 className="mb-2 font-semibold text-red-400">
                      Hallucinated Claims
                    </h3>

                    {evaluation.result.hallucination
                      .hallucinated_claims.map(
                        (claim, index) => (

                          <div
                            key={index}
                            className="mb-3 rounded-lg border border-red-700 p-4"
                          >

                            <p className="font-semibold text-white">
                              {claim.claim}
                            </p>

                            <p className="text-sm text-slate-400">
                              {claim.reason}
                            </p>

                          </div>
                        )
                      )}

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

/**
 * Gets the completeness score.
 *
 * Supports the structure we've been using:
 *
 * result.completeness.score
 *
 * and safely falls back to 0 if the property
 * does not exist.
 */
function getCompletenessScore(evaluation: any): number {
  return Number(
    evaluation?.result?.completeness?.score ?? 0
  );
}

/**
 * Calculates the overall score for one evaluation.
 */
function getOverallScore(evaluation: any): number {
  const relevance =
    Number(evaluation?.result?.relevance?.score ?? 0);

  const accuracy =
    Number(evaluation?.result?.accuracy?.score ?? 0);

  const hallucination =
    Number(
      evaluation?.result?.hallucination?.score ?? 0
    );

  const completeness =
    Number(
      evaluation?.result?.completeness?.score ?? 0
    );

  return (
    (relevance +
      accuracy +
      hallucination +
      completeness) /
    4
  );
}

/**
 * Converts the backend verdict into one of the
 * dashboard categories.
 *
 * If your VerdictAgent already returns:
 *
 * verdict.label
 *
 * or
 *
 * verdict.verdict
 *
 * we support both.
 */
function getVerdictLabel(evaluation: any): string {
  const verdict =
    evaluation?.result?.verdict;

  if (!verdict) {
    return getOverallVerdictFromScore(
      getOverallScore(evaluation)
    );
  }

  const value = String(
    verdict.label ??
      verdict.verdict ??
      verdict.recommendation ??
      ""
  ).toLowerCase();

  if (
    value.includes("excellent") ||
    value.includes("pass")
  ) {
    return "Excellent";
  }

  if (value.includes("good")) {
    return "Good";
  }

  if (
    value.includes("needs") ||
    value.includes("improvement")
  ) {
    return "Needs Improvement";
  }

  if (
    value.includes("fail") ||
    value.includes("poor")
  ) {
    return "Fail";
  }

  return getOverallVerdictFromScore(
    getOverallScore(evaluation)
  );
}

/**
 * Fallback verdict calculation when the backend
 * verdict field is unavailable.
 */
function getOverallVerdictFromScore(
  score: number
): string {
  if (score >= 8.5) {
    return "Excellent";
  }

  if (score >= 7) {
    return "Good";
  }

  if (score >= 5) {
    return "Needs Improvement";
  }

  return "Fail";
}

/* ============================================================
   SMALL UI COMPONENTS
============================================================ */

function Score({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-slate-800 p-4">

      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="mt-1 text-3xl font-bold text-white">
        {Number(value ?? 0).toFixed(2)}
      </h2>

    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">

      <h3 className="mb-2 font-semibold text-white">
        {title}
      </h3>

      <p className="text-slate-300">
        {children}
      </p>

    </div>
  );
}

function VerdictBadge({
  verdict,
}: {
  verdict: string;
}) {
  const classes: Record<string, string> = {
    Excellent:
      "bg-green-500/20 text-green-400 border-green-500/30",

    Good:
      "bg-blue-500/20 text-blue-400 border-blue-500/30",

    "Needs Improvement":
      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",

    Fail:
      "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
        classes[verdict] ??
        "bg-slate-500/20 text-slate-400 border-slate-500/30"
      }`}
    >
      {verdict}
    </span>
  );
}