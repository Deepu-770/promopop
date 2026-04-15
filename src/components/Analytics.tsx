import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { Session, TodoTask, Settings } from '@/src/types';
import { calculateStreak, cn } from '@/src/lib/utils';
import { Flame, TreeDeciduous, XCircle, Target } from 'lucide-react';
import { HeatmapContainer } from './Heatmap/HeatmapContainer';

interface AnalyticsProps {
  sessions: Session[];
  tasks: TodoTask[];
  settings: Settings;
}

export const Analytics: React.FC<AnalyticsProps> = ({ sessions, tasks, settings }) => {
  const isTreeEnabled = settings.enableTreeGrowing;

  // Process data for the bar chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const daySessions = (sessions || []).filter(s => isSameDay(new Date(s.timestamp), date));
    const totalMinutes = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    const treesPlanted = daySessions.filter(s => s.treeGrown).length;
    return {
      name: format(date, 'EEE'),
      minutes: totalMinutes,
      trees: treesPlanted,
      date: format(date, 'MMM d'),
    };
  });

  // ... (rest of the component)

  // Process data for the heatmap (last 365 days)
  const heatmapData = Array.from({ length: 365 }, (_, i) => {
    const date = subDays(new Date(), 364 - i);
    const daySessions = (sessions || []).filter(s => isSameDay(new Date(s.timestamp), date));
    const totalMinutes = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    return { date, intensity: Math.min(Math.ceil(totalMinutes / 30), 4) }; // 0-4 intensity
  });

  const totalFocusTime = Math.round((sessions || []).reduce((acc, s) => acc + s.duration, 0) / 60);
  const totalSessions = (sessions || []).length;
  const streak = calculateStreak(sessions || []);
  const completedSessions = (sessions || []).filter(s => s.completed).length;
  const successRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Tree metrics
  const totalTrees = (sessions || []).filter(s => s.treeGrown).length;
  const failedTrees = (sessions || []).filter(s => s.completed && !s.treeGrown).length; // Simplified
  const avgQuality = (sessions || []).length > 0
    ? ((sessions || []).reduce((acc, s) => acc + (s.focusScore || 0), 0) / (sessions || []).length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 p-2 overflow-y-auto max-h-full scrollbar-hide">
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="text-sm font-medium text-white/50 mb-1">Total Focus Time</div>
          <div className="text-4xl font-bold text-white">{totalFocusTime} <span className="text-lg font-normal text-white/40">mins</span></div>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="text-sm font-medium text-white/50 mb-1">Success Rate</div>
          <div className="text-4xl font-bold text-white">{successRate}%</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="text-sm font-medium text-white/50 mb-1">Current Streak</div>
          <div className="flex items-center gap-2">
            {streak > 0 && <Flame className="w-6 h-6 text-orange-500 fill-current" />}
            <div className="text-4xl font-bold text-white">{streak} <span className="text-lg font-normal text-white/40">days</span></div>
          </div>
        </div>
      </div>

      {isTreeEnabled && (
        <div className="grid grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-4">
            <TreeDeciduous className="w-10 h-10 text-green-500" />
            <div>
              <div className="text-sm font-medium text-white/50">Trees Planted</div>
              <div className="text-3xl font-bold text-white">{totalTrees}</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-4">
            <XCircle className="w-10 h-10 text-red-500" />
            <div>
              <div className="text-sm font-medium text-white/50">Failed Trees</div>
              <div className="text-3xl font-bold text-white">{failedTrees}</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-4">
            <Target className="w-10 h-10 text-primary" />
            <div>
              <div className="text-sm font-medium text-white/50">Focus Quality</div>
              <div className="text-3xl font-bold text-white">{avgQuality}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-semibold mb-6 text-white">Weekly Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#007AFF" stopOpacity={1} />
                    <stop offset="100%" stopColor="#007AFF" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)', fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)', fontWeight: 500 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#2A2A2A] p-3 rounded-xl border border-white/10 shadow-xl">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">{payload[0].payload.date}</p>
                          <p className="text-sm font-bold text-white">{payload[0].value} mins focused</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]} barSize={32}>
                  {last7Days.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? 'url(#barGradient)' : 'rgba(255,255,255,0.05)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center space-y-6 border border-white/10">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute inset-0 w-full h-full">
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-white/[0.05]"
              />
            </svg>
            
            {/* Progress Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="url(#qualityGradient)"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - Number(avgQuality) / 5)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="qualityGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#007AFF" />
                  <stop offset="100%" stopColor="#5856D6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="flex flex-col items-center justify-center z-10">
              <div className="text-4xl font-bold text-white tracking-tighter">{avgQuality}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">/ 5.0</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-white">Focus Quality</h4>
            <p className="text-sm text-white/40 max-w-[200px]">Your average session rating based on daily reflections</p>
          </div>
        </div>
      </div>

      <HeatmapContainer sessions={sessions} tasks={tasks} />
    </div>
  );
};
