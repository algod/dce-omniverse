'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, ArrowRight, Command, 
  Users, TrendingUp, FileCheck, Brain, Lightbulb, HeadphonesIcon,
  Home, Settings, HelpCircle, BarChart, Zap, History, Star,
  ChevronRight, Hash, FileText, Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { zsColors } from '@/lib/design-system/zs-colors';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: any;
  category: 'navigation' | 'agent' | 'action' | 'help' | 'recent';
  action: () => void;
  shortcut?: string;
  keywords?: string[];
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const router = useRouter();

  // Command items
  const commands = useMemo<CommandItem[]>(() => [
    // Navigation
    {
      id: 'home',
      title: 'Go to Dashboard',
      description: 'Agent-verse overview',
      icon: Home,
      category: 'navigation',
      action: () => router.push('/'),
      shortcut: '⌘H',
      keywords: ['home', 'dashboard', 'overview', 'flow']
    },
    // Agents
    {
      id: 'customer-agent',
      title: 'Customer Planning Agent',
      description: 'Barrier analysis & HCP prioritization',
      icon: Users,
      category: 'agent',
      action: () => router.push('/agents/customer'),
      shortcut: '⌘1',
      keywords: ['customer', 'hcp', 'barrier', 'planning']
    },
    {
      id: 'budget-agent',
      title: 'Budget Planning Agent',
      description: 'Multi-channel ROI optimization',
      icon: TrendingUp,
      category: 'agent',
      action: () => router.push('/agents/budget'),
      shortcut: '⌘2',
      keywords: ['budget', 'roi', 'optimization', 'allocation']
    },
    {
      id: 'content-agent',
      title: 'Content Review Agent',
      description: 'MLR compliance & content strategy',
      icon: FileCheck,
      category: 'agent',
      action: () => router.push('/agents/content'),
      shortcut: '⌘3',
      keywords: ['content', 'mlr', 'compliance', 'review']
    },
    {
      id: 'orchestration-agent',
      title: 'AI Orchestration Agent',
      description: 'Customer journey optimization & NBA',
      icon: Brain,
      category: 'agent',
      action: () => router.push('/agents/orchestration'),
      shortcut: '⌘4',
      keywords: ['orchestration', 'journey', 'nba', 'ai']
    },
    {
      id: 'suggestions-agent',
      title: 'Field Suggestions Agent',
      description: 'Intelligent trigger-based recommendations',
      icon: Lightbulb,
      category: 'agent',
      action: () => router.push('/agents/suggestions'),
      shortcut: '⌘5',
      keywords: ['suggestions', 'field', 'triggers', 'recommendations']
    },
    {
      id: 'copilot-agent',
      title: 'Field Copilot Agent',
      description: 'AI-powered rep assistance & coaching',
      icon: HeadphonesIcon,
      category: 'agent',
      action: () => router.push('/agents/copilot'),
      shortcut: '⌘6',
      keywords: ['copilot', 'field', 'rep', 'coaching', 'assistance']
    },
    // Actions
    {
      id: 'run-analysis',
      title: 'Run Analysis',
      description: 'Execute current agent analysis',
      icon: Zap,
      category: 'action',
      action: () => console.log('Run analysis'),
      shortcut: '⌘R',
      keywords: ['run', 'execute', 'analyze', 'process']
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download visualizations and data',
      icon: FileText,
      category: 'action',
      action: () => console.log('Export data'),
      shortcut: '⌘E',
      keywords: ['export', 'download', 'save', 'csv', 'pdf']
    },
    {
      id: 'view-metrics',
      title: 'View Metrics',
      description: 'Performance dashboards',
      icon: BarChart,
      category: 'action',
      action: () => console.log('View metrics'),
      keywords: ['metrics', 'performance', 'kpi', 'dashboard']
    },
    {
      id: 'activity-log',
      title: 'Activity Log',
      description: 'View recent activities',
      icon: Activity,
      category: 'action',
      action: () => console.log('Activity log'),
      keywords: ['activity', 'log', 'history', 'recent']
    },
    // Help
    {
      id: 'help',
      title: 'Help & Documentation',
      description: 'View guides and tutorials',
      icon: HelpCircle,
      category: 'help',
      action: () => console.log('Open help'),
      shortcut: '⌘?',
      keywords: ['help', 'docs', 'documentation', 'guide', 'tutorial']
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure preferences',
      icon: Settings,
      category: 'help',
      action: () => console.log('Open settings'),
      shortcut: '⌘,',
      keywords: ['settings', 'preferences', 'config', 'configuration']
    }
  ], [router]);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search) {
      // Show recent commands first when no search
      const recentItems = recentCommands
        .map(id => commands.find(cmd => cmd.id === id))
        .filter(Boolean) as CommandItem[];
      
      const otherItems = commands.filter(
        cmd => !recentCommands.includes(cmd.id)
      );
      
      return [...recentItems, ...otherItems];
    }

    const searchLower = search.toLowerCase();
    return commands.filter(cmd => 
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  }, [search, commands, recentCommands]);

  // Grouped commands for display
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      recent: [],
      navigation: [],
      agent: [],
      action: [],
      help: []
    };

    filteredCommands.forEach(cmd => {
      if (!search && recentCommands.includes(cmd.id)) {
        groups.recent.push(cmd);
      } else {
        groups[cmd.category].push(cmd);
      }
    });

    return groups;
  }, [filteredCommands, search, recentCommands]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      if (!isOpen) return;

      // Close palette
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      // Navigate
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      }

      // Execute
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      }

      // Direct shortcuts when palette is closed
      if (!isOpen) {
        const shortcutCommand = commands.find(cmd => {
          if (!cmd.shortcut) return false;
          const shortcutKey = cmd.shortcut.replace('⌘', '');
          return (e.metaKey || e.ctrlKey) && e.key === shortcutKey;
        });

        if (shortcutCommand) {
          e.preventDefault();
          executeCommand(shortcutCommand);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, commands]);

  // Execute command
  const executeCommand = useCallback((command: CommandItem) => {
    // Add to recent commands
    setRecentCommands(prev => {
      const updated = [command.id, ...prev.filter(id => id !== command.id)];
      return updated.slice(0, 5); // Keep only 5 recent
    });

    // Execute action
    command.action();
    
    // Close palette
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  }, []);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:shadow-xl z-40"
        style={{
          backgroundColor: zsColors.primary.navy,
          color: zsColors.neutral.white
        }}
      >
        <Command size={16} />
        <span className="text-sm font-medium">Command</span>
        <kbd className="px-1.5 py-0.5 text-xs rounded"
          style={{
            backgroundColor: zsColors.neutral.white + '20',
            border: `1px solid ${zsColors.neutral.white}30`
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[640px] max-w-[90vw] max-h-[60vh] rounded-xl shadow-2xl overflow-hidden z-50"
              style={{
                backgroundColor: zsColors.neutral.white,
                border: `1px solid ${zsColors.neutral.lightGray}`
              }}
            >
              {/* Search Header */}
              <div className="px-4 py-3 flex items-center gap-3"
                style={{ borderBottom: `1px solid ${zsColors.neutral.lightGray}` }}
              >
                <Search size={20} style={{ color: zsColors.neutral.gray }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 outline-none text-base"
                  style={{ color: zsColors.neutral.charcoal }}
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <X size={18} style={{ color: zsColors.neutral.gray }} />
                </button>
              </div>

              {/* Commands List */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(60vh - 60px)' }}>
                {Object.entries(groupedCommands).map(([category, items]) => {
                  if (items.length === 0) return null;

                  return (
                    <div key={category}>
                      {/* Category Header */}
                      {(category !== 'recent' || search === '') && (
                        <div className="px-4 py-2 text-xs font-semibold uppercase"
                          style={{ 
                            color: zsColors.neutral.gray,
                            backgroundColor: zsColors.neutral.offWhite
                          }}
                        >
                          {category === 'recent' ? 'Recent' : 
                           category === 'agent' ? 'Agents' :
                           category.charAt(0).toUpperCase() + category.slice(1)}
                        </div>
                      )}

                      {/* Category Items */}
                      {items.map((command, index) => {
                        const globalIndex = filteredCommands.indexOf(command);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <motion.div
                            key={command.id}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            onClick={() => executeCommand(command)}
                            className="px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors"
                            style={{
                              backgroundColor: isSelected ? zsColors.neutral.offWhite : 'transparent'
                            }}
                            whileHover={{ x: 2 }}
                          >
                            {/* Icon */}
                            {command.icon && (
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor: isSelected ? 
                                    zsColors.primary.blue + '15' : 
                                    zsColors.neutral.lightGray + '30',
                                  color: isSelected ? 
                                    zsColors.primary.blue : 
                                    zsColors.neutral.gray
                                }}
                              >
                                <command.icon size={18} />
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1">
                              <div className="font-medium text-sm"
                                style={{ color: zsColors.neutral.charcoal }}
                              >
                                {command.title}
                                {category === 'recent' && (
                                  <Star size={12} className="inline ml-2" 
                                    style={{ color: zsColors.secondary.orange }} 
                                  />
                                )}
                              </div>
                              {command.description && (
                                <div className="text-xs mt-0.5"
                                  style={{ color: zsColors.neutral.gray }}
                                >
                                  {command.description}
                                </div>
                              )}
                            </div>

                            {/* Shortcut or Arrow */}
                            {command.shortcut ? (
                              <kbd className="px-2 py-1 text-xs rounded"
                                style={{
                                  backgroundColor: zsColors.neutral.lightGray + '50',
                                  border: `1px solid ${zsColors.neutral.lightGray}`,
                                  color: zsColors.neutral.darkGray
                                }}
                              >
                                {command.shortcut}
                              </kbd>
                            ) : (
                              <ChevronRight size={16} 
                                style={{ 
                                  color: zsColors.neutral.gray,
                                  opacity: isSelected ? 1 : 0.3
                                }} 
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* No results */}
                {filteredCommands.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <div className="text-sm" style={{ color: zsColors.neutral.gray }}>
                      No results found for &ldquo;{search}&rdquo;
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 flex items-center justify-between text-xs"
                style={{ 
                  borderTop: `1px solid ${zsColors.neutral.lightGray}`,
                  backgroundColor: zsColors.neutral.offWhite,
                  color: zsColors.neutral.gray
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: zsColors.neutral.white,
                        border: `1px solid ${zsColors.neutral.lightGray}`
                      }}
                    >↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: zsColors.neutral.white,
                        border: `1px solid ${zsColors.neutral.lightGray}`
                      }}
                    >↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded text-xs"
                      style={{
                        backgroundColor: zsColors.neutral.white,
                        border: `1px solid ${zsColors.neutral.lightGray}`
                      }}
                    >esc</kbd>
                    Close
                  </span>
                </div>
                <div>
                  DCE OmniVerse Command
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}