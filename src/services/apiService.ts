import {
  CaseFile,
  AnalyzeExcuseRequest,
  ApiSettings,
  VerdictClassification,
  EvidenceCard,
} from '../types/case';

// Heuristic excuse analysis for the Mock Bureau
export function analyzeExcuseMock(statement: string): CaseFile {
  const text = statement.trim();
  const lower = text.toLowerCase();

  const caseNum = Math.floor(1000 + Math.random() * 9000);
  const badgeNum = 'BADGE #47-DET. VANCE';
  const sealNum = `SF-PD-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  // Keyword flags
  const hasAlarm = lower.includes('alarm') || lower.includes('slept in') || lower.includes('wake up');
  const hasPet = lower.includes('cat') || lower.includes('dog') || lower.includes('vet') || lower.includes('pet');
  const hasTraffic = lower.includes('traffic') || lower.includes('highway') || lower.includes('car') || lower.includes('tire') || lower.includes('flat') || lower.includes('accident');
  const hasTech = lower.includes('wifi') || lower.includes('internet') || lower.includes('phone') || lower.includes('battery') || lower.includes('slack') || lower.includes('zoom') || lower.includes('laptop') || lower.includes('email');
  const hasRelative = lower.includes('grandma') || lower.includes('grandpa') || lower.includes('cousin') || lower.includes('family') || lower.includes('uncle') || lower.includes('aunt');
  const hasHealth = lower.includes('sick') || lower.includes('food poisoning') || lower.includes('fever') || lower.includes('stomach') || lower.includes('headache') || lower.includes('migraine');
  const isMultiLayered = lower.includes('and then') || lower.includes('on top of that') || (lower.match(/and/g) || []).length >= 2;
  const isTooShort = text.length < 15;
  const isRambling = text.length > 250;

  let classification: VerdictClassification = 'BUSTED';
  let stampText = 'COLD HARD FICTION';
  let believabilityScore = 18;
  let summary = '';
  let secondaryTagline = 'THE NUMBERS DO NOT ADD UP, KID.';
  const evidenceCards: EvidenceCard[] = [];
  let detectiveNotes = '';
  const recommendedRebuttal: string[] = [];

  let clicheLevel = 75;
  let creativeEffort = 30;
  let audacityRating = 80;
  let plausibilityIndex = 20;

  if (hasAlarm && hasPet) {
    classification = 'BUSTED';
    stampText = 'BUSTED: DOUBLE DEFENSE';
    believabilityScore = 12;
    clicheLevel = 98;
    audacityRating = 92;
    plausibilityIndex = 14;
    creativeEffort = 25;
    summary = 'The classic "Mechanical Clock & Innocent Beast" tandem defense. Stacking independent failure events is the hallmark of an improvised panic fib.';
    secondaryTagline = 'TWO INDEPENDENT TRAGEDIES. ZERO CREDIBILITY.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Temporal Impossibility',
        severity: 'CRITICAL',
        category: 'temporal',
        finding: 'The chances of a silicon quartz oscillator and a domestic animal failing synchronously are 1 in 84,000.',
      },
      {
        id: 'ev-2',
        title: 'Feline/Canine Scapegoating',
        severity: 'HIGH',
        category: 'alibi',
        finding: 'The animal was reported peacefully snoozing on the carpet at the approximate time of the alleged emergency.',
      },
      {
        id: 'ev-3',
        title: 'Panic Compounding',
        severity: 'MEDIUM',
        category: 'psychology',
        finding: 'Noticeable use of conjunction "and then" indicates narrative escalation invented mid-sentence.',
      }
    );
    detectiveNotes = 'I\'ve heard cleaner bedtime stories from pickpockets at the ferry terminal. If you\'re going to fabricate an alibi, don\'t drag a loyal house pet into court with you.';
    recommendedRebuttal.push(
      '"Send over the vet billing statement and your alarm clock\'s battery diagnostic log by noon."',
      '"Next time just say you wanted a second cup of coffee. The cat didn\'t ask to be your fall guy."',
      '"Our forensics unit cross-referenced this. The cat called us 10 minutes ago to clear its name."'
    );
  } else if (hasPet) {
    classification = 'HIGHLY_SUSPECT';
    stampText = 'SUSPECT: PET SHIELD';
    believabilityScore = 24;
    clicheLevel = 90;
    audacityRating = 78;
    plausibilityIndex = 28;
    creativeEffort = 35;
    summary = 'Exploiting mammalian loyalty for personal unaccountability. The animal cannot testify in its own defense.';
    secondaryTagline = 'LEAVE THE DOG OUT OF THIS.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Convenient Illness Timing',
        severity: 'HIGH',
        category: 'temporal',
        finding: 'Pet ailments reliably peak between 8:45 AM and 9:15 AM on key deliverable deadlines.',
      },
      {
        id: 'ev-2',
        title: 'Witness Silence Pact',
        severity: 'MEDIUM',
        category: 'alibi',
        finding: 'Primary co-defendant lacks vocal apparatus to dispute ownership of the narrative.',
      }
    );
    detectiveNotes = 'A dog will take a bullet for you, and here you are taking away its good standing with society. Case closed on moral grounds alone.';
    recommendedRebuttal.push(
      '"Give the animal a scratch behind the ears from me, then email me the draft."',
      '"I hope the four-legged suspect makes a swift recovery. We will await the vet discharge paperwork."'
    );
  } else if (hasTraffic) {
    classification = 'CRIMINALLY_UNCREATIVE';
    stampText = 'CHEAP DODGE: TRAFFIC';
    believabilityScore = 38;
    clicheLevel = 95;
    audacityRating = 45;
    plausibilityIndex = 42;
    creativeEffort = 12;
    summary = 'The urban commuter\'s lazy trump card. Everyone knows the highway is choked, which is why prudent citizens leave early.';
    secondaryTagline = 'A TIRED STORY IN A TIRED TOWN.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Predictability Coefficient',
        severity: 'HIGH',
        category: 'temporal',
        finding: 'Traffic existed yesterday. It will exist tomorrow. Failure to account for reality is not an act of God.',
      },
      {
        id: 'ev-2',
        title: 'GPS Audit Absence',
        severity: 'MEDIUM',
        category: 'alibi',
        finding: 'Noticeable absence of a real-time navigation screenshot timestamped prior to departure.',
      }
    );
    detectiveNotes = 'Traffic? Rain falls, smoke rises, cars stop on the bridge. Give me an excuse that required at least thirty seconds of sweat to invent.';
    recommendedRebuttal.push(
      '"The city grid has been congested since 1923. You\'re 40 minutes late."',
      '"Waze said the road was green until you put your shoes on at 9:02 AM."'
    );
  } else if (hasTech) {
    classification = 'HIGHLY_SUSPECT';
    stampText = 'SUSPECT: GHOST PACKET';
    believabilityScore = 31;
    clicheLevel = 88;
    audacityRating = 65;
    plausibilityIndex = 35;
    creativeEffort = 40;
    summary = 'Blaming fiber-optic cables for organic tardiness. The modern equivalent of saying the carrier pigeon got shot down.';
    secondaryTagline = 'WIFI DOWN? YOUR STORY IS LEAKING.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Router Log Discrepancy',
        severity: 'HIGH',
        category: 'temporal',
        finding: 'Suspect was visibly online on Instagram liking espresso photos while Slack was supposedly unreachable.',
      },
      {
        id: 'ev-2',
        title: 'Selective Outage Pattern',
        severity: 'MEDIUM',
        category: 'linguistics',
        finding: 'Internet connections never fail during lunch; they only collapse during client standups.',
      }
    );
    detectiveNotes = 'The router lights were blinking green while the excuses were blinking red. You can\'t hide behind bandwidth in my precinct.';
    recommendedRebuttal.push(
      '"Funny how your LTE hotspot worked well enough to send this message in 4K."',
      '"I\'ll send the IT technician over to your desk. She charges by the eyebrow raise."'
    );
  } else if (hasRelative) {
    classification = 'UNVERIFIABLE';
    stampText = 'UNVERIFIED KIN DEFENSE';
    believabilityScore = 44;
    clicheLevel = 82;
    audacityRating = 70;
    plausibilityIndex = 48;
    creativeEffort = 55;
    summary = 'Calling upon distant genealogy to obscure personal calendar negligence. High emotional shield, low corroboration.';
    secondaryTagline = 'GRANDMA WOULD LIKE A WORD WITH YOU.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Genealogical Convenience',
        severity: 'MEDIUM',
        category: 'alibi',
        finding: 'Relative in question has suffered four independent emergencies across the current fiscal quarter.',
      },
      {
        id: 'ev-2',
        title: 'Emotional Leverage Factor',
        severity: 'HIGH',
        category: 'psychology',
        finding: 'Designed to induce polite hesitation in the recipient to prevent further inquiry.',
      }
    );
    detectiveNotes = 'Invoking blood relatives is high stakes gambling. One day the family reunion will happen, and the ledger will be opened.';
    recommendedRebuttal.push(
      '"Send my regards to Aunt Martha. Tell her we missed her at the sprint planning."',
      '"I hope everything is settled on the home front. We can resume the grilling tomorrow."'
    );
  } else if (hasHealth) {
    classification = 'PLAUSIBLE';
    stampText = 'PROVISIONAL PASS: BIOLOGICAL';
    believabilityScore = 58;
    clicheLevel = 60;
    audacityRating = 40;
    plausibilityIndex = 65;
    creativeEffort = 30;
    summary = 'A biological vulnerability claimed with sufficient brevity. We allow the suspect bail on humanitarian grounds, pending symptoms.';
    secondaryTagline = 'THE PRECINCT DOCTOR WILL KEEP WATCH.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Pathogen Veracity',
        severity: 'LOW',
        category: 'biometric',
        finding: 'Brevity works in suspect\'s favor. Detailed descriptions of bodily fluids correlate with fabrication; silence suggests genuine misery.',
      }
    );
    detectiveNotes = 'I\'m a detective, not a coroner. Take your aspirin and get out of the cold rain. But don\'t pull this stunt next Monday.';
    recommendedRebuttal.push(
      '"Drink fluids, stay warm, and don\'t look at spreadsheets until tomorrow."',
      '"We grant clemency this once. Return with a clear conscience and a negative test."'
    );
  } else if (isMultiLayered || isRambling) {
    classification = 'BUSTED';
    stampText = 'BUSTED: OVER-EXPLAINING';
    believabilityScore = 16;
    clicheLevel = 92;
    audacityRating = 94;
    plausibilityIndex = 18;
    creativeEffort = 65;
    summary = 'The suspect is weaving a tapestry when a simple thread was requested. Over-explaining is the dead giveaway of a guilty conscience.';
    secondaryTagline = 'THE MORE YOU TALK, THE DEEPER THE GRAVE.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Linguistic Clutter Index',
        severity: 'CRITICAL',
        category: 'linguistics',
        finding: 'Too many moving parts. Alibis collapse under the weight of their own unnecessary clauses.',
      },
      {
        id: 'ev-2',
        title: 'Defensive Narrative Architecture',
        severity: 'HIGH',
        category: 'psychology',
        finding: 'Subject is preemptively answering questions nobody asked yet.',
      }
    );
    detectiveNotes = 'Shakespeare wrote shorter soliloquies than this alibi. A guilty soul paints the fence twice before anyone inspects the wood.';
    recommendedRebuttal.push(
      '"You could have stopped at the first sentence, but you had to build an entire theatrical production."',
      '"I\'ll read chapter two after lunch. Until then, you owe us donuts."'
    );
  } else if (isTooShort) {
    classification = 'HIGHLY_SUSPECT';
    stampText = 'DEFICIENT STATEMENT';
    believabilityScore = 35;
    clicheLevel = 65;
    audacityRating = 85;
    plausibilityIndex = 30;
    creativeEffort = 8;
    summary = 'Laconic disrespect. Suspect gave so little effort they practically handed over the handcuffs.';
    secondaryTagline = 'NOT ENOUGH MEAT ON THESE BONES.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Severe Statement Starvation',
        severity: 'HIGH',
        category: 'linguistics',
        finding: 'Barely fifteen characters. Suspect couldn\'t even bother to fabricate a plausible noun.',
      }
    );
    detectiveNotes = 'I\'ve seen telegraph cables from the 1890s with more emotional investment than this half-hearted whisper.';
    recommendedRebuttal.push(
      '"Use your words, suspect. You\'re among professionals."',
      '"Care to add a verb to that haiku?"'
    );
  } else {
    // Default mysterious / custom excuse
    classification = 'BUSTED';
    stampText = 'COLD HARD FICTION';
    believabilityScore = 22;
    clicheLevel = 70;
    audacityRating = 82;
    plausibilityIndex = 25;
    creativeEffort = 45;
    summary = 'The story has holes you could sail an oil tanker through. Our crime lab ran the syntax through the archives and found zero precedent for truth.';
    secondaryTagline = 'SMOKE AND MIRRORS ON RAINY COBBLESTONES.';
    evidenceCards.push(
      {
        id: 'ev-1',
        title: 'Structural Fabrications Detected',
        severity: 'HIGH',
        category: 'psychology',
        finding: 'Plausibility drops sharply upon external scrutiny. Tone exhibits defensive deflection.',
      },
      {
        id: 'ev-2',
        title: 'Convenient Chain of Circumstance',
        severity: 'MEDIUM',
        category: 'temporal',
        finding: 'Misfortunes did not arise until precisely the moment accountability was expected.',
      }
    );
    detectiveNotes = 'I walked the beat in the rain for forty years. I know the scent of stale tobacco, burnt coffee, and an excuse cooked up in a moving elevator.';
    recommendedRebuttal.push(
      '"A thrilling tale. Have you considered pitching it to a publisher?"',
      '"The precinct has processed your excuse. The verdict is guilty of wasting good coffee."'
    );
  }

  // Add standard concluding evidence card if under 3
  if (evidenceCards.length < 3) {
    evidenceCards.push({
      id: 'ev-supplemental',
      title: 'Forensic Body Language Emulation',
      severity: 'MEDIUM',
      category: 'linguistics',
      finding: 'Digital cadence shows rapid typing followed by hesitant backspacing before dispatch.',
    });
  }

  return {
    caseId: `CASE-1947-${caseNum}`,
    timestamp: now,
    suspectStatement: text,
    suspectAlias: 'Unknown Perpetrator',
    believabilityScore,
    verdict: {
      classification,
      stampText,
      summary,
      secondaryTagline,
    },
    metrics: {
      plausibilityIndex,
      creativeEffort,
      audacityRating,
      clicheLevel,
    },
    evidenceCards,
    detectiveNotes,
    recommendedRebuttal,
    investigatorBadge: badgeNum,
    bureauSealNumber: sealNum,
  };
}

export class ApiService {
  public static async analyzeExcuse(
    req: AnalyzeExcuseRequest,
    settings: ApiSettings
  ): Promise<CaseFile> {
    if (settings.useMockMode || !settings.lambdaEndpointUrl.trim()) {
      // Simulate forensic bureau processing time (min 1.2s to 1.6s)
      const delay = Math.max(1200, settings.simulatedDelayMs || 1400);
      await new Promise((res) => setTimeout(res, delay));
      return analyzeExcuseMock(req.excuse);
    }

    // Live AWS Lambda Function URL call
    const endpoint = settings.lambdaEndpointUrl.trim();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (settings.apiKey.trim()) {
      headers['Authorization'] = `Bearer ${settings.apiKey.trim()}`;
    }

    const payload = {
      excuse: req.excuse,
      caseId: req.caseId || `CASE-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    const startTime = Date.now();
    let response: Response;

    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
    } catch (err: unknown) {
      const isOffline = !navigator.onLine;
      if (isOffline) {
        throw new Error('OFFLINE: The precinct telegraph line is dead. Check your internet connection.');
      }
      throw new Error(`CONNECTION_ERROR: Failed to reach the crime lab at ${endpoint}. Wire tapped or server offline.`);
    }

    if (response.status === 429) {
      throw new Error('RATE_LIMITED: The precinct telephone switchboard is completely overwhelmed. Take a breath and try again shortly.');
    }

    if (!response.ok) {
      let errorMsg = `HTTP_${response.status}`;
      try {
        const errJson = await response.json();
        errorMsg = errJson.message || errJson.error || errorMsg;
      } catch {
        // fallback
      }
      throw new Error(`CRIME_LAB_ERROR (${response.status}): ${errorMsg}`);
    }

    const rawData = await response.json();

    // Ensure response adheres to CaseFile shape; if partial, merge gracefully
    const mockFallback = analyzeExcuseMock(req.excuse);

    const caseFile: CaseFile = {
      caseId: rawData.caseId || rawData.case_id || mockFallback.caseId,
      timestamp: rawData.timestamp || mockFallback.timestamp,
      suspectStatement: rawData.suspectStatement || rawData.excuse || req.excuse,
      suspectAlias: rawData.suspectAlias || mockFallback.suspectAlias,
      believabilityScore: typeof rawData.believabilityScore === 'number'
        ? rawData.believabilityScore
        : typeof rawData.score === 'number'
        ? rawData.score
        : mockFallback.believabilityScore,
      verdict: {
        classification: rawData.verdict?.classification || mockFallback.verdict.classification,
        stampText: rawData.verdict?.stampText || rawData.verdict?.stamp || mockFallback.verdict.stampText,
        summary: rawData.verdict?.summary || rawData.summary || mockFallback.verdict.summary,
        secondaryTagline: rawData.verdict?.secondaryTagline || mockFallback.verdict.secondaryTagline,
      },
      metrics: {
        plausibilityIndex: rawData.metrics?.plausibilityIndex ?? mockFallback.metrics.plausibilityIndex,
        creativeEffort: rawData.metrics?.creativeEffort ?? mockFallback.metrics.creativeEffort,
        audacityRating: rawData.metrics?.audacityRating ?? mockFallback.metrics.audacityRating,
        clicheLevel: rawData.metrics?.clicheLevel ?? mockFallback.metrics.clicheLevel,
      },
      evidenceCards: Array.isArray(rawData.evidenceCards) && rawData.evidenceCards.length > 0
        ? rawData.evidenceCards
        : mockFallback.evidenceCards,
      detectiveNotes: rawData.detectiveNotes || rawData.notes || mockFallback.detectiveNotes,
      recommendedRebuttal: Array.isArray(rawData.recommendedRebuttal) && rawData.recommendedRebuttal.length > 0
        ? rawData.recommendedRebuttal
        : mockFallback.recommendedRebuttal,
      investigatorBadge: rawData.investigatorBadge || mockFallback.investigatorBadge,
      bureauSealNumber: rawData.bureauSealNumber || mockFallback.bureauSealNumber,
    };

    // Ensure min 1.2s feel even if the API responds in 100ms
    const elapsed = Date.now() - startTime;
    if (elapsed < 1200) {
      await new Promise((res) => setTimeout(res, 1200 - elapsed));
    }

    return caseFile;
  }
}
