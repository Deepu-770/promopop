import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';

interface TreeAnimationProps {
  isActive: boolean;
  duration: number; // in seconds
  onComplete: () => void;
  onDie: () => void;
}

export const TreeAnimation: React.FC<TreeAnimationProps> = ({ isActive, duration, onComplete, onDie }) => {
  const [progress, setProgress] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/media/notification.ogg');
    audioRef.current.load();
  }, []);

  useEffect(() => {
    if (!isActive && progress > 0 && progress < 100) {
      setIsDead(true);
      setTimeout(onDie, 0);
    } else if (isActive) {
      setIsDead(false);
    }
  }, [isActive, progress, onDie]);

  useEffect(() => {
    if (!isActive || isDead) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
          }
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4CAF50', '#2E7D32', '#81C784']
          });
          setTimeout(onComplete, 0);
          return 100;
        }
        return prev + (100 / (duration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, duration, onComplete, isDead]);

  const getTreeStage = () => {
    if (isDead) return 'dead';
    if (progress < 20) return 'seed';
    if (progress < 50) return 'small';
    if (progress < 80) return 'growing';
    return 'full';
  };

  const stage = getTreeStage();

  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {/* Progress Ring */}
      <svg className="absolute w-72 h-72 -rotate-90" viewBox="0 0 288 288">
        <circle
          cx="144"
          cy="144"
          r="130"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-black/[0.03] dark:text-white/5"
        />
        <motion.circle
          cx="144"
          cy="144"
          r="130"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="816.8"
          strokeDashoffset={816.8 * (1 - progress / 100)}
          strokeLinecap="round"
          className="text-primary"
          animate={{ strokeDashoffset: 816.8 * (1 - progress / 100) }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </svg>

      <motion.div
        animate={{ 
          scale: isDead ? 0.8 : 0.8 + (progress / 500),
          opacity: isDead ? 0.5 : 1,
          rotate: [0, -2, 2, 0]
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="relative w-48 h-48 flex items-center justify-center overflow-hidden"
      >
        <svg width="120" height="160" viewBox="0 0 120 160" className="mx-auto">
          {/* Trunk */}
          {stage !== 'seed' && <path d="M60 160 L60 100" stroke="#5D4037" strokeWidth="8" />}
          
          {/* Leaves/Tree */}
          {stage === 'seed' && (
            <g>
              <path d="M60 160 L60 140" stroke="#5D4037" strokeWidth="4" />
              <ellipse cx="55" cy="135" rx="5" ry="8" fill="#4CAF50" transform="rotate(-20 55 135)" />
              <ellipse cx="65" cy="135" rx="5" ry="8" fill="#4CAF50" transform="rotate(20 65 135)" />
            </g>
          )}
          {stage === 'small' && (
            <g>
              <path d="M60 100 Q 40 70 60 40 T 80 100" fill="#4CAF50" />
              <path d="M60 100 Q 80 70 60 40 T 40 100" fill="#66BB6A" />
            </g>
          )}
          {stage === 'growing' && (
            <g>
              <path d="M60 100 Q 20 60 60 20 T 100 100" fill="#4CAF50" />
              <path d="M60 100 Q 100 60 60 20 T 20 100" fill="#66BB6A" />
            </g>
          )}
          {stage === 'full' && (
            <g>
              <path d="M60 100 Q 10 50 60 0 T 110 100" fill="#2E7D32" />
              <path d="M60 100 Q 110 50 60 0 T 10 100" fill="#4CAF50" />
              <circle cx="60" cy="20" r="15" fill="#2E7D32" />
            </g>
          )}
          {stage === 'dead' && (
            <path d="M60 100 Q 30 70 60 40 T 90 100" stroke="#78909C" strokeWidth="4" fill="none" />
          )}
        </svg>
      </motion.div>
      <div className="mt-4 text-white/60 font-mono text-sm">
        {isDead ? "Tree Died" : `${Math.round(progress)}%`}
      </div>
    </div>
  );
};