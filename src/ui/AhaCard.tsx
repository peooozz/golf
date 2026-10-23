import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PlayCircle } from 'lucide-react';
import { useGameStore } from '../game/store';

export const AhaCard: React.FC = () => {
  const { currentLevel, showAha, showWhyDemo, setShowWhyDemo } = useGameStore();
  const [morphT, setMorphT] = useState(0);

  // 10-second animated mini-demo morphing parameter t when "Why?" is clicked
  useEffect(() => {
    if (!showWhyDemo) return;
    const start = performance.now();
    const id = window.setInterval(() => {
      const elapsed = (performance.now() - start) / 1000;
      setMorphT(Math.sin(elapsed * 2));
      if (elapsed >= 10) {
        setShowWhyDemo(false);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [showWhyDemo, setShowWhyDemo]);

  if (!showAha && !showWhyDemo) return null;

  // Build SVG path for the mini transformation demo
  const buildDemoPath = (paramOffset: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = (i / 40) * 6 - 3; // -3..3
      let y = 0;
      if (currentLevel.concept === 'shifts') {
        y = -0.35 * Math.pow(x - paramOffset * 1.2, 2) + 1.5;
      } else if (currentLevel.concept === 'stretch' || currentLevel.concept === 'reflect') {
        y = paramOffset * 0.45 * (x * x - 4);
      } else if (currentLevel.concept === 'exponential') {
        y = 0.4 * Math.pow(1.8, x) + paramOffset * 0.8 - 1;
      } else if (currentLevel.concept === 'trig') {
        y = (1.2 + paramOffset * 0.5) * Math.sin(x * 1.5);
      } else {
        y = -0.3 * x * x + 1.2;
      }
      const svgX = 110 + x * 28;
      const svgY = 65 - y * 18;
      pts.push(`${i === 0 ? 'M' : 'L'} ${svgX.toFixed(1)} ${svgY.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-emerald-950/90 border border-emerald-400/40 rounded-2xl p-3.5 text-white shadow-xl"
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 text-emerald-300 font-display font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Aha! Concept Unlocked</span>
        </div>
        <button
          type="button"
          onClick={() => setShowWhyDemo(!showWhyDemo)}
          className="btn-chunky px-2.5 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold flex items-center gap-1"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>{showWhyDemo ? 'Hide Why?' : 'Why? (10s Demo)'}</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-snug">
        {currentLevel.aha}
      </p>

      {showWhyDemo && (
        <div className="mt-2.5 bg-slate-950 rounded-xl p-2 border border-white/10 flex flex-col items-center">
          <svg viewBox="0 0 220 120" className="w-full h-28">
            <line x1="10" y1="65" x2="210" y2="65" stroke="#334155" strokeWidth="1.5" />
            <line x1="110" y1="10" x2="110" y2="110" stroke="#334155" strokeWidth="1.5" />
            {/* Parent ghost curve */}
            <path d={buildDemoPath(0)} stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            {/* Live morphing transformed curve */}
            <path d={buildDemoPath(morphT)} stroke="#38bdf8" strokeWidth="3" fill="none" />
          </svg>
          <span className="text-[11px] text-sky-300 font-mono">
            Watch how changing the parameter morphs the curve in real time!
          </span>
        </div>
      )}
    </motion.div>
  );
};
