# Sorry Not Sorry — Backend Contract Specification

This document defines the strict API contract between the Excuse Forensics frontend and the rule-based AWS Lambda backend.

## Base URL
- Configured via environment variable: `VITE_API_URL`
- Example: `https://faedmk2b5wb2icvfzfxxcnqdhm0pogln.lambda-url.us-east-1.on.aws`
- Trailing slashes are stripped automatically by the frontend.
- Mock mode activates only when `VITE_USE_MOCK=true` or `VITE_API_URL` is empty.
- Zero visitor configuration is required at runtime.

---

## 1. POST `/investigate`

Analyzes an excuse and returns forensic case findings.

### Request Body
```json
{
  "excuse": "My alarm didn't go off and then my cat got sick"
}
```

### Response Schema (`200 OK`)
```json
{
  "caseId": "CASE-1947-5289",
  "believability": 12,
  "verdict": "BUSTED",
  "patterns": [
    {
      "id": "temporal-synchronicity",
      "title": "Temporal Impossibility",
      "commentary": "A silicon alarm oscillator and a domestic quadruped failing simultaneously defy statistical probability.",
      "confidence": 94
    },
    {
      "id": "feline-fall-guy",
      "title": "Feline Scapegoating Strategy",
      "commentary": "Pet was reported sleeping soundly during the alleged morning crisis.",
      "confidence": 89
    }
  ],
  "notes": "I've heard cleaner bedtime stories from dockworkers in Oakland.",
  "createdAt": "2026-10-10T22:34:36.733Z"
}
```

### Field Definitions
- `caseId` (`string`): Unique forensic docket identifier.
- `believability` (`number`, 0–100): Lie detector score.
- `verdict` (`"BUSTED" | "SUSPICIOUS" | "PLAUSIBLE" | "CREDIBLE"`): Official case verdict.
- `patterns` (`array`): Detected contradiction exhibits. Each has:
  - `id` (`string`): Pattern identifier. An ID of `"repeat-offender"` triggers a highlighted alert card.
  - `title` (`string`): Exhibit title.
  - `commentary` (`string`): Exhibit finding/analysis.
  - `confidence` (`number`, 0–100): Detection confidence score.
- `notes` (`string`): Detective Jack Vance's confidential field observations.
- `createdAt` (`string`): ISO 8601 timestamp.

---

## 2. GET `/shame`

Retrieves the precinct's public Wall of Shame containing previously investigated excuses.

### Response Schema (`200 OK`)
```json
{
  "items": [
    {
      "excuse": "My alarm didn't go off and then my cat got sick",
      "believability": 12,
      "verdict": "BUSTED",
      "createdAt": "2026-10-10T22:34:36.733Z"
    }
  ]
}
```

---

## 3. Error Responses (`400`, `429`, `500`)

Errors are returned in the detective's deadpan voice:

```json
{
  "error": "The suspect provided no statement. You cannot arrest an empty room."
}
```
The frontend presents this message directly to the user in the noir error UI.
