export type VerdictClassification =
  | 'BUSTED'
  | 'HIGHLY_SUSPECT'
  | 'PLAUSIBLE'
  | 'UNVERIFIABLE'
  | 'CRIMINALLY_UNCREATIVE'
  | 'ALIBI_CONFIRMED';

export type EvidenceSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvidenceCard {
  id: string;
  title: string;
  severity: EvidenceSeverity;
  finding: string;
  category?: 'temporal' | 'biometric' | 'alibi' | 'linguistics' | 'psychology';
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
  interrogationTips?: string[];
  investigatorBadge: string;
  bureauSealNumber: string;
}

export interface AnalyzeExcuseRequest {
  excuse: string;
  caseId?: string;
  investigatorBadge?: string;
}

export interface ApiSettings {
  useMockMode: boolean;
  lambdaEndpointUrl: string;
  apiKey: string;
  simulatedDelayMs: number;
}
