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
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-[480px]"
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div 
              ref={cardRef}
              className="bg-black p-6 rounded-[32px] border border-white/10 overflow-hidden relative text-white shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)'
              }}
            >
              {/* Background Accents */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-50" />

              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                      <Brain className="text-white w-4 h-4" />
                    </div>
                    <span className="font-bold text-base tracking-tight text-white">Tempo</span>
                  </div>
                  <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-white">
                    {format(new Date(), 'MMMM yyyy')}
                  </div>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 text-orange-500 mb-1">
                      <Flame className="w-3 h-3 fill-current" />
                      <span className="text-[8px] font-bold uppercase tracking-wider">Streak</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{streak} <span className="text-xs font-normal opacity-40">days</span></div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-[8px] font-bold uppercase tracking-wider">Focus</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{totalTime} <span className="text-xs font-normal opacity-40">mins</span></div>
                  </div>
                </div>

                {/* Secondary Stats */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-60">
                      <Brain className="w-3 h-3" />
                      <span className="text-[8px] font-bold uppercase tracking-wider text-white">Avg. Session</span>
                    </div>
                    <span className="text-base font-bold text-white">{avgDuration}m</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-60">
                      <Award className="w-3 h-3" />
                      <span className="text-[8px] font-bold uppercase tracking-wider text-white">Focus Score</span>
                    </div>
                    <span className="text-base font-bold text-white">{avgScore}/5</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2 opacity-60">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[8px] font-bold uppercase tracking-wider text-white">Consistency</span>
                    </div>
                    <div className="flex gap-0.5">
                      {heatmapData.map((day, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1.5 h-1.5 rounded-[1px]",
                            day.intensity === 0 && "bg-white/5",
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

                {/* Footer */}
                <div className="text-center pt-1">
                  <p className="text-[8px] font-bold opacity-30 uppercase tracking-[0.3em] text-white">
                    Master your focus with Tempo
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleExport}
                className="flex-1 bg-white/10 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/10 text-white"
              >
                <Download className="w-4 h-4" />
                Export PNG
              </button>
              <button
                onClick={() => {
                  const text = `I've hit a ${streak} day focus streak on Tempo! 🚀 Total focus time: ${totalTime} mins.`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-12 bg-primary text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
