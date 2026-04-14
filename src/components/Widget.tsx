import React from 'react';
import { Play, Pause, Maximize2, Music, Music2 } from 'lucide-react';
import { formatTime, cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface WidgetProps {
  timeLeft: number;
  isActive: boolean;
  isBreak: boolean;
  modeName: string;
  onToggle: () => void;
  onExpand: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  showMusicControl: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
  timeLeft,
  isActive,
  isBreak,
  modeName,
  onToggle,
  onExpand,
  isMusicPlaying,
  onToggleMusic,
  showMusicControl,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "fixed bottom-6 right-6 w-56 h-20 glass-panel rounded-2xl flex items-center px-4 gap-3 cursor-move z-50",
        isBreak ? "border-green-500/30" : "border-primary/30"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0",
          isActive ? "bg-orange-500" : "bg-primary"
        )}
      >
        {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-xl font-bold tabular-nums leading-none text-[#4B5563] dark:text-white">
          {formatTime(timeLeft)}
        </div>
        <div className="text-[10px] font-medium text-[#4B5563]/50 dark:text-white/50 truncate mt-1">
          {isBreak ? 'Break' : modeName}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {showMusicControl && (
          <button
            onClick={onToggleMusic}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isMusicPlaying ? "text-primary bg-primary/10" : "text-[#4B5563] dark:text-white opacity-40 hover:opacity-100"
            )}
            title={isMusicPlaying ? "Stop Music" : "Play Music"}
          >
            {isMusicPlaying ? <Music2 className="w-4 h-4 animate-pulse" /> : <Music className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={onExpand}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-[#4B5563] dark:text-white"
        >
          <Maximize2 className="w-4 h-4 opacity-40" />
        </button>
      </div>
    </motion.div>
  );
};
