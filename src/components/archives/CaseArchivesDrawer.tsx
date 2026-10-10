import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderArchive,
  X,
  Trash2,
  Search,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';
import { CaseFile } from '../../types/case';
import { soundEffects } from '../../services/soundEffects';

interface CaseArchivesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseArchivesDrawer: React.FC<CaseArchivesDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    archives,
    loadCaseFromArchive,
    deleteFromArchives,
    clearArchives,
  } = useCaseStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');

  if (!isOpen) return null;

  const handleOpenCase = (c: CaseFile) => {
    soundEffects.playPaperSlide();
    loadCaseFromArchive(c);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundEffects.playTypewriterKey();
    deleteFromArchives(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Purge all forensic case records from this terminal?')) {
      soundEffects.playStampThud();
      clearArchives();
    }
  };

  const filteredCases = archives.filter((c) => {
    const matchesSearch =
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.suspectStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.verdict.stampText.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerdict =
      filterVerdict === 'ALL' || c.verdict.classification === filterVerdict;

    return matchesSearch && matchesVerdict;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
        {/* Click outside backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Slide-out drawer panel */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 22, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-paper-card border-l border-paper-edge shadow-noir-lg flex flex-col paper-grain z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archives-title"
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-paper-edge flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-brass" />
              <div>
                <h3 id="archives-title" className="font-typewriter font-bold text-base text-ink-rich uppercase">
                  Precinct Case Archives
                </h3>
                <p className="text-xs font-mono text-ink-faint">
                  {archives.length} Total Cases Filed
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded text-ink-faint hover:text-ink hover:bg-paper transition-colors"
              aria-label="Close archives drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-paper-edge space-y-3 bg-paper/40 dark:bg-paper-dark/40">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                placeholder="Search statements or case IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-paper-card border border-paper-edge rounded focus:outline-none focus:border-brass text-ink placeholder:text-ink-faint"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
              {['ALL', 'BUSTED', 'HIGHLY_SUSPECT', 'PLAUSIBLE'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterVerdict(tag)}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                    filterVerdict === tag
                      ? 'bg-brass text-paper-dark font-bold'
                      : 'bg-paper-card border border-paper-edge text-ink-faint hover:text-ink'
                  }`}
                >
                  {tag.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Archive Files List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredCases.length === 0 ? (
              <div className="text-center py-16 text-ink-faint space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-brass/60" />
                <p className="font-typewriter text-sm">No filed dossiers match your query.</p>
                <p className="font-mono text-xs text-ink-faint/70">
                  Submit an excuse on the intake desk to generate a record.
                </p>
              </div>
            ) : (
              filteredCases.map((c) => (
                <div
                  key={c.caseId}
                  onClick={() => handleOpenCase(c)}
                  className="p-3.5 bg-paper rounded border border-paper-edge hover:border-brass/70 cursor-pointer shadow-sm hover:shadow-folder transition-all group relative"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-typewriter font-bold text-xs text-ink-rich">
                      {c.caseId}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-evidence/40 text-evidence font-semibold">
                      {c.verdict.stampText}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-ink-light line-clamp-2 mb-2 italic">
                    &ldquo;{c.suspectStatement}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-ink-faint pt-1 border-t border-paper-edge/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(c.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-brass font-bold">
                        Score: {c.believabilityScore}/100
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, c.caseId)}
                        className="p-1 hover:text-evidence text-ink-faint transition-colors"
                        title="Delete case record"
                        aria-label="Delete case"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {archives.length > 0 && (
            <div className="p-3 border-t border-paper-edge bg-paper/50 dark:bg-paper-dark/50 flex justify-between items-center">
              <span className="text-[11px] font-mono text-ink-faint">
                Stored in local blotter
              </span>
              <button
                onClick={handleClearAll}
                className="text-xs font-mono text-evidence hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge Dossier</span>
              </button>
            </div>
          )}
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
