import type { BatchResult } from "../types/batch";

interface Props {
  results: BatchResult[];
  onView: (result: BatchResult) => void;
}

const getVerdictColor = (verdict: string) => {
  switch (verdict.toLowerCase()) {
    case "excellent":
      return "text-green-400";

    case "good":
      return "text-blue-400";

    case "needs improvement":
      return "text-yellow-400";

    case "fail":
      return "text-red-400";

    default:
      return "text-slate-300";
  }
};

const BatchTable = ({ results, onView }: Props) => {
  return (
    <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Batch Evaluation Results
      </h2>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>

            <tr className="border-b border-slate-700 text-left">

              <th className="p-4 text-slate-300">
                #
              </th>

              <th className="p-4 text-slate-300">
                Question
              </th>

              <th className="p-4 text-slate-300">
                Overall Score
              </th>

              <th className="p-4 text-slate-300">
                Verdict
              </th>

              <th className="p-4 text-slate-300">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {results.map((item, index) => (

              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800 transition"
              >

                <td className="p-4 text-slate-400">
                  {index + 1}
                </td>

                <td className="max-w-md truncate p-4 text-white">
                  {item.question}
                </td>

                <td className="p-4 font-semibold text-green-400">
                  {item.evaluation.verdict.overall_score.toFixed(2)}
                </td>

                <td
                  className={`p-4 font-semibold ${getVerdictColor(
                    item.evaluation.verdict.verdict
                  )}`}
                >
                  {item.evaluation.verdict.verdict}
                </td>

                <td className="p-4">

                  <button
                    onClick={() => onView(item)}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700 transition"
                  >
                    View Details
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default BatchTable;