/**
 * "Sorry Not Sorry" - Excuse Forensics Agent
 * AWS Lambda Backend Handler (Node.js ESM)
 * 
 * Implements docs/BACKEND_CONTRACT.md:
 * - POST /investigate -> { caseId, believability, verdict, patterns, notes, createdAt }
 * - GET  /shame       -> { items: [{ excuse, believability, verdict, createdAt }] }
 * - Errors            -> { error: string } in detective voice
 */

// Heuristic Forensics Classification Engine
function analyzeExcuse(statement) {
  const text = (statement || '').trim();
  const lower = text.toLowerCase();

  const caseNum = Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();

  // Pattern detection
  const hasAlarm = lower.includes('alarm') || lower.includes('slept in') || lower.includes('wake up');
  const hasPet = lower.includes('cat') || lower.includes('dog') || lower.includes('vet') || lower.includes('pet');
  const hasTraffic = lower.includes('traffic') || lower.includes('highway') || lower.includes('car') || lower.includes('flat') || lower.includes('accident');
  const hasTech = lower.includes('wifi') || lower.includes('internet') || lower.includes('phone') || lower.includes('battery') || lower.includes('slack');
  const hasRelative = lower.includes('grandma') || lower.includes('grandpa') || lower.includes('cousin') || lower.includes('family');
  const hasHealth = lower.includes('sick') || lower.includes('fever') || lower.includes('headache') || lower.includes('migraine');
  const isMultiLayered = lower.includes('and then') || (lower.match(/and/g) || []).length >= 2;
  const isTooShort = text.length < 15;
  const isRepeatSuspect = lower.includes('never got') || lower.includes("didn't see") || lower.includes('again');

  let verdict = 'BUSTED';
  let believability = 18;
  const patterns = [];
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
    caseId: `CASE-1947-${caseNum}`,
    believability,
    verdict,
    patterns,
    notes,
    createdAt: now,
  };
}

// In-memory / curated Shame Ledger
const WALL_OF_SHAME = [
  {
    excuse: "My alarm didn't go off and then my cat got sick",
    believability: 12,
    verdict: 'BUSTED',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    excuse: "Slack ate my notification, I definitely sent the PR yesterday",
    believability: 18,
    verdict: 'BUSTED',
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
  },
  {
    excuse: "Traffic on the bridge was completely stalled due to an overturned produce truck",
    believability: 38,
    verdict: 'SUSPICIOUS',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    excuse: "Sudden migraine after staring at the spreadsheet layout",
    believability: 58,
    verdict: 'PLAUSIBLE',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    excuse: "The power transformer down the block exploded right as the meeting started",
    believability: 25,
    verdict: 'BUSTED',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// AWS Lambda Handler function (ESM)
export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  const method = (event.requestContext?.http?.method || event.httpMethod || '').toUpperCase();
  const rawPath = event.rawPath || event.requestContext?.http?.path || event.path || '';

  // 1. Handle CORS preflight OPTIONS
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS OK' }),
    };
  }

  // 2. Handle GET /shame
  if (method === 'GET' && rawPath.endsWith('/shame')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ items: WALL_OF_SHAME }),
    };
  }

  // 3. Handle POST /investigate (and fallback POST /)
  if (method === 'POST') {
    try {
      let body = {};
      if (event.body) {
        if (typeof event.body === 'string') {
          body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf-8') : event.body);
        } else {
          body = event.body;
        }
      }

      const excuse = body.excuse || body.statement || '';
      if (!excuse || typeof excuse !== 'string' || !excuse.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "The suspect gave no statement. You can't interrogate silence, kid.",
          }),
        };
      }

      const report = analyzeExcuse(excuse);

      // Prepend to in-memory shame ledger if busted or suspicious
      if (report.verdict === 'BUSTED' || report.verdict === 'SUSPICIOUS') {
        WALL_OF_SHAME.unshift({
          excuse,
          believability: report.believability,
          verdict: report.verdict,
          createdAt: report.createdAt,
        });
        if (WALL_OF_SHAME.length > 25) WALL_OF_SHAME.pop();
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(report),
      };
    } catch (error) {
      console.error('Forensics Crime Lab Error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "The crime lab centrifuge overheated. Even the equipment couldn't stomach that tale.",
        }),
      };
    }
  }

  // Default 404 for unmapped routes
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({
      error: "Wrong alley, kid. That department doesn't exist in this precinct.",
    }),
  };
};
