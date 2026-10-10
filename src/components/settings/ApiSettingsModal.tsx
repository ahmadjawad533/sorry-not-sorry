import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  X,
  Server,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';
import { getApiBaseUrl, isMockMode, ApiService } from '../../services/apiService';
import { soundEffects } from '../../services/soundEffects';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { simulatedDelayMs, setSimulatedDelayMs } = useCaseStore();
  const [delayMs, setDelayMs] = useState(simulatedDelayMs || 1400);

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testFeedback, setTestFeedback] = useState<string>('');

  if (!isOpen) return null;

  const baseUrl = getApiBaseUrl();
  const inMock = isMockMode();

  const handleSave = () => {
    soundEffects.playStampThud();
    setSimulatedDelayMs(delayMs);
    onClose();
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestFeedback('Testing precinct communication lines...');
    soundEffects.playTypewriterKey();

    try {
      if (inMock) {
        await new Promise((r) => setTimeout(r, 600));
        setTestStatus('success');
        setTestFeedback('Mock Bureau is operational. Local forensics heuristics ready.');
        soundEffects.playTypewriterBell();
      } else {
        const shame = await ApiService.getWallOfShame();
        setTestStatus('success');
        setTestFeedback(`Connected to live AWS Lambda! Retrieved ${shame.items.length} records from /shame.`);
        soundEffects.playTypewriterBell();
      }
    } catch (err: unknown) {
      setTestStatus('error');
      setTestFeedback(err instanceof Error ? err.message : 'Connection test failed.');
      soundEffects.playPolygraphTick();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-paper-card border border-brass/40 rounded-lg shadow-noir-lg p-6 sm:p-8 overflow-hidden paper-grain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-paper-edge mb-5">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-brass" />
              <div>
                <h3 id="settings-title" className="font-typewriter font-bold text-base sm:text-lg text-ink-rich uppercase">
                  Bureau Transmission Status
                </h3>
                <p className="text-xs font-mono text-ink-faint">
                  Active Crime Lab Connection Details
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded text-ink-faint hover:text-ink hover:bg-paper transition-colors"
              aria-label="Close settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-5 text-xs font-mono">
            {/* Active Mode Display */}
            <div>
              <label className="block text-ink font-bold uppercase tracking-wider mb-2">
                Active Backend Engine
              </label>

              <div className="p-3 rounded border border-paper-edge bg-paper/60 dark:bg-paper-dark/60 flex items-start gap-3">
                <div className="p-2 rounded bg-paper-card border border-paper-edge text-brass mt-0.5">
                  {inMock ? <Sparkles className="w-4 h-4" /> : <Server className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink text-sm">
                      {inMock ? 'Mock Bureau (Local Forensics)' : 'Live AWS Lambda Backend'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inMock
                          ? 'bg-brass/15 text-brass'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {inMock ? 'MOCK' : 'LIVE'}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-ink-light mt-1 leading-relaxed">
                    {inMock
                      ? 'Running with local rule-based heuristics. Activated when VITE_API_URL is empty or VITE_USE_MOCK=true.'
                      : 'Connecting directly to rule-based AWS Lambda Function URL behind /investigate and /shame.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Base URL (Read-Only) */}
            <div>
              <label className="block text-ink font-semibold uppercase tracking-wider mb-1">
                Base Endpoint URL (Environment)
              </label>
              <div className="px-3 py-2 text-xs font-mono bg-paper border border-paper-edge rounded text-ink break-all select-all">
                {baseUrl || 'No VITE_API_URL configured (defaults to Mock Bureau)'}
              </div>
              <p className="text-[10px] text-ink-faint mt-1 font-sans">
                Zero configuration required by visitors. Bound automatically at build time via <code className="text-brass">VITE_API_URL</code>.
              </p>
            </div>

            {/* Health Test */}
            <div className="pt-1 border-t border-paper-edge/50">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-paper-edge hover:border-brass text-ink font-mono text-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>Test Crime Lab Connection</span>
              </button>

              {testFeedback && (
                <div
                  className={`mt-2 p-2 rounded border text-[11px] flex items-start gap-1.5 ${
                    testStatus === 'success'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-evidence/40 bg-evidence/10 text-evidence'
                  }`}
                >
                  {testStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{testFeedback}</span>
                </div>
              )}
            </div>

            {/* Atmospheric Delay */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-ink font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brass" />
                  <span>Atmospheric Deliberation Delay</span>
                </label>
                <span className="text-brass font-bold">{(delayMs / 1000).toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min={1200}
                max={3000}
                step={200}
                value={delayMs}
                onChange={(e) => setDelayMs(Number(e.target.value))}
                className="w-full accent-brass"
              />
              <span className="text-[10px] text-ink-faint block mt-0.5 font-sans">
                Controls the detective&apos;s pacing before slamming down the official case file.
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-paper-edge flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-mono text-ink-faint hover:text-ink transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded bg-brass hover:bg-brass-light text-paper-dark font-mono text-xs font-bold uppercase tracking-wider shadow transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
