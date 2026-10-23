import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { CurvePoint } from '../game/mathEngine';

interface CurveTubeProps {
  points: CurvePoint[];
  hitObstacle: boolean;
  inHole: boolean;
  solutionPoints?: CurvePoint[];
  colorBlindMode: boolean;
}

export const CurveTube: React.FC<CurveTubeProps> = ({
  points,
  hitObstacle,
  inHole,
  solutionPoints,
  colorBlindMode
}) => {
  const linePoints = useMemo(() => {
    if (points.length < 2) return [];
    // Downsample slightly for clean dotted tube rendering
    const step = Math.max(1, Math.floor(points.length / 90));
    const arr: Array<[number, number, number]> = [];
    for (let i = 0; i < points.length; i += step) {
      arr.push([points[i].x, points[i].y + 0.14, 0.2]);
    }
    const last = points[points.length - 1];
    arr.push([last.x, last.y + 0.14, 0.2]);
    return arr;
  }, [points]);

  const solLinePoints = useMemo(() => {
    if (!solutionPoints || solutionPoints.length < 2) return [];
    const step = Math.max(1, Math.floor(solutionPoints.length / 80));
    const arr: Array<[number, number, number]> = [];
    for (let i = 0; i < solutionPoints.length; i += step) {
      arr.push([solutionPoints[i].x, solutionPoints[i].y + 0.14, -0.1]);
    }
    const last = solutionPoints[solutionPoints.length - 1];
    arr.push([last.x, last.y + 0.14, -0.1]);
    return arr;
  }, [solutionPoints]);

  // Blue/cyan = ok, gold/green = hole lock, red/orange = obstacle hit
  const mainColor = hitObstacle
    ? colorBlindMode
      ? '#f97316'
      : '#fb7185'
    : inHole
    ? '#fde047'
    : '#38bdf8';

  const endPt = points.length > 0 ? points[points.length - 1] : null;

  return (
    <group>
      {linePoints.length >= 2 && (
        <Line
          points={linePoints}
          color={mainColor}
          lineWidth={3.5}
          dashed
          dashScale={3.2}
          dashSize={0.5}
          gapSize={0.28}
        />
      )}

      {/* Landing marker ring at the domain endpoint x2 */}
      {endPt && (
        <mesh position={[endPt.x, endPt.y + 0.14, 0.22]}>
          <ringGeometry args={[0.12, 0.22, 20]} />
          <meshBasicMaterial color={mainColor} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Optional Hint Step 3 / Dev Solution Ghost Curve */}
      {solLinePoints.length >= 2 && (
        <Line
          points={solLinePoints}
          color="#a855f7"
          lineWidth={2.5}
          dashed
          dashScale={2.5}
          dashSize={0.4}
          gapSize={0.35}
        />
      )}
    </group>
  );
};
