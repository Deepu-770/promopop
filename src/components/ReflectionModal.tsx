import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (outcome: string, score: number) => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [outcome, setOutcome] = useState('');
  const [score, setScore] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(outcome, score);
    setOutcome('');
    setScore(5);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel w-full max-w-md p-8 rounded-[32px] border border-black/10 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-green-500 w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#374151] dark:text-white">Session Reflection</h2>
              </div>
              <button onClick={onClose} className="p-2 text-[#4B5563]/40 dark:text-white/40 hover:text-[#4B5563] dark:hover:text-white transition-opacity">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#4B5563]/40 dark:text-white/40 mb-2 uppercase tracking-wider">What did you accomplish?</label>
                <textarea
                  autoFocus
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="e.g., Finished the login logic"
                  className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary/30 rounded-2xl px-5 py-4 outline-none transition-all font-medium min-h-[100px] resize-none text-[#4B5563] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4B5563]/40 dark:text-white/40 mb-3 uppercase tracking-wider">How focused were you?</label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScore(s)}
                      className={cn(
                        "flex-1 py-3 rounded-xl border transition-all flex flex-col items-center gap-1",
                        score === s
                          ? "bg-primary text-white border-primary"
                          : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 text-[#4B5563] dark:text-white"
                      )}
                    >
                      <Star className={cn("w-4 h-4", score >= s ? "fill-current" : "text-[#4B5563]/20 dark:text-white/20")} />
                      <span className="text-xs font-bold">{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Save Reflection
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
