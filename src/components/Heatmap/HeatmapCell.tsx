import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface HeatmapCellProps {
  date: string;
  count: number;
  intensity: number;
  label: string;
  metric: string;
  rowIndex: number;
}

export const HeatmapCell: React.FC<HeatmapCellProps> = ({ date, count, intensity, label, metric, rowIndex }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.2, zIndex: 100 }}
      className={cn(
        "w-3 h-3 rounded-[2px] transition-colors duration-300 cursor-pointer relative group",
        intensity === 0 && "bg-white/5",
        intensity === 1 && "bg-[#0e4429]",
        intensity === 2 && "bg-[#006d32]",
        intensity === 3 && "bg-[#26a641]",
        intensity === 4 && "bg-[#39d353]"
      )}
    >
      {/* Tooltip */}
      <div className={cn(
        "absolute left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1A1A] border border-white/10 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] shadow-xl",
        rowIndex < 2 ? "top-full mt-2" : "bottom-full mb-2"
      )}>
        <span className="font-bold">{metric === 'hours' ? count.toFixed(1) : Math.round(count)} {label}</span>
        <span className="text-white/40 ml-1">on {date}</span>
      </div>
    </motion.div>
  );
};
