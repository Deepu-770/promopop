import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { Session } from '@/src/types';
import { calculateStreak, cn } from '@/src/lib/utils';
import { Flame } from 'lucide-react';

interface AnalyticsProps {
  sessions: Session[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ sessions }) => {
  // Process data for the bar chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const daySessions = (sessions || []).filter(s => isSameDay(new Date(s.timestamp), date));
    const totalMinutes = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    return {
      name: format(date, 'EEE'),
      minutes: totalMinutes,
      date: format(date, 'MMM d'),
    };
  });

  // Process data for the heatmap (last 30 days)
  const heatmapData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const daySessions = (sessions || []).filter(s => isSameDay(new Date(s.timestamp), date));
    const totalMinutes = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    return { date, intensity: Math.min(Math.ceil(totalMinutes / 30), 4) }; // 0-4 intensity
  });

  const totalFocusTime = Math.round((sessions || []).reduce((acc, s) => acc + s.duration, 0) / 60);
  const totalSessions = (sessions || []).length;
  const streak = calculateStreak(sessions || []);

  // Comparison vs Last Week
  const thisWeekMinutes = last7Days.reduce((acc, d) => acc + d.minutes, 0);
  const lastWeekMinutes = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const daySessions = (sessions || []).filter(s => isSameDay(new Date(s.timestamp), date));
    return Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
  }).reduce((acc, m) => acc + m, 0);

  const improvement = lastWeekMinutes > 0 
    ? Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100)
    : 0;

  // Focus Consistency Score (0-100)
  const activeDaysLast30 = new Set(
    (sessions || [])
      .filter(s => new Date(s.timestamp) > subDays(new Date(), 30))
      .map(s => format(new Date(s.timestamp), 'yyyy-MM-dd'))
  ).size;
  const consistencyScore = Math.round((activeDaysLast30 / 30) * 100);

  // Average Session Quality
  const avgQuality = (sessions || []).length > 0
    ? ((sessions || []).reduce((acc, s) => acc + (s.focusScore || 0), 0) / (sessions || []).length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 p-2 overflow-y-auto max-h-full">
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-[#E5E5E5] dark:border-white/10">
          <div className="text-sm font-medium text-[#6E6E80] dark:text-white/50 mb-1">Total Focus Time</div>
          <div className="text-4xl font-bold text-[#0D0D0D] dark:text-white">{totalFocusTime} <span className="text-lg font-normal text-[#6E6E80]">mins</span></div>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-[#E5E5E5] dark:border-white/10">
          <div className="text-sm font-medium text-[#6E6E80] dark:text-white/50 mb-1">Weekly Progress</div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold text-[#0D0D0D] dark:text-white">{thisWeekMinutes} <span className="text-lg font-normal text-[#6E6E80]">m</span></div>
            <div className={cn(
              "text-sm font-bold flex items-center gap-0.5",
              improvement >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {improvement >= 0 ? '+' : ''}{improvement}%
              <span className="text-[10px] text-[#6E6E80] dark:text-white/50 font-normal ml-1">vs last week</span>
            </div>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-[#E5E5E5] dark:border-white/10">
          <div className="text-sm font-medium text-[#6E6E80] dark:text-white/50 mb-1">Current Streak</div>
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold text-[#0D0D0D] dark:text-white">{streak} <span className="text-lg font-normal text-[#6E6E80]">days</span></div>
            {streak > 0 && <Flame className="w-6 h-6 text-orange-500 fill-current" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-[#E5E5E5] dark:border-white/10">
          <h3 className="text-lg font-semibold mb-6">Weekly Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, opacity: 0.5 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, opacity: 0.5 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: 'none' }}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {last7Days.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? '#007AFF' : 'rgba(0,0,0,0.05)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center space-y-4 border border-[#E5E5E5] dark:border-white/10">
          <div className="w-24 h-24 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
            <div className="text-3xl font-bold text-[#0D0D0D] dark:text-white">{avgQuality}</div>
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - Number(avgQuality) / 5)}
                className="text-primary transition-all duration-1000"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#0D0D0D] dark:text-white">Focus Quality</h4>
            <p className="text-sm text-[#6E6E80]">Your average session rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};
