import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../game/store';
import { CurvePoint } from '../game/mathEngine';

interface CameraRigProps {
  tee: [number, number];
  hole: [number, number];
  isSwinging: boolean;
  flightPoints: CurvePoint[];
  reducedMotion: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  tee,
  hole,
  isSwinging,
  flightPoints,
  reducedMotion
}) => {
  const { camera, size } = useThree();
  const { cameraMode } = useGameStore();
  const targetVec = useMemo(() => new THREE.Vector3(), []);
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const currentTarget = useRef(new THREE.Vector3());

  // Initialize target position
  useEffect(() => {
    const midX = (tee[0] + hole[0]) * 0.5;
    const midY = (tee[1] + hole[1]) * 0.35;
    currentTarget.current.set(midX, midY, 0);
  }, [tee, hole]);

  useFrame(({ clock }, delta) => {
    // If in free Orbit mode, OrbitControls takes over control of the camera
    if (cameraMode === 'orbit') return;

    const midX = (tee[0] + hole[0]) * 0.5;
    const midY = (tee[1] + hole[1]) * 0.35 + 0.4;
    const spanX = Math.max(7.5, Math.abs(hole[0] - tee[0]));

    const aspect = size.width / Math.max(1, size.height);
    const mobileZoomOut = aspect < 0.85 ? 1.45 : aspect < 1.2 ? 1.2 : 1.0;

    if (isSwinging && flightPoints.length > 1) {
      // Dynamic televised ball flight tracking
      const last = flightPoints[flightPoints.length - 1];
      const leadX = (midX * 0.3 + last.x * 0.7);
      const leadY = (midY * 0.3 + last.y * 0.7);
      
      targetVec.set(leadX, leadY + 0.5, 0);

      if (cameraMode === 'tee') {
        desiredPos.set(tee[0] - 2.8, tee[1] + 1.8, 3.8);
      } else if (cameraMode === 'green') {
        desiredPos.set(hole[0] + 3.2, hole[1] + 2.5, 4.2);
      } else if (cameraMode === 'graph') {
        desiredPos.set(leadX, leadY + 1.2, (spanX * 1.05 + 5.0) * mobileZoomOut);
      } else {
        // Broadcast mode dynamic follow
        desiredPos.set(
          leadX - spanX * 0.15,
          Math.max(3.2, leadY + 2.4),
          (spanX * 0.75 + 5.0) * mobileZoomOut
        );
      }
    } else {
      const idleSway = reducedMotion ? 0 : Math.sin(clock.getElapsedTime() * 0.35) * 0.25;

      switch (cameraMode) {
        case 'tee':
          // Behind the tee box looking straight down the fairway toward the pin
          targetVec.set(hole[0] * 0.65 + tee[0] * 0.35, (tee[1] + hole[1]) * 0.5 + 0.8, 0);
          desiredPos.set(tee[0] - 3.2, tee[1] + 1.9, 4.2);
          break;

        case 'green':
          // Reverse championship perspective looking back from the green toward the tee
          targetVec.set(midX, midY + 0.5, 0);
          desiredPos.set(hole[0] + 3.8, hole[1] + 2.8, 4.8);
          break;

        case 'graph':
          // Exact orthographic 2D graph view with aligned axes
          targetVec.set(midX, midY - 0.5, 0);
          desiredPos.set(midX, midY + 1.0, (spanX * 1.15 + 5.5) * mobileZoomOut);
          break;

        case 'broadcast':
        default:
          // The Perfect 3D Broadcast Perspective (22° pitch down, 18° yaw angle)
          targetVec.set(midX + 0.3, midY - 0.2, 0);
          desiredPos.set(
            midX - spanX * 0.14 + idleSway,
            Math.max(3.8, midY + spanX * 0.34 + 2.2),
            (Math.max(6.5, spanX * 0.86 + 3.8)) * mobileZoomOut
          );
          break;
      }
    }

    const lerpSpeed = Math.min(1, delta * 3.8);
    camera.position.lerp(desiredPos, lerpSpeed);
    currentTarget.current.lerp(targetVec, lerpSpeed);
    camera.lookAt(currentTarget.current);
  });

  const midX = (tee[0] + hole[0]) * 0.5;
  const midY = (tee[1] + hole[1]) * 0.35;

  if (cameraMode === 'orbit') {
    return (
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        target={[midX, midY, 0]}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={3}
        maxDistance={65}
      />
    );
  }

  return null;
};
