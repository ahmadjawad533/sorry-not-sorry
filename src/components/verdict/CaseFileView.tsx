import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  RotateCcw,
  Printer,
  Calendar,
  Award,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { CaseFile } from '../../types/case';
import { PolygraphGauge } from './PolygraphGauge';
import { VerdictStamp } from './VerdictStamp';
import { EvidenceCardItem } from './EvidenceCardItem';
import { soundEffects } from '../../services/soundEffects';

interface CaseFileViewProps {
  caseFile: CaseFile;
  onFileAnotherCase: () => void;
}

export const CaseFileView: React.FC<CaseFileViewProps> = ({
  caseFile,
  onFileAnotherCase,
}) => {
  const [shaking, setShaking] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedRebuttalIdx, setCopiedRebuttalIdx] = useState<number | null>(null);

  useEffect(() => {
    // Screen shake when stamp slams
    const timer = setTimeout(() => {
      setShaking(false);
    }, 380);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyReport = async () => {
    soundEffects.playTypewriterKey();
    const formatted = `=== EXCUSE FORENSICS CASE FILE ===
Case Number: ${caseFile.caseId}
Date: ${new Date(caseFile.timestamp).toLocaleString()}
Suspect Statement: "${caseFile.suspectStatement}"

VERDICT: ${caseFile.verdict.stampText} (${caseFile.verdict.classification})
Believability Score: ${caseFile.believabilityScore}/100

FORENSIC METRICS:
- Plausibility: ${caseFile.metrics.plausibilityIndex}%
- Creative Effort: ${caseFile.metrics.creativeEffort}%
- Audacity: ${caseFile.metrics.audacityRating}%
- Cliché Level: ${caseFile.metrics.clicheLevel}%

DETECTIVE NOTES:
${caseFile.detectiveNotes}

OFFICIAL REBUTTALS:
${caseFile.recommendedRebuttal.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Investigator: ${caseFile.investigatorBadge}
Precinct Seal: ${caseFile.bureauSealNumber}
==================================`;

    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopySingleRebuttal = async (text: string, idx: number) => {
    soundEffects.playTypewriterKey();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRebuttalIdx(idx);
      setTimeout(() => setCopiedRebuttalIdx(null), 2000);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    soundEffects.playTypewriterKey();
    window.print();
  };

  const formattedDate = new Date(caseFile.timestamp).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 transition-transform ${shaking ? 'animate-shake' : ''}`}>
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
        <button
          onClick={onFileAnotherCase}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-paper-card border border-paper-edge hover:border-brass text-ink font-mono text-xs uppercase tracking-wider transition-colors active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-brass" />
          <span>Interrogate Another Excuse</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-paper-card border border-paper-edge hover:border-brass text-ink font-mono text-xs transition-colors"
            title="Copy entire case dossier to clipboard"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Dossier Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-brass" />
                <span>Copy Case File</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-paper-card border border-paper-edge hover:border-brass text-ink font-mono text-xs transition-colors"
            title="Print Case File"
          >
            <Printer className="w-3.5 h-3.5 text-brass" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Manila Folder Dossier Container */}
      <div className="relative bg-manila-light/20 dark:bg-manila/15 border-2 border-manila-dark/60 rounded-lg p-5 sm:p-10 shadow-folder paper-grain overflow-hidden">
        {/* Manila Folder Top Tab */}
        <div className="absolute top-0 right-8 px-6 py-1.5 bg-manila-tab text-ink-rich font-mono text-xs uppercase tracking-widest font-bold rounded-b border-b border-x border-manila-dark shadow-sm">
          CONFIDENTIAL DOSSIER
        </div>

        {/* Paperclip in Top Corner */}
        <div className="paperclip top-3 left-6 hidden sm:block" />

        {/* Coffee Stain Impression */}
        <div className="coffee-stain bottom-8 right-10 hidden md:block" />

        {/* Header Block: Case Number, Seal, Date */}
        <div className="border-b-2 border-dashed border-paper-edge pb-6 mb-8 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-evidence font-mono text-xs uppercase tracking-widest font-bold mb-1">
                <FileText className="w-4 h-4" />
                <span>EXCUSE FORENSICS UNIT &bull; CASE BLOTTER</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-typewriter font-extrabold text-ink-rich tracking-wider">
                {caseFile.caseId}
              </h2>
            </div>

            <div className="flex flex-col sm:items-end text-xs font-mono text-ink-faint space-y-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brass" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-brass" />
                <span>{caseFile.investigatorBadge}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Suspect Statement Quote Block */}
        <div className="relative bg-paper-card border border-paper-edge rounded-md p-5 sm:p-6 mb-8 shadow-inner paper-grain">
          <div className="text-[10px] font-mono uppercase tracking-widest text-evidence font-bold mb-2 flex items-center justify-between">
            <span>TRANSCRIPT OF SUSPECT STATEMENT</span>
            <span className="text-ink-faint">VERBATIM RECORD</span>
          </div>

          <blockquote className="font-typewriter text-base sm:text-lg text-ink font-medium leading-relaxed italic border-l-4 border-brass/60 pl-4 py-1">
            &ldquo;{caseFile.suspectStatement}&rdquo;
          </blockquote>
        </div>

        {/* Slammed Verdict Stamp & Polygraph Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
          {/* Stamp Centerpiece */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-paper-card/70 border border-paper-edge rounded-md paper-grain text-center">
            <VerdictStamp verdict={caseFile.verdict} />
            <p className="mt-4 text-xs font-mono text-ink-light tracking-wide max-w-sm italic">
              &ldquo;{caseFile.verdict.summary}&rdquo;
            </p>
          </div>

          {/* Polygraph Galvanometer */}
          <div className="lg:col-span-6">
            <PolygraphGauge
              score={caseFile.believabilityScore}
              metrics={caseFile.metrics}
            />
          </div>
        </div>

        {/* Evidence Exhibits Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between border-b border-paper-edge pb-2 mb-4">
            <h3 className="font-typewriter font-bold text-base sm:text-lg text-ink-rich uppercase tracking-wider">
              Forensic Evidence Exhibits
            </h3>
            <span className="text-xs font-mono text-ink-faint">
              {caseFile.evidenceCards.length} Contradictions Logged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {caseFile.evidenceCards.map((card, idx) => (
              <EvidenceCardItem key={card.id || idx} card={card} index={idx} />
            ))}
          </div>
        </div>

        {/* Detective's Field Notes */}
        <div className="mb-8 bg-paper-card border border-paper-edge rounded-md p-5 sm:p-6 paper-grain">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brass font-bold mb-3 border-b border-paper-edge/60 pb-2">
            <Sparkles className="w-4 h-4" />
            <span>Detective Jack Vance &bull; Confidential Field Observations</span>
          </div>

          <p className="font-typewriter text-sm sm:text-base text-ink leading-relaxed">
            {caseFile.detectiveNotes}
          </p>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-paper-edge/40 text-[11px] font-mono text-ink-faint">
            <span>Seal: {caseFile.bureauSealNumber}</span>
            <span className="italic font-typewriter">Sign-off: Det. J. Vance, Snr. Insp.</span>
          </div>
        </div>

        {/* Counter-Interrogation Rebuttal Box */}
        <div className="bg-paper-card border-2 border-brass/40 rounded-md p-5 sm:p-6 paper-grain">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-evidence font-bold mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>Suggested Counter-Interrogation Replies (One-Click Copy)</span>
          </div>
          <p className="text-xs font-sans text-ink-light mb-4">
            Don&apos;t let them off the hook with a passive nod. Choose a forensic reply formulated by the Bureau:
          </p>

          <div className="space-y-2.5">
            {caseFile.recommendedRebuttal.map((rebuttal, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 rounded bg-paper/60 dark:bg-paper-dark/60 border border-paper-edge hover:border-brass/70 transition-colors group"
              >
                <span className="font-typewriter text-xs sm:text-sm text-ink font-medium leading-relaxed">
                  {rebuttal}
                </span>

                <button
                  onClick={() => handleCopySingleRebuttal(rebuttal, idx)}
                  className="shrink-0 p-2 rounded text-ink-faint hover:text-ink hover:bg-brass/20 transition-all active:scale-95"
                  title="Copy reply text"
                  aria-label="Copy reply text"
                >
                  {copiedRebuttalIdx === idx ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-brass" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Manila Bottom Footer Stamp */}
        <div className="mt-8 pt-4 border-t border-paper-edge/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-ink-faint">
          <span>AWS BUILDER CENTER AGENT CHALLENGE &bull; EXCUSE FORENSICS</span>
          <span className="uppercase tracking-widest">
            AUTHENTICATED VIA CRYPTOGRAPHIC BUREAU HASH
          </span>
        </div>
      </div>
    </div>
  );
};
