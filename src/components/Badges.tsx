import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Badge } from '@/src/types';

interface BadgesProps {
  badges: Badge[];
}

export const Badges: React.FC<BadgesProps> = ({ badges }) => {
  const categories: ('Progress' | 'Consistency' | 'Performance')[] = ['Progress', 'Consistency', 'Performance'];

  return (
    <div className="h-full flex flex-col items-center space-y-8 p-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-white">Your Badges</h2>
      
      {categories.map(category => (
        <div key={category} className="w-full max-w-lg space-y-4">
          <h3 className="text-lg font-bold text-white/60">{category}</h3>
          <div className="grid grid-cols-1 gap-4">
            {badges.filter(b => b.category === category).map((badge) => (
              <motion.div 
                key={badge.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-4 rounded-2xl border flex items-center gap-4 transition-all relative overflow-hidden",
                  badge.unlocked 
                    ? "bg-primary/20 border-primary/50 text-white" 
                    : "bg-white/5 border-white/10 text-white/30"
                )}
              >
                {badge.unlocked && (
                  <motion.div 
                    className="absolute inset-0 bg-primary/20 blur-xl"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: 0 }}
                  />
                )}
                <div className="text-4xl relative z-10">{badge.icon}</div>
                <div className="flex-1 relative z-10">
                  <div className="font-bold">{badge.title}</div>
                  <div className="text-xs">{badge.condition}</div>
                  {!badge.unlocked && (
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${badge.progress}%` }} 
                      />
                    </div>
                  )}
                </div>
                {badge.unlocked && (
                  <div className="text-xs font-bold bg-primary px-2 py-1 rounded-full relative z-10">Unlocked</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
