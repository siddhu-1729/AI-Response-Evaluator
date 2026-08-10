import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

interface Props {
  relevance: number;
  accuracy: number;
  hallucination: number;
  completeness: number;
  overall: number;
}

const AverageScoreChart = ({
  relevance,
  accuracy,
  hallucination,
  completeness,
  overall,
}: Props) => {
  const data = [
    {
      metric: "Relevance",
      score: Number(relevance.toFixed(2)),
    },
    {
      metric: "Accuracy",
      score: Number(accuracy.toFixed(2)),
    },
    {
      metric: "Hallucination",
      score: Number(hallucination.toFixed(2)),
    },
    {
      metric: "Completeness",
      score: Number(completeness.toFixed(2)),
    },
    {
      metric: "Overall",
      score: Number(overall.toFixed(2)),
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Average Dimension Scores
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              dataKey="metric"
              tick={{ fill: "#CBD5E1" }}
            />

            <YAxis
              domain={[0, 10]}
              tick={{ fill: "#CBD5E1" }}
            />

            <Tooltip />

            <Bar
              dataKey="score"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default AverageScoreChart;