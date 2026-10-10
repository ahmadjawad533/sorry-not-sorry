import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { ForensicMetrics } from '../../types/case';
import { soundEffects } from '../../services/soundEffects';

interface PolygraphGaugeProps {
  score: number; // 0 - 100
  metrics: ForensicMetrics;
}

export const PolygraphGauge: React.FC<PolygraphGaugeProps> = ({
  score,
  metrics,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Sweeping needle animation
    const duration = 1200;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        soundEffects.playPolygraphTick();
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [score]);

  // Convert 0-100 to needle angle: -75deg to +75deg
  const needleAngle = -75 + (animatedScore / 100) * 150;

  const getScoreColor = (val: number) => {
    if (val <= 30) return 'text-evidence';
    if (val <= 60) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getScoreLabel = (val: number) => {
    if (val <= 20) return 'COLD HARD FICTION';
    if (val <= 40) return 'HIGHLY IMPROBABLE';
    if (val <= 60) return 'SUSPICIOUSLY VAGUE';
    if (val <= 80) return 'MODERATELY PLAUSIBLE';
    return 'IRONCLAD TRUTH';
  };

  return (
    <div className="bg-paper-card border border-paper-edge rounded-lg p-5 paper-grain shadow-inner">
      <div className="flex items-center justify-between border-b border-paper-edge pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-evidence" />
          <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
            Polygraph Lie-Detector Galvanometer
          </span>
        </div>
        <span className="text-[10px] font-mono text-ink-faint uppercase">
          Model PG-1947 &bull; Calibrated
        </span>
      </div>

      {/* Radial Arc / Gauge Graphic */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-4">
        <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center">
          {/* Semicircle dial track */}
          <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
            {/* Background Arc */}
            <path
              d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-paper-edge/40"
              strokeLinecap="round"
            />
            {/* Color Zone: Red (0-40) */}
            <path
              d="M 20 95 A 80 80 0 0 1 75 30"
              fill="none"
              stroke="#dc2626"
              strokeWidth="12"
              strokeDasharray="4 2"
              opacity="0.85"
            />
            {/* Color Zone: Amber (40-70) */}
            <path
              d="M 75 30 A 80 80 0 0 1 130 30"
              fill="none"
              stroke="#d97706"
              strokeWidth="12"
              strokeDasharray="4 2"
              opacity="0.85"
            />
            {/* Color Zone: Green (70-100) */}
            <path
              d="M 130 30 A 80 80 0 0 1 180 95"
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray="4 2"
              opacity="0.85"
            />

            {/* Calibration tick labels */}
            <text x="18" y="105" fontSize="8" fill="currentColor" className="text-ink-faint font-mono">0%</text>
            <text x="94" y="14" fontSize="8" fill="currentColor" className="text-ink-faint font-mono">50%</text>
            <text x="172" y="105" fontSize="8" fill="currentColor" className="text-ink-faint font-mono">100%</text>
          </svg>

          {/* Needle */}
          <motion.div
            style={{
              transformOrigin: 'bottom center',
              transform: `rotate(${needleAngle}deg)`,
            }}
            transition={{ type: 'spring', stiffness: 60, damping: 10 }}
            className="absolute bottom-0 w-1 h-28 bg-evidence rounded-t shadow-md z-10"
          >
            <div className="absolute -top-1.5 -left-1 w-3 h-3 bg-evidence rounded-full border border-black/40" />
          </motion.div>

          {/* Needle Base Pivot Cap */}
          <div className="absolute -bottom-2 w-6 h-6 rounded-full bg-brass border-2 border-stone-800 dark:border-stone-200 z-20 shadow" />
        </div>

        {/* Live Score Readout */}
        <div className="mt-3 text-center">
          <div className="flex items-baseline justify-center gap-1 font-typewriter font-bold text-3xl sm:text-4xl">
            <span className={getScoreColor(animatedScore)}>{animatedScore}</span>
            <span className="text-sm font-mono text-ink-faint">/ 100</span>
          </div>
          <div className="text-xs font-mono tracking-widest uppercase font-semibold text-ink-light mt-0.5">
            {getScoreLabel(animatedScore)}
          </div>
        </div>
      </div>

      {/* Forensic Breakdown Sub-metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-paper-edge text-center font-mono">
        <div className="p-2 rounded bg-paper/50 dark:bg-paper-dark/50 border border-paper-edge/50">
          <div className="text-[10px] text-ink-faint uppercase">Plausibility</div>
          <div className="text-sm font-bold text-ink">{metrics.plausibilityIndex}%</div>
        </div>
        <div className="p-2 rounded bg-paper/50 dark:bg-paper-dark/50 border border-paper-edge/50">
          <div className="text-[10px] text-ink-faint uppercase">Creative Effort</div>
          <div className="text-sm font-bold text-ink">{metrics.creativeEffort}%</div>
        </div>
        <div className="p-2 rounded bg-paper/50 dark:bg-paper-dark/50 border border-paper-edge/50">
          <div className="text-[10px] text-ink-faint uppercase">Audacity</div>
          <div className="text-sm font-bold text-evidence">{metrics.audacityRating}%</div>
        </div>
        <div className="p-2 rounded bg-paper/50 dark:bg-paper-dark/50 border border-paper-edge/50">
          <div className="text-[10px] text-ink-faint uppercase">Cliché Index</div>
          <div className="text-sm font-bold text-amber-500">{metrics.clicheLevel}%</div>
        </div>
      </div>
    </div>
  );
};
