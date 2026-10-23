import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface SliderControlProps {
  paramKey: 'a' | 'b' | 'h' | 'k';
  label: string;
  tooltip: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  onFocusParam: (key: 'a' | 'b' | 'h' | 'k' | null) => void;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  paramKey,
  label,
  tooltip,
  value,
  min,
  max,
  step,
  onChange,
  onFocusParam
}) => {
  const clampAndRound = (next: number) => {
    const clamped = Math.max(min, Math.min(max, next));
    return Math.round(clamped * 100) / 100;
  };

  return (
    <div
      onMouseEnter={() => onFocusParam(paramKey)}
      onMouseLeave={() => onFocusParam(null)}
      className="flex flex-col gap-1 bg-slate-800/90 px-3 py-2 rounded-xl border border-white/10"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-display font-bold text-yellow-300" title={tooltip}>
          {label} <span className="text-slate-400 font-normal">({tooltip})</span>
        </span>
        <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            onFocusParam(paramKey);
            onChange(clampAndRound(value - step));
          }}
          aria-label={`Decrease ${paramKey}`}
          className="btn-chunky w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onFocus={() => onFocusParam(paramKey)}
          onBlur={() => onFocusParam(null)}
          onTouchStart={() => onFocusParam(paramKey)}
          onTouchEnd={() => onFocusParam(null)}
          onChange={(e) => onChange(clampAndRound(parseFloat(e.target.value)))}
          className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
        />

        <button
          type="button"
          onClick={() => {
            onFocusParam(paramKey);
            onChange(clampAndRound(value + step));
          }}
          aria-label={`Increase ${paramKey}`}
          className="btn-chunky w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
