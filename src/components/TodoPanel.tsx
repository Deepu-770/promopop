import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Play, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TodoTask } from '@/src/types';
import { cn } from '@/src/lib/utils';
import { format, isSameDay, isSameMonth, parseISO } from 'date-fns';

interface TodoPanelProps {
  tasks: TodoTask[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onStartFromTask: (task: TodoTask) => void;
  isCollapsed: boolean;
}

export const TodoPanel: React.FC<TodoPanelProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onStartFromTask,
  isCollapsed
}) => {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'day' | 'month'>('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => {
      const taskDate = parseISO(task.createdAt);
      if (filter === 'day') return isSameDay(taskDate, selectedDate);
      if (filter === 'month') return isSameMonth(taskDate, selectedDate);
      return true;
    });
  }, [tasks, filter, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAddTask(newTodo);
      setNewTodo('');
    }
  };

  if (isCollapsed) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-[#0D0D0D] dark:text-white uppercase tracking-widest opacity-40">Tasks</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white">
            <Filter className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {(tasks || []).filter(t => !t.completed).length} / {(tasks || []).length}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            ref={filterRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 right-6 bg-[#171717] border border-white/10 rounded-xl p-4 shadow-xl space-y-3 w-64"
          >
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Filter</h4>
              <div className="flex items-center gap-2">
                <button onClick={() => { setFilter('all'); setSelectedDate(new Date()); setIsFilterOpen(false); }} className="text-[10px] text-primary hover:underline">Reset</button>
                <button onClick={() => setIsFilterOpen(false)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full bg-[#262626] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
            >
              <option value="all" className="text-white bg-[#262626]">All Time</option>
              <option value="day" className="text-white bg-[#262626]">By Day</option>
              <option value="month" className="text-white bg-[#262626]">By Month</option>
            </select>
            {filter !== 'all' && (
              <input 
                type="date" 
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                className="w-full bg-[#262626] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                style={{ colorScheme: 'dark' }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a task..."
          className="w-full bg-white/50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 focus:border-primary/30 rounded-xl px-4 py-2 text-sm outline-none transition-all pr-10 text-[#0D0D0D] dark:text-white"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary opacity-60 hover:opacity-100 transition-opacity">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="relative pl-8 space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {/* Vertical Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-[#E5E5E5] dark:bg-white/10" />

        {(!filteredTasks || filteredTasks.length === 0) ? (
          <div className="text-center py-4 text-[#6E6E80]/40 dark:text-white/20 text-xs font-medium italic">
            No tasks found
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="relative glass-panel rounded-xl p-4 flex items-center gap-4 border border-[#E5E5E5] dark:border-white/10 hover:border-primary/20 transition-all group"
            >
              {/* Connector line */}
              <div className="absolute -left-4 top-1/2 w-4 h-px bg-[#E5E5E5] dark:bg-white/10" />

              <button onClick={() => onToggleTask(task.id)} className="shrink-0">
                {task.completed ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </motion.div>
                ) : (
                  <Circle className="w-5 h-5 text-[#6E6E80]/40 dark:text-white/20 group-hover:text-primary/40" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm font-bold truncate text-[#0D0D0D] dark:text-white",
                  task.completed && "opacity-40 line-through"
                )}>
                  {task.text}
                </div>
                {task.completed && task.completedAt && (
                  <div className="text-[10px] font-bold text-[#6E6E80] uppercase tracking-widest">
                    Completed {format(new Date(task.completedAt), 'hh:mm a')}
                  </div>
                )}
              </div>

              {!task.completed && (
                <button
                  onClick={() => onStartFromTask(task)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-primary/10 rounded-lg text-primary transition-all"
                  title="Start focus with this task"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}

              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
