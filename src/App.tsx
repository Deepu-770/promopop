/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TimerDisplay } from './components/TimerDisplay';
import { ModeSelector } from './components/ModeSelector';
import { Analytics } from './components/Analytics';
import { Settings as SettingsPanel } from './components/Settings';
import { Widget } from './components/Widget';
import { SocialCard } from './components/SocialCard';
import { IntentionModal } from './components/IntentionModal';
import { ReflectionModal } from './components/ReflectionModal';
import { DailyReview } from './components/DailyReview';
import { Badges } from './components/Badges';
import { TitleBar } from './components/TitleBar';
import { MusicPlayerModal } from './components/MusicPlayerModal';
import { Category, TodoTask, DailyJournal } from './types';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FocusMode, MODES, Session, Settings, Track } from './types';
import { calculateStreak, cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Share2, Layers } from 'lucide-react';

import { LOFI_TRACKS, APP_VERSION, BADGES } from './constants';

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  notifications: true,
  sound: true,
  customFocusDuration: 25,
  customBreakDuration: 5,
  blockedApps: [],
  blockedWebsites: [],
  autoDND: true,
  backgroundMusic: false,
  autoStartFocus: false,
  enableTreeGrowing: false,
  treesGrown: 0,
  failedTrees: 0,
  selectedMusic: 'track-1',
  badges: BADGES,
};

import { useGoogleDriveSync } from './hooks/useGoogleDriveSync';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentMode, setCurrentMode] = useState<FocusMode>('reading');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSocialCardOpen, setIsSocialCardOpen] = useState(false);
  const [isIntentionModalOpen, setIsIntentionModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [localTracks, setLocalTracks] = useState<Track[]>([]);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [currentIntention, setCurrentIntention] = useState('');
  const [currentCategory, setCurrentCategory] = useState<Category>('Study');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [sessions, setSessions] = useLocalStorage<Session[]>('promograd_sessions', []);
  const [settings, setSettings] = useLocalStorage<Settings>('promograd_settings', DEFAULT_SETTINGS);
  const [tasks, setTasks] = useLocalStorage<TodoTask[]>('promograd_tasks', []);
  const [journals, setJournals] = useLocalStorage<DailyJournal[]>('promograd_journals', []);
  const musicRef = React.useRef<HTMLAudioElement | null>(null);
  const onBreakCompleteRef = React.useRef<() => void>(() => {});

  const getExportData = useCallback(() => ({
    sessions,
    tasks,
    journals,
    settings
  }), [sessions, tasks, journals, settings]);

  const handleImportData = useCallback((data: any) => {
    if (data.sessions) setSessions(prev => {
      const newSessions = data.sessions.filter((s: any) => !prev.find(p => p.id === s.id));
      return [...prev, ...newSessions];
    });
    if (data.tasks) setTasks(prev => {
      const newTasks = data.tasks.filter((t: any) => !prev.find(p => p.id === t.id));
      return [...prev, ...newTasks];
    });
    if (data.journals) setJournals(prev => {
      const newJournals = data.journals.filter((j: any) => !prev.find(p => p.id === j.id));
      return [...prev, ...newJournals];
    });
    if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
  }, [setSessions, setTasks, setJournals, setSettings]);

  const driveSync = useGoogleDriveSync(handleImportData, getExportData);

  // Auto-sync every 10 minutes if connected
  useEffect(() => {
    if (!driveSync.isConnected) return;
    
    const interval = setInterval(() => {
      if (navigator.onLine) {
        driveSync.syncWithDrive();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [driveSync.isConnected, driveSync.syncWithDrive]);


  // Migration: Ensure settings has all required fields
  useEffect(() => {
    const migratedSettings = { ...DEFAULT_SETTINGS, ...settings, theme: 'dark' as const };
    
    // Force update if badges are missing or old structure
    if (!settings.badges || settings.badges.length === 0 || !('treesBenchmark' in (settings.badges[0] || {}))) {
      migratedSettings.badges = BADGES;
    }

    if (JSON.stringify(migratedSettings) !== JSON.stringify(settings)) {
      setSettings(migratedSettings);
    }
  }, [settings, setSettings]);

  // Handle local settings changes for custom mode
  useEffect(() => {
    MODES.custom.focusDuration = settings.customFocusDuration;
    MODES.custom.breakDuration = settings.customBreakDuration;
  }, [settings.customFocusDuration, settings.customBreakDuration]);

  const streak = useMemo(() => calculateStreak(sessions), [sessions]);

  // Force dark mode on body
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const notify = useCallback((title: string, body: string) => {
    if (settings.notifications && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    if (settings.sound) {
      const audio = new Audio('/media/notification.ogg');
      audio.play().catch(() => {});
    }
  }, [settings.notifications, settings.sound]);

  useEffect(() => {
    if (settings.notifications && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notifications]);

  const onSessionComplete = useCallback((duration: number) => {
    setIsReflectionModalOpen(true);
    notify('Focus Session Complete!', 'Time for a well-deserved break.');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#007AFF', '#5856D6', '#FF9500']
    });
    
    // Auto-start break
    const mode = MODES[currentMode];
    const breakDur = currentMode === 'custom' ? settings.customBreakDuration : mode.breakDuration;
    startTimer(breakDur, true);
  }, [currentMode, settings.customBreakDuration, notify]);

  const onReflectionComplete = useCallback((outcome: string, score: number, treeGrown: boolean = false) => {
    const newSession: Session = {
      id: Math.random().toString(36).substr(2, 9),
      mode: currentMode,
      startTime: Date.now() - (MODES[currentMode].focusDuration * 60 * 1000),
      duration: MODES[currentMode].focusDuration * 60,
      timestamp: new Date().toISOString(),
      intention: currentIntention,
      outcome,
      focusScore: score,
      category: currentCategory,
      taskId: currentTaskId || undefined,
      completed: true,
      treeGrown,
    };
    setSessions((prev) => [...prev, newSession]);
    
    // Update badges
    const totalTrees = settings.treesGrown + (treeGrown ? 1 : 0);
    const totalHours = (sessions.reduce((acc, s) => acc + s.duration, 0) + newSession.duration) / 3600;
    
    const updatedBadges = settings.badges.map(badge => {
      const progress = Math.min(
        100,
        Math.round(((totalTrees / badge.treesBenchmark) + (totalHours / badge.hoursBenchmark)) / 2 * 100)
      );
      
      return {
        ...badge,
        progress: progress,
        unlocked: progress >= 100
      };
    });
    setSettings(prev => ({ ...prev, badges: updatedBadges, treesGrown: totalTrees }));

    if (currentTaskId) {
      const task = tasks.find(t => t.id === currentTaskId);
      if (task) {
        const updatedTask = { ...task, completed: true };
        setTasks(prev => prev.map(t => t.id === currentTaskId ? updatedTask : t));
      }
    }

    setIsReflectionModalOpen(false);
    setCurrentIntention('');
    setCurrentTaskId(null);
  }, [currentMode, currentIntention, currentCategory, currentTaskId, tasks, setSessions, settings, setSettings, sessions]);

  const onBreakComplete = useCallback(() => {
    onBreakCompleteRef.current();
  }, []);

  const {
    timeLeft,
    isActive,
    isBreak,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  } = useTimer({
    onSessionComplete,
    onBreakComplete,
  });

  useEffect(() => {
    onBreakCompleteRef.current = () => {
      notify('Break Over!', 'Ready to focus again?');
      
      // Auto-start focus
      if (settings.autoStartFocus) {
        const mode = MODES[currentMode];
        const focusDur = currentMode === 'custom' ? settings.customFocusDuration : mode.focusDuration;
        startTimer(focusDur, false);
      }
    };
  }, [currentMode, settings.customFocusDuration, settings.autoStartFocus, notify, startTimer]);

  // Background Music Logic
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    let isCancelled = false;

    if (isMusicPlaying) {
      const allTracks = [...LOFI_TRACKS, ...localTracks];
      const track = allTracks.find(t => t.id === settings.selectedMusic);
      
      if (track) {
        if (!musicRef.current || musicRef.current.src !== track.url) {
          if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current.removeAttribute('src');
            musicRef.current.load();
          }
          musicRef.current = new Audio(track.url);
        }
        musicRef.current.loop = isLooping;
        musicRef.current.volume = volume;
        
        const playPromise = musicRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (!isCancelled) {
              console.error("Audio play error:", error);
              setIsMusicPlaying(false);
            }
          });
        }
      }
    } else {
      if (musicRef.current) {
        musicRef.current.pause();
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [settings.selectedMusic, isMusicPlaying, localTracks, volume, isLooping]);

  // Sync isMusicPlaying with settings.backgroundMusic when session starts
  useEffect(() => {
    if (isActive && !isBreak && settings.backgroundMusic) {
      setIsMusicPlaying(true);
    } else if ((!isActive || isBreak) && settings.backgroundMusic) {
      setIsMusicPlaying(false);
    }
  }, [isActive, isBreak, settings.backgroundMusic]);

  const handleRefreshMusic = useCallback(() => {
    const currentTrackId = settings.selectedMusic || 'track-1';
    const disliked = [...(settings.dislikedTracks || []), currentTrackId];
    
    // Find available tracks that are not disliked
    const availableTracks = LOFI_TRACKS.filter(t => !disliked.includes(t.id));
    
    if (availableTracks.length > 0) {
      const nextTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
      setSettings({
        ...settings,
        dislikedTracks: disliked,
        selectedMusic: nextTrack.id
      });
    } else {
      // If all tracks are disliked, reset disliked list but keep current one as disliked for now
      const nextTrack = LOFI_TRACKS.find(t => t.id !== currentTrackId) || LOFI_TRACKS[0];
      setSettings({
        ...settings,
        dislikedTracks: [currentTrackId],
        selectedMusic: nextTrack.id
      });
    }
  }, [settings, setSettings]);

  const handleLikeMusic = useCallback((id: string) => {
    const liked = settings.likedTracks || [];
    if (liked.includes(id)) {
      setSettings({
        ...settings,
        likedTracks: liked.filter(t => t !== id)
      });
    } else {
      setSettings({
        ...settings,
        likedTracks: [...liked, id]
      });
    }
  }, [settings, setSettings]);

  const handleStart = () => {
    if (timeLeft > 0) {
      resumeTimer();
    } else {
      if (currentMode === 'custom') {
        setIsIntentionModalOpen(true);
      } else {
        // For Reading and Lecture modes, skip intention and start immediately
        const mode = MODES[currentMode];
        setCurrentIntention(mode.name); // Default intention to mode name
        setCurrentCategory('Study'); // Default category
        startTimer(mode.focusDuration);
      }
    }
  };

  const handleStartWithIntention = (intention: string, category: Category) => {
    setCurrentIntention(intention);
    setCurrentCategory(category);
    setIsIntentionModalOpen(false);
    
    const mode = MODES[currentMode];
    const duration = currentMode === 'custom' ? settings.customFocusDuration : mode.focusDuration;
    startTimer(duration);
  };

  const handleExport = (format: 'json' | 'csv') => {
    let content = '';
    let mimeType = '';
    let fileName = `promograd_export_${new Date().toISOString().split('T')[0]}`;

    const exportData = {
      sessions,
      tasks,
      journals,
      settings
    };

    if (format === 'json') {
      content = JSON.stringify(exportData, null, 2);
      mimeType = 'application/json';
      fileName += '.json';
    } else {
      // CSV Export - Multi-section
      const sections = [];
      
      // Sessions
      sections.push('--- SESSIONS ---');
      sections.push(['ID', 'Mode', 'Duration (s)', 'Timestamp', 'Completed', 'Tree Grown'].join(','));
      sessions.forEach(s => sections.push([s.id, s.mode, s.duration, s.timestamp, s.completed, s.treeGrown].join(',')));
      
      // Tasks
      sections.push('\n--- TASKS ---');
      sections.push(['ID', 'Text', 'Completed', 'Created At', 'Completed At'].join(','));
      tasks.forEach(t => sections.push([t.id, `"${t.text.replace(/"/g, '""')}"`, t.completed, t.createdAt, t.completedAt || ''].join(',')));
      
      // Journals
      sections.push('\n--- JOURNALS ---');
      sections.push(['ID', 'Content', 'Mood', 'Updated At'].join(','));
      journals.forEach(j => sections.push([j.id, `"${j.content.replace(/"/g, '""')}"`, j.mood || '', j.updatedAt].join(',')));
      
      // Settings (Flattened)
      sections.push('\n--- SETTINGS ---');
      sections.push(['Key', 'Value'].join(','));
      Object.entries(settings).forEach(([k, v]) => {
        const val = typeof v === 'object' ? JSON.stringify(v) : String(v);
        sections.push([k, `"${val.replace(/"/g, '""')}"`].join(','));
      });

      content = sections.join('\n');
      mimeType = 'text/csv';
      fileName += '.csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateSettings = (s: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...s, theme: 'dark' as const }));
  };

  const handleAddTask = (text: string) => {
    const newTask: TodoTask = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { 
          ...t, 
          completed: !t.completed,
          completedAt: !t.completed ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleStartFromTask = (task: TodoTask) => {
    setCurrentTaskId(task.id);
    setCurrentIntention(task.text);
    setCurrentCategory('Work');
    setActiveTab('home');
    
    const mode = MODES[currentMode];
    const duration = currentMode === 'custom' ? settings.customFocusDuration : mode.focusDuration;
    startTimer(duration);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <TimerDisplay
            timeLeft={timeLeft}
            isActive={isActive}
            isBreak={isBreak}
            progress={progress}
            modeName={MODES[currentMode].name}
            streak={streak}
            onStart={handleStart}
            onPause={pauseTimer}
            onReset={resetTimer}
            onMusicClick={() => setIsMusicModalOpen(true)}
            isMusicPlaying={isMusicPlaying}
            enableTreeGrowing={settings.enableTreeGrowing}
            onTreeGrown={() => updateSettings({ treesGrown: (settings.treesGrown || 0) + 1 })}
            onTreeDied={() => updateSettings({ failedTrees: (settings.failedTrees || 0) + 1 })}
          />
        );
      case 'modes':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Select Focus Mode</h2>
              <p className="opacity-50">Choose a mode that fits your current task</p>
            </div>
            <ModeSelector
              currentMode={currentMode}
              onModeSelect={(mode) => {
                setCurrentMode(mode);
                resetTimer();
                setActiveTab('home');
              }}
            />
          </div>
        );
      case 'analytics':
        return <Analytics sessions={sessions} tasks={tasks} settings={settings} />;
      case 'review':
        const todayId = new Date().toISOString().split('T')[0];
        return (
          <DailyReview 
            sessions={sessions} 
            tasks={tasks} 
            journal={journals.find(j => j.id === todayId) || null}
            onSaveJournal={(content, mood) => {
              const newJournal: DailyJournal = {
                id: todayId,
                content,
                mood,
                updatedAt: new Date().toISOString()
              };
              setJournals(prev => {
                const filtered = prev.filter(j => j.id !== todayId);
                return [...filtered, newJournal];
              });
            }}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onStartFromTask={handleStartFromTask}
          />
        );
      case 'settings':
        return (
          <SettingsPanel
            settings={settings}
            updateSettings={(s) => {
              const newSettings = { ...settings, ...s, theme: 'dark' as const };
              setSettings(newSettings);
            }}
            onResetData={async () => {
              setSessions([]);
              setTasks([]);
              setJournals([]);
              setSettings(DEFAULT_SETTINGS);
            }}
            onImport={(data) => {
              if (data.sessions) setSessions(prev => [...prev, ...data.sessions]);
              if (data.tasks) setTasks(prev => [...prev, ...data.tasks]);
              if (data.journals) setJournals(prev => [...prev, ...data.journals]);
              if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
            }}
            onExport={handleExport}
            onOpenSocialCard={() => setIsSocialCardOpen(true)}
            driveSync={driveSync}
          />
        );
      case 'badges':
        return <Badges badges={settings.badges} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] transition-all duration-500">
      {/* Taskbar-like minimized state indicator */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-8 px-6 py-3 bg-white dark:bg-[#1A1A1A] shadow-2xl rounded-2xl flex items-center gap-3 border border-black/5 dark:border-white/5 z-[200] hover:scale-105 transition-transform"
          >
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Layers className="text-white w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold">Tempo</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main App Window */}
      <motion.div 
        animate={{ 
          scale: isMinimized ? 0.9 : 1,
          opacity: isMinimized ? 0 : 1,
          pointerEvents: isMinimized ? 'none' : 'auto',
          width: isMaximized ? '100%' : '960px',
          height: isMaximized ? '100%' : '640px',
          borderRadius: isMaximized ? '0px' : '24px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "glass-panel flex flex-col overflow-hidden relative border border-[#E5E5E5] dark:border-white/10",
          isMaximized && "fixed inset-0 z-[150] w-full h-full"
        )}
      >
        <TitleBar 
          isMaximized={isMaximized}
          onMinimize={() => setIsMinimized(true)}
          onMaximize={() => setIsMaximized(!isMaximized)}
          onClose={() => {
            if (confirm("Are you sure you want to close Tempo?")) {
              setIsMinimized(true);
            }
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isPinned={isSidebarPinned}
            setIsPinned={setIsSidebarPinned}
            enableTreeGrowing={settings.enableTreeGrowing}
          />
          
          <main className="flex-1 p-10 relative overflow-y-auto scrollbar-custom">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </motion.div>

      {/* Modals */}
      <IntentionModal
        isOpen={isIntentionModalOpen}
        onClose={() => setIsIntentionModalOpen(false)}
        onStart={handleStartWithIntention}
      />
      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        onComplete={onReflectionComplete}
      />

      {/* Social Card Modal */}
      <SocialCard
        isOpen={isSocialCardOpen}
        onClose={() => setIsSocialCardOpen(false)}
        streak={streak}
        totalTime={Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}
        sessions={sessions}
      />

      <MusicPlayerModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        isMusicPlaying={isMusicPlaying}
        setIsMusicPlaying={setIsMusicPlaying}
        selectedMusic={settings.selectedMusic || 'track-1'}
        onSelectMusic={(id) => updateSettings({ selectedMusic: id })}
        likedTracks={settings.likedTracks || []}
        onLikeMusic={handleLikeMusic}
        dislikedTracks={settings.dislikedTracks || []}
        localTracks={localTracks}
        setLocalTracks={setLocalTracks}
        volume={volume}
        setVolume={setVolume}
        isLooping={isLooping}
        setIsLooping={setIsLooping}
        isShuffling={isShuffling}
        setIsShuffling={setIsShuffling}
      />

      {/* Floating Widget */}
      <AnimatePresence>
        {isMinimized && (
          <Widget
            timeLeft={timeLeft}
            isActive={isActive}
            isBreak={isBreak}
            modeName={MODES[currentMode].name}
            onToggle={isActive ? pauseTimer : handleStart}
            onExpand={() => setIsMinimized(false)}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={() => setIsMusicPlaying(!isMusicPlaying)}
            showMusicControl={settings.backgroundMusic && !isBreak}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
