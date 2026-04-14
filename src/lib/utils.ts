import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isSameDay, subDays, startOfDay, parseISO } from 'date-fns';
import { Session } from '@/src/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  // Get unique dates with sessions, sorted descending
  const dates = Array.from(new Set(sessions.map(s => startOfDay(parseISO(s.timestamp)).getTime())))
    .sort((a, b) => b - a);

  if (dates.length === 0) return 0;

  const today = startOfDay(new Date()).getTime();
  const yesterday = startOfDay(subDays(new Date(), 1)).getTime();

  // If the most recent session is older than yesterday, streak is broken
  if (dates[0] < yesterday) {
    return 0;
  }

  let streak = 0;
  let expectedDate = dates[0]; // Start from the most recent session date

  for (const date of dates) {
    if (date === expectedDate) {
      streak++;
      expectedDate = startOfDay(subDays(new Date(expectedDate), 1)).getTime();
    } else {
      break;
    }
  }

  return streak;
}
