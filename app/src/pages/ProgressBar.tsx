interface ProgressBarProps {
  value: number;
  max?: number;
}

export default function ProgressBar({
  value,
  max = 10,
}: ProgressBarProps) {
  const percentage = Math.min(
    100,
    Math.max(0, (value / max) * 100)
  );

  let color =
    "bg-red-500";

  if (value >= 9) {
    color = "bg-green-500";
  } else if (value >= 8) {
    color = "bg-emerald-500";
  } else if (value >= 7) {
    color = "bg-yellow-500";
  } else if (value >= 5) {
    color = "bg-orange-500";
  }

  return (
    <div className="mt-4">
      <div className="mb-2 flex justify-between text-xs text-slate-400">
        <span>Score</span>
        <span>
          {value.toFixed(1)} / {max}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}