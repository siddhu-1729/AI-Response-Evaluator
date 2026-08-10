import type { ChangeEvent } from "react";

interface Props {
  search: string;
  verdict: string;

  onSearchChange: (value: string) => void;
  onVerdictChange: (value: string) => void;
}

const DashboardFilters = ({
  search,
  verdict,
  onSearchChange,
  onVerdictChange,
}: Props) => {
  const handleSearch = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    onSearchChange(e.target.value);
  };

  const handleVerdict = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    onVerdictChange(e.target.value);
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Filters
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Search */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Search Question
          </label>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by question..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-violet-500"
          />

        </div>

        {/* Verdict */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Verdict
          </label>

          <select
            value={verdict}
            onChange={handleVerdict}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-violet-500"
          >
            <option value="">All</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Needs Improvement">
              Needs Improvement
            </option>
            <option value="Fail">Fail</option>
          </select>

        </div>

      </div>

    </div>
  );
};

export default DashboardFilters;