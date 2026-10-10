# Sorry Not Sorry — Excuse Forensics Bureau 🕵️‍♂️🔎

> An atmospheric film-noir excuse forensics web application built for the **AWS Builder Center "Build an Agent Weekend Challenge"**.

The user pastes an excuse they received (e.g., *"my alarm didn't go off and then my cat got sick"*). A deadpan film-noir detective agent analyzes it and returns a complete, authenticated case file with a forensic verdict stamp, polygraph lie-detector reading, contradiction exhibits, field notes, and one-click counter-interrogation rebuttals.

---

## 🌟 Distinctive Features

- **Deadpan Film-Noir Case File Aesthetic**:
  - Manila folder dossier with paperclips, classified stamps, and authentic coffee-ring stains.
  - Typewriter typography (*Courier Prime* & *Special Elite*) paired with clean modern sans (*Inter*).
  - Ambient desk lamp spotlight cone that subtly follows the pointer (disabled on touch devices & reduced motion).
  - Dual theme: **Bureau Night** (Noir dark mode) & **Daylight Case** (Vintage paper light mode).
- **Physical Motion System (Framer Motion)**:
  - Spring-loaded verdict stamp slam animation with simulated desk vibration.
  - Galvanic polygraph needle sweep with cardiac lie-detector waveform.
  - Staggered evidence card drop physics.
  - Typewriter text reveal cadence with in-character loading stages.
- **Self-Contained Web Audio Synthesizer**:
  - Mechanical typewriter key clicks, rubber stamp thud impact, folder sliding, and carriage bells synthesized in real-time via the browser's native **Web Audio API**.
  - **Muted by default** with a persistent toggle stored in `localStorage`.
- **Dual-Mode Backend Engine**:
  - **Mock Bureau (Default)**: Deep heuristic forensics engine analyzing cliches, over-explaining, animal scapegoating, technical outages, and temporal anomalies with zero cloud setup.
  - **Live AWS Lambda Function URL Mode**: Configurable live HTTP agent endpoint with CORS support, authentication header support, connection testing, and in-character error recovery.
- **Local Case Archives Dossier**:
  - Saves past investigations locally with search, verdict filters, and quick re-opening.
- **Accessibility & Performance**:
  - WCAG AA contrast ratio compliance.
  - Strict compliance with `prefers-reduced-motion`.
  - Keyboard accessible (`Cmd/Ctrl+Enter` to submit, `Esc` to dismiss drawers).
  - Zero external CDN audio assets.

---

## 🚀 Quick Start

### 1. Install & Run Dev Server
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run Tests
```bash
npm run test
```

### 3. Production Build
```bash
npm run build
```
Creates an optimized static bundle in `dist/` ready to deploy to AWS Amplify Hosting, Vercel, or Netlify.

---

## 📡 AWS Lambda Backend Contract

To connect your AWS Lambda backend:
1. Click the **Sliders / Settings** button in the header.
2. Select **AWS Lambda Live**.
3. Paste your **AWS Lambda Function URL** (e.g. `https://abcdef123.lambda-url.us-east-1.on.aws/`).
4. Click **Test Endpoint Connection** and then **Apply Settings**.

### Request Payload (`POST /`)
```json
{
  "excuse": "My alarm didn't go off and then my cat got sick",
  "caseId": "CASE-1947-8821",
  "timestamp": "2026-10-10T16:50:00Z"
}
```

### Expected Response Payload (`200 OK`)
```json
{
  "caseId": "CASE-1947-8821",
  "timestamp": "2026-10-10T16:50:00Z",
  "suspectStatement": "My alarm didn't go off and then my cat got sick",
  "believabilityScore": 14,
  "verdict": {
    "classification": "BUSTED",
    "stampText": "COLD HARD FICTION",
    "summary": "The feline emergency defense is the oldest dodge in the precinct blotter."
  },
  "metrics": {
    "plausibilityIndex": 12,
    "creativeEffort": 28,
    "audacityRating": 89,
    "clicheLevel": 95
  },
  "evidenceCards": [
    {
      "id": "ev-1",
      "title": "Temporal Inconsistency",
      "severity": "CRITICAL",
      "category": "temporal",
      "finding": "Alarm clocks do not selectively fail synchronously with domestic pets."
    }
  ],
  "detectiveNotes": "I've heard cleaner stories from pickpockets at the ferry terminal.",
  "recommendedRebuttal": [
    "Send over the vet invoice and your alarm clock diagnostics by noon."
  ],
  "investigatorBadge": "BADGE #47-DET. VANCE",
  "bureauSealNumber": "SF-PD-948211"
}
```

> **Note**: If any field is omitted from your Lambda response, the frontend gracefully falls back and enriches the case file using the precinct's crime lab defaults.

### AWS Lambda CORS Configuration
Ensure your Lambda Function URL has CORS enabled:
- **Allow Origin**: `*` (or your production hosting domain)
- **Allow Methods**: `POST, OPTIONS`
- **Allow Headers**: `content-type, authorization`

---

## 🎨 Design Tokens & Palette

| Token | Dark (Bureau Night) | Light (Daylight Case) | Description |
| :--- | :--- | :--- | :--- |
| `ink` | `#ded6c9` | `#2b2622` | Typewriter ribbon ink |
| `paper` | `#1c1815` | `#f4eee1` | Textured vintage blotting paper |
| `manila` | `#4a3c28` | `#e6ce9e` | Heavyweight bureau file folder |
| `evidence-red` | `#dc2626` | `#c02b2b` | Rubber stamp ink & critical warnings |
| `brass` | `#cca43b` | `#b8860b` | Detective badge & desk fixtures |
| `smoke` | `#2a2622` | `#dfd8cb` | Atmospheric haze & shadow dividers |

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript (Strict mode)
- **Styling**: Tailwind CSS + Custom CSS Variables Design Tokens
- **Animation**: Framer Motion
- **State Management**: Zustand with persistent storage
- **Typography**: `@fontsource/special-elite`, `@fontsource/courier-prime`, `@fontsource/inter`
- **Audio Engine**: Web Audio API Procedural Synthesizer
- **Icons**: Lucide React
