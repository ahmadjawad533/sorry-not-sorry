import { z } from 'zod';

// ==========================================
// BACKEND CONTRACT SCHEMAS (docs/BACKEND_CONTRACT.md)
// ==========================================

export const BackendVerdictEnum = z.enum([
  'BUSTED',
  'SUSPICIOUS',
  'PLAUSIBLE',
  'CREDIBLE',
]);
export type BackendVerdict = z.infer<typeof BackendVerdictEnum>;

export const PatternSchema = z.object({
  id: z.string(),
  title: z.string(),
  commentary: z.string(),
  confidence: z.number(),
});
export type Pattern = z.infer<typeof PatternSchema>;

export const InvestigateResponseSchema = z.object({
  caseId: z.string(),
  believability: z.number().min(0).max(100),
  verdict: BackendVerdictEnum,
  patterns: z.array(PatternSchema),
  notes: z.string(),
  createdAt: z.string(),
});
export type InvestigateResponse = z.infer<typeof InvestigateResponseSchema>;

export const ShameItemSchema = z.object({
  excuse: z.string(),
  believability: z.number().min(0).max(100),
  verdict: BackendVerdictEnum,
  createdAt: z.string(),
});
export type ShameItem = z.infer<typeof ShameItemSchema>;

export const ShameResponseSchema = z.object({
  items: z.array(ShameItemSchema),
});
export type ShameResponse = z.infer<typeof ShameResponseSchema>;

export const BackendErrorSchema = z.object({
  error: z.string(),
});
export type BackendError = z.infer<typeof BackendErrorSchema>;

// ==========================================
// FRONTEND UI MODEL (Mapped & Derived Client-Side)
// ==========================================

export type VerdictClassification = BackendVerdict;

export type EvidenceSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvidenceCard {
  id: string;
  title: string;
  severity: EvidenceSeverity;
  finding: string;
  confidence?: number;
  category?: 'temporal' | 'biometric' | 'alibi' | 'linguistics' | 'psychology';
  isRepeatOffender?: boolean;
}

export interface ForensicMetrics {
  plausibilityIndex: number; // 0 - 100
  creativeEffort: number; // 0 - 100
  audacityRating: number; // 0 - 100
  clicheLevel: number; // 0 - 100
}

export interface ForensicVerdict {
  classification: VerdictClassification;
  stampText: string;
  summary: string;
  secondaryTagline: string;
}

export interface CaseFile {
  caseId: string;
  timestamp: string;
  suspectStatement: string;
  suspectAlias?: string;
  believabilityScore: number; // 0 - 100
  verdict: ForensicVerdict;
  metrics: ForensicMetrics;
  evidenceCards: EvidenceCard[];
  detectiveNotes: string;
  recommendedRebuttal: string[];
  investigatorBadge: string;
  bureauSealNumber: string;
}

export interface AnalyzeExcuseRequest {
  excuse: string;
}

export interface ApiSettings {
  simulatedDelayMs: number;
}
