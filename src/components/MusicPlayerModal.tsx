import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Heart, X, Music, Volume2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LOFI_TRACKS } from '../constants';

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (v: boolean) => void;
  selectedMusic: string;
  onSelectMusic: (id: string) => void;
  likedTracks: string[];
  onLikeMusic: (id: string) => void;
  dislikedTracks: string[];
}

export const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({
  isOpen,
  onClose,
  isMusicPlaying,
  setIsMusicPlaying,
  selectedMusic,
  onSelectMusic,
  likedTracks,
  onLikeMusic,
  dislikedTracks
}) => {
  const currentTrack = LOFI_TRACKS.find(t => t.id === selectedMusic) || LOFI_TRACKS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm"
          >
            <div className="glass-panel p-6 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Music className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Lo-fi Player</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Track Info Badge */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Volume2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{currentTrack.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Nature Lo-fi</p>
                    </div>
                    <button
                      onClick={() => onLikeMusic(selectedMusic)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                        likedTracks.includes(selectedMusic)
                          ? "bg-red-500/10 border-red-500/20 text-red-500"
                          : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", likedTracks.includes(selectedMusic) && "fill-current")} />
                    </button>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                      className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      {isMusicPlaying ? (
                        <Pause className="w-8 h-8 fill-current" />
                      ) : (
                        <Play className="w-8 h-8 fill-current ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Track Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Change Track</label>
                    <select
                      value={selectedMusic}
                      onChange={(e) => onSelectMusic(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm font-bold text-white/80 hover:bg-white/10 transition-all cursor-pointer appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                    >
                      {LOFI_TRACKS.filter(t => !dislikedTracks.includes(t.id)).map(track => (
                        <option key={track.id} value={track.id} className="bg-[#1A1A1A] text-white">
                          {track.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
