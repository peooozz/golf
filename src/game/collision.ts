import { Obstacle, ObstacleType } from '../data/levels';
import { CurvePoint } from './mathEngine';

export interface CollisionOutcome {
  hitObstacle: boolean;
  obstacleIndex: number | null;
  obstacleType: ObstacleType | null;
  hitPoint: CurvePoint | null;
  inHole: boolean;
  flightPoints: CurvePoint[];
  caddieTip: string;
}

// Check if a single (x, y) point is inside a rectangular or circular obstacle
export function pointHitsObstacle(pt: CurvePoint, obs: Obstacle): boolean {
  if (obs.shape === 'rect') {
    return (
      pt.x >= obs.x &&
      pt.x <= obs.x + obs.w &&
      pt.y >= obs.y &&
      pt.y <= obs.y + obs.h
    );
  }
  const dx = pt.x - obs.cx;
  const dy = pt.y - obs.cy;
  return dx * dx + dy * dy <= obs.r * obs.r;
}

// Generate a plain-language 1-sentence coaching tip based on how the shot missed
function buildCoachingTip(
  lastPt: CurvePoint,
  hole: [number, number],
  hitType: ObstacleType | null,
  hitObs: Obstacle | null
): string {
  const [hx, hy] = hole;
  if (hitType && hitObs) {
    if (hitType === 'wall') {
      return 'You clipped the wall! Increase peak height k or steepen a to arch over it.';
    }
    if (hitType === 'water') {
      return 'Splash! Shift the vertex or trim your Putt Range before the water hazard.';
    }
    if (hitType === 'tree') {
      return 'Rustled the branches! Lower k or flip a to skim underneath the canopy.';
    }
    if (hitType === 'sand') {
      return 'Plugged in the bunker! Shift h so your arc carries past the sand.';
    }
  }

  const dx = lastPt.x - hx;
  const dy = lastPt.y - hy;
  if (Math.abs(dx) > 0.6) {
    return dx < 0
      ? 'Stopped short of the flag! Extend your Putt Range x2 or widen the curve.'
      : 'Flew past the flag! Pull the Putt Range x2 handle back to the hole.';
  }
  if (dy < -0.4) {
    return 'Your curve ended below the cup — try a bigger vertical shift k!';
  }
  if (dy > 0.4) {
    return 'Your curve ended too high above the cup — lower k or adjust stretch a!';
  }
  return 'So close! Fine-tune h or k by a tiny step to drop right in.';
}

// Evaluate sampled curve against all obstacles and the target hole
export function evaluateCurveCollision(
  points: CurvePoint[],
  obstacles: Obstacle[],
  hole: [number, number],
  tolerance: number
): CollisionOutcome {
  if (points.length === 0) {
    return {
      hitObstacle: false,
      obstacleIndex: null,
      obstacleType: null,
      hitPoint: null,
      inHole: false,
      flightPoints: [],
      caddieTip: 'Adjust the sliders to preview your shot!'
    };
  }

  const flightPoints: CurvePoint[] = [];

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    flightPoints.push(pt);

    // Ignore collision at the very first sample so a ball resting near an edge can launch
    if (i > 2) {
      for (let obsIdx = 0; obsIdx < obstacles.length; obsIdx++) {
        const obs = obstacles[obsIdx];
        if (pointHitsObstacle(pt, obs)) {
          return {
            hitObstacle: true,
            obstacleIndex: obsIdx,
            obstacleType: obs.type,
            hitPoint: pt,
            inHole: false,
            flightPoints,
            caddieTip: buildCoachingTip(pt, hole, obs.type, obs)
          };
        }
      }
    }
  }

  const lastPt = flightPoints[flightPoints.length - 1];
  const distToHole = Math.hypot(lastPt.x - hole[0], lastPt.y - hole[1]);
  const inHole = distToHole <= tolerance;

  return {
    hitObstacle: false,
    obstacleIndex: null,
    obstacleType: null,
    hitPoint: null,
    inHole,
    flightPoints,
    caddieTip: inHole
      ? 'Sweet swing! That curve drops right into the cup!'
      : buildCoachingTip(lastPt, hole, null, null)
  };
}
