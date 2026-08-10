import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface TrendPoint {
  index: number;
  overall: number;
}

interface Props {
  data: TrendPoint[];
}

const TrendChart = ({ data }: Props) => {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Quality Trend
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="index"
              label={{
                value: "Evaluation",
                position: "insideBottom",
                offset: -5,
                fill: "#CBD5E1",
              }}
              tick={{ fill: "#CBD5E1" }}
            />

            <YAxis
              domain={[0, 10]}
              tick={{ fill: "#CBD5E1" }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="overall"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#8B5CF6",
              }}
              activeDot={{
                r: 7,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default TrendChart;