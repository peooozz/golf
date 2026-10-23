import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CurvePoint } from '../game/mathEngine';
import { sfx } from '../audio/sfx';

interface BallProps {
  origin: [number, number];
  flightPoints: CurvePoint[];
  isSwinging: boolean;
  isReplaying: boolean;
  reducedMotion: boolean;
  onSwingFinish: () => void;
}

// Generate a procedural canvas bump/normal texture for realistic golf ball dimples
function createDimpleBumpMap(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = '#64748b';
  for (let y = 6; y < 64; y += 12) {
    for (let x = 6; x < 128; x += 12) {
      ctx.beginPath();
      ctx.arc(x + ((y / 12) % 2) * 5, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export const Ball: React.FC<BallProps> = ({
  origin,
  flightPoints,
  isSwinging,
  isReplaying,
  reducedMotion,
  onSwingFinish
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);
  const [trailCount, setTrailCount] = useState(0);
  const finishedRef = useRef(false);
  const bumpMap = useMemo(() => createDimpleBumpMap(), []);

  // Reset animation progress when a new swing begins
  React.useEffect(() => {
    if (isSwinging) {
      progressRef.current = 0;
      finishedRef.current = false;
      setTrailCount(0);
      sfx.playBallTick();
      sfx.playSwingWhoosh();
    }
  }, [isSwinging]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (!isSwinging || flightPoints.length < 2) {
      meshRef.current.position.set(origin[0], origin[1] + 0.18, 0.15);
      meshRef.current.scale.set(1, 1, 1);
      return;
    }

    const speed = isReplaying ? 0.38 : reducedMotion ? 1.4 : 0.85;
    progressRef.current = Math.min(1, progressRef.current + delta * speed);
    const t = progressRef.current;

    const floatIdx = t * (flightPoints.length - 1);
    const idx = Math.floor(floatIdx);
    const nextIdx = Math.min(flightPoints.length - 1, idx + 1);
    const frac = floatIdx - idx;

    const p0 = flightPoints[idx];
    const p1 = flightPoints[nextIdx];
    const cx = p0.x + (p1.x - p0.x) * frac;
    const cy = p0.y + (p1.y - p0.y) * frac;

    // Subtle bounce & squash right at landing (t > 0.92)
    let bounceOffset = 0;
    let squashY = 1;
    let squashXZ = 1;
    if (t > 0.92 && !reducedMotion) {
      const landPhase = (t - 0.92) / 0.08;
      bounceOffset = Math.abs(Math.sin(landPhase * Math.PI * 2)) * 0.18 * (1 - landPhase);
      squashY = 1 - Math.sin(landPhase * Math.PI) * 0.22;
      squashXZ = 1 + Math.sin(landPhase * Math.PI) * 0.15;
    }

    meshRef.current.position.set(cx, cy + 0.18 + bounceOffset, 0.15);
    meshRef.current.rotation.z -= delta * 12;
    meshRef.current.scale.set(squashXZ, squashY, squashXZ);

    const desiredTrail = Math.floor(t * Math.min(28, flightPoints.length));
    if (desiredTrail !== trailCount) {
      setTrailCount(desiredTrail);
    }

    if (t >= 1 && !finishedRef.current) {
      finishedRef.current = true;
      onSwingFinish();
    }
  });

  // Pick evenly spaced trail dots behind the ball during flight
  const trailDots = useMemo(() => {
    if (!isSwinging || flightPoints.length < 2 || trailCount === 0) return [];
    const dots: CurvePoint[] = [];
    const totalDots = 24;
    for (let i = 0; i < trailCount; i++) {
      const ptIdx = Math.floor((i / totalDots) * (flightPoints.length - 1));
      if (flightPoints[ptIdx]) {
        dots.push(flightPoints[ptIdx]);
      }
    }
    return dots;
  }, [isSwinging, flightPoints, trailCount]);

  return (
    <group>
      {/* Golf ball with procedural dimple bump map */}
      <mesh
        ref={meshRef}
        position={[origin[0], origin[1] + 0.18, 0.15]}
        castShadow
      >
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.1}
          bumpMap={bumpMap ?? undefined}
          bumpScale={0.03}
        />
      </mesh>

      {/* Glowing dot trail tracing the equation in flight */}
      {trailDots.map((pt, i) => (
        <mesh key={i} position={[pt.x, pt.y + 0.15, 0.1]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};
