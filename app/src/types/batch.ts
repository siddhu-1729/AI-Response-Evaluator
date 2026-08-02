export interface SupportedClaim {
  claim: string;
}

export interface HallucinatedClaim {
  claim: string;
  reason: string;
}

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

export interface HallucinationResult {
  score: number;
  confidence: number;
  supported_claims: SupportedClaim[];
  hallucinated_claims: HallucinatedClaim[];
  reason: string;
}

export interface CompletenessResult {
  score: number;
  confidence: number;
  covered_aspects: string[];
  missing_aspects: string[];
  reason: string;
}

export interface VerdictResult {
  overall_score: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export interface CombinedEvaluationResult {
  relevance: RelevanceResult;
  accuracy: AccuracyResult;
  hallucination: HallucinationResult;
  completeness: CompletenessResult;
  verdict: VerdictResult;
}

export interface BatchResult {
  question: string;
  response: string;
  evaluation: CombinedEvaluationResult;
}

export interface BatchSummary {
  total_evaluations: number;
  average_relevance: number;
  average_accuracy: number;
  average_hallucination: number;
  average_completeness: number;
  average_overall: number;
}

export interface BatchEvaluationResponse {
  summary: BatchSummary;
  results: BatchResult[];
}