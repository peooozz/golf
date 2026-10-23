import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface FlagProps {
  position: [number, number];
  reducedMotion: boolean;
}

export const Flag: React.FC<FlagProps> = ({ position, reducedMotion }) => {
  const [hx, hy] = position;
  const clothRef = useRef<THREE.Mesh>(null);

  // Create subdivided plane geometry for vertex-animated waving flag cloth
  const flagGeo = useMemo(() => new THREE.PlaneGeometry(1.1, 0.65, 12, 6), []);

  useFrame(({ clock }) => {
    if (!clothRef.current || reducedMotion) return;
    const pos = clothRef.current.geometry.attributes.position;
    const t = clock.getElapsedTime() * 4.5;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i) + 0.55; // 0 at pole, 1.1 at tip
      const wave = Math.sin(u * 4.0 - t) * 0.12 * u;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={[hx, hy, 0]}>
      {/* Dark recessed cup with visible depth */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.28, 20]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* White cup rim */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26, 0.33, 24]} />
        <meshBasicMaterial color="#f8fafc" side={THREE.DoubleSide} />
      </mesh>

      {/* Fiberglass flagstick */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 2.7, 12]} />
        <meshStandardMaterial color="#fef08a" metalness={0.3} roughness={0.3} />
      </mesh>

      {/* Gold finial ball on top */}
      <mesh position={[0, 2.72, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#facc15" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Waving red/coral cloth pennant */}
      <mesh
        ref={clothRef}
        geometry={flagGeo}
        position={[0.55, 2.32, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#f43f5e"
          side={THREE.DoubleSide}
          roughness={0.5}
        />
      </mesh>

      {/* Coordinate label badge right above the hole */}
      <Html position={[0, -0.55, 0.4]} center distanceFactor={14}>
        <div className="px-2 py-0.5 rounded-full bg-slate-900/85 text-yellow-300 font-display text-xs font-bold shadow border border-yellow-400/40 whitespace-nowrap pointer-events-none">
          ⛳ ({hx}, {hy})
        </div>
      </Html>
    </group>
  );
};
