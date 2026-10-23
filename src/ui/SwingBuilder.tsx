import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Play, Plus, Trash2, Keyboard, Sliders, Layers } from 'lucide-react';
import { useGameStore } from '../game/store';
import { ParentFunctionType } from '../data/levels';
import { samplePiecewiseCurve, sampleSingleCurve } from '../game/mathEngine';
import { EquationDisplay } from './EquationDisplay';
import { SliderControl } from './SliderControl';
import { DomainSlider } from './DomainSlider';
import { MathKeyboard } from './MathKeyboard';
import { EquationSolverBox } from './EquationSolverBox';

export const SwingBuilder: React.FC = () => {
  const {
    currentLevel,
    ballOrigin,
    inputMode,
    sliderParams,
    activeParam,
    typedEquation,
    domain,
    pieces,
    activePieceIndex,
    isSwinging,
    setSliderParam,
    setActiveParam,
    setDomain,
    setInputMode,
    updatePiece,
    addPiece,
    removePiece,
    setActivePieceIndex,
    startSwing
  } = useGameStore();

  const [collapsed, setCollapsed] = useState(false);

  const unlocked = currentLevel.unlocked;
  const hasA = unlocked.includes('a');
  const hasB = unlocked.includes('b');
  const hasH = unlocked.includes('h');
  const hasK = unlocked.includes('k');
  const hasDomain = unlocked.includes('domain');
  const hasPiecewise = unlocked.includes('piecewise');

  // Check equation validity for friendly error feedback
  const validation = useMemo(() => {
    if (inputMode === 'piecewise') {
      return samplePiecewiseCurve(pieces, 0.05);
    }
    return sampleSingleCurve(typedEquation, domain, ballOrigin, 0.05);
  }, [inputMode, pieces, typedEquation, domain, ballOrigin]);

  const maxCourseX = Math.max(11, currentLevel.hole[0] + 2);

  // If in Typed / Manual Equation Solver mode, render the rich EquationSolverBox
  if (inputMode === 'typed') {
    return (
      <section className="w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/15 text-white px-3 py-2 z-20 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          {/* Mode Switcher Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setInputMode('typed')}
                className="px-3 py-1 rounded-lg flex items-center gap-1.5 bg-sky-400 text-slate-950 font-extrabold shadow"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>✍️ Equation Box</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('sliders')}
                className="px-3 py-1 rounded-lg flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>🎛️ Sliders</span>
              </button>
              {hasPiecewise && (
                <button
                  type="button"
                  onClick={() => setInputMode('piecewise')}
                  className="px-3 py-1 rounded-lg flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>🧩 Clubs</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              title="Collapse or expand equation builder"
              className="btn-chunky p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-white/10"
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {!collapsed && <EquationSolverBox />}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-slate-900/95 backdrop-blur-lg border-t border-white/15 text-white px-3 py-2.5 z-20 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col gap-2">
        {/* Top Row: Equation Display + Mode Switcher + Mobile Collapse + SWING Button */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              title="Collapse or expand Swing Builder"
              className="sm:hidden btn-chunky p-1.5 rounded-lg bg-slate-800 text-slate-200 border border-white/10"
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {inputMode === 'sliders' ? (
              <EquationDisplay
                params={sliderParams}
                activeParam={activeParam}
                domain={domain}
                showDomain={hasDomain}
              />
            ) : (
              <div className="text-xs sm:text-sm font-display font-bold text-amber-300 px-2">
                Piecewise Multi-Club Builder ({pieces.length}/3 Clubs)
              </div>
            )}
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setInputMode('typed')}
                className="px-2.5 py-1 rounded-lg flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Equation Box</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('sliders')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                  inputMode === 'sliders' ? 'bg-sky-400 text-slate-950 font-extrabold' : 'text-slate-300'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Sliders</span>
              </button>
              {hasPiecewise && (
                <button
                  type="button"
                  onClick={() => setInputMode('piecewise')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                    inputMode === 'piecewise' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'text-slate-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Clubs</span>
                </button>
              )}
            </div>

            {/* Big Chunky SWING Button */}
            <button
              type="button"
              disabled={isSwinging || !validation.valid}
              onClick={() => startSwing(false)}
              className="btn-chunky px-5 py-2 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 disabled:opacity-40 text-slate-950 font-display font-extrabold text-base sm:text-lg tracking-wide shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>SWING!</span>
            </button>
          </div>
        </div>

        {/* Friendly validation error banner if equation is incomplete */}
        {!validation.valid && validation.error && (
          <div className="text-xs font-bold text-rose-300 bg-rose-950/70 border border-rose-400/30 px-3 py-1 rounded-lg">
            {validation.error}
          </div>
        )}

        {/* Collapsible body */}
        {!collapsed && (
          <div className="flex flex-col gap-2">
            {/* Parent Function Selector if level allows multiple parent families */}
            {inputMode === 'sliders' && currentLevel.allowedParents.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-bold">Club Shape:</span>
                {currentLevel.allowedParents.map((p: ParentFunctionType) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSliderParam('parent', p)}
                    className={`btn-chunky px-2.5 py-1 rounded-lg font-bold capitalize ${
                      sliderParams.parent === p
                        ? 'bg-yellow-300 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* SLIDERS MODE */}
            {inputMode === 'sliders' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {hasA && (
                  <SliderControl
                    paramKey="a"
                    label="a"
                    tooltip="steepness & flip"
                    value={sliderParams.a}
                    min={-3}
                    max={3}
                    step={0.05}
                    onChange={(v) => setSliderParam('a', v)}
                    onFocusParam={setActiveParam}
                  />
                )}
                {hasB && (
                  <SliderControl
                    paramKey="b"
                    label="b"
                    tooltip={sliderParams.parent === 'exponential' ? 'growth base' : 'wave frequency'}
                    value={sliderParams.b}
                    min={0.25}
                    max={3}
                    step={0.25}
                    onChange={(v) => setSliderParam('b', v)}
                    onFocusParam={setActiveParam}
                  />
                )}
                {hasH && (
                  <SliderControl
                    paramKey="h"
                    label="h"
                    tooltip="horizontal shift"
                    value={sliderParams.h}
                    min={-2}
                    max={10}
                    step={0.25}
                    onChange={(v) => setSliderParam('h', v)}
                    onFocusParam={setActiveParam}
                  />
                )}
                {hasK && (
                  <SliderControl
                    paramKey="k"
                    label="k"
                    tooltip="vertical shift"
                    value={sliderParams.k}
                    min={-6}
                    max={6}
                    step={0.25}
                    onChange={(v) => setSliderParam('k', v)}
                    onFocusParam={setActiveParam}
                  />
                )}
              </div>
            )}

            {/* DOMAIN PUTT RANGE SLIDER (World 3+) */}
            {inputMode !== 'piecewise' && hasDomain && (
              <DomainSlider domain={domain} maxX={maxCourseX} onChange={setDomain} />
            )}

            {/* PIECEWISE MULTI-CLUB BUILDER (World 6) */}
            {inputMode === 'piecewise' && (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {pieces.map((piece, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePieceIndex(idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        activePieceIndex === idx
                          ? 'bg-slate-800 border-amber-400 shadow-md'
                          : 'bg-slate-900/80 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-amber-300">Club {idx + 1}</span>
                        {pieces.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removePiece(idx);
                            }}
                            className="text-rose-400 hover:text-rose-300 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-white/10">
                        <span className="font-mono text-xs text-emerald-400">y =</span>
                        <input
                          type="text"
                          value={piece.equation}
                          onChange={(e) => updatePiece(idx, { equation: e.target.value })}
                          className="bg-transparent font-mono text-xs text-white focus:outline-none w-full"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-sky-300">
                        <span>Domain:</span>
                        <input
                          type="number"
                          step={0.2}
                          value={piece.domain[0]}
                          onChange={(e) =>
                            updatePiece(idx, {
                              domain: [parseFloat(e.target.value) || 0, piece.domain[1]]
                            })
                          }
                          className="w-14 bg-slate-950 px-1.5 py-0.5 rounded border border-white/15 text-center"
                        />
                        <span>≤ x ≤</span>
                        <input
                          type="number"
                          step={0.2}
                          value={piece.domain[1]}
                          onChange={(e) =>
                            updatePiece(idx, {
                              domain: [piece.domain[0], parseFloat(e.target.value) || 1]
                            })
                          }
                          className="w-14 bg-slate-950 px-1.5 py-0.5 rounded border border-white/15 text-center"
                        />
                      </div>
                    </div>
                  ))}

                  {pieces.length < 3 && (
                    <button
                      type="button"
                      onClick={addPiece}
                      className="btn-chunky p-3 rounded-xl border border-dashed border-amber-400/50 hover:border-amber-400 text-amber-300 flex items-center justify-center gap-1.5 text-xs font-bold"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Club Slot</span>
                    </button>
                  )}
                </div>

                <MathKeyboard
                  value={pieces[activePieceIndex]?.equation ?? ''}
                  onChange={(nextEq) => updatePiece(activePieceIndex, { equation: nextEq })}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
