import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';
import { soundEffects } from '../../services/soundEffects';

export const FirstRunModal: React.FC = () => {
  const { hasSeenIntro, dismissIntro } = useCaseStore();

  if (hasSeenIntro) return null;

  const handleDismiss = () => {
    soundEffects.playPaperSlide();
    dismissIntro();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-paper-card border border-brass/40 rounded-lg shadow-noir-lg p-6 sm:p-8 overflow-hidden paper-grain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="briefing-title"
        >
          {/* Manila top tab aesthetic */}
          <div className="absolute top-0 left-8 px-4 py-1 bg-manila-dark text-[10px] font-mono tracking-widest text-brass-light uppercase border-b border-r border-brass/30 rounded-b">
            Official Detective Briefing &bull; Memo #01
          </div>

          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded text-ink-faint hover:text-ink hover:bg-paper transition-colors"
            aria-label="Skip briefing"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-evidence/15 border border-evidence/40 flex items-center justify-center text-evidence">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-evidence tracking-wider uppercase font-semibold">
                Badge #47 &bull; Det. Jack Vance
              </span>
              <h2 id="briefing-title" className="text-xl font-typewriter font-bold text-ink-rich">
                Welcome to Excuse Forensics
              </h2>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-ink-light leading-relaxed font-sans border-y border-paper-edge/60 py-4">
            <p>
              Pull up a chair. Don&apos;t worry about the cigarette smoke—it&apos;s digital.
            </p>
            <p>
              In this precinct, we deal with one thing: <strong className="text-ink font-semibold">the anatomy of the dodge</strong>. Every morning, people claim their alarm didn&apos;t chime, their router sprouted wings, or their third cousin had an impromptu gallbladder crisis.
            </p>
            <p className="italic text-ink">
              &ldquo;We don&apos;t judge whether you forgive them. We just run the alibi through the polygraph, dust the syntax for fingerprints, and hand you the cold truth in a manila folder.&rdquo;
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-mono text-ink-faint">
              Press Cmd/Ctrl+Enter anytime to submit
            </span>
            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-brass hover:bg-brass-light text-paper-dark font-mono text-sm font-semibold shadow transition-transform active:scale-95"
            >
              <span>Take the Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
