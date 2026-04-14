import React from 'react';
import { Flame, Trophy } from 'lucide-react';

interface StreakStatsProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakStats: React.FC<StreakStatsProps> = ({ currentStreak, longestStreak }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Flame className="w-5 h-5 text-orange-500 fill-current" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Streak</div>
          <div className="text-xl font-bold text-white">{currentStreak} days</div>
        </div>
      </div>
      <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Longest Streak</div>
          <div className="text-xl font-bold text-white">{longestStreak} days</div>
        </div>
      </div>
    </div>
  );
};
