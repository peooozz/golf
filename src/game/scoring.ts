import { ConceptKey } from '../data/levels';

export interface LevelScoreRecord {
  strokes: number;
  stars: 1 | 2 | 3;
}

// Compute 1-3 stars from strokes vs par
export function calculateStars(strokes: number, par: number): 1 | 2 | 3 {
  if (strokes <= par) return 3;
  if (strokes === par + 1) return 2;
  return 1;
}

// Compute XP earned for completing a hole
export function calculateXpReward(strokes: number, par: number): number {
  const stars = calculateStars(strokes, par);
  const holeInOneBonus = strokes === 1 ? 50 : 0;
  return stars * 40 + holeInOneBonus;
}

// Update 0..3 concept mastery dots when a player clears a level
export function updateConceptMastery(
  current: Record<ConceptKey, number>,
  concept: ConceptKey,
  stars: 1 | 2 | 3
): Record<ConceptKey, number> {
  const prev = current[concept] ?? 0;
  const gain = stars === 3 ? 1 : 0.5;
  return {
    ...current,
    [concept]: Math.min(3, Math.round((prev + gain) * 2) / 2)
  };
}
