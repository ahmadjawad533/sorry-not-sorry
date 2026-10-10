import React from 'react';
import { motion } from 'framer-motion';
import { ForensicVerdict } from '../../types/case';

interface VerdictStampProps {
  verdict: ForensicVerdict;
}

export const VerdictStamp: React.FC<VerdictStampProps> = ({ verdict }) => {
  const isBusted = verdict.classification === 'BUSTED' || verdict.classification === 'HIGHLY_SUSPECT';
  const isPlausible = verdict.classification === 'PLAUSIBLE' || verdict.classification === 'ALIBI_CONFIRMED';

  const stampColorClass = isBusted
    ? 'text-evidence border-evidence'
    : isPlausible
    ? 'text-emerald-600 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
    : 'text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400';

  return (
    <motion.div
      initial={{ scale: 2.8, opacity: 0, rotate: -18 }}
      animate={{ scale: 1, opacity: 0.95, rotate: -7 }}
      transition={{
        type: 'spring',
        damping: 14,
        stiffness: 180,
        mass: 1.2,
      }}
      className="inline-block relative select-none"
    >
      <div
        className={`px-4 sm:px-6 py-2 sm:py-3 border-4 border-dashed rounded-sm font-typewriter font-bold uppercase tracking-widest text-center shadow-stamp ${stampColorClass}`}
        style={{
          maskImage: 'radial-gradient(circle, black 85%, rgba(0,0,0,0.7) 100%)',
        }}
      >
        <div className="text-[10px] sm:text-xs tracking-[0.25em] font-mono opacity-85 mb-0.5">
          ★ OFFICIAL FORENSICS VERDICT ★
        </div>
        <div className="text-xl sm:text-3xl font-extrabold tracking-wider">
          {verdict.stampText}
        </div>
        <div className="text-[9px] sm:text-[10px] tracking-widest font-mono opacity-75 mt-0.5">
          PRECINCT CRIME LAB &bull; CASE CLOSED
        </div>
      </div>
    </motion.div>
  );
};
