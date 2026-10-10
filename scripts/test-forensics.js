import {
  analyzeExcuseMock,
  mapBackendResponseToCaseFile,
  getMockWallOfShame,
  deriveStampText,
  deriveSecondaryTagline,
  deriveEvidenceCards,
  deriveRebuttals,
} from '../src/services/apiService.ts';
import {
  InvestigateResponseSchema,
  ShameResponseSchema,
} from '../src/types/case.ts';

console.log('=== Running Excuse Forensics Contract & Unit Tests ===\n');

let allPassed = true;

// Test 1: Validate Schema on Mock Engine outputs
console.log('1. Testing Schema Conformance (InvestigateResponseSchema)...');
const testCases = [
  {
    name: 'Alarm & Cat (Double Defense)',
    excuse: "my alarm didn't go off and then my cat got sick",
    expectedVerdict: 'BUSTED',
  },
  {
    name: 'Repeat Offender Suspect',
    excuse: "I never got your message, Slack must have eaten it again",
    expectedVerdict: 'BUSTED',
    checkRepeatOffender: true,
  },
  {
    name: 'Traffic Congestion',
    excuse: "traffic on the highway was bumper to bumper because of roadwork",
    expectedVerdict: 'SUSPICIOUS',
  },
  {
    name: 'WiFi Blackout',
    excuse: "my wifi completely went down and my phone battery died",
    expectedVerdict: 'SUSPICIOUS',
  },
  {
    name: 'Biological Fever',
    excuse: "I came down with a sudden fever and migraine this morning",
    expectedVerdict: 'PLAUSIBLE',
  },
];

for (const tc of testCases) {
  const rawResponse = analyzeExcuseMock(tc.excuse);
  const parseResult = InvestigateResponseSchema.safeParse(rawResponse);

  if (!parseResult.success) {
    console.error(`[FAIL] Schema validation failed for: ${tc.name}`);
    console.error(parseResult.error.format());
    allPassed = false;
    continue;
  }

  const validData = parseResult.data;
  const verdictMatches = validData.verdict === tc.expectedVerdict;

  if (tc.checkRepeatOffender) {
    const hasRepeatId = validData.patterns.some((p) => p.id === 'repeat-offender');
    if (!hasRepeatId) {
      console.error(`[FAIL] Expected 'repeat-offender' pattern in: ${tc.name}`);
      allPassed = false;
    }
  }

  console.log(`  ✓ ${tc.name}:`);
  console.log(`      Verdict: ${validData.verdict} (matches expected: ${verdictMatches})`);
  console.log(`      Believability: ${validData.believability}/100`);
  console.log(`      Patterns: ${validData.patterns.length}`);
  console.log(`      Notes: "${validData.notes.slice(0, 50)}..."`);
  if (!verdictMatches) allPassed = false;
}

// Test 2: Testing UI Field Mapping (patterns -> evidence cards, notes -> field notes)
console.log('\n2. Testing Frontend Mapping & Derivations...');
const testExcuse = "my alarm didn't go off and then my cat got sick";
const backendMock = analyzeExcuseMock(testExcuse);
const caseFile = mapBackendResponseToCaseFile(testExcuse, backendMock);

if (caseFile.caseId === backendMock.caseId) {
  console.log('  ✓ caseId properly mapped');
} else {
  console.error('  ✗ caseId mapping mismatch');
  allPassed = false;
}

if (caseFile.detectiveNotes === backendMock.notes) {
  console.log('  ✓ detectiveNotes strictly mapped to backend notes');
} else {
  console.error('  ✗ notes mapping mismatch');
  allPassed = false;
}

if (caseFile.evidenceCards.length === backendMock.patterns.length) {
  console.log(`  ✓ patterns successfully mapped to ${caseFile.evidenceCards.length} evidence cards`);
} else {
  console.error('  ✗ pattern to evidence card count mismatch');
  allPassed = false;
}

if (Array.isArray(caseFile.recommendedRebuttal) && caseFile.recommendedRebuttal.length > 0) {
  console.log(`  ✓ client-side rebuttals derived (${caseFile.recommendedRebuttal.length} rebuttals generated)`);
} else {
  console.error('  ✗ client-side rebuttals missing');
  allPassed = false;
}

// Test 3: Repeat Offender Card Highlighting
console.log('\n3. Testing Repeat Offender Card Highlighting...');
const repeatResponse = analyzeExcuseMock("I never got your message, didn't see the notification");
const repeatCards = deriveEvidenceCards(repeatResponse.patterns);
const repeatCard = repeatCards.find((c) => c.id === 'repeat-offender');

if (repeatCard && repeatCard.isRepeatOffender === true && repeatCard.severity === 'CRITICAL') {
  console.log('  ✓ Pattern id "repeat-offender" successfully flagged with isRepeatOffender=true & CRITICAL severity');
} else {
  console.error('  ✗ repeat-offender flag not set correctly');
  allPassed = false;
}

// Test 4: Wall of Shame (/shame) Schema Validation
console.log('\n4. Testing GET /shame Schema Validation...');
const mockShame = getMockWallOfShame();
const shameParsed = ShameResponseSchema.safeParse(mockShame);

if (shameParsed.success && shameParsed.data.items.length > 0) {
  console.log(`  ✓ ShameResponseSchema passed with ${shameParsed.data.items.length} items`);
} else {
  console.error('  ✗ ShameResponseSchema validation failed');
  allPassed = false;
}

// Test 5: Helper Derivations
console.log('\n5. Testing Helper Derivations (stamp text, taglines)...');
const verdicts = ['BUSTED', 'SUSPICIOUS', 'PLAUSIBLE', 'CREDIBLE'];
for (const v of verdicts) {
  const stamp = deriveStampText(v);
  const tagline = deriveSecondaryTagline(v);
  if (stamp && tagline) {
    console.log(`  ✓ ${v} -> Stamp: "${stamp}", Tagline: "${tagline}"`);
  } else {
    allPassed = false;
  }
}

console.log('\n-----------------------------------------------');
if (allPassed) {
  console.log('ALL UNIT & CONTRACT TESTS PASSED CLEANLY! ✓\n');
  process.exit(0);
} else {
  console.error('SOME UNIT TESTS FAILED! ✗\n');
  process.exit(1);
}
