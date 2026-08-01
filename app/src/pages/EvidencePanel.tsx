import { CheckCircle2 } from "lucide-react";

interface EvidencePanelProps {
  evidence: string[];
}

export default function EvidencePanel({
  evidence,
}: EvidencePanelProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-bold text-white">
        Supporting Evidence
      </h2>

      {evidence.length === 0 ? (
        <p className="text-slate-400">
          No supporting evidence returned.
        </p>
      ) : (
        <div className="space-y-4">

          {evidence.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-xl bg-slate-800 p-4"
            >
              <CheckCircle2
                className="mt-1 text-green-400"
                size={20}
              />

              <p className="text-slate-300">
                {item}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}