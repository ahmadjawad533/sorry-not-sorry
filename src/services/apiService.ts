import {
  CaseFile,
  AnalyzeExcuseRequest,
  InvestigateResponse,
  InvestigateResponseSchema,
  ShameResponse,
  ShameResponseSchema,
  BackendErrorSchema,
  EvidenceCard,
  ForensicMetrics,
  ForensicVerdict,
  BackendVerdict,
} from '../types/case';

// Base URL comes ONLY from import.meta.env.VITE_API_URL (strip any trailing slash)
export const getApiBaseUrl = (): string => {
  const raw = (import.meta.env.VITE_API_URL as string | undefined) || '';
  return raw.replace(/\/+$/, '');
};

// Mock mode ONLY when VITE_USE_MOCK=true or VITE_API_URL is empty
export const isMockMode = (): boolean => {
  return import.meta.env.VITE_USE_MOCK === 'true' || !getApiBaseUrl();
};

// ==========================================
// CLIENT-SIDE DERIVATIONS FOR UI FIELDS
// ==========================================

export function deriveStampText(verdict: BackendVerdict): string {
  switch (verdict) {
    case 'BUSTED':
      return 'BUSTED: FICTION';
    case 'SUSPICIOUS':
      return 'HIGHLY SUSPECT';
    case 'PLAUSIBLE':
      return 'PLAUSIBLE DEFENSE';
    case 'CREDIBLE':
      return 'ALIBI CONFIRMED';
  }
}

export function deriveSecondaryTagline(verdict: BackendVerdict): string {
  switch (verdict) {
    case 'BUSTED':
      return 'THE NUMBERS DO NOT ADD UP, KID.';
    case 'SUSPICIOUS':
      return 'TOO MANY LOOSE THREADS ON THIS ALIBI.';
    case 'PLAUSIBLE':
      return 'SURVIVES FORENSIC SCRUTINY FOR NOW.';
    case 'CREDIBLE':
      return 'WATERPROOF STORY. YOU ARE FREE TO GO.';
  }
}

export function deriveMetrics(
  believability: number,
  patterns: InvestigateResponse['patterns'],
  excuse: string
): ForensicMetrics {
  const patternCount = patterns.length;
  const avgConfidence = patternCount > 0
    ? Math.round(patterns.reduce((acc, p) => acc + p.confidence, 0) / patternCount)
    : 50;

  return {
    plausibilityIndex: believability,
    creativeEffort: Math.min(100, Math.max(10, Math.round(excuse.length / 3) + (patternCount * 12))),
    audacityRating: Math.max(5, 100 - believability),
    clicheLevel: Math.min(100, Math.max(20, Math.round(avgConfidence * 0.95))),
  };
}

export function deriveEvidenceCards(patterns: InvestigateResponse['patterns']): EvidenceCard[] {
  return patterns.map((p) => {
    const isRepeat = p.id === 'repeat-offender';

    let category: EvidenceCard['category'] = 'linguistics';
    const lowerId = p.id.toLowerCase();
    const lowerTitle = p.title.toLowerCase();

    if (lowerId.includes('time') || lowerId.includes('alarm') || lowerTitle.includes('temporal') || lowerTitle.includes('time')) {
      category = 'temporal';
    } else if (lowerId.includes('pet') || lowerId.includes('health') || lowerId.includes('sick') || lowerTitle.includes('feline') || lowerTitle.includes('biological')) {
      category = 'biometric';
    } else if (lowerId.includes('alibi') || lowerId.includes('traffic') || lowerId.includes('gps')) {
      category = 'alibi';
    } else if (lowerId.includes('psych') || lowerId.includes('panic') || lowerId.includes('repeat')) {
      category = 'psychology';
    }

    let severity: EvidenceCard['severity'] = 'LOW';
    if (isRepeat || p.confidence >= 80) {
      severity = 'CRITICAL';
    } else if (p.confidence >= 60) {
      severity = 'HIGH';
    } else if (p.confidence >= 40) {
      severity = 'MEDIUM';
    }

    return {
      id: p.id,
      title: p.title,
      finding: p.commentary,
      confidence: p.confidence,
      severity,
      category,
      isRepeatOffender: isRepeat,
    };
  });
}

export function deriveRebuttals(
  verdict: BackendVerdict,
  patterns: InvestigateResponse['patterns'],
  _excuse: string
): string[] {
  const hasRepeat = patterns.some((p) => p.id === 'repeat-offender');
  const rebuttals: string[] = [];

  if (hasRepeat) {
    rebuttals.push('"Our precinct blotter logged this exact story last week. Try a new tune."');
  }

  switch (verdict) {
    case 'BUSTED':
      rebuttals.push(
        '"Send over the invoice receipts and battery diagnostic logs by noon."',
        '"Next time, just admit you wanted a second espresso before the polygraph needle jumps."'
      );
      break;
    case 'SUSPICIOUS':
      rebuttals.push(
        '"A thrilling tale with too many moving parts. Care to simplify before we subpoena your router?"',
        '"We grant conditional bail pending witness testimony from your calendar."'
      );
      break;
    case 'PLAUSIBLE':
      rebuttals.push(
        '"Your story survives forensic scrutiny for today. Drink plenty of fluids."',
        '"The precinct grants clemency this once. Return with a clear conscience."'
      );
      break;
    case 'CREDIBLE':
      rebuttals.push(
        '"Unusual, but mathematically sound. Case dismissed with apologies."',
        '"Your alibi checks out on all frequencies. Carry on, citizen."'
      );
      break;
  }

  return rebuttals.slice(0, 3);
}

// Convert backend response into UI CaseFile
export function mapBackendResponseToCaseFile(
  excuse: string,
  res: InvestigateResponse
): CaseFile {
  const stampText = deriveStampText(res.verdict);
  const secondaryTagline = deriveSecondaryTagline(res.verdict);
  const metrics = deriveMetrics(res.believability, res.patterns, excuse);
  const evidenceCards = deriveEvidenceCards(res.patterns);
  const recommendedRebuttal = deriveRebuttals(res.verdict, res.patterns, excuse);

  const forensicVerdict: ForensicVerdict = {
    classification: res.verdict,
    stampText,
    summary: res.notes.slice(0, 160),
    secondaryTagline,
  };

  return {
    caseId: res.caseId,
    timestamp: res.createdAt,
    suspectStatement: excuse,
    suspectAlias: 'Unknown Perpetrator',
    believabilityScore: res.believability,
    verdict: forensicVerdict,
    metrics,
    evidenceCards,
    detectiveNotes: res.notes,
    recommendedRebuttal,
    investigatorBadge: 'BADGE #47-DET. VANCE',
    bureauSealNumber: `SF-PD-${Math.floor(100000 + Math.random() * 900000)}`,
  };
}

// ==========================================
// MOCK BUREAU IMPLEMENTATION
// (Conforms strictly to { caseId, believability, verdict, patterns, notes, createdAt })
// ==========================================

export function analyzeExcuseMock(statement: string): InvestigateResponse {
  const text = (statement || '').trim();
  const lower = text.toLowerCase();
  const now = new Date().toISOString();
  const caseId = `CASE-1947-${Math.floor(1000 + Math.random() * 9000)}`;

  const hasAlarm = lower.includes('alarm') || lower.includes('slept in') || lower.includes('wake up');
  const hasPet = lower.includes('cat') || lower.includes('dog') || lower.includes('vet') || lower.includes('pet');
  const hasTraffic = lower.includes('traffic') || lower.includes('highway') || lower.includes('car') || lower.includes('flat') || lower.includes('accident');
  const hasTech = lower.includes('wifi') || lower.includes('internet') || lower.includes('phone') || lower.includes('battery') || lower.includes('slack');
  const hasRelative = lower.includes('grandma') || lower.includes('grandpa') || lower.includes('cousin') || lower.includes('family');
  const hasHealth = lower.includes('sick') || lower.includes('fever') || lower.includes('headache') || lower.includes('migraine');
  const isMultiLayered = lower.includes('and then') || (lower.match(/and/g) || []).length >= 2;
  const isTooShort = text.length < 15;
  const isRepeatSuspect = lower.includes('never got') || lower.includes("didn't see") || lower.includes('again');

  let verdict: BackendVerdict = 'BUSTED';
  let believability = 18;
  const patterns: InvestigateResponse['patterns'] = [];
  let notes = '';

  if (isRepeatSuspect) {
    verdict = 'BUSTED';
    believability = 8;
    patterns.push(
      {
        id: 'repeat-offender',
        title: 'Chronic Precinct Recidivism',
        commentary: 'Suspect exhibits an identical pattern of notification evasion previously logged in precinct archives.',
        confidence: 96,
      },
      {
        id: 'digital-amnesia',
        title: 'Selective Digital Deafness',
        commentary: 'Suspect claims communication silence precisely during hours of highest accountability.',
        confidence: 84,
      }
    );
    notes = "I've pulled this rap sheet before. When a suspect claims notification failure more than once, it is no longer technical friction—it is an art form.";
  } else if (hasAlarm && hasPet) {
    verdict = 'BUSTED';
    believability = 12;
    patterns.push(
      {
        id: 'temporal-synchronicity',
        title: 'Temporal Impossibility',
        commentary: 'A silicon alarm oscillator and a domestic quadruped failing simultaneously defy statistical probability.',
        confidence: 94,
      },
      {
        id: 'feline-fall-guy',
        title: 'Feline Scapegoating Strategy',
        commentary: 'Pet was reported sleeping soundly during the alleged morning crisis.',
        confidence: 89,
      },
      {
        id: 'conjunction-overload',
        title: 'Panic Compounding ("And Then")',
        commentary: 'Use of multiple conjunctions signals spontaneous narrative escalation.',
        confidence: 76,
      }
    );
    notes = "I've heard cleaner bedtime stories from dockworkers in Oakland. If you're going to spin an alibi, don't drag an innocent house cat into court with you.";
  } else if (hasTraffic) {
    verdict = 'SUSPICIOUS';
    believability = 38;
    patterns.push(
      {
        id: 'gridlock-cliche',
        title: 'Predictability Coefficient',
        commentary: 'Highway congestion has existed since Henry Ford. Failure to plan is not an act of God.',
        confidence: 82,
      },
      {
        id: 'gps-unverified',
        title: 'GPS Telemetry Void',
        commentary: 'Noticeable absence of navigation map screenshots timestamped prior to scheduled departure.',
        confidence: 71,
      }
    );
    notes = 'Traffic is a tired excuse in a tired city. Rain falls, smoke rises, cars stop on bridges. Bring me something that required real imagination.';
  } else if (hasTech) {
    verdict = 'SUSPICIOUS';
    believability = 32;
    patterns.push(
      {
        id: 'ghost-packet',
        title: 'Selective Outage Pattern',
        commentary: 'Bandwidth never collapses during streaming breaks; it only dies during client standups.',
        confidence: 85,
      },
      {
        id: 'device-telemetry',
        title: 'Router Log Discrepancy',
        commentary: 'External activity timestamps contradict claims of total connectivity blackout.',
        confidence: 68,
      }
    );
    notes = "The router lights were green while the excuse was glowing red. You can't hide behind fiber optics in my precinct.";
  } else if (hasRelative) {
    verdict = 'SUSPICIOUS';
    believability = 42;
    patterns.push(
      {
        id: 'kin-shield',
        title: 'Genealogical Convenience',
        commentary: 'Invoking distant family emergencies to erect a polite emotional shield against scrutiny.',
        confidence: 75,
      }
    );
    notes = 'Invoking distant relatives is a high-stakes gamble. One day the family reunion happens, and the ledger is opened.';
  } else if (hasHealth) {
    verdict = 'PLAUSIBLE';
    believability = 58;
    patterns.push(
      {
        id: 'biological-brevity',
        title: 'Pathogen Veracity Index',
        commentary: 'Brevity supports the claim. Suspect refrained from suspicious over-elaboration of symptoms.',
        confidence: 64,
      }
    );
    notes = "I'm a detective, not a coroner. Take your aspirin and get out of the cold rain. But don't pull this stunt next Monday.";
  } else if (isMultiLayered) {
    verdict = 'BUSTED';
    believability = 15;
    patterns.push(
      {
        id: 'over-explaining',
        title: 'Linguistic Clutter Index',
        commentary: 'Too many moving clauses. Alibis crumble under the dead weight of defensive narrative architecture.',
        confidence: 91,
      }
    );
    notes = 'Shakespeare wrote shorter soliloquies than this excuse. A guilty soul paints the fence twice before anyone inspects the wood.';
  } else if (isTooShort) {
    verdict = 'SUSPICIOUS';
    believability = 35;
    patterns.push(
      {
        id: 'laconic-dodge',
        title: 'Severe Statement Starvation',
        commentary: 'Suspect gave so little effort they practically handed over the handcuffs.',
        confidence: 80,
      }
    );
    notes = "I've seen telegrams from 1890 with more emotional investment than this half-hearted whisper.";
  } else {
    verdict = 'BUSTED';
    believability = 22;
    patterns.push(
      {
        id: 'fabrication-syntax',
        title: 'Structural Fabrication Detected',
        commentary: 'Statement syntax exhibits classic defensive deflection upon forensic analysis.',
        confidence: 78,
      },
      {
        id: 'timing-anomaly',
        title: 'Circumstantial Timing Anomaly',
        commentary: 'Misfortune arose at the precise moment accountability was expected.',
        confidence: 72,
      }
    );
    notes = 'I walked the beat in the rain for forty years. I know the scent of stale tobacco, burnt coffee, and an excuse cooked up in a moving elevator.';
  }

  return {
    caseId,
    believability,
    verdict,
    patterns,
    notes,
    createdAt: now,
  };
}

// Mock items for GET /shame
export function getMockWallOfShame(): ShameResponse {
  return {
    items: [
      {
        excuse: "My alarm didn't go off and then my cat got sick",
        believability: 12,
        verdict: 'BUSTED',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        excuse: "Slack ate my message, I typed out the whole response yesterday",
        believability: 18,
        verdict: 'BUSTED',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        excuse: "Traffic on the bridge was stalled due to an overturned produce truck",
        believability: 38,
        verdict: 'SUSPICIOUS',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
      {
        excuse: "Sudden migraine after staring at the spreadsheet layout",
        believability: 58,
        verdict: 'PLAUSIBLE',
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
      {
        excuse: "My router caught fire right as the demo started",
        believability: 25,
        verdict: 'BUSTED',
        createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
      },
    ],
  };
}

// ==========================================
// API CLIENT
// ==========================================

export class ApiService {
  /**
   * POST ${base}/investigate
   */
  public static async analyzeExcuse(
    req: AnalyzeExcuseRequest,
    simulatedDelayMs: number = 1400
  ): Promise<CaseFile> {
    const excuse = req.excuse.trim();
    if (!excuse) {
      throw new Error("The suspect did not provide a statement to interrogate.");
    }

    // 1. Mock Mode Check (Mock mode ONLY when VITE_USE_MOCK=true or VITE_API_URL is empty)
    if (isMockMode()) {
      const delay = Math.max(1200, simulatedDelayMs);
      await new Promise((res) => setTimeout(res, delay));
      const mockBackendRes = analyzeExcuseMock(excuse);

      // Validate mock output against Zod schema as well
      const validated = InvestigateResponseSchema.parse(mockBackendRes);
      return mapBackendResponseToCaseFile(excuse, validated);
    }

    // 2. Live HTTP Request
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/investigate`;
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ excuse }),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('The precinct telegraph timed out. The suspect vanished into the foggy night before forensics finished.');
        }
        if (!navigator.onLine) {
          throw new Error('Telegraph wire severed: The precinct is offline. Check your internet connection.');
        }
        throw new Error(`Wire tapped: Failed to reach the crime lab at ${baseUrl}. Network severed or server offline.`);
      }
      throw new Error('An unexpected anomaly occurred during interrogation transmission.');
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle HTTP Errors: 400, 429, 500 return { error: string } written in detective's voice
    if (!response.ok) {
      let detectiveErrorMsg = '';

      try {
        const errorJson = await response.json();
        const parsed = BackendErrorSchema.safeParse(errorJson);
        if (parsed.success && parsed.data.error) {
          detectiveErrorMsg = parsed.data.error;
        } else if (typeof errorJson?.error === 'string') {
          detectiveErrorMsg = errorJson.error;
        } else if (typeof errorJson?.message === 'string') {
          detectiveErrorMsg = errorJson.message;
        }
      } catch {
        // Body was not JSON
      }

      if (!detectiveErrorMsg) {
        if (response.status === 400) {
          detectiveErrorMsg = "The suspect's statement was illegible or completely missing from the docket.";
        } else if (response.status === 429) {
          detectiveErrorMsg = "The precinct switchboard is flooded with panicked calls. Detectives are tied up on other cases.";
        } else if (response.status === 500) {
          detectiveErrorMsg = "The crime lab centrifuge overheated. Forensic analysis temporarily halted.";
        } else {
          detectiveErrorMsg = `The precinct encountered unexpected friction (HTTP ${response.status}).`;
        }
      }

      throw new Error(detectiveErrorMsg);
    }

    // Parse and validate with Zod
    const rawData = await response.json();
    const parseResult = InvestigateResponseSchema.safeParse(rawData);

    if (!parseResult.success) {
      console.error('Backend Contract Validation Error:', parseResult.error.format());
      throw new Error('Corrupted crime lab manifest: The forensic report does not match the department protocol.');
    }

    // Guarantee minimum atmospheric display time (~1.2s)
    const elapsed = Date.now() - startTime;
    if (elapsed < 1200) {
      await new Promise((res) => setTimeout(res, 1200 - elapsed));
    }

    return mapBackendResponseToCaseFile(excuse, parseResult.data);
  }

  /**
   * GET ${base}/shame
   */
  public static async getWallOfShame(): Promise<ShameResponse> {
    if (isMockMode()) {
      return getMockWallOfShame();
    }

    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/shame`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return getMockWallOfShame();
      }

      const raw = await response.json();
      const parsed = ShameResponseSchema.safeParse(raw);
      if (parsed.success) {
        return parsed.data;
      }
      return getMockWallOfShame();
    } catch {
      return getMockWallOfShame();
    }
  }
}
