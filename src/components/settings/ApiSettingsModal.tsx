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
import { soundEffects } from '../../services/soundEffects';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { apiSettings, updateApiSettings } = useCaseStore();

  const [useMock, setUseMock] = useState(apiSettings.useMockMode);
  const [lambdaUrl, setLambdaUrl] = useState(apiSettings.lambdaEndpointUrl);
  const [apiKey, setApiKey] = useState(apiSettings.apiKey);
  const [delayMs, setDelayMs] = useState(apiSettings.simulatedDelayMs || 1400);

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testFeedback, setTestFeedback] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    soundEffects.playStampThud();
    updateApiSettings({
      useMockMode: useMock,
      lambdaEndpointUrl: lambdaUrl.trim(),
      apiKey: apiKey.trim(),
      simulatedDelayMs: delayMs,
    });
    onClose();
  };

  const handleTestConnection = async () => {
    if (!lambdaUrl.trim()) {
      setTestStatus('error');
      setTestFeedback('Enter a valid AWS Lambda Function URL first.');
      return;
    }

    setTestStatus('testing');
    setTestFeedback('Pinging AWS Lambda Function URL...');
    soundEffects.playTypewriterKey();

    try {
      const res = await fetch(lambdaUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey.trim() ? { Authorization: `Bearer ${apiKey.trim()}` } : {}),
        },
        body: JSON.stringify({
          excuse: 'Test diagnostic ping from Excuse Forensics terminal.',
          caseId: 'TEST-PING',
        }),
      });

      if (res.ok) {
        setTestStatus('success');
        setTestFeedback('Connected! The Crime Lab AWS Lambda responded successfully.');
        soundEffects.playTypewriterBell();
      } else {
        setTestStatus('error');
        setTestFeedback(`Endpoint returned HTTP ${res.status}. Check CORS or authentication.`);
        soundEffects.playPolygraphTick();
      }
    } catch (err: unknown) {
      setTestStatus('error');
      setTestFeedback('Connection failed. Verify CORS configuration on the Lambda Function URL.');
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
                  Bureau Transmission Settings
                </h3>
                <p className="text-xs font-mono text-ink-faint">
                  Configure Forensics Backend & Lambda URL
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
            {/* Mode Selector */}
            <div>
              <label className="block text-ink font-bold uppercase tracking-wider mb-2">
                Forensics Engine Mode
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUseMock(true)}
                  className={`p-3 rounded border text-left flex flex-col gap-1 transition-all ${
                    useMock
                      ? 'border-brass bg-brass/10 text-ink'
                      : 'border-paper-edge bg-paper text-ink-faint hover:text-ink'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-4 h-4 text-brass" />
                    <span>Mock Bureau</span>
                  </div>
                  <span className="text-[11px] font-sans text-ink-light">
                    Built-in heuristic detective engine. Fast, reliable, zero cloud cost.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setUseMock(false)}
                  className={`p-3 rounded border text-left flex flex-col gap-1 transition-all ${
                    !useMock
                      ? 'border-evidence bg-evidence/10 text-ink'
                      : 'border-paper-edge bg-paper text-ink-faint hover:text-ink'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <Server className="w-4 h-4 text-evidence" />
                    <span>AWS Lambda Live</span>
                  </div>
                  <span className="text-[11px] font-sans text-ink-light">
                    Calls your live AWS Lambda Function URL agent endpoint.
                  </span>
                </button>
              </div>
            </div>

            {/* AWS Lambda URL Configuration */}
            <div className={`space-y-3 transition-opacity ${useMock ? 'opacity-50' : 'opacity-100'}`}>
              <div>
                <label className="block text-ink font-semibold uppercase tracking-wider mb-1">
                  AWS Lambda Function URL
                </label>
                <input
                  type="url"
                  placeholder="https://abcdef123456.lambda-url.us-east-1.on.aws/"
                  value={lambdaUrl}
                  onChange={(e) => setLambdaUrl(e.target.value)}
                  disabled={useMock}
                  className="w-full px-3 py-2 text-xs font-mono bg-paper border border-paper-edge rounded focus:outline-none focus:border-brass text-ink placeholder:text-ink-faint/50"
                />
                <p className="text-[10px] text-ink-faint mt-1 font-sans">
                  Ensure the Lambda Function URL has CORS enabled (Allow Origin: `*` or your domain, Methods: `POST, OPTIONS`).
                </p>
              </div>

              <div>
                <label className="block text-ink font-semibold uppercase tracking-wider mb-1">
                  Optional API Key / Authorization Token
                </label>
                <input
                  type="password"
                  placeholder="Bearer token or leave blank"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={useMock}
                  className="w-full px-3 py-2 text-xs font-mono bg-paper border border-paper-edge rounded focus:outline-none focus:border-brass text-ink placeholder:text-ink-faint/50"
                />
              </div>

              {!useMock && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-paper-edge hover:border-brass text-ink font-mono text-xs transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                    <span>Test Endpoint Connection</span>
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
              )}
            </div>

            {/* Simulated Deliberation Delay */}
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
                Controls how long the detective takes to deliberate before slamming down the case verdict.
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
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded bg-brass hover:bg-brass-light text-paper-dark font-mono text-xs font-bold uppercase tracking-wider shadow transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Apply Settings</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
