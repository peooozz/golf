import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  active: boolean;
  isHoleInOne: boolean;
  reducedMotion: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, isHoleInOne, reducedMotion }) => {
  useEffect(() => {
    if (!active || reducedMotion) return;
    try {
      confetti({
        particleCount: isHoleInOne ? 110 : 60,
        spread: isHoleInOne ? 90 : 65,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if canvas-confetti fails in headless environment
    }
  }, [active, isHoleInOne, reducedMotion]);

  return null;
};
