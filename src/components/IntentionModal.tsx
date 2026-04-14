import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Target, Tag, X } from 'lucide-react';
import { CATEGORIES, Category } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface IntentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (intention: string, category: Category) => void;
}

export const IntentionModal: React.FC<IntentionModalProps> = ({ isOpen, onClose, onStart }) => {
  const [intention, setIntention] = useState('');
  const [category, setCategory] = useState<Category>('Study');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (intention.trim()) {
      onStart(intention, category);
      setIntention('');
    }
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
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Target className="text-primary w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#374151] dark:text-white">Set Your Intention</h2>
              </div>
              <button onClick={onClose} className="p-2 text-[#4B5563]/40 dark:text-white/40 hover:text-[#4B5563] dark:hover:text-white transition-opacity">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#4B5563]/40 dark:text-white/40 mb-2 uppercase tracking-wider">What are you focusing on?</label>
                <input
                  autoFocus
                  type="text"
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="e.g., Finish React components"
                  className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary/30 rounded-2xl px-5 py-4 outline-none transition-all font-medium text-[#4B5563] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4B5563]/40 dark:text-white/40 mb-3 uppercase tracking-wider">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                        category === cat
                          ? "bg-primary text-white border-primary"
                          : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 text-[#4B5563] dark:text-white"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!intention.trim()}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                Start Focusing
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
