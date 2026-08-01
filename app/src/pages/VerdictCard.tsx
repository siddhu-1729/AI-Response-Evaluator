import {
  CheckCircle2,
  CircleX,
  Lightbulb,
  Trophy,
} from "lucide-react";

interface VerdictCardProps {
  verdict: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export default function VerdictCard({
  verdict,
  overallScore,
  strengths,
  weaknesses,
  recommendation,
}: VerdictCardProps) {
  let color = "text-red-400";

  if (overallScore >= 9) {
    color = "text-green-400";
  } else if (overallScore >= 8) {
    color = "text-emerald-400";
  } else if (overallScore >= 7) {
    color = "text-yellow-400";
  } else if (overallScore >= 5) {
    color = "text-orange-400";
  }

  return (
    <div className="rounded-3xl border border-violet-700 bg-slate-900 p-8">

      <div className="flex items-center gap-3">

        <Trophy
          className="text-yellow-400"
          size={30}
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            Final Verdict
          </h2>

          <p className={`mt-1 text-xl font-semibold ${color}`}>
            {verdict}
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-xl bg-slate-800 p-5">

        <p className="text-sm text-slate-400">
          Overall Score
        </p>

        <h1 className={`mt-2 text-5xl font-bold ${color}`}>
          {overallScore.toFixed(1)}
        </h1>

      </div>

      {/* Strengths */}

      <div className="mt-8">

        <div className="mb-4 flex items-center gap-2">

          <CheckCircle2
            className="text-green-400"
            size={22}
          />

          <h3 className="font-semibold text-green-400">
            Strengths
          </h3>

        </div>

        {strengths.length === 0 ? (
          <p className="text-slate-400">
            No strengths identified.
          </p>
        ) : (
          <div className="space-y-3">

            {strengths.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-slate-800 p-4"
              >
                {item}
              </div>
            ))}

          </div>
        )}

      </div>

      {/* Weaknesses */}

      <div className="mt-8">

        <div className="mb-4 flex items-center gap-2">

          <CircleX
            className="text-red-400"
            size={22}
          />

          <h3 className="font-semibold text-red-400">
            Weaknesses
          </h3>

        </div>

        {weaknesses.length === 0 ? (
          <p className="text-slate-400">
            No weaknesses identified.
          </p>
        ) : (
          <div className="space-y-3">

            {weaknesses.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-slate-800 p-4"
              >
                {item}
              </div>
            ))}

          </div>
        )}

      </div>

      {/* Recommendation */}

      <div className="mt-8">

        <div className="mb-4 flex items-center gap-2">

          <Lightbulb
            className="text-blue-400"
            size={22}
          />

          <h3 className="font-semibold text-blue-400">
            Recommendation
          </h3>

        </div>

        <div className="rounded-xl bg-slate-800 p-5">

          <p className="leading-7 text-slate-300">
            {recommendation}
          </p>

        </div>

      </div>

    </div>
  );
}