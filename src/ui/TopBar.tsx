import React from 'react';
import { Grid, HelpCircle, Map, RotateCcw, Settings, Volume2, VolumeX, Eye } from 'lucide-react';
import { useGameStore } from '../game/store';

export const TopBar: React.FC = () => {
  const {
    currentLevel,
    strokes,
    xp,
    showGrid,
    muted,
    teacherMode,
    devShowSolution,
    toggleGrid,
    advanceHint,
    resetLevel,
    toggleWorldMap,
    toggleSettings,
    toggleMute,
    toggleDevSolution
  } = useGameStore();

  return (
    <header className="w-full px-3 py-2 flex items-center justify-between gap-2 bg-slate-900/80 backdrop-blur-md text-white border-b border-white/15 z-20">
      {/* Left: WorldMap button + Level badge */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => toggleWorldMap(true)}
          title="Select hole on World Map"
          className="btn-chunky flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm shadow"
        >
          <Map className="w-4 h-4" />
          <span>{currentLevel.id}</span>
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="font-display font-bold text-sm leading-tight text-yellow-300">
            {currentLevel.title}
          </span>
          <span className="text-[11px] text-sky-200 leading-tight">
            {currentLevel.worldTitle}
          </span>
        </div>
      </div>

      {/* Center: Strokes / Par & XP Bar */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 rounded-xl bg-slate-800/90 border border-white/10 flex items-center gap-2 text-xs sm:text-sm font-display font-bold">
          <span className="text-sky-300">Strokes: {strokes}</span>
          <span className="text-white/40">|</span>
          <span className="text-emerald-300">Par: {currentLevel.par}</span>
        </div>

        <div
          title="Total XP earned"
          className="hidden md:flex items-center gap-2 bg-slate-800/90 px-2.5 py-1 rounded-xl border border-white/10"
        >
          <span className="text-xs font-bold text-yellow-300">⭐ {xp} XP</span>
          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (xp % 250) / 2.5)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: Grid toggle, Hint ladder, Solution (dev/teacher), Reset, Mute, Menu */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleGrid}
          title="Toggle coordinate grid overlay"
          className={`btn-chunky px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border ${
            showGrid
              ? 'bg-sky-400 text-slate-950 border-sky-200'
              : 'bg-slate-800 text-slate-200 border-white/15'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span className="hidden sm:inline">Grid</span>
        </button>

        <button
          type="button"
          onClick={advanceHint}
          title="Get a step-by-step caddie hint"
          className="btn-chunky px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 shadow"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Hint</span>
        </button>

        {(teacherMode || import.meta.env.DEV) && (
          <button
            type="button"
            onClick={toggleDevSolution}
            title="Show ghost solution curve"
            className={`btn-chunky px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
              devShowSolution
                ? 'bg-purple-500 text-white'
                : 'bg-slate-800 text-purple-300 border border-purple-400/40'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden lg:inline">Solution</span>
          </button>
        )}

        <button
          type="button"
          onClick={resetLevel}
          title="Reset hole to tee (0,0)"
          className="btn-chunky p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/15"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleMute}
          title={muted ? 'Unmute audio' : 'Mute audio'}
          className="btn-chunky p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/15"
        >
          {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          type="button"
          onClick={() => toggleSettings(true)}
          title="Open menu & teacher settings"
          className="btn-chunky p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/15"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
