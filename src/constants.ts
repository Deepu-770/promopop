import { Badge } from './types';

/**
 * LO-FI MUSIC REGISTRY
 * To add new music:
 * 1. Add your audio file to the project (or use a URL)
 * 2. Add a new entry to the LOFI_TRACKS array below
 * 3. The system will automatically include it in the shuffle logic
 */
export const LOFI_TRACKS = [
  { id: 'track-1', name: 'Rainy Nights', url: '/media/track-1.ogg' },
  { id: 'track-2', name: 'Calm Study', url: '/media/track-2.ogg' },
  { id: 'track-3', name: 'Peaceful Mind', url: '/media/track-3.ogg' },
  { id: 'track-4', name: 'Night Focus', url: '/media/track-4.ogg' },
  { id: 'track-5', name: 'Deep Work Flow', url: '/media/track-5.ogg' },
  { id: 'track-6', name: 'Coffee Shop Vibes', url: '/media/track-6.ogg' },
  { id: 'track-7', name: 'Forest Calm', url: '/media/track-7.ogg' },
  { id: 'track-8', name: 'Space Drift', url: '/media/track-8.ogg' },
];

export const BADGES: Badge[] = [
  { id: 'b1', title: 'Seedling Apprentice', category: 'Progress', condition: '10 trees, 5 hours', treesBenchmark: 10, hoursBenchmark: 5, benchmark: 10, progress: 0, unlocked: false, icon: '🌱' },
  { id: 'b2', title: 'Sprout Guardian', category: 'Progress', condition: '50 trees, 25 hours', treesBenchmark: 50, hoursBenchmark: 25, benchmark: 50, progress: 0, unlocked: false, icon: '🌿' },
  { id: 'b3', title: 'Sapling Sage', category: 'Progress', condition: '100 trees, 50 hours', treesBenchmark: 100, hoursBenchmark: 50, benchmark: 100, progress: 0, unlocked: false, icon: '🌳' },
  { id: 'b4', title: 'Grove Keeper', category: 'Progress', condition: '250 trees, 125 hours', treesBenchmark: 250, hoursBenchmark: 125, benchmark: 250, progress: 0, unlocked: false, icon: '🌲' },
  { id: 'b5', title: 'Forest Warden', category: 'Consistency', condition: '500 trees, 250 hours', treesBenchmark: 500, hoursBenchmark: 250, benchmark: 500, progress: 0, unlocked: false, icon: '🪵' },
  { id: 'b6', title: 'Ancient Arborist', category: 'Consistency', condition: '1000 trees, 500 hours', treesBenchmark: 1000, hoursBenchmark: 500, benchmark: 1000, progress: 0, unlocked: false, icon: '🍂' },
  { id: 'b7', title: 'Titan of Timber', category: 'Performance', condition: '2000 trees, 750 hours', treesBenchmark: 2000, hoursBenchmark: 750, benchmark: 2000, progress: 0, unlocked: false, icon: '🪵' },
  { id: 'b8', title: 'Ethereal Ent', category: 'Performance', condition: '3000 trees, 850 hours', treesBenchmark: 3000, hoursBenchmark: 850, benchmark: 3000, progress: 0, unlocked: false, icon: '✨' },
  { id: 'b9', title: 'Celestial Canopy', category: 'Performance', condition: '4000 trees, 950 hours', treesBenchmark: 4000, hoursBenchmark: 950, benchmark: 4000, progress: 0, unlocked: false, icon: '🌌' },
  { id: 'b10', title: 'World Tree Architect', category: 'Performance', condition: '5000 trees, 1000 hours', treesBenchmark: 5000, hoursBenchmark: 1000, benchmark: 5000, progress: 0, unlocked: false, icon: '🌍' },
];

export const APP_VERSION = 'v1.0.3';

