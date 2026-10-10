import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Dna, MapPin, MessageSquareQuote, ShieldAlert, Siren } from 'lucide-react';
import { EvidenceCard, EvidenceSeverity } from '../../types/case';

interface EvidenceCardItemProps {
  card: EvidenceCard;
  index: number;
}

export const EvidenceCardItem: React.FC<EvidenceCardItemProps> = ({
  card,
  index,
}) => {
  const isRepeat = card.id === 'repeat-offender' || card.isRepeatOffender;

  // Slight random rotation for desk-scattered realism (-1.5deg to +1.5deg)
  const rotationAngles = [-1.4, 1.2, -0.8, 1.6, -1.1];
  const rot = isRepeat ? 0 : rotationAngles[index % rotationAngles.length];

  const getSeverityBadge = (sev: EvidenceSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-evidence/15 text-evidence border-evidence/40';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/40';
      default:
        return 'bg-stone-500/15 text-stone-600 dark:text-stone-400 border-stone-500/40';
    }
  };

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'temporal':
        return <Clock className="w-3.5 h-3.5" />;
      case 'biometric':
        return <Dna className="w-3.5 h-3.5" />;
      case 'alibi':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'linguistics':
        return <MessageSquareQuote className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, rotate: rot * 3 }}
      animate={{ opacity: 1, y: 0, rotate: rot }}
      transition={{
        delay: 0.15 + index * 0.12,
        duration: 0.35,
        ease: 'easeOut',
      }}
      className={`relative rounded p-4 paper-grain group transition-all ${
        isRepeat
          ? 'bg-evidence/10 dark:bg-evidence/15 border-2 border-evidence ring-2 ring-evidence/30 shadow-lg col-span-1 md:col-span-3'
          : 'bg-paper-card border border-paper-edge shadow-noir-sm hover:shadow-folder'
      }`}
    >
      {/* Repeat Offender Special Highlight Banner */}
      {isRepeat && (
        <div className="flex items-center justify-between bg-evidence text-white text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded -mt-2 -mx-2 mb-3 shadow">
          <span className="flex items-center gap-1.5 animate-pulse">
            <Siren className="w-3.5 h-3.5" />
            SPECIAL EXHIBIT: REPEAT OFFENDER IDENTIFIED
          </span>
          <span className="opacity-90">PRECINCT RECORD #RECIDIVIST</span>
        </div>
      )}

      {/* Evidence index tag in corner */}
      <div className="flex items-center justify-between gap-2 border-b border-paper-edge/60 pb-2 mb-2">
        <div className="flex items-center gap-1.5 font-mono text-xs text-ink-light">
          {isRepeat ? (
            <Siren className="w-3.5 h-3.5 text-evidence animate-bounce" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-brass" />
          )}
          <span className={`font-bold ${isRepeat ? 'text-evidence' : 'text-ink'}`}>
            EXHIBIT #{index + 1}
          </span>
          {card.category && (
            <span className="flex items-center gap-1 text-[11px] text-ink-faint uppercase">
              &bull; {getCategoryIcon(card.category)} {card.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {card.confidence !== undefined && (
            <span className="text-[10px] font-mono text-ink-faint hidden sm:inline">
              Confidence: {card.confidence}%
            </span>
          )}
          <span
            className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded border ${getSeverityBadge(
              card.severity
            )}`}
          >
            {card.severity}
          </span>
        </div>
      </div>

      <h4 className={`font-typewriter font-bold text-sm mb-1.5 ${isRepeat ? 'text-evidence' : 'text-ink-rich'}`}>
        {card.title}
      </h4>

      <p className="font-mono text-xs text-ink-light leading-relaxed">
        {card.finding}
      </p>
    </motion.div>
  );
};
