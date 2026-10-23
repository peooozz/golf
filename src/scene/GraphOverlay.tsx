import React, { useMemo } from 'react';
import { Line, Text } from '@react-three/drei';

interface GraphOverlayProps {
  visible: boolean;
  maxX: number;
  origin: [number, number];
}

export const GraphOverlay: React.FC<GraphOverlayProps> = ({ visible, maxX, origin }) => {
  const gridLines = useMemo(() => {
    const xEnd = Math.max(12, Math.ceil(maxX + 2));
    const verticals: Array<Array<[number, number, number]>> = [];
    const horizontals: Array<Array<[number, number, number]>> = [];

    for (let x = -2; x <= xEnd; x += 1) {
      verticals.push([
        [x, -6, -0.35],
        [x, 8, -0.35]
      ]);
    }
    for (let y = -6; y <= 8; y += 1) {
      horizontals.push([
        [-2, y, -0.35],
        [xEnd, y, -0.35]
      ]);
    }
    return { verticals, horizontals, xEnd };
  }, [maxX]);

  if (!visible) return null;

  return (
    <group>
      {/* Faint vertical grid lines */}
      {gridLines.verticals.map((pts, i) => (
        <Line
          key={`v-${i}`}
          points={pts}
          color="#e2e8f0"
          lineWidth={1}
          transparent
          opacity={0.22}
        />
      ))}

      {/* Faint horizontal grid lines */}
      {gridLines.horizontals.map((pts, i) => (
        <Line
          key={`h-${i}`}
          points={pts}
          color="#e2e8f0"
          lineWidth={1}
          transparent
          opacity={0.22}
        />
      ))}

      {/* Bold X and Y axes */}
      <Line
        points={[
          [-2, 0, -0.3],
          [gridLines.xEnd, 0, -0.3]
        ]}
        color="#fef08a"
        lineWidth={2}
        transparent
        opacity={0.65}
      />
      <Line
        points={[
          [0, -6, -0.3],
          [0, 8, -0.3]
        ]}
        color="#fef08a"
        lineWidth={2}
        transparent
        opacity={0.65}
      />

      {/* Tick numbers along the x-axis */}
      {Array.from({ length: Math.floor(gridLines.xEnd / 2) + 1 }, (_, i) => i * 2).map((xVal) => (
        <Text
          key={`xtick-${xVal}`}
          position={[xVal, -0.42, 0.45]}
          fontSize={0.32}
          color="#fef9c3"
          anchorX="center"
          anchorY="middle"
        >
          {xVal}
        </Text>
      ))}

      {/* Tick numbers along the y-axis left wall */}
      {[-4, -2, 2, 4, 6].map((yVal) => (
        <Text
          key={`ytick-${yVal}`}
          position={[-0.45, yVal, 0.45]}
          fontSize={0.32}
          color="#fef9c3"
          anchorX="right"
          anchorY="middle"
        >
          {yVal}
        </Text>
      ))}

      {/* Highlight local origin if stroke continuation moved the tee */}
      {(origin[0] !== 0 || origin[1] !== 0) && (
        <Text
          position={[origin[0], origin[1] - 0.55, 0.5]}
          fontSize={0.28}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {`New Tee (${origin[0]}, ${origin[1]})`}
        </Text>
      )}
    </group>
  );
};
