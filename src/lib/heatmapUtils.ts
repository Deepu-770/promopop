import { format, subDays, startOfDay, isSameDay, eachDayOfInterval, startOfWeek, endOfWeek, differenceInDays } from 'date-fns';
import { Session, TodoTask } from '../types';

export type HeatmapMetric = 'sessions' | 'hours' | 'tasks';

export interface HeatmapDataPoint {
  date: string;
  count: number;
}

export interface StreakData {
  current: number;
  longest: number;
}

export const getHeatmapData = (
  sessions: Session[],
  tasks: TodoTask[],
  metric: HeatmapMetric,
  days: number = 365
): Map<string, number> => {
  const data = new Map<string, number>();
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, days - 1);

  const interval = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Initialize with 0
  interval.forEach(date => {
    data.set(format(date, 'yyyy-MM-dd'), 0);
  });

  if (metric === 'sessions') {
    sessions.forEach(s => {
      const dateKey = format(new Date(s.timestamp), 'yyyy-MM-dd');
      if (data.has(dateKey)) {
        data.set(dateKey, (data.get(dateKey) || 0) + 1);
      }
    });
  } else if (metric === 'hours') {
    sessions.forEach(s => {
      const dateKey = format(new Date(s.timestamp), 'yyyy-MM-dd');
      if (data.has(dateKey)) {
        data.set(dateKey, (data.get(dateKey) || 0) + (s.duration / 3600));
      }
    });
  } else if (metric === 'tasks') {
    tasks.forEach(t => {
      if (t.completed) {
        const dateKey = format(new Date(t.createdAt), 'yyyy-MM-dd');
        if (data.has(dateKey)) {
          data.set(dateKey, (data.get(dateKey) || 0) + 1);
        }
      }
    });
  }

  return data;
};

export const calculateStreaks = (data: Map<string, number>): StreakData => {
  const sortedDates = Array.from(data.keys()).sort();
  let current = 0;
  let longest = 0;
  let tempStreak = 0;

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Longest streak
  sortedDates.forEach(date => {
    if ((data.get(date) || 0) > 0) {
      tempStreak++;
      longest = Math.max(longest, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  // Current streak
  // Check if active today or yesterday to continue streak
  let checkDate = new Date();
  while (true) {
    const key = format(checkDate, 'yyyy-MM-dd');
    if ((data.get(key) || 0) > 0) {
      current++;
      checkDate = subDays(checkDate, 1);
    } else {
      // If today is 0, check if yesterday was > 0 to maintain streak
      if (isSameDay(checkDate, new Date())) {
        checkDate = subDays(checkDate, 1);
        continue;
      }
      break;
    }
  }

  return { current, longest };
};

export const getIntensity = (count: number, max: number): number => {
  if (count === 0) return 0;
  if (max === 0) return 1;
  const percentage = count / max;
  if (percentage <= 0.25) return 1;
  if (percentage <= 0.5) return 2;
  if (percentage <= 0.75) return 3;
  return 4;
};
