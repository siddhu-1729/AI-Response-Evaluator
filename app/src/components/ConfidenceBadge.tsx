interface ConfidenceBadgeProps {
  confidence: number;
}

export default function ConfidenceBadge({
  confidence,
}: ConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100);

  let bg = "bg-red-500/20";
  let text = "text-red-400";
  let label = "Low";

  if (percentage >= 90) {
    bg = "bg-green-500/20";
    text = "text-green-400";
    label = "High";
  } else if (percentage >= 75) {
    bg = "bg-yellow-500/20";
    text = "text-yellow-400";
    label = "Medium";
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${bg} ${text}`}
    >
      <span className="h-2 w-2 rounded-full bg-current"></span>

      <span>{label} Confidence</span>

      <span className="font-semibold">
        {percentage}%
      </span>
    </div>
  );
}