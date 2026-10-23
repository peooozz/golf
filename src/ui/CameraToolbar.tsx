import React, { useEffect, useState } from 'react';
import { Camera, Maximize, Minimize } from 'lucide-react';
import { CameraMode, useGameStore } from '../game/store';

const CAMERA_MODES: Array<{ mode: CameraMode; label: string; icon: string }> = [
  { mode: 'broadcast', label: 'Broadcast 3D', icon: '🎥' },
  { mode: 'tee', label: 'Tee View', icon: '🏌️' },
  { mode: 'green', label: 'Pin View', icon: '⛳' },
  { mode: 'graph', label: '2D Graph', icon: '📐' },
  { mode: 'orbit', label: 'Free Orbit', icon: '🔄' }
];

export const CameraToolbar: React.FC = () => {
  const { cameraMode, setCameraMode } = useGameStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-2xl border border-white/15 shadow-xl text-white select-none">
      <div className="flex items-center gap-1 px-1.5 text-slate-400 font-display font-bold text-xs border-r border-white/10 hidden sm:flex">
        <Camera className="w-3.5 h-3.5 text-sky-400" />
        <span>Angle:</span>
      </div>

      {CAMERA_MODES.map((item) => {
        const isActive = cameraMode === item.mode;
        return (
          <button
            key={item.mode}
            type="button"
            onClick={() => setCameraMode(item.mode)}
            title={`Switch to ${item.label} camera angle`}
            className={`btn-chunky px-2.5 py-1 rounded-xl text-xs font-display font-bold flex items-center gap-1 transition-all ${
              isActive
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300'
            }`}
          >
            <span>{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </button>
        );
      })}

      <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

      {/* True Fullscreen Toggle */}
      <button
        type="button"
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (F11)'}
        className="btn-chunky p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 transition-colors"
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>
    </div>
  );
};
