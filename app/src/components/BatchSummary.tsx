import type { BatchSummary as BatchSummaryType } from "../types/batch";

interface Props {
  summary: BatchSummaryType;
}

const SummaryCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number | string;
  color: string;
}) => {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <p className="text-sm uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <h2 className={`mt-3 text-3xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
};

const BatchSummary = ({ summary }: Props) => {
  return (
    <div className="mt-8">

      <h2 className="mb-6 text-3xl font-bold text-white">
        Batch Evaluation Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <SummaryCard
          title="Total Evaluations"
          value={summary.total_evaluations}
          color="text-violet-400"
        />

        <SummaryCard
          title="Average Overall"
          value={summary.average_overall.toFixed(2)}
          color="text-green-400"
        />

        <SummaryCard
          title="Average Relevance"
          value={summary.average_relevance.toFixed(2)}
          color="text-blue-400"
        />

        <SummaryCard
          title="Average Accuracy"
          value={summary.average_accuracy.toFixed(2)}
          color="text-yellow-400"
        />

        <SummaryCard
          title="Average Hallucination"
          value={summary.average_hallucination.toFixed(2)}
          color="text-red-400"
        />

        <SummaryCard
          title="Average Completeness"
          value={summary.average_completeness.toFixed(2)}
          color="text-emerald-400"
        />

      </div>

    </div>
  );
};

export default BatchSummary;