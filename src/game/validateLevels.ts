import { LEVELS, LevelConfig } from '../data/levels';
import { samplePiecewiseCurve, sampleSingleCurve } from './mathEngine';
import { evaluateCurveCollision } from './collision';

export interface LevelValidationReport {
  id: string;
  title: string;
  solvable: boolean;
  reason?: string;
}

// Programmatically verify that every level's solution reaches the hole without hitting obstacles
export function validateAllLevels(levels: LevelConfig[] = LEVELS): LevelValidationReport[] {
  return levels.map((lvl) => {
    const sampled =
      lvl.solution.pieces && lvl.solution.pieces.length > 0
        ? samplePiecewiseCurve(lvl.solution.pieces, 0.02)
        : sampleSingleCurve(lvl.solution.equation, lvl.solution.domain, lvl.tee, 0.02);

    if (!sampled.valid || sampled.points.length < 2) {
      return {
        id: lvl.id,
        title: lvl.title,
        solvable: false,
        reason: sampled.error ?? 'Failed to sample solution curve'
      };
    }

    const startPt = sampled.points[0];
    const distFromTee = Math.hypot(startPt.x - lvl.tee[0], startPt.y - lvl.tee[1]);
    if (distFromTee > 0.55) {
      return {
        id: lvl.id,
        title: lvl.title,
        solvable: false,
        reason: `Solution starts at (${startPt.x.toFixed(2)}, ${startPt.y.toFixed(2)}), too far from tee (${lvl.tee[0]}, ${lvl.tee[1]})`
      };
    }

    const outcome = evaluateCurveCollision(
      sampled.points,
      lvl.obstacles,
      lvl.hole,
      lvl.tolerance
    );

    if (outcome.hitObstacle) {
      return {
        id: lvl.id,
        title: lvl.title,
        solvable: false,
        reason: `Solution hit obstacle (${outcome.obstacleType}) at (${outcome.hitPoint?.x.toFixed(2)}, ${outcome.hitPoint?.y.toFixed(2)})`
      };
    }

    if (!outcome.inHole) {
      const endPt = sampled.points[sampled.points.length - 1];
      return {
        id: lvl.id,
        title: lvl.title,
        solvable: false,
        reason: `Solution ended at (${endPt.x.toFixed(2)}, ${endPt.y.toFixed(2)}), outside hole (${lvl.hole[0]}, ${lvl.hole[1]})`
      };
    }

    return { id: lvl.id, title: lvl.title, solvable: true };
  });
}
