import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderArchive,
  X,
  Trash2,
  Search,
  Calendar,
  AlertTriangle,
  Flame,
  CornerDownLeft,
  RefreshCw,
} from 'lucide-react';
import { useCaseStore } from '../../store/caseStore';
import { CaseFile, ShameItem } from '../../types/case';
import { ApiService } from '../../services/apiService';
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
    setDraftExcuse,
  } = useCaseStore();

  const [activeTab, setActiveTab] = useState<'dossier' | 'shame'>('dossier');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<string>('ALL');

  // Wall of Shame state (from GET ${base}/shame)
  const [shameItems, setShameItems] = useState<ShameItem[]>([]);
  const [isLoadingShame, setIsLoadingShame] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'shame') {
      loadShameItems();
    }
  }, [isOpen, activeTab]);

  const loadShameItems = async () => {
    setIsLoadingShame(true);
    try {
      const data = await ApiService.getWallOfShame();
      setShameItems(data.items);
    } catch {
      // fallback
    } finally {
      setIsLoadingShame(false);
    }
  };

  if (!isOpen) return null;

  const handleOpenCase = (c: CaseFile) => {
    soundEffects.playPaperSlide();
    loadCaseFromArchive(c);
    onClose();
  };

  const handleSelectShameExcuse = (excuse: string) => {
    soundEffects.playTypewriterKey();
    setDraftExcuse(excuse);
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

  const filteredShame = shameItems.filter((item) => {
    const matchesSearch = item.excuse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVerdict = filterVerdict === 'ALL' || item.verdict === filterVerdict;
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
                  Precinct Archives &amp; Records
                </h3>
                <p className="text-xs font-mono text-ink-faint">
                  {activeTab === 'dossier'
                    ? `${archives.length} Local Cases Stored`
                    : `${shameItems.length} Public Entries on Wall of Shame`}
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

          {/* Tab Selector: Local Dossier vs Wall of Shame */}
          <div className="grid grid-cols-2 border-b border-paper-edge text-xs font-mono">
            <button
              onClick={() => setActiveTab('dossier')}
              className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-r border-paper-edge ${
                activeTab === 'dossier'
                  ? 'bg-paper text-ink font-bold border-b-2 border-b-brass'
                  : 'bg-paper/40 text-ink-faint hover:text-ink'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Local Dossier ({archives.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('shame')}
              className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'shame'
                  ? 'bg-paper text-evidence font-bold border-b-2 border-b-evidence'
                  : 'bg-paper/40 text-ink-faint hover:text-ink'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-evidence" />
              <span>Wall of Shame (/shame)</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-paper-edge space-y-2.5 bg-paper/30 dark:bg-paper-dark/30">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                placeholder={activeTab === 'dossier' ? "Search statements or case IDs..." : "Filter Wall of Shame..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-paper-card border border-paper-edge rounded focus:outline-none focus:border-brass text-ink placeholder:text-ink-faint"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
              {['ALL', 'BUSTED', 'SUSPICIOUS', 'PLAUSIBLE', 'CREDIBLE'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterVerdict(tag)}
                  className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap text-[10px] ${
                    filterVerdict === tag
                      ? 'bg-brass text-paper-dark font-bold'
                      : 'bg-paper-card border border-paper-edge text-ink-faint hover:text-ink'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Archive / Shame List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'dossier' ? (
              // LOCAL DOSSIER TAB
              filteredCases.length === 0 ? (
                <div className="text-center py-16 text-ink-faint space-y-2">
                  <AlertTriangle className="w-8 h-8 mx-auto text-brass/60" />
                  <p className="font-typewriter text-sm">No local case records found.</p>
                  <p className="font-mono text-xs text-ink-faint/70">
                    Interrogate an excuse on the intake desk to generate a docket.
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
              )
            ) : (
              // WALL OF SHAME TAB (from GET /shame)
              isLoadingShame ? (
                <div className="text-center py-16 text-ink-faint space-y-2">
                  <RefreshCw className="w-6 h-6 mx-auto text-brass animate-spin" />
                  <p className="font-mono text-xs">Retrieving Wall of Shame from precinct records...</p>
                </div>
              ) : filteredShame.length === 0 ? (
                <div className="text-center py-16 text-ink-faint space-y-2">
                  <Flame className="w-8 h-8 mx-auto text-evidence/60" />
                  <p className="font-typewriter text-sm">No entries on the Wall of Shame.</p>
                </div>
              ) : (
                filteredShame.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-paper rounded border border-paper-edge hover:border-evidence/60 shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-evidence uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {item.verdict}
                      </span>
                      <span className="text-[10px] font-mono text-brass font-bold">
                        Score: {item.believability}/100
                      </span>
                    </div>

                    <p className="font-mono text-xs text-ink-rich mb-2.5 italic">
                      &ldquo;{item.excuse}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-paper-edge/50 text-[10px] font-mono text-ink-faint">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleSelectShameExcuse(item.excuse)}
                        className="inline-flex items-center gap-1 text-brass hover:text-ink font-semibold"
                        title="Load this excuse onto interrogation desk"
                      >
                        <span>Interrogate</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Drawer Footer */}
          {activeTab === 'dossier' && archives.length > 0 && (
            <div className="p-3 border-t border-paper-edge bg-paper/50 dark:bg-paper-dark/50 flex justify-between items-center">
              <span className="text-[11px] font-mono text-ink-faint">
                Stored in local blotter
              </span>
              <button
                onClick={handleClearAll}
                className="text-xs font-mono text-evidence hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge Local Dossier</span>
              </button>
            </div>
          )}
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
