import React from 'react';
import { BookOpen, Video, Settings2 } from 'lucide-react';
import { MODES, FocusMode } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface ModeSelectorProps {
  currentMode: FocusMode;
  onModeSelect: (mode: FocusMode) => void;
}

const iconMap = {
  BookOpen: BookOpen,
  Video: Video,
  Settings2: Settings2,
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
      {(Object.values(MODES)).map((mode) => {
        const Icon = iconMap[mode.icon as keyof typeof iconMap];
        const isActive = currentMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onModeSelect(mode.id)}
            className={cn(
              "flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all",
              isActive
                ? "bg-primary/5 border-primary text-primary"
                : "bg-[var(--color-card-light)] dark:bg-white/5 border-[#E5E5E5] dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
              isActive ? "bg-primary text-white" : "bg-black/5 dark:bg-white/10"
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm text-[#0D0D0D] dark:text-white">{mode.name}</div>
              <div className="text-xs text-[#6E6E80] dark:text-white/50 mt-1">
                {mode.focusDuration}m focus / {mode.breakDuration}m break
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
