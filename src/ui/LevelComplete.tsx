import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw, Share2, Star, Film } from 'lucide-react';
import { useGameStore } from '../game/store';
import { calculateStars } from '../game/scoring';
import { AhaCard } from './AhaCard';
import { Confetti } from '../scene/effects/Confetti';

export const LevelComplete: React.FC = () => {
  const {
    currentLevel,
    strokes,
    levelWon,
    reducedMotion,
    nextLevel,
    resetLevel,
    startSwing
  } = useGameStore();
  const [copied, setCopied] = useState(false);

  if (!levelWon) return null;

  const stars = calculateStars(strokes, currentLevel.par);
  const isHoleInOne = strokes === 1;

  const shareScoreCard = () => {
    const starIcons = '⭐'.repeat(stars);
    const summary = `⛳ Graphing Golf — Hole ${currentLevel.id} (${currentLevel.title})
Score: ${strokes} ${
      strokes === 1 ? 'Stroke (Hole-in-One!)' : 'Strokes'
    } (Par ${currentLevel.par}) ${starIcons}`;
    try {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Confetti active={levelWon} isHoleInOne={isHoleInOne} reducedMotion={reducedMotion} />

      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-slate-900 border-2 border-emerald-400 rounded-3xl p-5 text-white shadow-2xl flex flex-col gap-4"
      >
        <div className="text-center">
          <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-display font-bold text-xs uppercase tracking-wider">
            {isHoleInOne ? '🔥 Hole in One!' : 'Hole Complete!'}
          </span>
          <h2 className="font-display font-extrabold text-2xl text-yellow-300 mt-1">
            {currentLevel.id}: {currentLevel.title}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Finished in <strong className="text-white">{strokes}</strong>{' '}
            {strokes === 1 ? 'stroke' : 'strokes'} (Par {currentLevel.par})
          </p>
        </div>

        {/* Animated 3-Star Rating */}
        <div className="flex items-center justify-center gap-3 py-1">
          {[1, 2, 3].map((idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: idx <= stars ? 1.15 : 0.9, rotate: 0 }}
              transition={{ delay: idx * 0.14, type: 'spring' }}
            >
              <Star
                className={`w-10 h-10 ${
                  idx <= stars
                    ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]'
                    : 'text-slate-700'
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* 5-second Aha Concept Card + Why? Mini-Demo */}
        <AhaCard />

        {/* Replay, Share, Retry, and Next Hole buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => startSwing(true)}
            className="btn-chunky py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-display font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10"
          >
            <Film className="w-4 h-4" />
            <span>Slow-Mo Replay</span>
          </button>

          <button
            type="button"
            onClick={shareScoreCard}
            className="btn-chunky py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-display font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Score Copied!' : 'Share Score'}</span>
          </button>

          <button
            type="button"
            onClick={resetLevel}
            className="btn-chunky py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-display font-bold text-sm flex items-center justify-center gap-1.5 border border-white/15"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Hole</span>
          </button>

          <button
            type="button"
            onClick={nextLevel}
            className="btn-chunky py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-lg"
          >
            <span>Next Hole</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
