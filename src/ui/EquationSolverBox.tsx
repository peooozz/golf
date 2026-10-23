import React, { useMemo } from 'react';
import { Play, Sparkles, X, CheckCircle2, AlertCircle, RotateCcw, Target } from 'lucide-react';
import { useGameStore } from '../game/store';
import { sampleSingleCurve } from '../game/mathEngine';
import { evaluateCurveCollision } from '../game/collision';

const MATH_TOKENS = [
  { label: 'x', val: 'x' },
  { label: 'x²', val: '^2' },
  { label: '√x', val: 'sqrt(x)' },
  { label: 'sin', val: 'sin(' },
  { label: 'cos', val: 'cos(' },
  { label: 'abs', val: 'abs(' },
  { label: '(', val: '(' },
  { label: ')', val: ')' },
  { label: '+', val: ' + ' },
  { label: '−', val: ' - ' },
  { label: '×', val: ' * ' },
  { label: '÷', val: ' / ' },
  { label: 'π', val: 'pi' }
];

export const EquationSolverBox: React.FC = () => {
  const {
    currentLevel,
    ballOrigin,
    typedEquation,
    domain,
    isSwinging,
    setTypedEquation,
    setDomain,
    solveCurrentHole,
    startSwing,
    resetLevel
  } = useGameStore();

  const [hx, hy] = currentLevel.hole;

  // Live validation & collision calculation
  const sample = useMemo(() => {
    return sampleSingleCurve(typedEquation, domain, ballOrigin, 0.02);
  }, [typedEquation, domain, ballOrigin]);

  const collision = useMemo(() => {
    return evaluateCurveCollision(
      sample.points,
      currentLevel.obstacles,
      currentLevel.hole,
      currentLevel.tolerance
    );
  }, [sample.points, currentLevel.obstacles, currentLevel.hole, currentLevel.tolerance]);

  const insertToken = (token: string) => {
    setTypedEquation(`${typedEquation}${token}`);
  };

  const handleSnapDomainToHole = () => {
    setDomain([domain[0], currentLevel.hole[0]]);
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-4 shadow-2xl text-white flex flex-col gap-3">
      {/* Header with Title, Target Badge & Auto-Solve Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-display font-extrabold tracking-wide text-white flex items-center gap-1.5">
              <span>Manual Equation Solver</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 font-mono font-bold">
                Level {currentLevel.id}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Target Flag at <strong className="text-yellow-300 font-mono">({hx}, {hy})</strong> • Par {currentLevel.par}
            </p>
          </div>
        </div>

        {/* Smart Auto-Solve Button */}
        <button
          type="button"
          onClick={solveCurrentHole}
          disabled={isSwinging}
          title="Auto-calculate the mathematically optimal curve to hit the cup"
          className="btn-chunky flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 font-display font-bold text-xs shadow-md transition-transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          <span>✨ Solve Hole</span>
        </button>
      </div>

      {/* Main Formula Input Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-950/90 px-3.5 py-2.5 rounded-xl border border-white/20 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/30 transition-all shadow-inner">
          <span className="font-mono font-extrabold text-base sm:text-lg text-emerald-400 select-none">
            y =
          </span>
          <input
            type="text"
            value={typedEquation}
            onChange={(e) => setTypedEquation(e.target.value)}
            placeholder="e.g. -0.25 * (x - 4)^2 + 4"
            disabled={isSwinging}
            className="w-full bg-transparent font-mono text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {typedEquation && (
            <button
              type="button"
              onClick={() => setTypedEquation('')}
              title="Clear equation"
              className="text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Big SWING Button */}
        <button
          type="button"
          disabled={isSwinging || !sample.valid}
          onClick={() => startSwing(false)}
          className="btn-chunky px-6 py-2.5 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 disabled:opacity-40 text-slate-950 font-display font-extrabold text-base tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>SWING!</span>
        </button>
      </div>

      {/* Domain / Flight Range + Status Feedback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-800/60 px-3 py-2 rounded-xl border border-white/10 text-xs">
        {/* Domain range controls */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400 font-bold">Range x:</span>
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-white/10">
            <input
              type="number"
              step="0.5"
              value={domain[0]}
              onChange={(e) => setDomain([parseFloat(e.target.value) || 0, domain[1]])}
              className="w-12 bg-transparent text-sky-300 text-center focus:outline-none"
            />
            <span className="text-slate-500 font-sans">≤ x ≤</span>
            <input
              type="number"
              step="0.5"
              value={domain[1]}
              onChange={(e) => setDomain([domain[0], parseFloat(e.target.value) || 1])}
              className="w-12 bg-transparent text-sky-300 text-center focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleSnapDomainToHole}
            title="Snap flight end x to flag x coordinate"
            className="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-sans font-bold text-[11px] border border-sky-400/30 transition-colors"
          >
            Snap to Flag ({hx})
          </button>
        </div>

        {/* Live validation feedback */}
        <div className="flex items-center gap-1.5 font-medium">
          {!sample.valid ? (
            <span className="text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{sample.error ?? "Invalid equation"}</span>
            </span>
          ) : collision.inHole ? (
            <span className="text-yellow-300 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-yellow-400" />
              <span>🎉 Hole-in-One lock! Ready to swing!</span>
            </span>
          ) : collision.hitObstacle ? (
            <span className="text-rose-300 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Hits {collision.obstacleType} hazard! Adjust curve.</span>
            </span>
          ) : (
            <span className="text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Trajectory valid • Lands at ({sample.points[sample.points.length - 1]?.x.toFixed(1)}, {sample.points[sample.points.length - 1]?.y.toFixed(1)})</span>
            </span>
          )}
        </div>
      </div>

      {/* Quick Math Symbols Keyboard */}
      <div className="flex flex-wrap items-center gap-1 pt-0.5">
        <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Quick insert:</span>
        {MATH_TOKENS.map((token) => (
          <button
            key={token.label}
            type="button"
            onClick={() => insertToken(token.val)}
            className="btn-chunky px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-sky-200 font-mono text-xs font-bold border border-white/10 transition-colors"
          >
            {token.label}
          </button>
        ))}
        <button
          type="button"
          onClick={resetLevel}
          title="Reset hole to starting tee"
          className="ml-auto btn-chunky px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
