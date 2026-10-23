import React from 'react';
import { SliderParams } from '../data/levels';

interface EquationDisplayProps {
  params: SliderParams;
  activeParam: 'a' | 'b' | 'h' | 'k' | null;
  domain: [number, number];
  showDomain: boolean;
}

export const EquationDisplay: React.FC<EquationDisplayProps> = ({
  params,
  activeParam,
  domain,
  showDomain
}) => {
  const { parent, a, b, h, k } = params;
  const hSign = h >= 0 ? '-' : '+';
  const kSign = k >= 0 ? '+' : '-';

  const glowClass = (key: 'a' | 'b' | 'h' | 'k') =>
    activeParam === key
      ? 'bg-yellow-300 text-slate-950 px-1.5 py-0.5 rounded-lg shadow-[0_0_12px_#fde047] scale-105 inline-block transition-all'
      : 'text-sky-300 px-0.5 transition-all';

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-white/15 font-mono text-sm sm:text-base font-bold text-white shadow-inner">
      <span className="text-emerald-400">y =</span>

      {/* Stretch / Reflection parameter a */}
      <span className={glowClass('a')}>{a}</span>

      {parent === 'quadratic' && (
        <>
          <span>(x {hSign}</span>
          <span className={glowClass('h')}>{Math.abs(h)}</span>
          <span>)²</span>
        </>
      )}

      {parent === 'exponential' && (
        <>
          <span>·</span>
          <span className={glowClass('b')}>{b}</span>
          <span>
            ^(x {hSign} <span className={glowClass('h')}>{Math.abs(h)}</span>)
          </span>
        </>
      )}

      {(parent === 'sine' || parent === 'cosine') && (
        <>
          <span>· {parent === 'sine' ? 'sin' : 'cos'}(</span>
          <span className={glowClass('b')}>{b}</span>
          <span>
            (x {hSign} <span className={glowClass('h')}>{Math.abs(h)}</span>))
          </span>
        </>
      )}

      {parent === 'abs' && (
        <>
          <span>|x {hSign}</span>
          <span className={glowClass('h')}>{Math.abs(h)}</span>
          <span>|</span>
        </>
      )}

      {parent === 'linear' && (
        <>
          <span>(x {hSign}</span>
          <span className={glowClass('h')}>{Math.abs(h)}</span>
          <span>)</span>
        </>
      )}

      {/* Vertical shift parameter k */}
      <span>{kSign}</span>
      <span className={glowClass('k')}>{Math.abs(k)}</span>

      {showDomain && (
        <span className="ml-2 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-400/30">
          {`{${domain[0]} ≤ x ≤ ${domain[1]}}`}
        </span>
      )}
    </div>
  );
};
