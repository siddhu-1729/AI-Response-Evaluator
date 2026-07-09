import { useMemo, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

type ReliabilityTier = "reliable" | "review" | "unreliable";

interface EvaluationRecord {
  id: string;
  promptSummary: string;
  model: string;
  accuracy: number; // 0-100, how factually correct the response was
  relevance: number; // 0-100, how well it addressed the prompt
  referenceOverlap: number; // 0-100, semantic overlap with reference text
  reliability: number; // 0-100, composite trust score
  tier: ReliabilityTier;
  evaluatedAt: string;
}

const EVALUATIONS: EvaluationRecord[] = [
  {
    id: "ev_1042",
    promptSummary: "Summarize the causes of the 2008 financial crisis",
    model: "gpt-4o",
    accuracy: 92,
    relevance: 95,
    referenceOverlap: 88,
    reliability: 91,
    tier: "reliable",
    evaluatedAt: "2026-07-08T14:20:00Z",
  },
  {
    id: "ev_1041",
    promptSummary: "Explain how mRNA vaccines trigger an immune response",
    model: "claude-sonnet-5",
    accuracy: 96,
    relevance: 93,
    referenceOverlap: 90,
    reliability: 94,
    tier: "reliable",
    evaluatedAt: "2026-07-08T11:05:00Z",
  },
  {
    id: "ev_1040",
    promptSummary: "Compare Big-O complexity of quicksort vs mergesort",
    model: "gemini-2.5-pro",
    accuracy: 78,
    relevance: 82,
    referenceOverlap: 65,
    reliability: 74,
    tier: "review",
    evaluatedAt: "2026-07-07T19:40:00Z",
  },
  {
    id: "ev_1039",
    promptSummary: "Describe current treatment guidelines for hypertension",
    model: "gpt-4o",
    accuracy: 54,
    relevance: 71,
    referenceOverlap: 40,
    reliability: 48,
    tier: "unreliable",
    evaluatedAt: "2026-07-07T09:12:00Z",
  },
  {
    id: "ev_1038",
    promptSummary: "Draft a cover letter for a data analyst role",
    model: "claude-sonnet-5",
    accuracy: 88,
    relevance: 90,
    referenceOverlap: 84,
    reliability: 87,
    tier: "reliable",
    evaluatedAt: "2026-07-06T16:30:00Z",
  },
];

const TIER_CONFIG: Record<
  ReliabilityTier,
  { label: string; icon: typeof ShieldCheck; textClass: string; bgClass: string }
> = {
  reliable: {
    label: "Reliable",
    icon: ShieldCheck,
    textClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/20",
  },
  review: {
    label: "Needs review",
    icon: ShieldAlert,
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/20",
  },
  unreliable: {
    label: "Unreliable",
    icon: ShieldX,
    textClass: "text-rose-400",
    bgClass: "bg-rose-500/10 border-rose-500/20",
  },
};

const average = (values: number[]) =>
  Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium text-slate-200">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ReliabilityGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#fb7185";

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-slate-800"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-semibold text-slate-100">{score}</span>
        <span className="text-xs text-slate-500">out of 100</span>
      </div>
    </div>
  );
}

function TrendIndicator({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-slate-500">
        <Minus size={13} />
        Flat vs last week
      </span>
    );
  }
  const isUp = delta > 0;
  return (
    <span
      className={`flex items-center gap-1 text-xs ${
        isUp ? "text-emerald-400" : "text-rose-400"
      }`}
    >
      {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {Math.abs(delta)} pts vs last week
    </span>
  );
}

export const Dashboard = () => {
  const [selectedTier, setSelectedTier] = useState<ReliabilityTier | "all">(
    "all"
  );

  const overallReliability = useMemo(
    () => average(EVALUATIONS.map((e) => e.reliability)),
    []
  );
  const overallAccuracy = useMemo(
    () => average(EVALUATIONS.map((e) => e.accuracy)),
    []
  );
  const overallRelevance = useMemo(
    () => average(EVALUATIONS.map((e) => e.relevance)),
    []
  );
  const overallOverlap = useMemo(
    () => average(EVALUATIONS.map((e) => e.referenceOverlap)),
    []
  );

  const filteredEvaluations = useMemo(() => {
    if (selectedTier === "all") return EVALUATIONS;
    return EVALUATIONS.filter((e) => e.tier === selectedTier);
  }, [selectedTier]);

  const tierCounts = useMemo(() => {
    return EVALUATIONS.reduce(
      (acc, e) => {
        acc[e.tier] += 1;
        return acc;
      },
      { reliable: 0, review: 0, unreliable: 0 } as Record<ReliabilityTier, number>
    );
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Evaluation dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Reliability of model responses against reference text, across recent evaluations.
        </p>
      </div>

      {/* Top summary row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Reliability gauge card */}
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <ReliabilityGauge score={overallReliability} />
          <div className="text-center">
            <p className="text-sm font-medium text-slate-200">
              Overall reliability
            </p>
            <TrendIndicator delta={4} />
          </div>
        </div>

        {/* Score breakdown card */}
        <div className="flex flex-col justify-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-2">
          <p className="text-sm font-medium text-slate-200">
            Composite score breakdown
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ScoreBar label="Accuracy" value={overallAccuracy} />
            <ScoreBar label="Relevance" value={overallRelevance} />
            <ScoreBar label="Reference overlap" value={overallOverlap} />
          </div>
        </div>
      </div>

      {/* Tier filter chips */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedTier("all")}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            selectedTier === "all"
              ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
              : "border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          All ({EVALUATIONS.length})
        </button>
        {(Object.keys(TIER_CONFIG) as ReliabilityTier[]).map((tier) => {
          const config = TIER_CONFIG[tier];
          return (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedTier === tier
                  ? `${config.bgClass} ${config.textClass}`
                  : "border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {config.label} ({tierCounts[tier]})
            </button>
          );
        })}
      </div>

      {/* Evaluations table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3 font-medium">Prompt</th>
                <th className="px-5 py-3 font-medium">Model</th>
                <th className="px-5 py-3 font-medium">Accuracy</th>
                <th className="px-5 py-3 font-medium">Relevance</th>
                <th className="px-5 py-3 font-medium">Ref. overlap</th>
                <th className="px-5 py-3 font-medium">Reliability</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Evaluated</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations.map((evaluation) => {
                const config = TIER_CONFIG[evaluation.tier];
                const Icon = config.icon;
                return (
                  <tr
                    key={evaluation.id}
                    className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30"
                  >
                    <td className="max-w-xs truncate px-5 py-3.5 text-slate-200">
                      {evaluation.promptSummary}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {evaluation.model}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {evaluation.accuracy}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {evaluation.relevance}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">
                      {evaluation.referenceOverlap}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-100">
                      {evaluation.reliability}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.bgClass} ${config.textClass}`}
                      >
                        <Icon size={13} />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                      {formatDate(evaluation.evaluatedAt)}
                    </td>
                  </tr>
                );
              })}

              {filteredEvaluations.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No evaluations in this category yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};