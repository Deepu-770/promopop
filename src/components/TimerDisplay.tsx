import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Flame, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatTime, cn } from '@/src/lib/utils';
import { TreeAnimation } from './TreeAnimation';

interface TimerDisplayProps {
  timeLeft: number;
  isActive: boolean;
  isBreak: boolean;
  progress: number;
  modeName: string;
  streak: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onMusicClick?: () => void;
  isMusicPlaying?: boolean;
  currentIntention?: string;
  enableTreeGrowing: boolean;
  onTreeGrown: () => void;
  onTreeDied: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isActive,
  isBreak,
  progress,
  modeName,
  streak,
  onStart,
  onPause,
  onReset,
  onMusicClick,
  isMusicPlaying,
  currentIntention,
  enableTreeGrowing,
  onTreeGrown,
  onTreeDied
}) => {
  const [timerMode, setTimerMode] = useState<'clock' | 'tree'>('clock');

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      {enableTreeGrowing && (
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full">
          <button
            onClick={() => setTimerMode('clock')}
            className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", timerMode === 'clock' ? "bg-primary text-white" : "text-white/40")}
          >
            Clock
          </button>
          <button
            onClick={() => setTimerMode('tree')}
            className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", timerMode === 'tree' ? "bg-primary text-white" : "text-white/40")}
          >
            Tree
          </button>
        </div>
      )}

      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 font-bold text-sm border border-orange-500/20"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Flame className="w-4 h-4 fill-current" />
          </motion.div>
          <span>{streak} Day Streak</span>
          
          {/* Subtle Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-500/20 blur-md -z-10"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      )}

      {currentIntention && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1 text-xs font-bold text-primary uppercase tracking-[0.2em]">
            <Brain className="w-4 h-4" />
            <span>Intention</span>
          </div>
          <div className="text-lg font-bold text-[#0D0D0D] dark:text-white">{currentIntention}</div>
        </div>
      )}

      {timerMode === 'tree' && enableTreeGrowing ? (
        <TreeAnimation
          isActive={isActive}
          duration={timeLeft}
          onComplete={onTreeGrown}
          onDie={onTreeDied}
        />
      ) : (
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Progress Circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="130"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-black/[0.03] dark:text-white/5"
            />
            <motion.circle
              cx="144"
              cy="144"
              r="130"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="816.8"
              initial={{ strokeDashoffset: 816.8 }}
              animate={{ strokeDashoffset: 816.8 * (1 - progress) }}
              transition={{ duration: 1, ease: "linear" }}
              className={cn(
                "transition-colors duration-500",
                isBreak ? "text-green-500" : "text-primary"
              )}
            />
          </svg>

          <div className="text-center z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={isBreak ? 'break' : 'focus'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-center gap-2 mb-3 text-xs font-bold text-[#6E6E80] dark:text-white/50 uppercase tracking-[0.2em]"
              >
                {isBreak ? (
                  <>
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Break Time</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-3.5 h-3.5" />
                    <span>Focusing</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="text-8xl font-bold tabular-nums tracking-tighter text-[#0D0D0D] dark:text-white">
              {formatTime(timeLeft)}
            </div>
            <div className="mt-3 text-xs font-bold text-[#6E6E80]/40 dark:text-white/30 uppercase tracking-widest">{modeName}</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-6">
        <button
          onClick={onReset}
          className="p-5 rounded-full bg-black/[0.03] dark:bg-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-all text-[#0D0D0D] dark:text-white active:scale-90"
          title="Reset"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <button
          onClick={isActive ? onPause : onStart}
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all active:scale-95",
            isActive 
              ? "bg-orange-500 text-white border-orange-400 hover:bg-orange-600" 
              : "bg-primary text-white border-primary/20 hover:bg-primary/90"
          )}
        >
          {isActive ? (
            <Pause className="w-10 h-10 fill-current" />
          ) : (
            <Play className="w-10 h-10 fill-current ml-1" />
          )}
        </button>

        <button
          onClick={onMusicClick}
          className={cn(
            "p-5 rounded-full transition-all active:scale-90 relative",
            isMusicPlaying 
              ? "bg-primary/20 text-primary border border-primary/20" 
              : "bg-black/[0.03] dark:bg-white/5 hover:bg-black/[0.06] dark:hover:bg-white/10 text-[#0D0D0D] dark:text-white"
          )}
          title="Lo-fi Music"
        >
          <Music className="w-6 h-6" />
          {isMusicPlaying && (
            <motion.div
              layoutId="music-glow"
              className="absolute inset-0 rounded-full bg-primary/20 blur-md -z-10"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </button>
      </div>
    </div>
  );
};
