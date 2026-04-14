import { useState, useEffect, useCallback, useRef } from 'react';

interface TimerOptions {
  onSessionComplete: (duration: number) => void;
  onBreakComplete: () => void;
  onTick?: (timeLeft: number) => void;
}

export function useTimer(options: TimerOptions) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback((minutes: number, isBreakMode: boolean = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setTotalDuration(seconds);
    setIsActive(true);
    setIsBreak(isBreakMode);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(0);
    setIsBreak(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (options.onTick) options.onTick(next);
          return next;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      if (isBreak) {
        options.onBreakComplete();
      } else {
        options.onSessionComplete(totalDuration);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, isBreak, totalDuration, options]);

  return {
    timeLeft,
    isActive,
    isBreak,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    progress: totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0
  };
}
