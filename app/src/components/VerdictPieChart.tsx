import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  excellent: number;
  good: number;
  needsImprovement: number;
  fail: number;
}

const COLORS = [
  "#22c55e", // Excellent
  "#3b82f6", // Good
  "#facc15", // Needs Improvement
  "#ef4444", // Fail
];

const VerdictPieChart = ({
  excellent,
  good,
  needsImprovement,
  fail,
}: Props) => {
  const data = [
    {
      name: "Excellent",
      value: excellent,
    },
    {
      name: "Good",
      value: good,
    },
    {
      name: "Needs Improvement",
      value: needsImprovement,
    },
    {
      name: "Fail",
      value: fail,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Verdict Distribution
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={60}
              dataKey="value"
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default VerdictPieChart;