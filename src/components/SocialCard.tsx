import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Brain, Clock, Calendar, Download, X, Share2, Award, Zap, Trophy } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
import { toPng } from 'html-to-image';
import { Session } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface SocialCardProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  totalTime: number;
  sessions: Session[];
}

export const SocialCard: React.FC<SocialCardProps> = ({
  isOpen,
  onClose,
  streak,
  totalTime,
  sessions,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#F2F2F7' // Force light background for export consistency
      });
      const link = document.createElement('a');
      link.download = `promograd-milestone-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  // Calculate average attention span (avg session duration)
  const avgDuration = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length / 60)
    : 0;

  // Calculate Focus Score (avg focus score)
  const avgScore = sessions.length > 0
    ? (sessions.reduce((acc, s) => acc + (s.focusScore || 0), 0) / sessions.length).toFixed(1)
    : 0;

  // Heatmap for the card (last 14 days)
  const heatmapData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const daySessions = sessions.filter(s => {
      const sDate = new Date(s.timestamp);
      return sDate.getFullYear() === date.getFullYear() &&
             sDate.getMonth() === date.getMonth() &&
             sDate.getDate() === date.getDate();
    });
    const totalMinutes = Math.round(daySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
    return { intensity: Math.min(Math.ceil(totalMinutes / 30), 4) };
  });

  // Achievement Badges
  const badges = [
    { id: 'streak', icon: Flame, label: `${streak} Day Streak`, active: streak >= 3, color: 'text-orange-500' },
    { id: 'focus', icon: Zap, label: 'Deep Focus', active: totalTime >= 300, color: 'text-yellow-500' },
    { id: 'master', icon: Trophy, label: 'Focus Master', active: sessions.length >= 20, color: 'text-primary' },
  ];

  const weeklyTime = Math.round((sessions || [])
    .filter(s => new Date(s.timestamp) > subDays(new Date(), 7))
    .reduce((acc, s) => acc + s.duration, 0) / 60);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-w-md w-full"
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div 
              ref={cardRef}
              className="bg-[#F2F2F7] p-8 rounded-[40px] border border-black/5 overflow-hidden relative text-black"
            >
              {/* Background Accents */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Brain className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-black">Promograd</span>
                  </div>
                  <div className="text-xs font-bold opacity-40 uppercase tracking-widest text-black">
                    {format(new Date(), 'MMMM yyyy')}
                  </div>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-black/5">
                    <div className="flex items-center gap-2 text-orange-500 mb-1">
                      <Flame className="w-4 h-4 fill-current" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Streak</span>
                    </div>
                    <div className="text-3xl font-bold text-black">{streak} <span className="text-sm font-normal opacity-40">days</span></div>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-black/5">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Focus</span>
                    </div>
                    <div className="text-3xl font-bold text-black">{totalTime} <span className="text-sm font-normal opacity-40">mins</span></div>
                  </div>
                </div>

                {/* Secondary Stats */}
                <div className="bg-white p-6 rounded-3xl border border-black/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-60">
                      <Brain className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-black">Avg. Session</span>
                    </div>
                    <span className="text-lg font-bold text-black">{avgDuration}m</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-60">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-black">Focus Score</span>
                    </div>
                    <span className="text-lg font-bold text-black">{avgScore}/5</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] font-medium leading-relaxed">
                      You focused for <span className="text-primary font-bold">{weeklyTime} minutes</span> this week. 
                      {weeklyTime > 300 ? " Exceptional consistency!" : " Keep building the habit!"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <div className="flex items-center gap-2 opacity-60">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-black">Consistency</span>
                    </div>
                    <div className="flex gap-1">
                      {heatmapData.map((day, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-2 h-2 rounded-[2px]",
                            day.intensity === 0 && "bg-black/5",
                            day.intensity === 1 && "bg-primary/20",
                            day.intensity === 2 && "bg-primary/40",
                            day.intensity === 3 && "bg-primary/70",
                            day.intensity === 4 && "bg-primary"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex justify-center gap-4">
                  {badges.map(badge => (
                    <div 
                      key={badge.id}
                      className={cn(
                        "flex flex-col items-center gap-1 transition-all",
                        badge.active ? "opacity-100 scale-100" : "opacity-10 grayscale scale-90"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center", badge.color)}>
                        <badge.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-black">{badge.label}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="text-center pt-2">
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.3em] text-black">
                    Master your focus with Promograd
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleExport}
                className="flex-1 bg-white dark:bg-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/20 transition-all border border-black/10 dark:border-white/10"
              >
                <Download className="w-5 h-5" />
                Export PNG
              </button>
              <button
                onClick={() => {
                  const text = `I've hit a ${streak} day focus streak on Promograd! 🚀 Total focus time: ${totalTime} mins.`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-16 bg-primary text-white rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
