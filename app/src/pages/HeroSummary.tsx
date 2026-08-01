import ConfidenceBadge from "./ConfidenceBadge";

interface HeroSummaryProps {
  overallScore: number;
  verdict: string;
  confidence: number;
}

export default function HeroSummary({
  overallScore,
  verdict,
  confidence,
}: HeroSummaryProps) {
  let scoreColor = "text-red-400";

  if (overallScore >= 9) {
    scoreColor = "text-green-400";
  } else if (overallScore >= 8) {
    scoreColor = "text-emerald-400";
  } else if (overallScore >= 7) {
    scoreColor = "text-yellow-400";
  } else if (overallScore >= 5) {
    scoreColor = "text-orange-400";
  }

  return (
    <div className="rounded-3xl border border-violet-700 bg-linear-to-br from-slate-900 to-slate-800 p-10 shadow-xl">
      <div className="flex flex-col items-center text-center">

        <p className="text-slate-400 uppercase tracking-widest text-sm">
          Overall Evaluation
        </p>

        <h1 className={`mt-5 text-7xl font-bold ${scoreColor}`}>
          {overallScore.toFixed(1)}
        </h1>

        <p className="mt-4 text-3xl font-semibold text-violet-400">
          {verdict}
        </p>

        <div className="mt-6">
          <ConfidenceBadge confidence={confidence} />
        </div>
      </div>
    </div>
  );
}