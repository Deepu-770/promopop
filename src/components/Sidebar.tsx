import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BarChart2, Settings, Layers, Calendar, PanelLeftClose, PanelLeftOpen, Github, Play, Pause, Square, Music, Heart, RefreshCw } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { TodoPanel } from './TodoPanel';
import { TodoTask } from '../types';
import { LOFI_TRACKS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPinned: boolean;
  setIsPinned: (v: boolean) => void;
  tasks: TodoTask[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStartFromTask: (task: TodoTask) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (v: boolean) => void;
  selectedMusic: string;
  onSelectMusic: (id: string) => void;
  likedTracks: string[];
  dislikedTracks: string[];
  onLikeMusic: (id: string) => void;
  onRefreshMusic: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isPinned,
  setIsPinned,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onStartFromTask,
  isMusicPlaying,
  setIsMusicPlaying,
  selectedMusic,
  onSelectMusic,
  likedTracks,
  dislikedTracks,
  onLikeMusic,
  onRefreshMusic
}) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'modes', icon: Layers, label: 'Modes' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'review', icon: Calendar, label: 'Daily Review' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned;

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        width: isExpanded ? 260 : 64,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "h-full flex flex-col border-r border-[#E5E5E5] dark:border-white/5 transition-colors duration-300 overflow-hidden shrink-0",
        "bg-[var(--color-sidebar-light)] dark:bg-[#171717]"
      )}
    >
      {/* Header / Logo / Toggle */}
      <div className="h-20 flex items-center px-[16px] shrink-0 relative">
        <AnimatePresence mode="wait">
          {(!isExpanded) ? (
            <motion.div 
              key="collapsed-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              {isHovered ? (
                <button
                  onClick={handleTogglePin}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/5 transition-colors text-primary"
                  title="Open Sidebar"
                >
                  <PanelLeftOpen className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <Layers className="text-white w-4 h-4" />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="expanded-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center w-full"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <Layers className="text-white w-4 h-4" />
              </div>
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3 text-lg font-normal tracking-tight truncate flex-1 text-[#0D0D0D] dark:text-white"
              >
                Promograd
              </motion.h1>
              
              <button
                onClick={handleTogglePin}
                className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors text-[#4B5563]/40 hover:text-[#4B5563] dark:text-white/40 dark:hover:text-white"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[12px] space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center h-11 w-full rounded-xl transition-all duration-200 px-[10px]",
              activeTab === item.id 
                ? "bg-white dark:bg-primary/20 text-primary font-normal border border-[#E5E5E5] dark:border-white/5" 
                : "hover:bg-white/60 dark:hover:bg-white/5 text-[#6E6E80] hover:text-[#0D0D0D] dark:text-white/60 dark:hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "opacity-100" : "opacity-60")} />
            <motion.span 
              animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
              className="ml-4 truncate font-normal text-sm"
            >
              {item.label}
            </motion.span>
          </button>
        ))}

        <div className={cn(
          "pt-4 transition-opacity duration-300",
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          {/* Music Player Section */}
          <div className="mb-6 px-2">
            <div className="flex items-center gap-2 mb-3 opacity-40">
              <Music className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Lo-fi Player</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={selectedMusic}
                  onChange={(e) => onSelectMusic(e.target.value)}
                  className="flex-1 bg-white/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl px-3 py-2 outline-none text-[10px] font-bold text-[#0D0D0D] dark:text-white/80 hover:bg-white/10 transition-all cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '0.8rem' }}
                >
                  {LOFI_TRACKS.filter(t => !dislikedTracks.includes(t.id)).map(track => (
                    <option key={track.id} value={track.id} className="bg-white dark:bg-[#1A1A1A] text-[#0D0D0D] dark:text-white">
                      {track.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onLikeMusic(selectedMusic)}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-xl transition-all border",
                    likedTracks.includes(selectedMusic)
                      ? "bg-red-500/10 border-red-500/20 text-red-500"
                      : "bg-black/5 dark:bg-white/5 border-transparent text-[#6E6E80] dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10"
                  )}
                  title="Like Track"
                >
                  <Heart className={cn("w-3.5 h-3.5", likedTracks.includes(selectedMusic) && "fill-current")} />
                </button>
                <button
                  onClick={onRefreshMusic}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-[#6E6E80] dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-transparent"
                  title="Not for me (Refresh)"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                  className="flex-1 flex items-center justify-center gap-2 h-9 rounded-xl bg-primary text-white hover:opacity-90 transition-all shadow-sm"
                >
                  {isMusicPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Play</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsMusicPlaying(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-[#6E6E80] dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                  title="Stop Music"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          <TodoPanel
            tasks={tasks}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onStartFromTask={onStartFromTask}
            isCollapsed={!isExpanded}
          />
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="px-[12px] py-4 space-y-1 border-t border-black/5 dark:border-white/5 shrink-0">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center h-11 w-full px-[10px] text-[#6E6E80] dark:text-white/40 hover:text-primary transition-colors group"
        >
          <Github className="w-5 h-5 shrink-0" />
          <motion.span 
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
            className="ml-4 truncate text-[10px] font-normal uppercase tracking-widest"
          >
            GitHub Repo
          </motion.span>
        </a>
      </div>
    </motion.div>
  );
};
