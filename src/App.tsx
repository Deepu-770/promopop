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
import { TitleBar } from './components/TitleBar';
import { Category, TodoTask, DailyJournal } from './types';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { FocusMode, MODES, Session, Settings } from './types';
import { calculateStreak, cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, onSnapshot, writeBatch, getDocs, deleteDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { Share2, Layers } from 'lucide-react';

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  notifications: true,
  sound: true,
  customFocusDuration: 25,
  customBreakDuration: 5,
  blockedApps: [],
  blockedWebsites: [],
  autoDND: true,
  backgroundMusic: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentMode, setCurrentMode] = useState<FocusMode>('reading');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSocialCardOpen, setIsSocialCardOpen] = useState(false);
  const [isIntentionModalOpen, setIsIntentionModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [currentIntention, setCurrentIntention] = useState('');
  const [currentCategory, setCurrentCategory] = useState<Category>('Study');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useLocalStorage<Session[]>('promograd_sessions', []);
  const [settings, setSettings] = useLocalStorage<Settings>('promograd_settings', DEFAULT_SETTINGS);
  const [tasks, setTasks] = useLocalStorage<TodoTask[]>('promograd_tasks', []);
  const [journals, setJournals] = useLocalStorage<DailyJournal[]>('promograd_journals', []);
  const musicRef = React.useRef<HTMLAudioElement | null>(null);

  // Migration: Ensure settings has all required fields
  useEffect(() => {
    const migratedSettings = { ...DEFAULT_SETTINGS, ...settings };
    if (JSON.stringify(migratedSettings) !== JSON.stringify(settings)) {
      setSettings(migratedSettings);
    }
  }, [settings, setSettings]);

  // Sync Tasks with Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tasks'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cloudTasks = snapshot.docs.map(doc => doc.data() as TodoTask);
      setTasks(prev => {
        const localIds = new Set(prev.map(t => t.id));
        const newFromCloud = cloudTasks.filter(t => !localIds.has(t.id));
        return [...prev, ...newFromCloud];
      });
    });
    return () => unsubscribe();
  }, [user]);

  // Sync Journals with Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'journals'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cloudJournals = snapshot.docs.map(doc => doc.data() as DailyJournal);
      setJournals(prev => {
        const localIds = new Set(prev.map(j => j.id));
        const newFromCloud = cloudJournals.filter(j => !localIds.has(j.id));
        return [...prev, ...newFromCloud];
      });
    });
    return () => unsubscribe();
  }, [user]);

  const pushJournalToCloud = useCallback(async (journal: DailyJournal) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'journals', journal.id), { ...journal, uid: user.uid });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `journals/${journal.id}`);
    }
  }, [user]);

  const pushTaskToCloud = useCallback(async (task: TodoTask) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'tasks', task.id), { ...task, uid: user.uid });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `tasks/${task.id}`);
    }
  }, [user]);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Sync with Firestore
  useEffect(() => {
    if (!user) return;

    // Sync Sessions
    const q = query(collection(db, 'sessions'), where('uid', '==', user.uid));
    const unsubscribeSessions = onSnapshot(q, (snapshot) => {
      const cloudSessions = snapshot.docs.map(doc => doc.data() as Session);
      // Merge logic: prefer cloud if local is empty, or merge by ID
      setSessions(prev => {
        const localIds = new Set(prev.map(s => s.id));
        const newFromCloud = cloudSessions.filter(s => !localIds.has(s.id));
        return [...prev, ...newFromCloud].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'sessions'));

    // Sync Settings
    const settingsRef = doc(db, 'users', user.uid);
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.settings) {
          setSettings(prev => {
            const newSettings = { ...prev, ...data.settings };
            // Update MODES for custom mode
            MODES.custom.focusDuration = newSettings.customFocusDuration;
            MODES.custom.breakDuration = newSettings.customBreakDuration;
            return newSettings;
          });
        }
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${user.uid}`));

    return () => {
      unsubscribeSessions();
      unsubscribeSettings();
    };
  }, [user]);

  // Handle local settings changes for custom mode
  useEffect(() => {
    MODES.custom.focusDuration = settings.customFocusDuration;
    MODES.custom.breakDuration = settings.customBreakDuration;
  }, [settings.customFocusDuration, settings.customBreakDuration]);

  // Push local changes to cloud
  const pushSessionToCloud = useCallback(async (session: Session) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'sessions', session.id), { ...session, uid: user.uid });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `sessions/${session.id}`);
    }
  }, [user]);

  const pushSettingsToCloud = useCallback(async (newSettings: Settings) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { 
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        settings: newSettings 
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  }, [user]);

  const streak = useMemo(() => calculateStreak(sessions), [sessions]);

  // Update theme on body
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const notify = useCallback((title: string, body: string) => {
    if (settings.notifications && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    if (settings.sound) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
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

  const onReflectionComplete = useCallback((outcome: string, score: number) => {
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
    };
    setSessions((prev) => [...prev, newSession]);
    pushSessionToCloud(newSession);
    
    if (currentTaskId) {
      const task = tasks.find(t => t.id === currentTaskId);
      if (task) {
        const updatedTask = { ...task, completed: true };
        setTasks(prev => prev.map(t => t.id === currentTaskId ? updatedTask : t));
        pushTaskToCloud(updatedTask);
      }
    }

    setIsReflectionModalOpen(false);
    setCurrentIntention('');
    setCurrentTaskId(null);
  }, [currentMode, currentIntention, currentCategory, currentTaskId, tasks, setSessions, pushSessionToCloud, pushTaskToCloud]);

  const onBreakComplete = useCallback(() => {
    notify('Break Over!', 'Ready to focus again?');
    
    // Auto-start focus
    const mode = MODES[currentMode];
    const focusDur = currentMode === 'custom' ? settings.customFocusDuration : mode.focusDuration;
    startTimer(focusDur, false);
  }, [currentMode, settings.customFocusDuration, notify]);

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

  // Background Music Logic
  useEffect(() => {
    if (isActive && !isBreak && settings.backgroundMusic) {
      if (!musicRef.current) {
        musicRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // Placeholder lo-fi
        musicRef.current.loop = true;
      }
      musicRef.current.play().catch(() => {});
    } else {
      if (musicRef.current) {
        musicRef.current.pause();
      }
    }
  }, [isActive, isBreak, settings.backgroundMusic]);

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

    if (format === 'json') {
      content = JSON.stringify(sessions, null, 2);
      mimeType = 'application/json';
      fileName += '.json';
    } else {
      const headers = ['ID', 'Mode', 'Duration (s)', 'Timestamp'];
      const rows = sessions.map(s => [s.id, s.mode, s.duration, s.timestamp]);
      content = [headers, ...rows].map(r => r.join(',')).join('\n');
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

  const handleAddTask = (text: string) => {
    const newTask: TodoTask = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    pushTaskToCloud(newTask);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, completed: !t.completed };
        pushTaskToCloud(updated);
        return updated;
      }
      return t;
    }));
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (user) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `tasks/${id}`);
      }
    }
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
        return <Analytics sessions={sessions} />;
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
              pushJournalToCloud(newJournal);
            }}
          />
        );
      case 'settings':
        return (
          <SettingsPanel
            settings={settings}
            updateSettings={(s) => {
              const newSettings = { ...settings, ...s };
              setSettings(newSettings);
              pushSettingsToCloud(newSettings);
            }}
            onResetData={async () => {
              const warning = user 
                ? 'Are you sure? This will delete all your data from the CLOUD and this system. This cannot be undone.'
                : 'Are you sure you want to reset all data? This cannot be undone.';
              
              if (confirm(warning)) {
                if (user) {
                  // Delete from Cloud
                  const q = query(collection(db, 'sessions'), where('uid', '==', user.uid));
                  const snapshot = await getDocs(q);
                  const batch = writeBatch(db);
                  snapshot.docs.forEach(d => batch.delete(d.ref));
                  
                  const tq = query(collection(db, 'tasks'), where('uid', '==', user.uid));
                  const tsnapshot = await getDocs(tq);
                  tsnapshot.docs.forEach(d => batch.delete(d.ref));
                  
                  await batch.commit();
                  await deleteDoc(doc(db, 'users', user.uid));
                }
                setSessions([]);
                setTasks([]);
              }
            }}
            onExport={handleExport}
            onOpenSocialCard={() => setIsSocialCardOpen(true)}
          />
        );
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
            <span className="text-sm font-bold">Promograd</span>
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
            if (confirm("Are you sure you want to close Promograd?")) {
              setIsMinimized(true);
            }
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={settings.theme}
            toggleTheme={() => {
              const newTheme: 'light' | 'dark' = settings.theme === 'light' ? 'dark' : 'light';
              const newSettings: Settings = { ...settings, theme: newTheme };
              setSettings(newSettings);
              pushSettingsToCloud(newSettings);
            }}
            user={user}
            isPinned={isSidebarPinned}
            setIsPinned={setIsSidebarPinned}
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onStartFromTask={handleStartFromTask}
          />
          
          <main className="flex-1 p-10 relative overflow-y-auto scrollbar-custom">
            <div className="absolute top-10 right-10 flex gap-2">
              {activeTab === 'home' && (
                <>
                  <button 
                    onClick={() => setIsSocialCardOpen(true)}
                    className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-[#4B5563] dark:text-white"
                    title="Share Achievement"
                  >
                    <Share2 className="w-4 h-4 opacity-60" />
                  </button>
                </>
              )}
            </div>

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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
