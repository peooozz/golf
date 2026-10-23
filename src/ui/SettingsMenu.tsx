import React, { useState } from 'react';
import { X, GraduationCap, Share2, Check } from 'lucide-react';
import { useGameStore } from '../game/store';
import { Obstacle } from '../data/levels';

export const SettingsMenu: React.FC = () => {
  const {
    currentLevel,
    showSettings,
    teacherMode,
    muted,
    colorBlindMode,
    reducedMotion,
    toggleSettings,
    toggleTeacherMode,
    toggleMute,
    toggleColorBlindMode,
    toggleReducedMotion,
    loadCustomHole
  } = useGameStore();

  const [customX, setCustomX] = useState(8);
  const [customY, setCustomY] = useState(0);
  const [wallX, setWallX] = useState(4);
  const [wallH, setWallH] = useState(3);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!showSettings) return null;

  const applyAndCopyCustomHole = () => {
    const obstacles: Obstacle[] = [
      { type: 'wall', shape: 'rect', x: wallX, y: -1, w: 0.6, h: wallH }
    ];
    loadCustomHole([customX, customY], obstacles, 2);
    const payload = btoa(JSON.stringify({ hole: [customX, customY], obstacles }));
    const url = `${window.location.origin}${window.location.pathname}#custom=${payload}`;
    window.history.replaceState(null, '', `#custom=${payload}`);
    try {
      navigator.clipboard.writeText(url);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    } catch {
      setCopiedHash(true);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-sky-400/50 rounded-3xl p-5 text-white shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h2 className="font-display font-extrabold text-xl text-yellow-300">
            ⚙️ Game Settings & Teacher Mode
          </h2>
          <button
            type="button"
            onClick={() => toggleSettings(false)}
            className="btn-chunky p-1.5 rounded-xl bg-slate-800 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accessibility & Audio Toggles */}
        <div className="space-y-2 text-sm">
          <label className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl cursor-pointer">
            <span>Mute Sound Effects</span>
            <input
              type="checkbox"
              checked={muted}
              onChange={toggleMute}
              className="w-4 h-4 accent-emerald-400"
            />
          </label>

          <label className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl cursor-pointer">
            <span>Colour-Blind Safe Palette (High-Contrast Orange/Blue)</span>
            <input
              type="checkbox"
              checked={colorBlindMode}
              onChange={toggleColorBlindMode}
              className="w-4 h-4 accent-emerald-400"
            />
          </label>

          <label className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl cursor-pointer">
            <span>Reduced Motion (Calm Camera & Instant Transitions)</span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={toggleReducedMotion}
              className="w-4 h-4 accent-emerald-400"
            />
          </label>

          <label className="flex items-center justify-between bg-purple-950/60 border border-purple-400/40 p-3 rounded-xl cursor-pointer">
            <span className="flex items-center gap-2 font-bold text-purple-200">
              <GraduationCap className="w-5 h-5 text-purple-300" />
              Teacher Mode (Show Solutions & Custom Hole Builder)
            </span>
            <input
              type="checkbox"
              checked={teacherMode}
              onChange={toggleTeacherMode}
              className="w-4 h-4 accent-purple-400"
            />
          </label>
        </div>

        {/* Teacher Mode Panel */}
        {teacherMode && (
          <div className="bg-slate-950 border border-purple-400/30 rounded-2xl p-3.5 space-y-3 text-xs">
            <div className="font-bold text-purple-300 uppercase tracking-wider">
              Current Hole Reference
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
              <div>Tee: ({currentLevel.tee[0]}, {currentLevel.tee[1]})</div>
              <div>Target: ({currentLevel.hole[0]}, {currentLevel.hole[1]})</div>
              <div className="col-span-2 text-emerald-300">
                Solution: y = {currentLevel.solution.equation} on [{currentLevel.solution.domain[0]}, {currentLevel.solution.domain[1]}]
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 font-bold text-purple-300 uppercase tracking-wider">
              Build & Share Custom Hole via URL Hash
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-slate-400">Hole X (4..12)</span>
                <input
                  type="number"
                  value={customX}
                  onChange={(e) => setCustomX(Number(e.target.value))}
                  className="bg-slate-900 border border-white/15 rounded px-2 py-1 text-white"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-slate-400">Hole Y (-4..4)</span>
                <input
                  type="number"
                  value={customY}
                  onChange={(e) => setCustomY(Number(e.target.value))}
                  className="bg-slate-900 border border-white/15 rounded px-2 py-1 text-white"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-slate-400">Wall X</span>
                <input
                  type="number"
                  value={wallX}
                  onChange={(e) => setWallX(Number(e.target.value))}
                  className="bg-slate-900 border border-white/15 rounded px-2 py-1 text-white"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-slate-400">Wall Height</span>
                <input
                  type="number"
                  value={wallH}
                  onChange={(e) => setWallH(Number(e.target.value))}
                  className="bg-slate-900 border border-white/15 rounded px-2 py-1 text-white"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={applyAndCopyCustomHole}
              className="btn-chunky w-full py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-display font-bold flex items-center justify-center gap-1.5"
            >
              {copiedHash ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedHash ? 'Custom Hole Loaded & URL Copied!' : 'Play & Copy Shareable Hole URL'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
