import React, { useState, useEffect, useRef } from 'react';
import {
  FileSearch,
  CornerDownLeft,
  Trash2,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';
import { soundEffects } from '../../services/soundEffects';

const ROTATING_PLACEHOLDERS = [
  'My alarm didn\'t go off and then my cat got sick...',
  'My router spontaneously caught fire right as the meeting started...',
  'I was in an elevator with no cellular signal for four hours...',
  'My grandmother\'s second cousin had an urgent goat rescue in Vermont...',
  'I sent the email yesterday, check your spam folder or server queue...',
  'A water main broke directly in front of my driveway...',
];

const CLASSIC_EXCUSES = [
  {
    label: '⏰ Broken Alarm',
    text: "My alarm didn't go off and then my cat got sick.",
  },
  {
    label: '📶 Ghost Wi-Fi',
    text: "My Wi-Fi completely crashed right as I was about to join the client call.",
  },
  {
    label: '🚗 The Gridlock',
    text: "Traffic on the bridge was completely stalled due to an overturned produce truck.",
  },
  {
    label: '👵 Distant Relative',
    text: "Grandma's cousin had an emergency and I had to drive three towns over.",
  },
  {
    label: '📬 Never Got The Ping',
    text: "I swear I never saw your message. Slack must have eaten the notification.",
  },
  {
    label: '⚡ Power Outage',
    text: "The transformer down the block blew up and my laptop died right after.",
  },
];

export const InterrogationRoom: React.FC = () => {
  const { draftExcuse, setDraftExcuse, openCase, status } = useCaseStore();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Rotate placeholders every 4.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 500);
    soundEffects.playTypewriterKey();
    setDraftExcuse(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (draftExcuse.trim() && status !== 'investigating') {
        openCase();
      }
    }
  };

  const handleSelectClassic = (text: string) => {
    soundEffects.playTypewriterKey();
    setDraftExcuse(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleClear = () => {
    soundEffects.playTypewriterKey();
    setDraftExcuse('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftExcuse.trim() && status !== 'investigating') {
      openCase();
    }
  };

  const charCount = draftExcuse.length;
  const isNearLimit = charCount >= 450;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-manila/15 border border-brass/30 text-brass text-xs font-mono tracking-widest uppercase">
          <FileText className="w-3.5 h-3.5" />
          <span>Case Intake Division &bull; Room 402</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-typewriter font-bold tracking-tight text-ink-rich mb-3">
          Drop the excuse on the desk.
        </h2>

        <p className="text-sm sm:text-base text-ink-light font-sans max-w-xl mx-auto leading-relaxed">
          &ldquo;The truth is a clean desk. An excuse is a coffee stain on fresh blotting paper. Paste whatever story they spun you, and let our crime lab measure the fiction.&rdquo;
        </p>
      </div>

      {/* Case Intake Form Container */}
      <div className="relative bg-paper-card border border-paper-edge rounded-lg shadow-folder p-5 sm:p-8 paper-grain">
        {/* Metal clipboard top clip aesthetic */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 sm:w-44 h-7 bg-gradient-to-b from-stone-400 to-stone-600 dark:from-stone-700 dark:to-stone-900 rounded-t-md border-t border-x border-stone-300 dark:border-stone-600 shadow-md flex items-center justify-center">
          <div className="w-8 h-1.5 bg-stone-900/60 dark:bg-black/50 rounded-full" />
        </div>

        {/* Coffee stain visual flair */}
        <div className="coffee-stain top-6 right-6 opacity-15 hidden md:block" />

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div className="flex items-center justify-between border-b border-paper-edge pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-evidence font-bold">
                Item #A-47
              </span>
              <span className="text-xs font-mono text-ink-faint hidden sm:inline">
                &bull; Suspect Verbatim Transcript
              </span>
            </div>

            {draftExcuse && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 text-xs font-mono text-ink-faint hover:text-evidence transition-colors"
                title="Wipe intake form"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wipe Slate</span>
              </button>
            )}
          </div>

          {/* Big Intake Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={4}
              value={draftExcuse}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={500}
              placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
              className="w-full bg-paper/60 dark:bg-paper-dark/60 border border-paper-edge focus:border-brass/70 rounded-md p-4 sm:p-5 font-typewriter text-sm sm:text-base text-ink placeholder:text-ink-faint/60 placeholder:font-mono focus:outline-none focus:ring-1 focus:ring-brass/50 transition-all resize-y min-h-[140px] leading-relaxed"
              aria-label="Paste excuse for forensics analysis"
              required
            />
          </div>

          {/* Form Footer Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3 text-xs font-mono text-ink-faint">
              <span
                className={`transition-colors font-medium ${
                  isNearLimit ? 'text-evidence font-bold' : ''
                }`}
              >
                {charCount}/500 chars
              </span>
              <span className="hidden sm:inline text-ink-faint/40">&bull;</span>
              <span className="hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-paper-edge/30 border border-paper-edge font-mono text-[10px]">Cmd/Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-paper-edge/30 border border-paper-edge font-mono text-[10px]">Enter</kbd>
              </span>
            </div>

            <button
              type="submit"
              disabled={!draftExcuse.trim() || status === 'investigating'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-evidence hover:bg-evidence-stamp text-white font-mono text-sm uppercase tracking-wider font-bold shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all transform active:scale-95"
            >
              <FileSearch className="w-4 h-4" />
              <span>Open Case</span>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-70 hidden sm:inline" />
            </button>
          </div>
        </form>
      </div>

      {/* Classic Excuses Quick-Select Chips */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-brass" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-light">
            Try A Classic Defense (Instant Subpoena)
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {CLASSIC_EXCUSES.map((item) => (
            <button
              key={item.label}
              onClick={() => handleSelectClassic(item.text)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-paper-card border border-paper-edge/70 hover:border-brass/70 text-ink-light hover:text-ink hover:bg-manila/15 transition-all active:scale-95 text-left"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
