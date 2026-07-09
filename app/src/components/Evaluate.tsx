import { useState } from "react";
import {  Loader2 } from "lucide-react";

export const Evaluate = () => {
  const [prompt, setPrompt] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const isDisabled = !prompt.trim() || isEvaluating;

  const handleEvaluate = async () => {
    if (isDisabled) return;
    setIsEvaluating(true);
    try {
      // Replace with your actual evaluation call.
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Evaluate a response
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Provide the prompt and a reference answer to score an AI response against it.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm shadow-black/20 sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="prompt"
              className="text-sm font-medium text-slate-300"
            >
              Prompt
            </label>
            <textarea
              id="prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What was the model asked to do?"
              className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="reference-text"
              className="text-sm font-medium text-slate-300"
            >
              Reference text
            </label>
            <textarea
              id="reference-text"
              rows={5}
              value={referenceText}
              onChange={(e) => setReferenceText(e.target.value)}
              placeholder="Paste the ideal or ground-truth answer to compare against."
              className="w-full resize-none rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-5">
            <p className="text-xs text-slate-500">
              Both fields are required to run an evaluation.
            </p>
            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isDisabled}
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-950/40 transition-all hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:from-violet-600 disabled:hover:to-indigo-600"
            >
              {isEvaluating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Evaluating
                </>
              ) : (
                <>
                  
                  Evaluate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};