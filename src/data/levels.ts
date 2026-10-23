export type ObstacleType = 'water' | 'sand' | 'wall' | 'tree';
export type ParentFunctionType = 'quadratic' | 'exponential' | 'sine' | 'cosine' | 'linear' | 'abs';
export type ConceptKey = 'shifts' | 'stretch' | 'reflect' | 'domain' | 'exponential' | 'trig' | 'piecewise';

export interface RectObstacle {
  type: ObstacleType;
  shape: 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CircleObstacle {
  type: ObstacleType;
  shape: 'circle';
  cx: number;
  cy: number;
  r: number;
}

export type Obstacle = RectObstacle | CircleObstacle;

export interface PiecewisePiece {
  equation: string;
  domain: [number, number];
}

export interface SliderParams {
  parent: ParentFunctionType;
  a: number;
  b: number;
  h: number;
  k: number;
}

export interface LevelConfig {
  id: string;
  world: number;
  worldTitle: string;
  title: string;
  goal: string;
  tee: [number, number];
  hole: [number, number];
  tolerance: number;
  par: number;
  obstacles: Obstacle[];
  allowedParents: ParentFunctionType[];
  unlocked: Array<'a' | 'b' | 'h' | 'k' | 'domain' | 'typed' | 'piecewise'>;
  defaultParams: SliderParams;
  defaultDomain: [number, number];
  caddieIntro: string;
  hints: [string, string, string];
  aha: string;
  concept: ConceptKey;
  solution: {
    equation: string;
    domain: [number, number];
    pieces?: PiecewisePiece[];
  };
}

export const WORLD_NAMES: Record<number, { title: string; subtitle: string; concept: ConceptKey }> = {
  1: { title: 'Driving Range', subtitle: 'Horizontal & Vertical Shifts', concept: 'shifts' },
  2: { title: 'Fairway Stretch', subtitle: 'Stretches & Reflections', concept: 'stretch' },
  3: { title: 'Bunker Bay', subtitle: 'Domain & Range Restrictions', concept: 'domain' },
  4: { title: 'Growth Gardens', subtitle: 'Exponential Curves & Asymptotes', concept: 'exponential' },
  5: { title: 'Wave Valley', subtitle: 'Sine & Cosine Waves', concept: 'trig' },
  6: { title: 'Pro Tour', subtitle: 'Piecewise Multi-Club Shots', concept: 'piecewise' }
};

export const LEVELS: LevelConfig[] = [
  // ================= WORLD 1: DRIVING RANGE (SHIFTS) =================
  {
    id: '1-1',
    world: 1,
    worldTitle: 'Driving Range',
    title: 'First Arc',
    goal: 'Shift the parabola peak to (4, 4) so it drops right into (8, 0).',
    tee: [0, 0],
    hole: [8, 0],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'sand', shape: 'rect', x: 3.2, y: -1.2, w: 1.6, h: 1.2 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['h', 'k'],
    defaultParams: { parent: 'quadratic', a: -0.25, b: 1, h: 2, k: 2 },
    defaultDomain: [0, 8],
    caddieIntro: 'Slide h to 4 and k to 4 to arch over the sand!',
    hints: [
      'h moves the peak left or right; k moves it up or down.',
      'To peak halfway to x = 8, set h = 4.',
      'Set h = 4 and k = 4 for y = -0.25(x - 4)^2 + 4.'
    ],
    aha: 'Subtracting h inside (x - h) shifts the graph right!',
    concept: 'shifts',
    solution: { equation: '-0.25 * (x - 4)^2 + 4', domain: [0, 8] }
  },
  {
    id: '1-2',
    world: 1,
    worldTitle: 'Driving Range',
    title: 'Sunken Green',
    goal: 'Land in the sunken cup at (6, -3) while clearing the pond.',
    tee: [0, 0],
    hole: [6, -3],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'water', shape: 'rect', x: 1.2, y: -1.5, w: 2.2, h: 1.4 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['h', 'k'],
    defaultParams: { parent: 'quadratic', a: -0.25, b: 1, h: 1, k: 2 },
    defaultDomain: [0, 6],
    caddieIntro: 'Shift the vertex to (2, 1) so the curve arcs over the pond!',
    hints: [
      'The pond sits between x = 1.2 and x = 3.4.',
      'If the vertex is at h = 2, k = 1, check where x = 0 and x = 6 land!',
      'Set h = 2 and k = 1 for y = -0.25(x - 2)^2 + 1.'
    ],
    aha: 'Vertex (h, k) anchors the highest point of a downward parabola.',
    concept: 'shifts',
    solution: { equation: '-0.25 * (x - 2)^2 + 1', domain: [0, 6] }
  },
  {
    id: '1-3',
    world: 1,
    worldTitle: 'Driving Range',
    title: 'Range Boss: Valley Dip',
    goal: 'Skim under the low tree canopy and rise up to the flag at (8, 0).',
    tee: [0, 0],
    hole: [8, 0],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'tree', shape: 'circle', cx: 4, cy: 2.2, r: 1.6 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['h', 'k'],
    defaultParams: { parent: 'quadratic', a: 0.25, b: 1, h: 2, k: -1 },
    defaultDomain: [0, 8],
    caddieIntro: 'Low branches ahead! Dip the vertex below ground with negative k.',
    hints: [
      'This parabola opens upward (a = 0.25), so the vertex is at the bottom.',
      'Place the bottom of the dip at x = 4.',
      'Set h = 4 and k = -4 for y = 0.25(x - 4)^2 - 4.'
    ],
    aha: 'A negative k shifts the entire curve downward below the x-axis!',
    concept: 'shifts',
    solution: { equation: '0.25 * (x - 4)^2 - 4', domain: [0, 8] }
  },

  // ================= WORLD 2: FAIRWAY STRETCH (STRETCHES & REFLECTIONS) =================
  {
    id: '2-1',
    world: 2,
    worldTitle: 'Fairway Stretch',
    title: 'Over the Brick Wall',
    goal: 'Flip and stretch a so the parabola clears the high brick wall.',
    tee: [0, 0],
    hole: [6, 0],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'wall', shape: 'rect', x: 2.6, y: 0, w: 0.8, h: 3.2 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['a', 'h', 'k'],
    defaultParams: { parent: 'quadratic', a: -0.25, b: 1, h: 3, k: 4.5 },
    defaultDomain: [0, 6],
    caddieIntro: 'Tune a, h, and k together so the curve starts at (0,0) and clears the wall!',
    hints: [
      'Peak halfway to the hole at h = 3, above the wall (k = 4.5).',
      'To pass through (0,0) when h = 3 and k = 4.5, you need 9a + 4.5 = 0.',
      'Set a = -0.5, h = 3, k = 4.5.'
    ],
    aha: 'Negative a flips the parabola upside down; |a| controls its steepness!',
    concept: 'reflect',
    solution: { equation: '-0.5 * (x - 3)^2 + 4.5', domain: [0, 6] }
  },
  {
    id: '2-2',
    world: 2,
    worldTitle: 'Fairway Stretch',
    title: 'Wide Canyon Glide',
    goal: 'Use a gentle, wide parabola (0 < |a| < 1) to glide across the wide lake.',
    tee: [0, 0],
    hole: [10, 0],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'water', shape: 'rect', x: 1.5, y: -1.5, w: 7.0, h: 1.5 },
      { type: 'tree', shape: 'circle', cx: 5, cy: 5.2, r: 1.3 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['a', 'h', 'k'],
    defaultParams: { parent: 'quadratic', a: -0.25, b: 1, h: 5, k: 2.5 },
    defaultDomain: [0, 10],
    caddieIntro: 'A small |a| makes the parabola wide enough to span 10 yards!',
    hints: [
      'Center the arch at h = 5 and keep the peak under the tree at k = 2.5.',
      'We need a*(0 - 5)^2 + 2.5 = 0, so 25a = -2.5.',
      'Set a = -0.1, h = 5, k = 2.5.'
    ],
    aha: 'Values of |a| between 0 and 1 make the parabola wider!',
    concept: 'stretch',
    solution: { equation: '-0.1 * (x - 5)^2 + 2.5', domain: [0, 10] }
  },
  {
    id: '2-3',
    world: 2,
    worldTitle: 'Fairway Stretch',
    title: 'Fairway Boss: Needle Thread',
    goal: 'Thread between the tall wall and hanging tree to reach (8, -4).',
    tee: [0, 0],
    hole: [8, -4],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'wall', shape: 'rect', x: 2.2, y: -4, w: 0.7, h: 5.5 },
      { type: 'tree', shape: 'circle', cx: 6.2, cy: 3.2, r: 1.4 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['a', 'h', 'k'],
    defaultParams: { parent: 'quadratic', a: -0.25, b: 1, h: 2, k: 3 },
    defaultDomain: [0, 8],
    caddieIntro: 'Peak above the wall at (3, 2.25) with a = -0.25 so it drops into (8, -4)!',
    hints: [
      'Place the vertex at h = 3, k = 2.25 to clear the wall at x = 2.5.',
      'With a = -0.25, y(0) = -0.25(9) + 2.25 = 0 and y(8) = -0.25(25) + 2.25 = -4!',
      'Set a = -0.25, h = 3, k = 2.25.'
    ],
    aha: 'Combining stretch a with vertex (h, k) threads any gap!',
    concept: 'stretch',
    solution: { equation: '-0.25 * (x - 3)^2 + 2.25', domain: [0, 8] }
  },

  // ================= WORLD 3: BUNKER BAY (DOMAIN RESTRICTIONS) =================
  {
    id: '3-1',
    world: 3,
    worldTitle: 'Bunker Bay',
    title: 'Stop on the Island',
    goal: 'Trim the Putt Range (domain) so the ball stops at x = 6 before the water!',
    tee: [0, 0],
    hole: [6, 3],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'water', shape: 'rect', x: 7.0, y: -1, w: 3.5, h: 5.0 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['a', 'h', 'k', 'domain'],
    defaultParams: { parent: 'quadratic', a: -0.25, b: 1, h: 4, k: 4 },
    defaultDomain: [0, 9],
    caddieIntro: 'The curve already passes through (6, 3), but flies into the water! Pull x2 back.',
    hints: [
      'Without a domain stop, the graph keeps going to x = 9 and splashes!',
      'Look at the x-coordinate of the flag: x = 6.',
      'Drag the right Putt Range handle to x2 = 6.'
    ],
    aha: 'Domain {x1 <= x <= x2} controls where a function starts and stops!',
    concept: 'domain',
    solution: { equation: '-0.25 * (x - 4)^2 + 4', domain: [0, 6] }
  },
  {
    id: '3-2',
    world: 3,
    worldTitle: 'Bunker Bay',
    title: 'Cliffside Bunker',
    goal: 'Arc over the bunker and halt right in the cliff cup at (7, -1.75).',
    tee: [0, 0],
    hole: [7, -1.75],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'sand', shape: 'rect', x: 2.0, y: -1.0, w: 2.5, h: 1.2 },
      { type: 'wall', shape: 'rect', x: 7.8, y: -4.0, w: 0.8, h: 6.0 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['a', 'h', 'k', 'domain'],
    defaultParams: { parent: 'quadratic', a: -0.25, b: 1, h: 2, k: 2 },
    defaultDomain: [0, 9],
    caddieIntro: 'Peak at (3, 2.25) and stop the domain at x = 7 before smashing the cliff wall!',
    hints: [
      'With a = -0.25 and h = 3, setting k = 2.25 starts the curve at (0,0).',
      'At x = 7, y = -0.25(7 - 3)^2 + 2.25 = -1.75, right in the cup!',
      'Set a = -0.25, h = 3, k = 2.25 and Putt Range [0, 7].'
    ],
    aha: 'Stopping the domain at x2 = 7 keeps the ball from hitting hazards beyond the hole!',
    concept: 'domain',
    solution: { equation: '-0.25 * (x - 3)^2 + 2.25', domain: [0, 7] }
  },
  {
    id: '3-3',
    world: 3,
    worldTitle: 'Bunker Bay',
    title: 'Bunker Boss: Precision Drop',
    goal: 'Hop over two hazards and stop on a dime at (5, 2.5) before the pond.',
    tee: [0, 0],
    hole: [5, 2.5],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'wall', shape: 'rect', x: 1.8, y: 0, w: 0.6, h: 2.4 },
      { type: 'water', shape: 'rect', x: 5.8, y: -2, w: 3.0, h: 5.5 }
    ],
    allowedParents: ['quadratic'],
    unlocked: ['a', 'h', 'k', 'domain'],
    defaultParams: { parent: 'quadratic', a: -0.5, b: 1, h: 3, k: 3 },
    defaultDomain: [0, 8],
    caddieIntro: 'Shape the parabola to clear the wall and cut the domain right at x = 5!',
    hints: [
      'Use a = -0.5 and h = 3 so the peak is at x = 3.',
      'To start at (0,0), set k = 4.5. Then at x = 5, y = -0.5(4) + 4.5 = 2.5!',
      'Set a = -0.5, h = 3, k = 4.5, and domain [0, 5].'
    ],
    aha: 'Every golf shot is a function restricted to a closed interval [x1, x2].',
    concept: 'domain',
    solution: { equation: '-0.5 * (x - 3)^2 + 4.5', domain: [0, 5] }
  },

  // ================= WORLD 4: GROWTH GARDENS (EXPONENTIALS) =================
  {
    id: '4-1',
    world: 4,
    worldTitle: 'Growth Gardens',
    title: 'Exponential Climb',
    goal: 'Use an exponential curve y = a*b^(x-h) + k to rocket up to the high ledge at (4, 7).',
    tee: [0, 0],
    hole: [4, 7],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'wall', shape: 'rect', x: 3.2, y: 0, w: 0.5, h: 3.5 }
    ],
    allowedParents: ['exponential'],
    unlocked: ['a', 'b', 'h', 'k', 'domain'],
    defaultParams: { parent: 'exponential', a: 1, b: 2, h: 0, k: 0 },
    defaultDomain: [0, 4],
    caddieIntro: 'Exponentials start flat along their k asymptote and shoot upward fast!',
    hints: [
      'With b = 2, 2^0 = 1 at the tee (x = 0) and 2^3 = 8 near the ledge.',
      'Shift down by k = -1 so at x = 0, y = 2^0 - 1 = 0.',
      'Set a = 0.5, b = 2, h = 0, k = -0.5 — or a = 1, b = 2, h = 1, k = -0.5 (try a = 0.5, b = 2, h = 0, k = -0.5 for y(4)=7.5, or a = 1, b = 2, h = 1, k = -0.5 for y(4)=7.5).'
    ],
    aha: 'The horizontal asymptote y = k acts like a floor the exponential launches from!',
    concept: 'exponential',
    solution: { equation: '0.5 * 2^(x - 0) - 0.5', domain: [0, 3.9] }
  },
  {
    id: '4-2',
    world: 4,
    worldTitle: 'Growth Gardens',
    title: 'Soft Landing Decay',
    goal: 'Glide down along the asymptote floor into the valley hole at (6, -3).',
    tee: [0, 0],
    hole: [6, -3],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'tree', shape: 'circle', cx: 2.5, cy: 1.5, r: 1.5 },
      { type: 'sand', shape: 'rect', x: 0.6, y: -4.2, w: 1.2, h: 1.2 }
    ],
    allowedParents: ['exponential'],
    unlocked: ['a', 'b', 'h', 'k', 'domain'],
    defaultParams: { parent: 'exponential', a: 3, b: 0.5, h: 0, k: -1 },
    defaultDomain: [0, 6],
    caddieIntro: 'When 0 < b < 1, the curve decays smoothly toward the asymptote y = k!',
    hints: [
      'Set the horizontal asymptote k = -3 right at the hole depth.',
      'To start at (0, 0) when k = -3 and h = 0, set a = 3.',
      'Set a = 3, b = 0.5, h = 0, k = -3, domain [0, 6].'
    ],
    aha: 'Decay bases (0 < b < 1) flatten out gently along the asymptote y = k!',
    concept: 'exponential',
    solution: { equation: '3 * 0.5^(x - 0) - 3', domain: [0, 6] }
  },
  {
    id: '4-3',
    world: 4,
    worldTitle: 'Growth Gardens',
    title: 'Garden Boss: Cliff Dive',
    goal: 'Stay flat across the table top, then plunge steeply into the deep hole at (5, -7).',
    tee: [0, 0],
    hole: [5, -7],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'water', shape: 'rect', x: 1.0, y: -6.0, w: 2.0, h: 3.8 }
    ],
    allowedParents: ['exponential'],
    unlocked: ['a', 'b', 'h', 'k', 'domain'],
    defaultParams: { parent: 'exponential', a: -0.5, b: 2, h: 0, k: 0.5 },
    defaultDomain: [0, 5],
    caddieIntro: 'A negative a with b = 2 stays high at first, then dives past the water!',
    hints: [
      'Keep a negative so the exponential bends downward.',
      'With a = -0.25, b = 2, h = 0, and k = 0.25, y(0) = 0.',
      'At x = 5, -0.25 * 2^5 + 0.25 = -7.75; try domain [0, 4.85] or a = -0.25, b = 2, h = 0.1, k = 0.25.'
    ],
    aha: 'Reflecting an exponential (a < 0) creates a late, dramatic drop!',
    concept: 'exponential',
    solution: { equation: '-0.25 * 2^(x - 0) + 0.25', domain: [0, 4.85] }
  },

  // ================= WORLD 5: WAVE VALLEY (TRIGONOMETRY) =================
  {
    id: '5-1',
    world: 5,
    worldTitle: 'Wave Valley',
    title: 'Sine Wave Slalom',
    goal: 'Weave over the bunker and under the tree using a sine wave to hit (6, 0).',
    tee: [0, 0],
    hole: [6, 0],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'sand', shape: 'rect', x: 1.0, y: -1.5, w: 1.4, h: 1.8 },
      { type: 'tree', shape: 'circle', cx: 4.5, cy: 1.8, r: 1.4 }
    ],
    allowedParents: ['sine', 'cosine'],
    unlocked: ['a', 'b', 'h', 'k', 'domain', 'typed'],
    defaultParams: { parent: 'sine', a: 2, b: 0.5, h: 0, k: 0 },
    defaultDomain: [0, 6],
    caddieIntro: 'Sine waves rise first then dip! Adjust amplitude a and frequency b.',
    hints: [
      'y = a * sin(b * x) starts at (0,0), peaks, crosses zero, then dips.',
      'With b = 1, sin(x) crosses zero near x = 3.14 and x = 6.28.',
      'Set parent = sine, a = 2.5, b = 1, h = 0, k = 0, domain [0, 6.2].'
    ],
    aha: 'Amplitude a sets wave height; b controls how fast the wave oscillates!',
    concept: 'trig',
    solution: { equation: '2.5 * sin(1 * (x - 0)) + 0', domain: [0, 6.2] }
  },
  {
    id: '5-2',
    world: 5,
    worldTitle: 'Wave Valley',
    title: 'Cosine Ridge',
    goal: 'Use a shifted cosine wave to start at (0,0) and crest right into (6, 4).',
    tee: [0, 0],
    hole: [6, 4],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'wall', shape: 'rect', x: 2.8, y: -1.0, w: 0.6, h: 2.2 }
    ],
    allowedParents: ['cosine', 'sine'],
    unlocked: ['a', 'b', 'h', 'k', 'domain', 'typed'],
    defaultParams: { parent: 'cosine', a: -2, b: 0.5, h: 0, k: 2 },
    defaultDomain: [0, 6],
    caddieIntro: 'Flip cosine with a = -2 and shift up by k = 2 so it starts at (0,0) and climbs!',
    hints: [
      'cos(0) = 1, so -2*cos(b*x) + 2 starts right at y = 0!',
      'At the peak of -2*cos(b*x) + 2, the height reaches 2 + 2 = 4.',
      'Set parent = cosine, a = -2, b = 0.5, h = 0, k = 2, domain [0, 6.2].'
    ],
    aha: 'Vertical shift k moves the midline of a trig wave up or down!',
    concept: 'trig',
    solution: { equation: '-2 * cos(0.5 * (x - 0)) + 2', domain: [0, 6.2] }
  },
  {
    id: '5-3',
    world: 5,
    worldTitle: 'Wave Valley',
    title: 'Wave Boss: Double Bend',
    goal: 'Thread through three alternating hazards with a high-frequency sine wave to (9, 0).',
    tee: [0, 0],
    hole: [9, 0],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'wall', shape: 'rect', x: 1.2, y: -3, w: 0.6, h: 4.2 },
      { type: 'tree', shape: 'circle', cx: 4.7, cy: 1.5, r: 1.5 },
      { type: 'sand', shape: 'rect', x: 7.2, y: -2, w: 1.2, h: 2.5 }
    ],
    allowedParents: ['sine', 'cosine'],
    unlocked: ['a', 'b', 'h', 'k', 'domain', 'typed'],
    defaultParams: { parent: 'sine', a: 2, b: 0.5, h: 0, k: 0 },
    defaultDomain: [0, 9.4],
    caddieIntro: 'You can use sliders OR switch to Typed Mode with the math keyboard!',
    hints: [
      'You need a peak near x = 1.5, a trough near x = 4.7, and a second peak near x = 7.8.',
      'That matches sin(x) with b = 1 over [0, 3*pi] (3*pi is about 9.42)!',
      'Set parent = sine, a = 3, b = 1, h = 0, k = 0, domain [0, 9.35].'
    ],
    aha: 'One sin(x) period is 2π (~6.28), so 1.5 periods lands at 3π (~9.42)!',
    concept: 'trig',
    solution: { equation: '3 * sin(1 * (x - 0)) + 0', domain: [0, 9.35] }
  },

  // ================= WORLD 6: PRO TOUR (PIECEWISE FUNCTIONS) =================
  {
    id: '6-1',
    world: 6,
    worldTitle: 'Pro Tour',
    title: 'Two-Club Combo',
    goal: 'Chain two functions together: arch over the wall to (4, 0), then roll flat to (8, 0).',
    tee: [0, 0],
    hole: [8, 0],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'wall', shape: 'rect', x: 1.7, y: 0, w: 0.6, h: 2.5 },
      { type: 'tree', shape: 'circle', cx: 6.0, cy: 1.8, r: 1.4 }
    ],
    allowedParents: ['quadratic', 'linear', 'sine'],
    unlocked: ['a', 'b', 'h', 'k', 'domain', 'typed', 'piecewise'],
    defaultParams: { parent: 'quadratic', a: -1, b: 1, h: 2, k: 4 },
    defaultDomain: [0, 8],
    caddieIntro: 'Welcome to Piecewise Mode! Stack two club segments so they join smoothly at x = 4.',
    hints: [
      'Club 1 [0, 4]: arch over the wall with -1*(x - 2)^2 + 4, which lands at (4, 0).',
      'Club 2 [4, 8]: skim under the low tree with a flat line 0*x or gentle dip.',
      'Set Club 1: -1*(x - 2)^2 + 4 on [0, 4], Club 2: 0*x on [4, 8].'
    ],
    aha: 'Piecewise functions let different formulas govern different domain intervals!',
    concept: 'piecewise',
    solution: {
      equation: '-1 * (x - 2)^2 + 4',
      domain: [0, 8],
      pieces: [
        { equation: '-1 * (x - 2)^2 + 4', domain: [0, 4] },
        { equation: '0 * x', domain: [4, 8] }
      ]
    }
  },
  {
    id: '6-2',
    world: 6,
    worldTitle: 'Pro Tour',
    title: 'Ramp to Parabola',
    goal: 'Climb the ramp from [0, 3] to (3, 3), then launch a parabola into (7, -1).',
    tee: [0, 0],
    hole: [7, -1],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'water', shape: 'rect', x: 3.2, y: -3, w: 2.8, h: 3.5 }
    ],
    allowedParents: ['linear', 'quadratic', 'sine'],
    unlocked: ['a', 'b', 'h', 'k', 'domain', 'typed', 'piecewise'],
    defaultParams: { parent: 'linear', a: 1, b: 1, h: 0, k: 0 },
    defaultDomain: [0, 7],
    caddieIntro: 'Keep your piecewise curve continuous: Club 2 must start at (3, 3) where Club 1 ends!',
    hints: [
      'Club 1 on [0, 3]: y = x climbs straight from (0, 0) to (3, 3).',
      'Club 2 on [3, 7]: start with vertex at (3, 3) using -0.25*(x - 3)^2 + 3.',
      'At x = 7, -0.25*(7 - 3)^2 + 3 = -1, right in the cup!'
    ],
    aha: 'Matching endpoints f1(c) = f2(c) makes a piecewise function continuous!',
    concept: 'piecewise',
    solution: {
      equation: 'x',
      domain: [0, 7],
      pieces: [
        { equation: 'x', domain: [0, 3] },
        { equation: '-0.25 * (x - 3)^2 + 3', domain: [3, 7] }
      ]
    }
  },
  {
    id: '6-3',
    world: 6,
    worldTitle: 'Pro Tour',
    title: 'Grand Finale: Championship 18th',
    goal: 'Chain three clubs across water, wall, and bunker to conquer the Pro Tour at (10, 2)!',
    tee: [0, 0],
    hole: [10, 2],
    tolerance: 0.45,
    par: 1,
    obstacles: [
      { type: 'water', shape: 'rect', x: 0.8, y: -2, w: 2.4, h: 2.0 },
      { type: 'tree', shape: 'circle', cx: 5.5, cy: 2.2, r: 1.5 },
      { type: 'wall', shape: 'rect', x: 8.2, y: -2, w: 0.6, h: 3.2 }
    ],
    allowedParents: ['quadratic', 'linear', 'sine'],
    unlocked: ['a', 'b', 'h', 'k', 'domain', 'typed', 'piecewise'],
    defaultParams: { parent: 'quadratic', a: -1, b: 1, h: 2, k: 4 },
    defaultDomain: [0, 10],
    caddieIntro: 'The Championship Hole! Chain 2 or 3 clubs to clear the water, duck the tree, and hop the wall.',
    hints: [
      'Club 1 [0, 4]: -1*(x - 2)^2 + 4 arches over the water to (4, 0).',
      'Club 2 [4, 7]: 0*x skims flat under the tree from (4, 0) to (7, 0).',
      'Club 3 [7, 10]: -1*(x - 9)^2 + 4 hops the wall wait: at x=7, -(7-9)^2+4 = 0, and at x=10, -(10-9)^2+4 = 3... Use -0.5*(x-9)^2 + 2 + 0.5!'
    ],
    aha: 'You mastered function transformations, domains, and piecewise engineering!',
    concept: 'piecewise',
    solution: {
      equation: '-1 * (x - 2)^2 + 4',
      domain: [0, 10],
      pieces: [
        { equation: '-1 * (x - 2)^2 + 4', domain: [0, 4] },
        { equation: '0 * x', domain: [4, 7] },
        { equation: '-1 * (x - 9)^2 + 4', domain: [7, 10.4] }
      ]
    }
  }
];
