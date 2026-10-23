import React from 'react';

interface DomainSliderProps {
  domain: [number, number];
  maxX?: number;
  onChange: (next: [number, number]) => void;
}

export const DomainSlider: React.FC<DomainSliderProps> = ({
  domain,
  maxX = 12,
  onChange
}) => {
  const [x1, x2] = domain;

  const handleX1 = (val: number) => {
    const clamped = Math.min(val, x2 - 0.5);
    onChange([Math.round(clamped * 20) / 20, x2]);
  };

  const handleX2 = (val: number) => {
    const clamped = Math.max(val, x1 + 0.5);
    onChange([x1, Math.round(clamped * 20) / 20]);
  };

  return (
    <div className="flex flex-col gap-1.5 bg-slate-800/90 px-3 py-2 rounded-xl border border-emerald-400/30">
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-display font-bold text-emerald-300"
          title="Stop the ball inside this x interval"
        >
          Putt Range (Domain)
        </span>
        <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded">
          {`{ ${x1} ≤ x ≤ ${x2} }`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 items-center">
        <label className="flex items-center gap-2 text-[11px] text-slate-300">
          <span className="font-mono text-sky-300 shrink-0">Start x₁</span>
          <input
            type="range"
            min={0}
            max={maxX - 1}
            step={0.05}
            value={x1}
            onChange={(e) => handleX1(parseFloat(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </label>

        <label className="flex items-center gap-2 text-[11px] text-slate-300">
          <span className="font-mono text-emerald-300 shrink-0">Stop x₂</span>
          <input
            type="range"
            min={1}
            max={maxX}
            step={0.05}
            value={x2}
            onChange={(e) => handleX2(parseFloat(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
