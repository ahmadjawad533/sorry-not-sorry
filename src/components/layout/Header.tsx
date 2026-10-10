import React from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  FolderArchive,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { isMockMode } from '../../services/apiService';
import { useCaseStore } from '../../store/caseStore';

interface HeaderProps {
  onOpenArchives: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenArchives,
  onOpenSettings,
}) => {
  const {
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    archives,
  } = useCaseStore();

  const inMock = isMockMode();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-edge/50 bg-paper/85 dark:bg-paper-dark/90 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Bureau Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded bg-manila-dark/30 dark:bg-manila/20 border border-brass/50 text-brass shadow-sm">
            <ShieldAlert className="w-5 h-5 text-evidence" />
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-evidence opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-evidence"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-typewriter font-bold text-base sm:text-lg tracking-wider text-ink-rich uppercase">
                Sorry Not Sorry
              </h1>
              <span className="hidden md:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-manila-dark/20 text-brass border border-brass/30">
                Div 1947
              </span>
            </div>
            <p className="text-xs text-ink-faint font-mono tracking-tight hidden sm:block">
              Precinct Crime Lab &bull; Excuse Forensics Division
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Pill Badge */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border transition-colors border-paper-edge bg-paper-card text-ink-light hover:text-ink hover:border-brass/60"
            title="Bureau Backend Status (Mock / AWS Lambda)"
          >
            {inMock ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brass" />
                <span className="hidden sm:inline">Mock Bureau</span>
                <span className="sm:hidden">Mock</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">AWS Lambda Live</span>
                <span className="sm:hidden">AWS</span>
              </>
            )}
          </button>

          {/* Case Archives Drawer Button */}
          <button
            onClick={onOpenArchives}
            className="relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border border-paper-edge bg-paper-card text-ink-light hover:text-ink hover:border-brass/60 transition-colors"
            title="Open Case Archives"
            aria-label={`Open Case Archives, ${archives.length} files stored`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-brass" />
            <span className="hidden sm:inline">Dossier</span>
            {archives.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-evidence text-white">
                {archives.length}
              </span>
            )}
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded border transition-colors ${
              soundEnabled
                ? 'border-brass/70 text-brass bg-brass/10'
                : 'border-paper-edge text-ink-faint bg-paper-card hover:text-ink'
            }`}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects (Typewriter & Stamp)'}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Daylight / Night Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded border border-paper-edge bg-paper-card text-ink-light hover:text-ink hover:border-brass/60 transition-colors"
            title={theme === 'dark' ? 'Switch to Daylight Case theme' : 'Switch to Bureau Night theme'}
            aria-label={theme === 'dark' ? 'Switch to Daylight Case theme' : 'Switch to Bureau Night theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-brass" /> : <Moon className="w-4 h-4 text-ink" />}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded border border-paper-edge bg-paper-card text-ink-light hover:text-ink hover:border-brass/60 transition-colors"
            title="Bureau Configuration (AWS Lambda & Audio)"
            aria-label="Bureau Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
