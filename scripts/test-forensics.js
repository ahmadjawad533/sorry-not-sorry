// Quick automated test to verify the heuristics engine determinism and coverage
import { analyzeExcuseMock } from '../src/services/apiService.ts';

const testCases = [
  {
    name: 'Alarm & Pet (Double Defense)',
    excuse: "my alarm didn't go off and then my cat got sick",
    expectedClassification: 'BUSTED',
  },
  {
    name: 'Traffic Dodge',
    excuse: "traffic on the highway was bumper to bumper because of roadwork",
    expectedClassification: 'CRIMINALLY_UNCREATIVE',
  },
  {
    name: 'Tech / WiFi Failure',
    excuse: "my wifi completely went down and my laptop battery ran out",
    expectedClassification: 'HIGHLY_SUSPECT',
  },
  {
    name: 'Grandma / Relative',
    excuse: "grandma's cousin had an emergency and I had to rush over",
    expectedClassification: 'UNVERIFIABLE',
  },
  {
    name: 'Biological / Sickness',
    excuse: "I came down with a sudden fever and migraine this morning",
    expectedClassification: 'PLAUSIBLE',
  },
];

console.log('--- Testing Excuse Forensics Heuristic Engine ---');
let allPassed = true;

for (const tc of testCases) {
  const result = analyzeExcuseMock(tc.excuse);
  const pass = result.verdict.classification === tc.expectedClassification;
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${tc.name}:`);
  console.log(`   Classification: ${result.verdict.classification} (Expected: ${tc.expectedClassification})`);
  console.log(`   Stamp: ${result.verdict.stampText}`);
  console.log(`   Believability: ${result.believabilityScore}/100`);
  console.log(`   Evidence Exhibits: ${result.evidenceCards.length}`);
  console.log(`   Rebuttals: ${result.recommendedRebuttal.length}`);
  if (!pass) allPassed = false;
}

if (allPassed) {
  console.log('\nAll heuristic test cases PASSED successfully!');
  process.exit(0);
} else {
  console.error('\nSome test cases failed.');
  process.exit(1);
}
