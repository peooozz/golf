import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../game/store';

export const Caddie: React.FC = () => {
  const { caddieMessage, caddieMood, hintStep } = useGameStore();

  return (
    <div className="pointer-events-none fixed top-14 left-3 right-3 sm:right-auto sm:max-w-md z-10 flex items-start gap-2.5">
      {/* Friendly SVG Cartoon Golf-Ball Caddie Mascot */}
      <motion.div
        animate={
          caddieMood === 'happy'
            ? { y: [0, -6, 0], rotate: [0, 8, -8, 0] }
            : caddieMood === 'wince'
            ? { x: [0, -4, 4, 0] }
            : { y: [0, -2, 0] }
        }
        transition={{ duration: 0.6 }}
        className="w-12 h-12 rounded-2xl bg-slate-900/85 border-2 border-emerald-400 shadow-lg flex items-center justify-center shrink-0"
      >
        <svg viewBox="0 0 64 64" className="w-10 h-10">
          {/* Visor cap */}
          <path d="M12 24 Q32 10 52 24 Z" fill="#22c55e" />
          <path d="M10 24 Q32 20 56 26 L50 29 Q32 25 12 27 Z" fill="#15803d" />
          {/* Golf ball body */}
          <circle cx="32" cy="36" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          {/* Dimples */}
          <circle cx="20" cy="36" r="1.5" fill="#cbd5e1" />
          <circle cx="44" cy="36" r="1.5" fill="#cbd5e1" />
          <circle cx="24" cy="46" r="1.5" fill="#cbd5e1" />
          <circle cx="40" cy="46" r="1.5" fill="#cbd5e1" />
          {/* Eyes */}
          {caddieMood === 'wince' ? (
            <>
              <path d="M22 31 L27 34 L22 37" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M42 31 L37 34 L42 37" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="25" cy="33" r="2.6" fill="#0f172a" />
              <circle cx="39" cy="33" r="2.6" fill="#0f172a" />
            </>
          )}
          {/* Mouth */}
          {caddieMood === 'happy' ? (
            <path d="M24 40 Q32 48 40 40" stroke="#0f172a" strokeWidth="2.5" fill="#f43f5e" strokeLinecap="round" />
          ) : caddieMood === 'wince' ? (
            <path d="M25 43 Q32 39 39 43" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M26 41 Q32 45 38 41" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </motion.div>

      {/* One-sentence speech bubble */}
      <motion.div
        key={caddieMessage}
        initial={{ opacity: 0, y: -4, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="pointer-events-auto bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-white/15 shadow-lg text-xs sm:text-sm font-medium leading-snug"
      >
        <span>{caddieMessage}</span>
        {hintStep > 0 && (
          <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
            Hint {hintStep}/3
          </span>
        )}
      </motion.div>
    </div>
  );
};
