export type FocusMode = 'reading' | 'lecture' | 'custom';
export type Category = 'Study' | 'Coding' | 'Revision' | 'Work' | 'Other';

export interface ModeConfig {
  id: FocusMode;
  name: string;
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  icon: string;
}

export interface Session {
  id: string;
  uid?: string;
  mode: FocusMode;
  startTime: number;
  duration: number; // actual focus time in seconds
  timestamp: string; // ISO date string
  intention?: string;
  outcome?: string;
  focusScore?: number; // 1-5
  category?: Category;
  taskId?: string;
}

export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface DailyJournal {
  id: string; // YYYY-MM-DD
  content: string;
  mood?: string;
  updatedAt: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  sound: boolean;
  customFocusDuration: number;
  customBreakDuration: number;
  blockedApps: string[];
  blockedWebsites: string[];
  autoDND: boolean;
  backgroundMusic: boolean;
  selectedMusic?: string;
  likedTracks?: string[];
  dislikedTracks?: string[];
}

export const MODES: Record<FocusMode, ModeConfig> = {
  reading: {
    id: 'reading',
    name: 'Reading Mode',
    focusDuration: 25,
    breakDuration: 5,
    icon: 'BookOpen',
  },
  lecture: {
    id: 'lecture',
    name: 'Lecture Mode',
    focusDuration: 60,
    breakDuration: 15,
    icon: 'Video',
  },
  custom: {
    id: 'custom',
    name: 'Custom Mode',
    focusDuration: 25,
    breakDuration: 5,
    icon: 'Settings2',
  },
};

export const CATEGORIES: Category[] = ['Study', 'Coding', 'Revision', 'Work', 'Other'];
