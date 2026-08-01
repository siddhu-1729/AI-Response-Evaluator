import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface AgentAccordionProps {
  title: string;
  children: React.ReactNode;
}

export default function AgentAccordion({
  title,
  children,
}: AgentAccordionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 hover:bg-slate-800 transition"
      >
        <h2 className="font-semibold text-white">
          {title}
        </h2>

        {open ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-700 p-6 text-slate-300 leading-8">
          {children}
        </div>
      )}
    </div>
  );
}