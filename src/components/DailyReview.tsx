import React, { useState, useEffect, useMemo } from 'react';
import { format, isSameDay, startOfDay, getHours } from 'date-fns';
import { Session, TodoTask, DailyJournal } from '@/src/types';
import { cn, calculateStreak } from '@/src/lib/utils';
import { 
  Target, CheckCircle2, Star, Clock, Calendar, Save, 
  TrendingUp, Zap, Award, Smile, Meh, Frown, 
  Coffee, RefreshCcw, Save as SaveIcon
} from 'lucide-react';

interface DailyReviewProps {
  sessions: Session[];
  tasks: TodoTask[];
  journal: DailyJournal | null;
  onSaveJournal: (content: string, mood?: string) => void;
}

const MOODS = [
  { id: 'great', icon: Smile, label: 'Great' },
  { id: 'good', icon: Meh, label: 'Good' },
  { id: 'tired', icon: Coffee, label: 'Tired' },
  { id: 'bad', icon: Frown, label: 'Bad' },
];

const PROMPTS = [
  "What was your biggest breakthrough today?",
  "What's one thing you'd do differently tomorrow?",
  "What are you most proud of achieving?",
  "How did you handle distractions today?"
];

export const DailyReview: React.FC<DailyReviewProps> = ({ sessions = [], tasks = [], journal, onSaveJournal }) => {
  const today = startOfDay(new Date());
  const todaySessions = useMemo(() => (sessions || []).filter(s => isSameDay(new Date(s.timestamp), today)), [sessions, today]);
  
  const [journalContent, setJournalContent] = useState(journal?.content || '');
  const [selectedMood, setSelectedMood] = useState(journal?.mood || '');
  const [activePrompt, setActivePrompt] = useState(0);

  useEffect(() => {
    setJournalContent(journal?.content || '');
    setSelectedMood(journal?.mood || '');
  }, [journal]);

  const handleSave = () => {
    onSaveJournal(journalContent, selectedMood);
  };

  // Metrics
  const totalFocusTime = Math.round(todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60);
  const sessionCount = todaySessions.length;
  const streak = calculateStreak(sessions);
  const focusScore = todaySessions.length > 0
    ? Math.round((todaySessions.reduce((acc, s) => acc + (s.focusScore || 0), 0) / (todaySessions.length * 5)) * 100)
    : 0;

  // Peak Time
  const peakTimeStr = useMemo(() => {
    const hourCounts = new Array(24).fill(0);
    todaySessions.forEach(s => {
      const h = getHours(new Date(s.timestamp));
      hourCounts[h] += s.duration;
    });
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    if (totalFocusTime > 0) {
      return peakHour >= 12 ? `${peakHour === 12 ? 12 : peakHour - 12} PM` : `${peakHour === 0 ? 12 : peakHour} AM`;
    }
    return null;
  }, [todaySessions, totalFocusTime]);

  // Timeline Grouping
  const groupedSessions = useMemo(() => {
    const groups: Record<string, Session[]> = {
      morning: todaySessions.filter(s => getHours(new Date(s.timestamp)) < 12),
      afternoon: todaySessions.filter(s => getHours(new Date(s.timestamp)) >= 12 && getHours(new Date(s.timestamp)) < 18),
      evening: todaySessions.filter(s => getHours(new Date(s.timestamp)) >= 18),
    };
    return groups;
  }, [todaySessions]);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20 px-8 pt-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-[#374151] dark:text-white">Daily Review</h2>
          <p className="text-[#4B5563] dark:text-white flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4" />
            {format(today, 'EEEE, MMMM do')}
          </p>
        </div>
        
        <div className="flex gap-8">
          {[
            { label: 'Focus Time', value: `${totalFocusTime}m`, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Focus Score', value: `${focusScore}%`, icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Sessions', value: sessionCount, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { label: 'Streak', value: `${streak}d`, icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-500/10' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#6E6E80] dark:text-white/40 uppercase tracking-wider">{stat.label}</div>
                <div className="text-lg font-bold text-[#0D0D0D] dark:text-white">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Journal Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#0D0D0D] dark:text-white">Daily Journal</h3>
        <div className="glass-panel rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-white/10">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] dark:border-white/20">
            <div className="flex items-center gap-3 flex-1">
              <button 
                onClick={() => setActivePrompt((prev) => (prev + 1) % PROMPTS.length)}
                className="p-1.5 hover:bg-black/[0.03] dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <RefreshCcw className="w-5 h-5 opacity-60" />
              </button>
              <span className="font-bold text-base text-[#0D0D0D] dark:text-white opacity-80">{PROMPTS[activePrompt]}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-4">
                {MOODS.map((mood, index) => {
                  const labels = ["good", "ok", "tired", "sad"];
                  return (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      title={labels[index]}
                      className={cn(
                        "transition-all hover:scale-110",
                        selectedMood === mood.id ? "opacity-100 text-primary" : "opacity-30"
                      )}
                    >
                      <mood.icon className="w-6 h-6" />
                    </button>
                  );
                })}
              </div>
              <div className="w-px h-6 bg-[#E5E5E5] dark:bg-white/20 mx-2" />
              <button 
                onClick={handleSave}
                className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-all"
              >
                <SaveIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="Start writing your reflection ..."
            className="w-full h-64 p-6 text-base font-medium outline-none bg-transparent resize-none placeholder:text-black/10 dark:placeholder:text-white/20 text-[#0D0D0D] dark:text-white"
          />
        </div>
      </div>

      {/* Session Timeline Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#0D0D0D] dark:text-white">Session Timeline</h3>
          {peakTimeStr && (
            <p className="text-xs font-bold uppercase tracking-widest text-[#6E6E80] opacity-40">Your most productive hour was {peakTimeStr}</p>
          )}
        </div>

        <div className="relative pl-12 space-y-12">
          {/* Vertical Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#E5E5E5] dark:bg-white/20" />

          {(Object.entries(groupedSessions) as [string, Session[]][]).map(([key, groupSessions]) => (
            groupSessions.length > 0 && (
              <div key={key} className="space-y-6 relative">
                {/* Horizontal Branch */}
                <div className="absolute -left-6 top-4 w-6 h-px bg-[#E5E5E5] dark:bg-white/20" />
                
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#6E6E80] opacity-40" />
                  <h4 className="text-lg font-bold uppercase tracking-widest text-[#6E6E80] opacity-40">{key}</h4>
                </div>

                <div className="space-y-4">
                  {groupSessions.map((session) => (
                    <div
                      key={session.id}
                      className="glass-panel rounded-2xl p-5 flex items-center gap-6 border border-[#E5E5E5] dark:border-white/10"
                    >
                      <div className="w-20 shrink-0 text-center border-r border-[#E5E5E5] dark:border-white/10 pr-6">
                        <div className="text-xl font-bold italic tracking-tighter text-[#0D0D0D] dark:text-white">{format(new Date(session.timestamp), 'HH:mm')}</div>
                        <div className="text-[10px] font-bold text-[#6E6E80] uppercase tracking-widest">{session.mode}</div>
                      </div>

                      <div className="flex-1 grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <div className="text-base font-bold text-[#0D0D0D] dark:text-white">{session.intention || 'Deep Work Session'}</div>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#6E6E80] tracking-widest">
                            <Target className="w-3 h-3" />
                            Intention
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#6E6E80] tracking-widest">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Outcome
                          </div>
                          <div className="text-sm font-medium italic text-[#6E6E80]">
                            {session.outcome || 'No reflection recorded'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-xl font-bold tracking-tighter text-[#0D0D0D] dark:text-white">{session.focusScore || 0}/5</span>
                        </div>
                        <div className="text-xl font-bold uppercase tracking-tighter text-[#0D0D0D] dark:text-white opacity-80">
                          {Math.round(session.duration / 60)} MINS
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};