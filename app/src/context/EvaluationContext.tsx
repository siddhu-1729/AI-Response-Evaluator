// src/context/EvaluationContext.tsx

import { createContext, useContext, useState ,type ReactNode} from "react";

export interface EvaluationResult {
  overall_score: number;
  grammar: number;
  similarity: number;
  reasoning: number;
  feedback: string[];
}

interface EvaluationContextType {
  evaluations: EvaluationResult[];
  addEvaluation: (evaluation: EvaluationResult) => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(
  undefined
);

// Evaluation provider function to get more evalutions and store them
export function EvaluationProvider({
  children,
}: {
  children: ReactNode;
}) {
    
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);

  const addEvaluation = (evaluation: EvaluationResult) => {
    setEvaluations((prev) => [evaluation, ...prev]);
  };


  return (
    <EvaluationContext.Provider
      value={{
        evaluations,
        addEvaluation,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );

  
}

// custom Hook for usage purpose
export function useEvaluation() {
  const context = useContext(EvaluationContext);

  if (!context) {
    throw new Error(
      "useEvaluation must be used inside EvaluationProvider"
    );
  }

  return context;
}