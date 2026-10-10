import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CaseFile } from '../types/case';
import { ApiService } from '../services/apiService';
import { soundEffects } from '../services/soundEffects';

export type AppStatus = 'idle' | 'investigating' | 'verdict' | 'error';

interface CaseStoreState {
  // Case Investigation State
  status: AppStatus;
  currentCase: CaseFile | null;
  draftExcuse: string;
  errorMessage: string | null;
  investigationStepIndex: number;
  simulatedDelayMs: number;

  // Persisted state
  archives: CaseFile[];
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  hasSeenIntro: boolean;

  // Actions
  setDraftExcuse: (text: string) => void;
  openCase: (excuseText?: string) => Promise<void>;
  resetToInterrogation: () => void;
  loadCaseFromArchive: (caseFile: CaseFile) => void;
  deleteFromArchives: (caseId: string) => void;
  clearArchives: () => void;

  toggleSound: () => void;
  toggleTheme: () => void;
  dismissIntro: () => void;
  setSimulatedDelayMs: (ms: number) => void;
  setInvestigationStepIndex: (step: number) => void;
}

export const useCaseStore = create<CaseStoreState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      currentCase: null,
      draftExcuse: '',
      errorMessage: null,
      investigationStepIndex: 0,
      simulatedDelayMs: 1400,

      archives: [],
      soundEnabled: !soundEffects.getIsMuted(),
      theme: 'dark',
      hasSeenIntro: false,

      setDraftExcuse: (text: string) => {
        set({ draftExcuse: text });
      },

      openCase: async (excuseText?: string) => {
        const excuse = (excuseText ?? get().draftExcuse).trim();
        if (!excuse) return;

        soundEffects.playPaperSlide();
        set({
          status: 'investigating',
          errorMessage: null,
          investigationStepIndex: 0,
        });

        try {
          const caseFile = await ApiService.analyzeExcuse(
            { excuse },
            get().simulatedDelayMs
          );

          // Add to archives (avoid duplicates, max 30)
          const existing = get().archives.filter((c) => c.caseId !== caseFile.caseId);
          const updatedArchives = [caseFile, ...existing].slice(0, 30);

          soundEffects.playStampThud();
          setTimeout(() => {
            soundEffects.playTypewriterBell();
          }, 350);

          set({
            status: 'verdict',
            currentCase: caseFile,
            archives: updatedArchives,
            errorMessage: null,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown bureau anomaly occurred.';
          soundEffects.playPolygraphTick();
          set({
            status: 'error',
            errorMessage: message,
          });
        }
      },

      resetToInterrogation: () => {
        soundEffects.playPaperSlide();
        set({
          status: 'idle',
          currentCase: null,
          errorMessage: null,
        });
      },

      loadCaseFromArchive: (caseFile: CaseFile) => {
        soundEffects.playPaperSlide();
        set({
          status: 'verdict',
          currentCase: caseFile,
          draftExcuse: caseFile.suspectStatement,
          errorMessage: null,
        });
      },

      deleteFromArchives: (caseId: string) => {
        set((state) => ({
          archives: state.archives.filter((c) => c.caseId !== caseId),
        }));
      },

      clearArchives: () => {
        set({ archives: [] });
      },

      toggleSound: () => {
        const next = !get().soundEnabled;
        soundEffects.setMuted(!next);
        if (next) {
          soundEffects.playTypewriterKey();
        }
        set({ soundEnabled: next });
      },

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme: nextTheme });
      },

      dismissIntro: () => {
        set({ hasSeenIntro: true });
      },

      setSimulatedDelayMs: (ms: number) => {
        set({ simulatedDelayMs: ms });
      },

      setInvestigationStepIndex: (step: number) => {
        set({ investigationStepIndex: step });
      },
    }),
    {
      name: 'sorry-not-sorry-state',
      partialize: (state) => ({
        archives: state.archives,
        soundEnabled: state.soundEnabled,
        theme: state.theme,
        hasSeenIntro: state.hasSeenIntro,
      }),
    }
  )
);
