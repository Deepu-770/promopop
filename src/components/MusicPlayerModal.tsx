import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Heart, X, Music, Volume2, Upload, FolderUp, Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LOFI_TRACKS } from '../constants';
import { Track } from '@/src/types';

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
  localTracks: Track[];
  setLocalTracks: (tracks: Track[]) => void;
  volume: number;
  setVolume: (v: number) => void;
  isLooping: boolean;
  setIsLooping: (v: boolean) => void;
  isShuffling: boolean;
  setIsShuffling: (v: boolean) => void;
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
  dislikedTracks,
  localTracks,
  setLocalTracks,
  volume,
  setVolume,
  isLooping,
  setIsLooping,
  isShuffling,
  setIsShuffling
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const allTracks = [...LOFI_TRACKS, ...localTracks];
  const currentTrack = allTracks.find(t => t.id === selectedMusic) || allTracks[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setLocalTracks([...localTracks, ...newTracks]);
    }
  };

  const playNext = () => {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * allTracks.length);
      onSelectMusic(allTracks[randomIndex].id);
    } else {
      const currentIndex = allTracks.findIndex(t => t.id === selectedMusic);
      const nextIndex = (currentIndex + 1) % allTracks.length;
      onSelectMusic(allTracks[nextIndex].id);
    }
  };

  const playPrevious = () => {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * allTracks.length);
      onSelectMusic(allTracks[randomIndex].id);
    } else {
      const currentIndex = allTracks.findIndex(t => t.id === selectedMusic);
      const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
      onSelectMusic(allTracks[prevIndex].id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm"
          >
            <div className="glass-panel p-6 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
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
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Volume2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{currentTrack.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Lo-fi Beats</p>
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

                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setIsShuffling(!isShuffling)}
                      className={cn("p-3 rounded-full transition-all", isShuffling ? "text-primary bg-primary/10" : "text-white/40 hover:text-white")}
                    >
                      <Shuffle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={playPrevious}
                      className="p-3 rounded-full text-white/40 hover:text-white transition-all"
                    >
                      <SkipBack className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                      className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      {isMusicPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                    </button>
                    <button
                      onClick={playNext}
                      className="p-3 rounded-full text-white/40 hover:text-white transition-all"
                    >
                      <SkipForward className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={cn("p-3 rounded-full transition-all", isLooping ? "text-primary bg-primary/10" : "text-white/40 hover:text-white")}
                    >
                      <Repeat className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 rounded-xl transition-all">
                      <Upload className="w-4 h-4" /> Add File
                    </button>
                    <button onClick={() => folderInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 rounded-xl transition-all">
                      <FolderUp className="w-4 h-4" /> Add Folder
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" multiple className="hidden" />
                    <input type="file" ref={folderInputRef} onChange={handleFileUpload} webkitdirectory="true" directory="true" multiple className="hidden" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1">Change Track</label>
                    <select
                      value={selectedMusic}
                      onChange={(e) => onSelectMusic(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-sm font-bold text-white/80 hover:bg-white/10 transition-all cursor-pointer appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                    >
                      {allTracks.filter(t => !dislikedTracks.includes(t.id)).map(track => (
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
