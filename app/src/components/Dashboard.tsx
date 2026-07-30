import { useMemo } from "react";
import { useEvaluation } from "../context/EvaluationContext";

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

    const relevance =
      evaluations.reduce(
        (sum, evaluation) => sum + evaluation.result.relevance.score,
        0
      ) / evaluations.length;

    const accuracy =
      evaluations.reduce(
        (sum, evaluation) => sum + evaluation.result.accuracy.score,
        0
      ) / evaluations.length;

    const hallucination =
      evaluations.reduce(
        (sum, evaluation) => sum + evaluation.result.hallucination.score,
        0
      ) / evaluations.length;

    const completeness =
      evaluations.reduce(
        (sum, evaluation) => sum + evaluation.result.completeness.score,
        0
      ) / evaluations.length;

    const overall =
      evaluations.reduce(
        (sum, evaluation) =>
          sum + evaluation.result.verdict.overall_score,
        0
      ) / evaluations.length;

    return {
      relevance,
      accuracy,
      hallucination,
      completeness,
      overall,
    };
  }, [evaluations]);

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Evaluation Dashboard
          </h1>

          <p className="text-slate-400">
            Total Evaluations: {evaluations.length}
          </p>
        </div>

        <button
          onClick={clearEvaluations}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Clear History
        </button>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-5">
        <Card
          title="Overall"
          value={averages.overall.toFixed(2)}
          color="text-green-400"
        />

        <Card
          title="Relevance"
          value={averages.relevance.toFixed(2)}
          color="text-blue-400"
        />

        <Card
          title="Accuracy"
          value={averages.accuracy.toFixed(2)}
          color="text-yellow-400"
        />

        <Card
          title="Hallucination"
          value={averages.hallucination.toFixed(2)}
          color="text-red-400"
        />

        <Card
          title="Completeness"
          value={averages.completeness.toFixed(2)}
          color="text-emerald-400"
        />
      </div>

      {evaluations.length === 0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
          No evaluations yet.
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((evaluation) => {
            const overall =
              evaluation.result.verdict.overall_score;

            return (
              <div
                key={evaluation.id}
                className="rounded-xl border border-slate-700 bg-slate-900 p-6"
              >
                <div className="mb-4 flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Overall Score: {overall.toFixed(2)}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-violet-400">
                      Verdict: {evaluation.result.verdict.verdict}
                    </p>
                  </div>

                  <span className="text-sm text-slate-400">
                    {new Date(
                      evaluation.evaluatedAt
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-violet-400">
                    Question
                  </h3>

                  <p className="text-slate-300">
                    {evaluation.question}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-violet-400">
                    AI Response
                  </h3>

                  <p className="whitespace-pre-wrap text-slate-300">
                    {evaluation.response}
                  </p>
                </div>

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
                    value={evaluation.result.hallucination.score}
                  />

                  <Score
                    title="Completeness"
                    value={evaluation.result.completeness.score}
                  />
                </div>
                                <Section title="Relevance Reason">
                  {evaluation.result.relevance.reason}
                </Section>

                <Section title="Accuracy Reason">
                  {evaluation.result.accuracy.reason}
                </Section>

                <Section title="Completeness Reason">
                  {evaluation.result.completeness.reason}
                </Section>

                <Section title="Hallucination Reason">
                  {evaluation.result.hallucination.reason}
                </Section>

                {/* Verdict */}

                <div className="mt-6 rounded-xl border border-violet-600 bg-slate-800 p-5">
                  <h3 className="mb-4 text-xl font-bold text-violet-400">
                    Final Verdict
                  </h3>

                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {evaluation.result.verdict.verdict}
                      </p>

                      <p className="text-slate-400">
                        Overall Score:{" "}
                        {evaluation.result.verdict.overall_score.toFixed(2)}
                        /10
                      </p>
                    </div>
                  </div>

                  {/* Strengths */}

                  <div className="mb-5">
                    <h4 className="mb-2 font-semibold text-green-400">
                      Strengths
                    </h4>

                    {evaluation.result.verdict.strengths.length === 0 ? (
                      <p className="text-slate-400">
                        No strengths detected.
                      </p>
                    ) : (
                      <ul className="list-disc space-y-1 pl-6 text-slate-300">
                        {evaluation.result.verdict.strengths.map(
                          (strength, index) => (
                            <li key={index}>{strength}</li>
                          )
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Weaknesses */}

                  <div className="mb-5">
                    <h4 className="mb-2 font-semibold text-red-400">
                      Weaknesses
                    </h4>

                    {evaluation.result.verdict.weaknesses.length === 0 ? (
                      <p className="text-slate-400">
                        No weaknesses detected.
                      </p>
                    ) : (
                      <ul className="list-disc space-y-1 pl-6 text-slate-300">
                        {evaluation.result.verdict.weaknesses.map(
                          (weakness, index) => (
                            <li key={index}>{weakness}</li>
                          )
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Recommendation */}

                  <div>
                    <h4 className="mb-2 font-semibold text-blue-400">
                      Recommendation
                    </h4>

                    <p className="text-slate-300">
                      {evaluation.result.verdict.recommendation}
                    </p>
                  </div>
                </div>

                {/* Supporting Evidence */}

                <div className="mt-6">
                  <h3 className="mb-2 font-semibold text-white">
                    Supporting Evidence
                  </h3>

                  <ul className="ml-6 list-disc space-y-2">
                    {evaluation.result.accuracy.supporting_evidence.length ===
                    0 ? (
                      <li className="text-slate-400">
                        No supporting evidence returned.
                      </li>
                    ) : (
                      evaluation.result.accuracy.supporting_evidence.map(
                        (evidence, index) => (
                          <li
                            key={index}
                            className="text-slate-300"
                          >
                            {evidence}
                          </li>
                        )
                      )
                    )}
                  </ul>
                </div>

                {/* Hallucinated Claims */}

                {evaluation.result.hallucination.hallucinated_claims.length >
                  0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 font-semibold text-red-400">
                      Hallucinated Claims
                    </h3>

                    {evaluation.result.hallucination.hallucinated_claims.map(
                      (claim, index) => (
                        <div
                          key={index}
                          className="mb-3 rounded-lg border border-red-700 bg-slate-800 p-4"
                        >
                          <p className="font-semibold text-white">
                            {claim.claim}
                          </p>

                          <p className="mt-2 text-sm text-slate-400">
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
function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-md">
      <p className="text-sm text-slate-400">{title}</p>

      <h2 className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function Score({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  let color = "text-red-400";

  if (value >= 9) {
    color = "text-green-400";
  } else if (value >= 8) {
    color = "text-emerald-400";
  } else if (value >= 7) {
    color = "text-yellow-400";
  } else if (value >= 5) {
    color = "text-orange-400";
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className={`mt-2 text-3xl font-bold ${color}`}>
        {value.toFixed(1)}
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
    <div className="mt-5 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-2 font-semibold text-white">
        {title}
      </h3>

      <div className="leading-7 text-slate-300">
        {children}
      </div>
    </div>
  );
}