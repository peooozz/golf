import React, { useEffect } from 'react';
import { useGameStore } from './game/store';
import { validateAllLevels } from './game/validateLevels';
import { GolfScene } from './scene/GolfScene';
import { TopBar } from './ui/TopBar';
import { Caddie } from './ui/Caddie';
import { HintLadder } from './ui/HintLadder';
import { SwingBuilder } from './ui/SwingBuilder';
import { WorldMap } from './ui/WorldMap';
import { LevelComplete } from './ui/LevelComplete';
import { SettingsMenu } from './ui/SettingsMenu';
import { sfx } from './audio/sfx';

export function App(): React.ReactElement {
  const { loadCustomHole, startSwing, sliderParams, setSliderParam } = useGameStore();

  // Validate all 18 levels on startup & check URL hash for teacher-shared custom holes
  useEffect(() => {
    const reports = validateAllLevels();
    const failed = reports.filter((r) => !r.solvable);
    if (failed.length > 0) {
      console.warn('Unverified levels:', failed);
    }

    if (window.location.hash.startsWith('#custom=')) {
      try {
        const raw = atob(window.location.hash.replace('#custom=', ''));
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.hole) && Array.isArray(parsed.obstacles)) {
          loadCustomHole(parsed.hole, parsed.obstacles, 2);
        }
      } catch {
        // Ignore malformed URL hash
      }
    }
  }, [loadCustomHole]);

  // Keyboard shortcuts: Enter/Space to Swing, Arrow keys to nudge h and k
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        sfx.startAmbientLoop();
        startSwing(false);
      } else if (e.key === 'ArrowRight') {
        setSliderParam('h', Math.round((sliderParams.h + 0.25) * 100) / 100);
      } else if (e.key === 'ArrowLeft') {
        setSliderParam('h', Math.round((sliderParams.h - 0.25) * 100) / 100);
      } else if (e.key === 'ArrowUp') {
        setSliderParam('k', Math.round((sliderParams.k + 0.25) * 100) / 100);
      } else if (e.key === 'ArrowDown') {
        setSliderParam('k', Math.round((sliderParams.k - 0.25) * 100) / 100);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [startSwing, sliderParams, setSliderParam]);

  return (
    <main
      onClick={() => sfx.startAmbientLoop()}
      className="w-screen h-screen overflow-hidden flex flex-col justify-between relative select-none bg-slate-950"
    >
      {/* 1. Fullscreen 3D Golf Canvas spanning 100% width and height */}
      <div className="absolute inset-0 w-full h-full z-0">
        <GolfScene />
      </div>

      {/* 2. Floating Sleek Glassy Top Bar */}
      <div className="relative z-20 pointer-events-auto">
        <TopBar />
      </div>

      {/* 3. Floating Caddie Mascot Bubble & Hint Ladder */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Caddie />
          <HintLadder />
        </div>
      </div>

      {/* 4. Floating Bottom Swing Builder / Equation Solver Panel */}
      <div className="relative z-20 pointer-events-auto mt-auto">
        <SwingBuilder />
      </div>

      {/* Modal Overlays */}
      <LevelComplete />
      <WorldMap />
      <SettingsMenu />
    </main>
  );
}

export default App;
