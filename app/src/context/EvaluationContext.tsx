// src/context/EvaluationContext.tsx

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/* ================================
   Backend Response Interfaces
================================ */

export interface RelevanceResult {
  score: number;
  label: string;
  confidence: number;
  reason: string;
}

export interface AccuracyResult {
  score: number;
  confidence: number;
  supporting_evidence: string[];
  reason: string;
}

export interface HallucinatedClaim {
  claim: string;
  reason: string;
}

export interface SupportedClaim {
  claim: string;
}

export interface HallucinationResult {
  score: number;
  confidence: number;
  hallucinated_claims: HallucinatedClaim[];
  supported_claims: SupportedClaim[];
  reason: string;
}
export interface CompletenessResult{
   score:number;
   confidence:number;
   covered_aspects:string[];
   missing_aspects:string[];
   reason:string;
}

export interface EvaluationResult {
  relevance: RelevanceResult;
  accuracy: AccuracyResult;
  hallucination: HallucinationResult;
  completeness:CompletenessResult;
  
}

/* ================================
   Evaluation Record
================================ */

export interface EvaluationRecord {
  id: string;

  question: string;

  response: string;

  evaluatedAt: string;

  result: EvaluationResult;
}

/* ================================
   Context
================================ */

interface EvaluationContextType {
  evaluations: EvaluationRecord[];

  addEvaluation: (record: EvaluationRecord) => void;

  clearEvaluations: () => void;
}

const EvaluationContext =
  createContext<EvaluationContextType | undefined>(undefined);

/* ================================
   Provider
================================ */

export function EvaluationProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [evaluations, setEvaluations] =
    useState<EvaluationRecord[]>([]);

  const addEvaluation = (record: EvaluationRecord) => {

    setEvaluations((prev) => [record, ...prev]);

  };

  const clearEvaluations = () => {

    setEvaluations([]);

  };

  return (

    <EvaluationContext.Provider
      value={{
        evaluations,
        addEvaluation,
        clearEvaluations,
      }}
    >
      {children}
    </EvaluationContext.Provider>

  );

}

/* =============================
   Custom Hook
================================ */

export function useEvaluation() {

  const context = useContext(EvaluationContext);

  if (!context) {

    throw new Error(
      "useEvaluation must be used inside EvaluationProvider"
    );

  }

  return context;

}