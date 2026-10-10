import React from 'react';
import { AlertOctagon, RotateCcw, Sparkles, WifiOff } from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';
import { soundEffects } from '../../services/soundEffects';

interface NoirErrorViewProps {
  errorMessage: string;
}

export const NoirErrorView: React.FC<NoirErrorViewProps> = ({ errorMessage }) => {
  const { openCase, resetToInterrogation, updateApiSettings } = useCaseStore();

  const isOffline = errorMessage.includes('OFFLINE') || !navigator.onLine;
  const isRateLimited = errorMessage.includes('RATE_LIMITED') || errorMessage.includes('429');

  const handleRetry = () => {
    soundEffects.playTypewriterKey();
    openCase();
  };

  const handleSwitchToMock = () => {
    soundEffects.playStampThud();
    updateApiSettings({ useMockMode: true });
    openCase();
  };

  const handleReset = () => {
    soundEffects.playPaperSlide();
    resetToInterrogation();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12 text-center">
      <div className="bg-paper-card border-2 border-evidence rounded-lg p-6 sm:p-8 shadow-noir paper-grain relative overflow-hidden">
        {/* Red Classified Danger Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-evidence" />

        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-evidence/15 border border-evidence/40 flex items-center justify-center text-evidence">
          {isOffline ? <WifiOff className="w-7 h-7" /> : <AlertOctagon className="w-7 h-7" />}
        </div>

        <div className="inline-block px-3 py-1 mb-2 rounded bg-evidence/10 text-evidence font-mono text-xs uppercase tracking-widest font-bold">
          {isOffline
            ? 'Telegraph Wire Severed'
            : isRateLimited
            ? 'Precinct Switchboard Flooded'
            : 'Crime Lab Transmission Failure'}
        </div>

        <h3 className="font-typewriter font-bold text-xl sm:text-2xl text-ink-rich mb-3">
          Investigation Interrupted
        </h3>

        <p className="font-mono text-xs sm:text-sm text-ink-light mb-6 leading-relaxed">
          {errorMessage}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-paper-edge font-mono text-xs">
          <button
            onClick={handleRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-evidence hover:bg-evidence-stamp text-white font-bold uppercase transition-transform active:scale-95 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retransmit Statement</span>
          </button>

          <button
            onClick={handleSwitchToMock}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-paper border border-brass text-brass hover:bg-brass/10 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fallback to Mock Bureau</span>
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-3 py-2 text-ink-faint hover:text-ink transition-colors"
          >
            Back to Desk
          </button>
        </div>
      </div>
    </div>
  );
};
