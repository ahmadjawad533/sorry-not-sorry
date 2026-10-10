import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Dna, MapPin, MessageSquareQuote, ShieldAlert } from 'lucide-react';
import { EvidenceCard, EvidenceSeverity } from '../../types/case';

interface EvidenceCardItemProps {
  card: EvidenceCard;
  index: number;
}

export const EvidenceCardItem: React.FC<EvidenceCardItemProps> = ({
  card,
  index,
}) => {
  // Slight random rotation for desk-scattered realism (-1.5deg to +1.5deg)
  const rotationAngles = [-1.4, 1.2, -0.8, 1.6, -1.1];
  const rot = rotationAngles[index % rotationAngles.length];

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
      className="relative bg-paper-card border border-paper-edge rounded p-4 shadow-noir-sm paper-grain group hover:shadow-folder transition-shadow"
    >
      {/* Evidence index tag in corner */}
      <div className="flex items-center justify-between gap-2 border-b border-paper-edge/60 pb-2 mb-2">
        <div className="flex items-center gap-1.5 font-mono text-xs text-ink-light">
          <ShieldAlert className="w-3.5 h-3.5 text-brass" />
          <span className="font-bold text-ink">EXHIBIT #{index + 1}</span>
          {card.category && (
            <span className="flex items-center gap-1 text-[11px] text-ink-faint uppercase">
              &bull; {getCategoryIcon(card.category)} {card.category}
            </span>
          )}
        </div>

        <span
          className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded border ${getSeverityBadge(
            card.severity
          )}`}
        >
          {card.severity}
        </span>
      </div>

      <h4 className="font-typewriter font-bold text-sm text-ink-rich mb-1.5">
        {card.title}
      </h4>

      <p className="font-mono text-xs text-ink-light leading-relaxed">
        {card.finding}
      </p>
    </motion.div>
  );
};
