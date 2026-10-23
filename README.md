# ⛳ Graphing Golf

An interactive 3D math-golf game built with **Vite + React 18 + TypeScript + Three.js (`@react-three/fiber`)** that teaches 11th–12th grade students **function transformations, domain restrictions, exponential asymptotes, trigonometry, and piecewise functions** through visual discovery and play.

## Quick Start

```bash
chmod +x setup.sh
./setup.sh
# Or manually:
npm install
npm run dev
```

To build for production with strict TypeScript verification:

```bash
npm run build
```

## How to Add a New Level

Open `src/data/levels.ts` and append a new `LevelConfig` object to the `LEVELS` array:

```ts
{
  id: '1-4',
  world: 1,
  title: 'Hilltop Hop',
  goal: 'Shift the parabola right and up to land on the ridge.',
  tee: [0, 0],
  hole: [6, 2],
  tolerance: 0.45,
  par: 1,
  obstacles: [
    { type: 'wall', shape: 'rect', x: 2.8, y: -2, w: 0.6, h: 3.5 }
  ],
  allowedParents: ['quadratic'],
  unlocked: ['a', 'h', 'k'],
  defaultParams: { a: -0.5, h: 2, k: 3 },
  caddieIntro: 'Move the peak right with h and up with k!',
  hints: [
    'Subtracting inside (x - h) shifts the vertex right.',
    'Try placing the vertex near (4, 4).',
    'Set a = -0.5, h = 4, k = 4.'
  ],
  aha: 'Inside shifts horizontally; outside shifts vertically!',
  concept: 'shifts',
  solution: { equation: '-0.5 * (x - 4)^2 + 4', domain: [0, 6] }
}
```

Every level in `src/data/levels.ts` is automatically verified on startup (and via `npm run validate-levels`) to ensure `level.solution` reaches the hole with zero obstacle hits.

## Folder Structure

```text
graphing-golf/
├─ package.json, vite.config.ts, tsconfig.json, tailwind.config.js, index.html
├─ setup.sh, README.md
└─ src/
   ├─ main.tsx, App.tsx
   ├─ data/levels.ts             (18 levels across 6 worlds + validator)
   ├─ game/
   │   ├─ store.ts               (Zustand state, localStorage persistence, URL custom hole)
   │   ├─ mathEngine.ts          (Sandboxed mathjs parser, sampler, piecewise evaluator)
   │   ├─ collision.ts           (Curve vs rect/circle obstacles & hole detection)
   │   └─ scoring.ts             (Strokes, par, stars, XP, and concept mastery)
   ├─ scene/
   │   ├─ GolfScene.tsx, Course.tsx, Ball.tsx, Flag.tsx
   │   ├─ Hazards.tsx            (3D Water, Sand, Brick Wall, swaying Trees)
   │   ├─ CurveTube.tsx, GraphOverlay.tsx, CameraRig.tsx
   │   └─ effects/               (Splash.tsx, SandPuff.tsx, Confetti.tsx)
   ├─ ui/
   │   ├─ TopBar.tsx, SwingBuilder.tsx, SliderControl.tsx
   │   ├─ DomainSlider.tsx, MathKeyboard.tsx, EquationDisplay.tsx
   │   ├─ Caddie.tsx, HintLadder.tsx, AhaCard.tsx
   │   ├─ WorldMap.tsx, LevelComplete.tsx, SettingsMenu.tsx
   ├─ audio/sfx.ts               (Procedural WebAudio synthesizer + haptics)
   └─ styles/index.css           (Tailwind & tactile button styles)
```
# golf
