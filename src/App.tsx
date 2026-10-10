import React, { useState, useEffect } from 'react';
import { useCaseStore } from './store/caseStore';
import { DeskLampLight } from './components/effects/DeskLampLight';
import { Header } from './components/layout/Header';
import { FirstRunModal } from './components/intake/FirstRunModal';
import { InterrogationRoom } from './components/intake/InterrogationRoom';
import { InvestigationProgress } from './components/loading/InvestigationProgress';
import { CaseFileView } from './components/verdict/CaseFileView';
import { NoirErrorView } from './components/common/NoirErrorView';
import { CaseArchivesDrawer } from './components/archives/CaseArchivesDrawer';
import { ApiSettingsModal } from './components/settings/ApiSettingsModal';

export const App: React.FC = () => {
  const { status, currentCase, errorMessage, resetToInterrogation, theme } = useCaseStore();

  const [archivesOpen, setArchivesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync theme with root HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Global escape key listener for drawers/modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (archivesOpen) setArchivesOpen(false);
        if (settingsOpen) setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [archivesOpen, settingsOpen]);

  return (
    <div className="min-h-screen bg-paper-dark text-ink font-sans relative flex flex-col transition-colors duration-300 selection:bg-evidence selection:text-white">
      {/* Desk Lamp Ambient Cursor Light (Disabled on touch & reduced motion) */}
      <DeskLampLight />

      {/* Precinct Header */}
      <Header
        onOpenArchives={() => setArchivesOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Forensic Content Area */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        {status === 'investigating' && <InvestigationProgress />}

        {status === 'verdict' && currentCase && (
          <CaseFileView
            caseFile={currentCase}
            onFileAnotherCase={resetToInterrogation}
          />
        )}

        {status === 'error' && (
          <NoirErrorView errorMessage={errorMessage || 'Unknown bureau error.'} />
        )}

        {status === 'idle' && <InterrogationRoom />}
      </main>

      {/* Atmospheric Footer */}
      <footer className="w-full border-t border-paper-edge/40 bg-paper/50 dark:bg-paper-dark/60 py-4 px-4 text-center font-mono text-[11px] text-ink-faint relative z-10 transition-colors">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            SORRY NOT SORRY &bull; AWS BUILDER CENTER WEEKEND CHALLENGE
          </span>
          <span className="hidden sm:inline">
            Typewriter font: Courier Prime / Special Elite &bull; WCAG AA Compliant
          </span>
          <span>
            DIV 1947 CRIME LAB
          </span>
        </div>
      </footer>

      {/* Skippable First Run Detective Briefing */}
      <FirstRunModal />

      {/* Case Archives Drawer */}
      <CaseArchivesDrawer
        isOpen={archivesOpen}
        onClose={() => setArchivesOpen(false)}
      />

      {/* API / AWS Lambda Configuration Modal */}
      <ApiSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
