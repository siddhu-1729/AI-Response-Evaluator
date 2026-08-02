import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface HallucinatedClaim {
  claim: string;
  reason: string;
}

interface SupportedClaim {
  claim: string;
}

interface HallucinationPanelProps {
  hallucinatedClaims: HallucinatedClaim[];
  supportedClaims: SupportedClaim[];
}

export default function HallucinationPanel({
  hallucinatedClaims,
  supportedClaims,
}: HallucinationPanelProps) {
  return (
    <div className="space-y-6">

      {/* Hallucinated Claims */}

      <div className="rounded-2xl border border-red-700 bg-slate-900 p-6">

        <div className="mb-5 flex items-center gap-3">
          <AlertTriangle
            className="text-red-400"
            size={26}
          />

          <h2 className="text-xl font-bold text-red-400">
            Hallucination Detection
          </h2>
        </div>

        {hallucinatedClaims.length === 0 ? (
          <div className="rounded-xl bg-green-900/20 p-5">

            <div className="flex items-center gap-3">

              <CheckCircle2
                className="text-green-400"
                size={22}
              />

              <p className="font-medium text-green-400">
                No hallucinated claims detected.
              </p>

            </div>

          </div>
        ) : (
          <div className="space-y-5">

            {hallucinatedClaims.map((claim, index) => (
              <div
                key={index}
                className="rounded-xl border border-red-700 bg-red-950/20 p-5"
              >
                <h3 className="font-semibold text-red-300">
                  Flagged Claim
                </h3>

                <p className="mt-3 text-white">
                  {claim.claim}
                </p>

                <div className="mt-5 rounded-lg bg-slate-800 p-4">

                  <p className="text-sm font-semibold text-red-400">
                    Why it was flagged
                  </p>

                  <p className="mt-2 text-slate-300">
                    {claim.reason}
                  </p>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Supported Claims */}

      {supportedClaims.length > 0 && (
        <div className="rounded-2xl border border-green-700 bg-slate-900 p-6">

          <div className="mb-5 flex items-center gap-3">

            <CheckCircle2
              className="text-green-400"
              size={24}
            />

            <h2 className="text-xl font-bold text-green-400">
              Supported Claims
            </h2>

          </div>

          <div className="space-y-4">

            {supportedClaims.map((claim, index) => (
              <div
                key={index}
                className="rounded-lg bg-slate-800 p-4"
              >
                <p className="text-slate-300">
                  {claim.claim}
                </p>
              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}