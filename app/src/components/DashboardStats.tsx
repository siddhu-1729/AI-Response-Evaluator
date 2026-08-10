interface DashboardStatsProps {
  totalEvaluations: number;
  excellent: number;
  good: number;
  needsImprovement: number;
  fail: number;
  averageOverall: number;
  hallucinationFrequency: number;
}

interface CardProps {
  title: string;
  value: string | number;
  color: string;
}

const StatCard = ({
  title,
  value,
  color,
}: CardProps) => {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <p className="text-sm uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <h2 className={`mt-4 text-3xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
};

const DashboardStats = ({
  totalEvaluations,
  excellent,
  good,
  needsImprovement,
  fail,
  averageOverall,
  hallucinationFrequency,
}: DashboardStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Evaluations"
        value={totalEvaluations}
        color="text-violet-400"
      />

      <StatCard
        title="Excellent"
        value={excellent}
        color="text-green-400"
      />

      <StatCard
        title="Good"
        value={good}
        color="text-blue-400"
      />

      <StatCard
        title="Needs Improvement"
        value={needsImprovement}
        color="text-yellow-400"
      />

      <StatCard
        title="Fail"
        value={fail}
        color="text-red-400"
      />

      <StatCard
        title="Average Overall"
        value={averageOverall.toFixed(2)}
        color="text-cyan-400"
      />

      <StatCard
        title="Hallucination Frequency"
        value={`${hallucinationFrequency.toFixed(1)}%`}
        color="text-pink-400"
      />

    </div>
  );
};

export default DashboardStats;