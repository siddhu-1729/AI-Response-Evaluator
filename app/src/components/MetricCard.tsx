import ProgressBar from "./ProgressBar";
import ConfidenceBadge from "./ConfidenceBadge";

interface MetricCardProps {
  title: string;
  score: number;
  confidence: number;
  reason: string;
  color: string;
}

export default function MetricCard({
  title,
  score,
  confidence,
  reason,
  color,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg transition hover:border-violet-500 hover:shadow-violet-500/20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        <ConfidenceBadge confidence={confidence} />
      </div>

      <h1 className={`mt-5 text-5xl font-bold ${color}`}>
        {score.toFixed(1)}
      </h1>

      <ProgressBar value={score} />

      <p className="mt-6 text-sm leading-7 text-slate-300">
        {reason}
      </p>
    </div>
  );
}