import { compile, EvalFunction } from 'mathjs';
import { PiecewisePiece, SliderParams } from '../data/levels';

export interface CurvePoint {
  x: number;
  y: number;
}

export interface SampledCurveResult {
  points: CurvePoint[];
  valid: boolean;
  error?: string;
}

// Build a clean human-readable formula string from slider parameters
export function buildEquationFromSliders(params: SliderParams): string {
  const { parent, a, b, h, k } = params;
  const hSign = h >= 0 ? `- ${Math.abs(h)}` : `+ ${Math.abs(h)}`;
  const kSign = k >= 0 ? `+ ${Math.abs(k)}` : `- ${Math.abs(k)}`;

  switch (parent) {
    case 'quadratic':
      return `${a} * (x ${hSign})^2 ${kSign}`;
    case 'exponential':
      return `${a} * ${b}^(x ${hSign}) ${kSign}`;
    case 'sine':
      return `${a} * sin(${b} * (x ${hSign})) ${kSign}`;
    case 'cosine':
      return `${a} * cos(${b} * (x ${hSign})) ${kSign}`;
    case 'abs':
      return `${a} * abs(x ${hSign}) ${kSign}`;
    case 'linear':
    default:
      return `${a} * (x ${hSign}) ${kSign}`;
  }
}

// Safely compile an equation with mathjs; reject forbidden tokens so eval is never used
export function safeCompileEquation(rawEquation: string): { fn?: EvalFunction; error?: string } {
  let clean = rawEquation.trim();
  if (!clean) {
    return { error: "Hmm, I can't read that yet" };
  }
  // Strip leading 'y =' or 'f(x) ='
  clean = clean.replace(/^(?:y|f\(x\))\s*=\s*/i, '');
  // Normalize unicode mathematical characters
  clean = clean.replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/');

  // Only allow safe mathematical characters and function names
  const forbidden = /[;{}\[\]"`$\\]/;
  if (forbidden.test(clean)) {
    return { error: "Hmm, I can't read that yet" };
  }
  try {
    const compiled = compile(clean);
    // Test evaluation at x = 0 or x = 1 to catch undefined symbols early
    let testVal: unknown;
    try {
      testVal = compiled.evaluate({ x: 0, e: Math.E, pi: Math.PI });
    } catch {
      testVal = compiled.evaluate({ x: 1, e: Math.E, pi: Math.PI });
    }
    if (typeof testVal !== 'number' && typeof testVal !== 'object') {
      return { error: "Hmm, I can't read that yet" };
    }
    return { fn: compiled };
  } catch {
    return { error: "Hmm, I can't read that yet" };
  }
}

// Sample a single equation over [x1, x2] shifted by a local tee origin [ox, oy]
export function sampleSingleCurve(
  equation: string,
  domain: [number, number],
  origin: [number, number] = [0, 0],
  dx = 0.02
): SampledCurveResult {
  const { fn, error } = safeCompileEquation(equation);
  if (!fn || error) {
    return { points: [], valid: false, error: error ?? "Hmm, I can't read that yet" };
  }

  const [x1, x2] = domain;
  if (!(x2 > x1)) {
    return { points: [], valid: false, error: 'Make sure x2 is greater than x1!' };
  }

  const [ox, oy] = origin;
  // Auto-shift local equation so f_shifted(x_local) starts right at the ball's resting origin
  let startOffset = 0;
  try {
    const yAtStart = Number(fn.evaluate({ x: x1, e: Math.E, pi: Math.PI }));
    if (Number.isFinite(yAtStart)) {
      // Only apply continuation shift when shooting from an intermediate resting spot
      if (ox !== 0 || oy !== 0) {
        startOffset = oy - yAtStart;
      }
    }
  } catch {
    return { points: [], valid: false, error: "Hmm, I can't read that yet" };
  }

  const points: CurvePoint[] = [];
  const steps = Math.max(2, Math.ceil((x2 - x1) / dx));

  for (let i = 0; i <= steps; i++) {
    const localX = i === steps ? x2 : x1 + i * dx;
    try {
      const rawY = Number(fn.evaluate({ x: localX, e: Math.E, pi: Math.PI }));
      if (!Number.isFinite(rawY) || Math.abs(rawY) > 60) {
        continue;
      }
      const worldX = ox !== 0 || oy !== 0 ? ox + (localX - x1) : localX;
      const worldY = ox !== 0 || oy !== 0 ? rawY + startOffset : rawY;
      points.push({ x: worldX, y: worldY });
    } catch {
      return { points: [], valid: false, error: "Hmm, I can't read that yet" };
    }
  }

  if (points.length < 2) {
    return { points: [], valid: false, error: "Hmm, I can't read that yet" };
  }

  return { points, valid: true };
}

// Sample a piecewise chain of 2-3 club slots into one combined flight path
export function samplePiecewiseCurve(
  pieces: PiecewisePiece[],
  dx = 0.02
): SampledCurveResult {
  const combined: CurvePoint[] = [];

  for (let idx = 0; idx < pieces.length; idx++) {
    const piece = pieces[idx];
    const res = sampleSingleCurve(piece.equation, piece.domain, [0, 0], dx);
    if (!res.valid) {
      return { points: [], valid: false, error: `Club ${idx + 1}: ${res.error}` };
    }
    if (idx > 0 && combined.length > 0 && res.points.length > 0) {
      // Check continuity gap between pieces
      const prevEnd = combined[combined.length - 1];
      const nextStart = res.points[0];
      const gap = Math.hypot(nextStart.x - prevEnd.x, nextStart.y - prevEnd.y);
      if (gap > 0.65) {
        return {
          points: [...combined, ...res.points],
          valid: false,
          error: `Clubs ${idx} & ${idx + 1} don't meet! Close the gap at x = ${piece.domain[0]}.`
        };
      }
    }
    combined.push(...res.points);
  }

  return { points: combined, valid: combined.length >= 2 };
}
