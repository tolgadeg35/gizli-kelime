import { SecretData, GameSettings, Difficulty } from '../types';
import { STATIC_WORD_POOL } from '../data/wordPool';

// AI (GoogleGenAI) imports and initialization removed.
// This service now works 100% offline using the local wordPool.

export const generateSecretData = async (settings: GameSettings): Promise<SecretData> => {
  const { categories, difficulty } = settings;
  
  let pool = STATIC_WORD_POOL;
  let filteredPool = pool;

  // 1. First Pass: Try to filter by BOTH Category and Difficulty
  // Only filter by difficulty if a specific difficulty is chosen (not RANDOM)
  if (difficulty && difficulty !== Difficulty.RANDOM) {
    filteredPool = filteredPool.filter(w => w.difficulties.includes(difficulty));
  }
  
  if (categories && categories.length > 0) {
    filteredPool = filteredPool.filter(w => w.categories.some(cat => categories.includes(cat)));
  }

  // 2. Fallback Mechanism
  // If the specific combination (e.g., "Space" category + "Easy" difficulty) yields no results,
  // we relax the rules to ensure the game continues instead of crashing.
  
  // If empty, try filtering ONLY by Category (ignore difficulty)
  if (filteredPool.length === 0 && categories && categories.length > 0) {
    filteredPool = pool.filter(w => w.categories.some(cat => categories.includes(cat)));
  }

  // If still empty (or if no categories were selected but difficulty was too strict), try filtering ONLY by Difficulty
  // Only try this fallback if difficulty is NOT random (since random implies we accept anything)
  if (filteredPool.length === 0 && difficulty && difficulty !== Difficulty.RANDOM) {
    filteredPool = pool.filter(w => w.difficulties.includes(difficulty));
  }

  // If absolutely nothing matches (shouldn't happen with default data), use the entire pool
  if (filteredPool.length === 0) {
    filteredPool = pool;
  }

  // Pick a random word from the final filtered pool
  const randomIdx = Math.floor(Math.random() * filteredPool.length);
  const selected = filteredPool[randomIdx];

  // Artificial delay to mimic "thinking" and give UI time to show loading state (optional but looks nice)
  await new Promise(r => setTimeout(r, 600)); 
  
  return {
    word: selected.word,
    category: selected.categories.join(', '), 
    imposterHint: selected.imposterHint
  };
};