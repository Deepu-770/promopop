import { Badge } from './types';

/**
 * LO-FI MUSIC REGISTRY
 * To add new music:
 * 1. Add your audio file to the project (or use a URL)
 * 2. Add a new entry to the LOFI_TRACKS array below
 * 3. The system will automatically include it in the shuffle logic
 */
export const LOFI_TRACKS = [
  { id: 'nature-1', name: 'Rainforest Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'nature-2', name: 'Ocean Waves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'nature-3', name: 'Mountain Stream', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'nature-4', name: 'Forest Birds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: 'nature-5', name: 'Summer Night', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: 'nature-6', name: 'Windy Peak', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: 'nature-7', name: 'Soft Thunder', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: 'nature-8', name: 'Crackling Fire', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'nature-9', name: 'Morning Mist', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: 'nature-10', name: 'Deep Forest', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
  { id: 'lofi-1', name: 'Midnight Study', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1234567890.mp3' },
  { id: 'lofi-2', name: 'Coffee Shop', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73056.mp3' },
  { id: 'lofi-3', name: 'Rainy Window', url: 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3' },
  { id: 'lofi-4', name: 'Sunset Drive', url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_31743c5825.mp3' },
  { id: 'lofi-5', name: 'Library Silence', url: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1301.mp3' },
  { id: 'lofi-6', name: 'Urban Night', url: 'https://cdn.pixabay.com/audio/2022/04/27/audio_783ed3a0e0.mp3' },
  { id: 'lofi-7', name: 'Dreamy Keys', url: 'https://cdn.pixabay.com/audio/2022/05/17/audio_51743c5825.mp3' },
  { id: 'lofi-8', name: 'Chill Hop', url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_91b32e02f9.mp3' },
  { id: 'lofi-9', name: 'Soft Vinyl', url: 'https://cdn.pixabay.com/audio/2022/07/17/audio_c8c8a73056.mp3' },
  { id: 'lofi-10', name: 'Stargazing', url: 'https://cdn.pixabay.com/audio/2022/08/27/audio_1234567890.mp3' },
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

