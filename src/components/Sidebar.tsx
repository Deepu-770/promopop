import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BarChart2, Settings, Layers, Calendar, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { TodoPanel } from './TodoPanel';
import { TodoTask } from '../types';

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
  onStartFromTask
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
                className="ml-3 text-lg font-bold tracking-tight truncate flex-1 text-[#0D0D0D] dark:text-white"
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
                ? "bg-white dark:bg-primary/20 text-primary font-bold border border-[#E5E5E5] dark:border-white/5" 
                : "hover:bg-white/60 dark:hover:bg-white/5 text-[#6E6E80] hover:text-[#0D0D0D] dark:text-white/60 dark:hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "opacity-100" : "opacity-60")} />
            <motion.span 
              animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
              className="ml-4 truncate font-bold text-sm"
            >
              {item.label}
            </motion.span>
          </button>
        ))}

        <div className={cn(
          "pt-4 transition-opacity duration-300",
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
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
        <div className="flex items-center h-11 w-full px-[10px] text-[#6E6E80] dark:text-white/40">
          <motion.span 
            animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
            className="truncate text-[10px] font-bold uppercase tracking-widest"
          >
            Promograd v1.0
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};
