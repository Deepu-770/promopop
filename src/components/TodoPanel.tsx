import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Play } from 'lucide-react';
import { TodoTask } from '@/src/types';
import { cn } from '@/src/lib/utils';

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
        <h3 className="text-xs font-bold text-[#6E6E80] dark:text-white/40 uppercase tracking-[0.2em]">Today's Focus</h3>
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {(tasks || []).filter(t => !t.completed).length}
        </span>
      </div>

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

      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
        {(!tasks || tasks.length === 0) ? (
          <div className="text-center py-4 text-[#6E6E80]/40 dark:text-white/20 text-xs font-medium italic">
            No tasks for today
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 hover:border-primary/20 transition-all"
            >
              <button onClick={() => onToggleTask(task.id)} className="shrink-0">
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-[#6E6E80]/40 dark:text-white/20 group-hover:text-primary/40" />
                )}
              </button>
              
              <span className={cn(
                "flex-1 text-xs font-medium truncate text-[#0D0D0D] dark:text-white",
                task.completed && "opacity-40 line-through"
              )}>
                {task.text}
              </span>

              {!task.completed && (
                <button
                  onClick={() => onStartFromTask(task)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded-lg text-primary transition-all"
                  title="Start focus with this task"
                >
                  <Play className="w-3 h-3 fill-current" />
                </button>
              )}

              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded-lg text-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
