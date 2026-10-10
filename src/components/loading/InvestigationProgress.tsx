import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Search } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

const INVESTIGATION_STEPS = [
  'Securing the perimeter of the statement...',
  'Dusting the excuse for latent fingerprints...',
  'Cross-referencing with 10,000 known precinct lies...',
  'Running suspect timeline through the chronometer...',
  'Consulting the Bureau of Convenient Illnesses...',
  'Applying the polygraph needle to the syntax...',
  'Formulating the detective\'s verdict and official seal...',
];

export const InvestigationProgress: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Cycle through steps every 450ms
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = (prev + 1) % INVESTIGATION_STEPS.length;
        soundEffects.playTypewriterKey();
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full max-w-xl mx-auto px-4 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative inline-flex items-center justify-center p-6 mb-6">
        {/* Pulsing radar / scanner glow */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-brass/10 dark:bg-brass/20 border border-brass/40"
        />

        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-paper-card border-2 border-brass shadow-folder">
          <Fingerprint className="w-10 h-10 text-evidence animate-pulse" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1 -right-1 text-brass"
          >
            <Search className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      <div className="inline-block px-3 py-1 mb-3 rounded bg-evidence/10 border border-evidence/30 text-evidence font-mono text-xs uppercase tracking-widest font-bold">
        Forensics in Progress
      </div>

      <h3 className="text-xl sm:text-2xl font-typewriter font-bold text-ink-rich mb-3">
        The Crime Lab is Processing...
      </h3>

      {/* Typewriter message with animated typing cursor */}
      <div className="min-h-[48px] flex items-center justify-center">
        <p className="font-mono text-sm sm:text-base text-ink-light tracking-wide">
          {INVESTIGATION_STEPS[stepIndex]}
          <span className="inline-block w-2 h-4 ml-1 bg-brass animate-pulse align-middle" />
        </p>
      </div>

      {/* Polygraph animated waveform line */}
      <div className="mt-8 max-w-md mx-auto p-3 bg-paper-card border border-paper-edge rounded font-mono text-xs text-ink-faint">
        <div className="flex items-center justify-between mb-1.5 text-[10px] uppercase tracking-wider text-brass">
          <span>Galvanic Galvanometer</span>
          <span className="text-evidence animate-pulse">● Live Sweep</span>
        </div>
        <svg
          viewBox="0 0 300 40"
          className="w-full h-10 text-evidence stroke-current fill-none stroke-[1.5]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,20 L50,20 L65,5 L75,35 L85,15 L95,25 L105,20 L180,20 L195,2 L205,38 L215,10 L225,25 L235,20 L300,20"
            className="polygraph-active"
          />
        </svg>
      </div>
    </div>
  );
};
