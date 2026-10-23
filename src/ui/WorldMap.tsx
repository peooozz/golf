import React from 'react';
import { X, Star, Flag, Calendar } from 'lucide-react';
import { useGameStore } from '../game/store';
import { WORLD_NAMES } from '../data/levels';

export const WorldMap: React.FC = () => {
  const {
    levels,
    currentLevel,
    completed,
    mastery,
    showWorldMap,
    selectLevel,
    toggleWorldMap,
    startDailyChallenge
  } = useGameStore();

  if (!showWorldMap) return null;

  const worlds = [1, 2, 3, 4, 5, 6];

  return (
    <div className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[88vh] bg-slate-900 border-2 border-emerald-400/50 rounded-3xl p-5 text-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-yellow-300">
              🗺️ Course Tour & Mastery Map
            </h2>
            <p className="text-xs text-slate-300">
              18 Holes across 6 Worlds — earn 3 stars and fill every concept meter!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startDailyChallenge}
              className="btn-chunky px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-xs flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Daily Hole</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWorldMap(false)}
              className="btn-chunky p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Winding World Cards */}
        <div className="overflow-y-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 pr-1">
          {worlds.map((wNum) => {
            const meta = WORLD_NAMES[wNum];
            const worldLevels = levels.filter((l) => l.world === wNum);
            const dots = Math.floor(mastery[meta.concept] ?? 0);

            return (
              <div
                key={wNum}
                className="bg-slate-800/90 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      World {wNum}
                    </span>
                    <h3 className="font-display font-bold text-lg text-white leading-tight">
                      {meta.title}
                    </h3>
                    <p className="text-xs text-slate-400">{meta.subtitle}</p>
                  </div>

                  {/* 3-dot Concept Mastery Meter */}
                  <div className="flex flex-col items-end gap-1" title="Concept Mastery Meter">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Mastery</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((d) => (
                        <span
                          key={d}
                          className={`w-3 h-3 rounded-full border ${
                            d <= dots
                              ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#4ade80]'
                              : 'bg-slate-900 border-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {worldLevels.map((lvl) => {
                    const record = completed[lvl.id];
                    const isCurrent = currentLevel.id === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => selectLevel(lvl.id)}
                        className={`btn-chunky p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                          isCurrent
                            ? 'bg-emerald-500/25 border-emerald-400'
                            : record
                            ? 'bg-slate-900/90 border-emerald-500/40'
                            : 'bg-slate-900/60 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs text-yellow-300 flex items-center gap-1">
                            <Flag className="w-3 h-3" />
                            {lvl.id}
                          </span>
                          <span className="text-[10px] text-slate-400">Par {lvl.par}</span>
                        </div>
                        <div className="text-xs font-bold text-white truncate">{lvl.title}</div>
                        <div className="flex items-center gap-0.5 pt-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                record && s <= record.stars
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
