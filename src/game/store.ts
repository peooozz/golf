import { create } from 'zustand';
import {
  ConceptKey,
  LEVELS,
  LevelConfig,
  Obstacle,
  ParentFunctionType,
  PiecewisePiece,
  SliderParams
} from '../data/levels';
import { buildEquationFromSliders } from './mathEngine';
import { calculateStars, calculateXpReward, LevelScoreRecord, updateConceptMastery } from './scoring';

export type CaddieMood = 'idle' | 'happy' | 'wince' | 'thinking';
export type InputMode = 'sliders' | 'typed' | 'piecewise';
export type CameraMode = 'broadcast' | 'tee' | 'green' | 'graph' | 'orbit';

interface SavedProgress {
  completed: Record<string, LevelScoreRecord>;
  xp: number;
  mastery: Record<ConceptKey, number>;
  muted: boolean;
  colorBlindMode: boolean;
  reducedMotion: boolean;
  showGrid: boolean;
}

const STORAGE_KEY = 'graphing_golf_progress_v1';

const DEFAULT_MASTERY: Record<ConceptKey, number> = {
  shifts: 0,
  stretch: 0,
  reflect: 0,
  domain: 0,
  exponential: 0,
  trig: 0,
  piecewise: 0
};

function loadProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        completed: {},
        xp: 0,
        mastery: { ...DEFAULT_MASTERY },
        muted: false,
        colorBlindMode: false,
        reducedMotion: false,
        showGrid: true
      };
    }
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      completed: parsed.completed ?? {},
      xp: parsed.xp ?? 0,
      mastery: { ...DEFAULT_MASTERY, ...(parsed.mastery ?? {}) },
      muted: Boolean(parsed.muted),
      colorBlindMode: Boolean(parsed.colorBlindMode),
      reducedMotion: Boolean(parsed.reducedMotion),
      showGrid: parsed.showGrid ?? true
    };
  } catch {
    return {
      completed: {},
      xp: 0,
      mastery: { ...DEFAULT_MASTERY },
      muted: false,
      colorBlindMode: false,
      reducedMotion: false,
      showGrid: true
    };
  }
}

function saveProgress(state: SavedProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted iframes
  }
}

export interface GameState {
  // Current level & custom levels
  levels: LevelConfig[];
  currentLevelIndex: number;
  currentLevel: LevelConfig;

  // Ball & shot state
  strokes: number;
  ballOrigin: [number, number];
  isSwinging: boolean;
  isReplaying: boolean;
  swingProgress: number;
  lastImpact: { type: 'water' | 'sand' | 'wall' | 'tree' | 'hole' | null; point: [number, number] | null };
  levelWon: boolean;
  showAha: boolean;
  showWhyDemo: boolean;

  // Equation builder state
  inputMode: InputMode;
  sliderParams: SliderParams;
  activeParam: 'a' | 'b' | 'h' | 'k' | null;
  typedEquation: string;
  domain: [number, number];
  pieces: PiecewisePiece[];
  activePieceIndex: number;

  // Caddie & hints
  caddieMessage: string;
  caddieMood: CaddieMood;
  hintStep: number; // 0 = none, 1 = nudge, 2 = bigger nudge, 3 = ghost solution
  devShowSolution: boolean;

  // UI overlays & settings
  showWorldMap: boolean;
  showSettings: boolean;
  showGrid: boolean;
  teacherMode: boolean;
  muted: boolean;
  colorBlindMode: boolean;
  reducedMotion: boolean;

  // Persistent progression
  completed: Record<string, LevelScoreRecord>;
  xp: number;
  mastery: Record<ConceptKey, number>;

  // Actions
  selectLevel: (idOrIndex: string | number) => void;
  nextLevel: () => void;
  resetLevel: () => void;
  setSliderParam: (key: keyof SliderParams, value: number | ParentFunctionType) => void;
  setActiveParam: (param: 'a' | 'b' | 'h' | 'k' | null) => void;
  setTypedEquation: (eq: string) => void;
  setDomain: (domain: [number, number]) => void;
  setInputMode: (mode: InputMode) => void;
  updatePiece: (index: number, piece: Partial<PiecewisePiece>) => void;
  addPiece: () => void;
  removePiece: (index: number) => void;
  setActivePieceIndex: (index: number) => void;
  advanceHint: () => void;
  toggleDevSolution: () => void;
  startSwing: (replaySlowMo?: boolean) => void;
  completeSwing: (outcome: {
    inHole: boolean;
    hitObstacle: boolean;
    obstacleType: 'water' | 'sand' | 'wall' | 'tree' | null;
    endPoint: [number, number];
    caddieTip: string;
  }) => void;
  setCaddie: (message: string, mood?: CaddieMood) => void;
  toggleGrid: () => void;
  toggleWorldMap: (open?: boolean) => void;
  toggleSettings: (open?: boolean) => void;
  toggleTeacherMode: () => void;
  toggleMute: () => void;
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  solveCurrentHole: () => void;
  toggleColorBlindMode: () => void;
  toggleReducedMotion: () => void;
  setShowAha: (show: boolean) => void;
  setShowWhyDemo: (show: boolean) => void;
  loadCustomHole: (hole: [number, number], obstacles: Obstacle[], par?: number) => void;
  startDailyChallenge: () => void;
}

function getInitialPieces(level: LevelConfig): PiecewisePiece[] {
  if (level.solution.pieces && level.solution.pieces.length > 0) {
    return [
      { equation: '-0.5 * (x - 2)^2 + 2', domain: [0, 4] },
      { equation: '0 * x', domain: [4, level.hole[0]] }
    ];
  }
  return [
    { equation: buildEquationFromSliders(level.defaultParams), domain: [...level.defaultDomain] }
  ];
}

const initialSaved = loadProgress();
const firstLevel = LEVELS[0];

export const useGameStore = create<GameState>((set, get) => ({
  levels: LEVELS,
  currentLevelIndex: 0,
  currentLevel: firstLevel,

  strokes: 0,
  ballOrigin: [...firstLevel.tee],
  isSwinging: false,
  isReplaying: false,
  swingProgress: 0,
  lastImpact: { type: null, point: null },
  levelWon: false,
  showAha: false,
  showWhyDemo: false,

  inputMode: firstLevel.unlocked.includes('piecewise') ? 'piecewise' : 'sliders',
  sliderParams: { ...firstLevel.defaultParams },
  activeParam: null,
  typedEquation: buildEquationFromSliders(firstLevel.defaultParams),
  domain: [...firstLevel.defaultDomain],
  pieces: getInitialPieces(firstLevel),
  activePieceIndex: 0,

  caddieMessage: firstLevel.caddieIntro,
  caddieMood: 'idle',
  hintStep: 0,
  devShowSolution: false,

  showWorldMap: false,
  showSettings: false,
  showGrid: initialSaved.showGrid,
  teacherMode: false,
  muted: initialSaved.muted,
  colorBlindMode: initialSaved.colorBlindMode,
  reducedMotion: initialSaved.reducedMotion,
  cameraMode: 'broadcast',

  completed: initialSaved.completed,
  xp: initialSaved.xp,
  mastery: initialSaved.mastery,

  selectLevel: (idOrIndex) => {
    const { levels, inputMode: currentInputMode } = get();
    const idx =
      typeof idOrIndex === 'number'
        ? Math.max(0, Math.min(levels.length - 1, idOrIndex))
        : Math.max(0, levels.findIndex((l) => l.id === idOrIndex));
    const lvl = levels[idx] ?? levels[0];
    const mode: InputMode = currentInputMode === 'typed' ? 'typed' : (lvl.unlocked.includes('piecewise') ? 'piecewise' : 'sliders');

    set({
      currentLevelIndex: idx,
      currentLevel: lvl,
      strokes: 0,
      ballOrigin: [...lvl.tee],
      isSwinging: false,
      isReplaying: false,
      swingProgress: 0,
      lastImpact: { type: null, point: null },
      levelWon: false,
      showAha: false,
      showWhyDemo: false,
      inputMode: mode,
      sliderParams: { ...lvl.defaultParams },
      activeParam: null,
      typedEquation: buildEquationFromSliders(lvl.defaultParams),
      domain: [...lvl.defaultDomain],
      pieces: getInitialPieces(lvl),
      activePieceIndex: 0,
      caddieMessage: lvl.caddieIntro,
      caddieMood: 'idle',
      hintStep: 0,
      devShowSolution: false,
      showWorldMap: false
    });
  },

  nextLevel: () => {
    const { currentLevelIndex, levels, selectLevel } = get();
    if (currentLevelIndex + 1 < levels.length) {
      selectLevel(currentLevelIndex + 1);
    } else {
      set({ showWorldMap: true });
    }
  },

  resetLevel: () => {
    const { currentLevelIndex, selectLevel } = get();
    selectLevel(currentLevelIndex);
  },

  setSliderParam: (key, value) => {
    const { sliderParams, isSwinging } = get();
    if (isSwinging) return;
    const updated: SliderParams = {
      ...sliderParams,
      [key]: value
    };
    set({
      sliderParams: updated,
      typedEquation: buildEquationFromSliders(updated)
    });
  },

  setActiveParam: (param) => set({ activeParam: param }),

  setTypedEquation: (eq) => {
    if (get().isSwinging) return;
    set({ typedEquation: eq });
  },

  setDomain: (domain) => {
    if (get().isSwinging) return;
    set({ domain });
  },

  setInputMode: (mode) => {
    if (get().isSwinging) return;
    set({ inputMode: mode });
  },

  updatePiece: (index, partial) => {
    const { pieces, isSwinging } = get();
    if (isSwinging) return;
    const next = pieces.map((p, i) => (i === index ? { ...p, ...partial } : p));
    set({ pieces: next });
  },

  addPiece: () => {
    const { pieces, currentLevel } = get();
    if (pieces.length >= 3) return;
    const last = pieces[pieces.length - 1];
    const nextStart = last ? last.domain[1] : 0;
    const nextEnd = Math.max(nextStart + 2, currentLevel.hole[0]);
    set({
      pieces: [...pieces, { equation: '0 * x', domain: [nextStart, nextEnd] }],
      activePieceIndex: pieces.length
    });
  },

  removePiece: (index) => {
    const { pieces } = get();
    if (pieces.length <= 1) return;
    const filtered = pieces.filter((_, i) => i !== index);
    set({ pieces: filtered, activePieceIndex: Math.max(0, filtered.length - 1) });
  },

  setActivePieceIndex: (index) => set({ activePieceIndex: index }),

  advanceHint: () => {
    const { hintStep, currentLevel } = get();
    const nextStep = Math.min(3, hintStep + 1);
    const hintMsg = currentLevel.hints[nextStep - 1] ?? currentLevel.hints[2];
    set({
      hintStep: nextStep,
      caddieMessage: hintMsg,
      caddieMood: 'thinking'
    });
  },

  toggleDevSolution: () => {
    const { devShowSolution, currentLevel } = get();
    const next = !devShowSolution;
    set({
      devShowSolution: next,
      caddieMessage: next
        ? `Solution preview enabled: y = ${currentLevel.solution.equation}`
        : currentLevel.caddieIntro
    });
  },

  startSwing: (replaySlowMo = false) => {
    const { isSwinging, strokes } = get();
    if (isSwinging) return;
    set({
      isSwinging: true,
      isReplaying: replaySlowMo,
      strokes: replaySlowMo ? strokes : strokes + 1,
      lastImpact: { type: null, point: null },
      caddieMessage: replaySlowMo ? 'Slow-motion instant replay...' : 'Fore! Watch that curve fly!',
      caddieMood: 'thinking'
    });
  },

  completeSwing: ({ inHole, hitObstacle, obstacleType, endPoint, caddieTip }) => {
    const state = get();
    if (inHole) {
      const stars = calculateStars(state.strokes, state.currentLevel.par);
      const earnedXp = calculateXpReward(state.strokes, state.currentLevel.par);
      const prevBest = state.completed[state.currentLevel.id];
      const bestRecord: LevelScoreRecord =
        !prevBest || state.strokes < prevBest.strokes
          ? { strokes: state.strokes, stars }
          : prevBest;

      const updatedCompleted = {
        ...state.completed,
        [state.currentLevel.id]: bestRecord
      };
      const updatedMastery = updateConceptMastery(
        state.mastery,
        state.currentLevel.concept,
        stars
      );
      const updatedXp = state.xp + earnedXp;

      saveProgress({
        completed: updatedCompleted,
        xp: updatedXp,
        mastery: updatedMastery,
        muted: state.muted,
        colorBlindMode: state.colorBlindMode,
        reducedMotion: state.reducedMotion,
        showGrid: state.showGrid
      });

      set({
        isSwinging: false,
        isReplaying: false,
        levelWon: true,
        showAha: true,
        ballOrigin: [...state.currentLevel.hole],
        lastImpact: { type: 'hole', point: [...state.currentLevel.hole] },
        caddieMessage:
          state.strokes === 1 ? 'HOLE IN ONE! Pure mathematical magic!' : caddieTip,
        caddieMood: 'happy',
        completed: updatedCompleted,
        xp: updatedXp,
        mastery: updatedMastery
      });
      return;
    }

    // Missed or hit obstacle: update ballOrigin for stroke continuation ("new tee, new origin")
    const clampedX = Math.round(endPoint[0] * 10) / 10;
    const clampedY = Math.round(endPoint[1] * 10) / 10;
    const remainingDist = Math.max(2, Math.round((state.currentLevel.hole[0] - clampedX) * 10) / 10);

    set({
      isSwinging: false,
      isReplaying: false,
      ballOrigin: [clampedX, clampedY],
      domain: [0, remainingDist],
      lastImpact: {
        type: hitObstacle ? obstacleType : null,
        point: [clampedX, clampedY]
      },
      caddieMessage: `${caddieTip} (New tee, new origin at (${clampedX}, ${clampedY})!)`,
      caddieMood: 'wince'
    });
  },

  setCaddie: (message, mood = 'idle') => set({ caddieMessage: message, caddieMood: mood }),

  toggleGrid: () => {
    const next = !get().showGrid;
    set({ showGrid: next });
    const s = get();
    saveProgress({
      completed: s.completed,
      xp: s.xp,
      mastery: s.mastery,
      muted: s.muted,
      colorBlindMode: s.colorBlindMode,
      reducedMotion: s.reducedMotion,
      showGrid: next
    });
  },

  toggleWorldMap: (open) =>
    set((s) => ({ showWorldMap: open !== undefined ? open : !s.showWorldMap })),

  toggleSettings: (open) =>
    set((s) => ({ showSettings: open !== undefined ? open : !s.showSettings })),

  toggleTeacherMode: () =>
    set((s) => ({
      teacherMode: !s.teacherMode,
      caddieMessage: !s.teacherMode
        ? 'Teacher Mode active: solutions & custom URL hole builder unlocked!'
        : s.currentLevel.caddieIntro
    })),

  toggleMute: () => {
    const next = !get().muted;
    set({ muted: next });
    const s = get();
    saveProgress({
      completed: s.completed,
      xp: s.xp,
      mastery: s.mastery,
      muted: next,
      colorBlindMode: s.colorBlindMode,
      reducedMotion: s.reducedMotion,
      showGrid: s.showGrid
    });
  },

  setCameraMode: (mode) => set({ cameraMode: mode }),

  solveCurrentHole: () => {
    const { currentLevel, isSwinging } = get();
    if (isSwinging) return;
    const sol = currentLevel.solution;
    if (sol.pieces && sol.pieces.length > 0) {
      set({
        inputMode: 'piecewise',
        pieces: sol.pieces.map((p) => ({ ...p, domain: [...p.domain] as [number, number] })),
        activePieceIndex: 0,
        caddieMessage: `✨ Perfect multi-club curve loaded! Press SWING to sink it.`,
        caddieMood: 'happy'
      });
    } else {
      set({
        inputMode: 'typed',
        typedEquation: sol.equation,
        domain: [...sol.domain],
        caddieMessage: `✨ Solved! Equation y = ${sol.equation} lands directly in the cup!`,
        caddieMood: 'happy'
      });
    }
  },

  toggleColorBlindMode: () => {
    const next = !get().colorBlindMode;
    set({ colorBlindMode: next });
    const s = get();
    saveProgress({
      completed: s.completed,
      xp: s.xp,
      mastery: s.mastery,
      muted: s.muted,
      colorBlindMode: next,
      reducedMotion: s.reducedMotion,
      showGrid: s.showGrid
    });
  },

  toggleReducedMotion: () => {
    const next = !get().reducedMotion;
    set({ reducedMotion: next });
    const s = get();
    saveProgress({
      completed: s.completed,
      xp: s.xp,
      mastery: s.mastery,
      muted: s.muted,
      colorBlindMode: s.colorBlindMode,
      reducedMotion: next,
      showGrid: s.showGrid
    });
  },

  setShowAha: (show) => set({ showAha: show }),
  setShowWhyDemo: (show) => set({ showWhyDemo: show }),

  loadCustomHole: (hole, obstacles, par = 2) => {
    const customLevel: LevelConfig = {
      id: 'custom',
      world: 1,
      worldTitle: 'Custom Hole',
      title: 'Teacher Custom Hole',
      goal: `Reach the custom flag at (${hole[0]}, ${hole[1]})!`,
      tee: [0, 0],
      hole,
      tolerance: 0.45,
      par,
      obstacles,
      allowedParents: ['quadratic', 'exponential', 'sine', 'cosine', 'linear', 'abs'],
      unlocked: ['a', 'b', 'h', 'k', 'domain', 'typed'],
      defaultParams: { parent: 'quadratic', a: -0.25, b: 1, h: Math.round(hole[0] / 2), k: 3 },
      defaultDomain: [0, hole[0]],
      caddieIntro: `Custom hole loaded! Aim for (${hole[0]}, ${hole[1]}).`,
      hints: [
        'Use h and k to place your vertex clear of obstacles.',
        'Adjust stretch a so the curve passes through (0, 0) and the flag.',
        `Set Putt Range x2 = ${hole[0]} so the ball stops right in the cup.`
      ],
      aha: 'Custom functions let you design and solve any course geometry!',
      concept: 'shifts',
      solution: { equation: `-0.25 * (x - ${hole[0] / 2})^2 + 3`, domain: [0, hole[0]] }
    };

    set({
      currentLevel: customLevel,
      strokes: 0,
      ballOrigin: [0, 0],
      isSwinging: false,
      levelWon: false,
      showAha: false,
      sliderParams: { ...customLevel.defaultParams },
      typedEquation: buildEquationFromSliders(customLevel.defaultParams),
      domain: [0, hole[0]],
      caddieMessage: customLevel.caddieIntro,
      showSettings: false
    });
  },

  startDailyChallenge: () => {
    // Deterministic daily hole seeded by YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = (hash * 31 + today.charCodeAt(i)) % 1000;
    }
    const targetX = 6 + (hash % 4); // 6..9
    const targetY = -2 + (hash % 5); // -2..2
    const wallX = Math.max(2, Math.min(targetX - 2, 2 + (hash % 3)));
    const aVal = -0.25;
    const hVal = targetX / 2;

    const dailyLevel: LevelConfig = {
      id: `daily-${today}`,
      world: 2,
      worldTitle: 'Daily Challenge',
      title: `Daily Cup (${today})`,
      goal: `Daily Challenge: Arc over the hazard to sink (${targetX}, ${targetY})!`,
      tee: [0, 0],
      hole: [targetX, targetY],
      tolerance: 0.45,
      par: 2,
      obstacles: [
        { type: 'wall', shape: 'rect', x: wallX, y: -2, w: 0.6, h: 3.2 }
      ],
      allowedParents: ['quadratic', 'sine', 'exponential'],
      unlocked: ['a', 'b', 'h', 'k', 'domain', 'typed'],
      defaultParams: { parent: 'quadratic', a: aVal, b: 1, h: hVal, k: 3.5 },
      defaultDomain: [0, targetX],
      caddieIntro: `Welcome to today's Daily Challenge! Target is (${targetX}, ${targetY}).`,
      hints: [
        'Use h and k to place your peak above the brick wall.',
        'Adjust stretch a or switch to Typed Mode for exact control.',
        `Stop your Putt Range right at x2 = ${targetX}.`
      ],
      aha: 'Daily practice keeps your function intuition sharp!',
      concept: 'stretch',
      solution: { equation: `${aVal} * (x - ${hVal})^2 + 3.5`, domain: [0, targetX] }
    };

    set({
      currentLevel: dailyLevel,
      strokes: 0,
      ballOrigin: [0, 0],
      isSwinging: false,
      levelWon: false,
      showAha: false,
      sliderParams: { ...dailyLevel.defaultParams },
      typedEquation: buildEquationFromSliders(dailyLevel.defaultParams),
      domain: [0, targetX],
      caddieMessage: dailyLevel.caddieIntro,
      showWorldMap: false,
      showSettings: false
    });
  }
}));
