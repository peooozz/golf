import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SplashProps {
  point: [number, number] | null;
  active: boolean;
}

export const Splash: React.FC<SplashProps> = ({ point, active }) => {
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
      const angle = (i / 10) * Math.PI * 2;
      const speed = 1.2 + (i % 3) * 0.4;
      child.position.x = Math.cos(angle) * speed * elapsed;
      child.position.y = Math.sin(elapsed * 5) * 1.4 - 2.2 * elapsed * elapsed;
      child.position.z = Math.sin(angle) * speed * elapsed * 0.5;
      const scale = Math.max(0.01, 1 - elapsed * 1.1);
      child.scale.setScalar(scale);
    });
  });

  if (!active || !point) return null;

  return (
    <group ref={groupRef} position={[point[0], point[1] + 0.2, 0.2]}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};
