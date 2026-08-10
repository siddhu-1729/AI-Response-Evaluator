interface Props {
  totalResponses: number;
  hallucinatedResponses: number;
  totalHallucinatedClaims: number;
}

const HallucinationAnalytics = ({
  totalResponses,
  hallucinatedResponses,
  totalHallucinatedClaims,
}: Props) => {
  const frequency =
    totalResponses === 0
      ? 0
      : (hallucinatedResponses / totalResponses) * 100;

  const averageClaims =
    hallucinatedResponses === 0
      ? 0
      : totalHallucinatedClaims / hallucinatedResponses;

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Hallucination Analytics
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {/* Total Responses */}

        <div className="rounded-xl bg-slate-800 p-5">

          <p className="text-sm uppercase tracking-wide text-slate-400">
            Total Responses
          </p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {totalResponses}
          </h3>

        </div>

        {/* Responses With Hallucinations */}

        <div className="rounded-xl bg-slate-800 p-5">

          <p className="text-sm uppercase tracking-wide text-slate-400">
            Hallucinated Responses
          </p>

          <h3 className="mt-3 text-3xl font-bold text-red-400">
            {hallucinatedResponses}
          </h3>

        </div>

        {/* Frequency */}

        <div className="rounded-xl bg-slate-800 p-5">

          <p className="text-sm uppercase tracking-wide text-slate-400">
            Hallucination Frequency
          </p>

          <h3 className="mt-3 text-3xl font-bold text-yellow-400">
            {frequency.toFixed(1)}%
          </h3>

        </div>

        {/* Avg Claims */}

        <div className="rounded-xl bg-slate-800 p-5">

          <p className="text-sm uppercase tracking-wide text-slate-400">
            Avg Claims / Response
          </p>

          <h3 className="mt-3 text-3xl font-bold text-violet-400">
            {averageClaims.toFixed(2)}
          </h3>

        </div>

      </div>

      {/* Progress Bar */}

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm text-slate-400">

          <span>Hallucination Frequency</span>

          <span>{frequency.toFixed(1)}%</span>

        </div>

        <div className="h-4 overflow-hidden rounded-full bg-slate-700">

          <div
            className="h-full rounded-full bg-red-500 transition-all duration-500"
            style={{
              width: `${frequency}%`,
            }}
          />

        </div>

      </div>

      {/* Total Claims */}

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800 p-5">

        <p className="text-slate-400">
          Total Hallucinated Claims Detected
        </p>

        <h2 className="mt-2 text-4xl font-bold text-red-500">
          {totalHallucinatedClaims}
        </h2>

      </div>

    </div>
  );
};

export default HallucinationAnalytics;