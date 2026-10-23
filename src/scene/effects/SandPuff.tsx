import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SandPuffProps {
  point: [number, number] | null;
  active: boolean;
}

export const SandPuff: React.FC<SandPuffProps> = ({ point, active }) => {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);

  React.useEffect(() => {
    if (active) {
      startTime.current = performance.now();
    }
  }, [active, point]);

  useFrame(() => {
    if (!groupRef.current || !active || startTime.current === null) return;
    const elapsed = (performance.now() - startTime.current) / 1000;
    groupRef.current.children.forEach((child, i) => {
      const angle = (i / 8) * Math.PI;
      child.position.x = Math.cos(angle) * 0.9 * elapsed;
      child.position.y = Math.sin(angle) * 0.8 * elapsed;
      const scale = Math.max(0.01, (1 - elapsed * 1.2) * 1.3);
      child.scale.setScalar(scale);
    });
  });

  if (!active || !point) return null;

  return (
    <group ref={groupRef} position={[point[0], point[1] + 0.15, 0.25]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshStandardMaterial color="#fde047" transparent opacity={0.85} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
