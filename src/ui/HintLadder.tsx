import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useGameStore } from '../game/store';

export const HintLadder: React.FC = () => {
  const { currentLevel, hintStep, advanceHint } = useGameStore();

  if (hintStep === 0) return null;

  return (
    <div className="fixed top-28 left-3 z-10 max-w-xs bg-slate-900/90 backdrop-blur-md border border-amber-400/40 rounded-2xl p-3 text-white shadow-xl">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-display font-bold text-amber-300 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5" />
          Hint Ladder ({hintStep}/3)
        </span>
        {hintStep < 3 && (
          <button
            type="button"
            onClick={advanceHint}
            className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950"
          >
            Next Hint
          </button>
        )}
      </div>
      <ul className="space-y-1 text-xs text-slate-200">
        {currentLevel.hints.slice(0, hintStep).map((h, i) => (
          <li key={i} className="leading-snug">
            <span className="text-amber-300 font-bold">{i + 1}.</span> {h}
          </li>
        ))}
      </ul>
    </div>
  );
};
