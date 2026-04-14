import React, { useMemo, useState } from 'react';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { Session, TodoTask } from '../../types';
import { getHeatmapData, calculateStreaks, getIntensity, HeatmapMetric } from '../../lib/heatmapUtils';
import { HeatmapCell } from './HeatmapCell';
import { StreakStats } from './StreakStats';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface HeatmapContainerProps {
  sessions: Session[];
  tasks: TodoTask[];
}

export const HeatmapContainer: React.FC<HeatmapContainerProps> = ({ sessions, tasks }) => {
  const [metric, setMetric] = useState<HeatmapMetric>('sessions');

  const { data, streaks, maxCount } = useMemo(() => {
    const heatmapData = getHeatmapData(sessions, tasks, metric);
    const streakData = calculateStreaks(heatmapData);
    const max = Math.max(...Array.from(heatmapData.values()), 1);
    return { data: heatmapData, streaks: streakData, maxCount: max };
  }, [sessions, tasks, metric]);

  const weeks = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 364);
    const firstMonday = startOfWeek(startDate, { weekStartsOn: 1 });
    
    const allDays = eachDayOfInterval({ start: firstMonday, end: endDate });
    const weekChunks: Date[][] = [];
    
    for (let i = 0; i < allDays.length; i += 7) {
      weekChunks.push(allDays.slice(i, i + 7));
    }
    
    return weekChunks;
  }, []);

  const metricLabels: Record<HeatmapMetric, string> = {
    sessions: 'sessions',
    hours: 'hours',
    tasks: 'tasks completed'
  };

  const monthLabels = useMemo(() => {
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, i) => {
      const month = week[0].getMonth();
      if (month !== lastMonth) {
        labels.push({ label: format(week[0], 'MMM'), index: i });
        lastMonth = month;
      }
    });
    
    return labels;
  }, [weeks]);

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white">Focus Consistency</h3>
          <p className="text-sm text-white/40">Your productivity over the last year</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {(['sessions', 'hours', 'tasks'] as HeatmapMetric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                metric === m ? "bg-primary text-white shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <StreakStats currentStreak={streaks.current} longestStreak={streaks.longest} />

      <div className="flex gap-4">
        {/* Day Labels */}
        <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-white/20 uppercase tracking-tighter h-[100px] mt-6">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* Heatmap Grid with Labels */}
        <div className="flex-1 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, weekIndex) => {
              const monthLabel = monthLabels.find(m => m.index === weekIndex);
              
              return (
                <div key={weekIndex} className="flex flex-col gap-1 shrink-0">
                  {/* Month Label */}
                  <div className="h-6 relative">
                    {monthLabel && (
                      <span className="absolute left-0 bottom-1 text-[10px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">
                        {monthLabel.label}
                      </span>
                    )}
                  </div>

                  {/* Week Column */}
                  {week.map((day, dayIndex) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const count = data.get(dateKey) || 0;
                    const intensity = getIntensity(count, maxCount);
                    
                    return (
                      <HeatmapCell
                        key={dayIndex}
                        date={format(day, 'MMM d, yyyy')}
                        count={count}
                        intensity={intensity}
                        label={metricLabels[metric]}
                        metric={metric}
                        rowIndex={dayIndex}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-[10px] text-white/20 font-medium">Learn how we count contributions</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-[2px] bg-white/5" />
              <div className="w-3 h-3 rounded-[2px] bg-[#0e4429]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#006d32]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#26a641]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#39d353]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">More</span>
          </div>
        </div>
      </div>
  );
};
