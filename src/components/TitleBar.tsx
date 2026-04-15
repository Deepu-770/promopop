import React from 'react';
import { Minus, Square, X, Layers } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface TitleBarProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  isMaximized: boolean;
  title?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  onMinimize,
  onMaximize,
  onClose,
  isMaximized,
  title = "Tempo"
}) => {
  return (
    <div className="h-10 flex items-center justify-between px-4 bg-white/80 dark:bg-black/20 backdrop-blur-md border-b border-[#E5E5E5] dark:border-white/5 select-none shrink-0 z-[110]">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
          <Layers className="text-white w-3 h-3" />
        </div>
        <span className="text-[10px] uppercase font-bold text-[#6E6E80] dark:text-gray-400 tracking-[0.1em]">
          {title}
        </span>
      </div>
      
      <div className="flex items-center h-full">
        <button 
          onClick={onMinimize}
          className="h-full px-3 flex items-center justify-center hover:bg-black/[0.03] dark:hover:bg-white/5 transition-colors group"
        >
          <Minus className="w-3.5 h-3.5 text-[#6E6E80] group-hover:text-[#0D0D0D] dark:group-hover:text-white" />
        </button>
        <button 
          onClick={onMaximize}
          className="h-full px-3 flex items-center justify-center hover:bg-black/[0.03] dark:hover:bg-white/5 transition-colors group"
        >
          <Square className={cn("w-3 h-3 text-[#6E6E80] group-hover:text-[#0D0D0D] dark:group-hover:text-white", isMaximized && "scale-90")} />
        </button>
        <button 
          onClick={onClose}
          className="h-full px-4 flex items-center justify-center hover:bg-red-500 transition-colors group"
        >
          <X className="w-3.5 h-3.5 text-[#6E6E80] group-hover:text-white dark:group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};
