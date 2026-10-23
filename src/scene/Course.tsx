import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LevelConfig } from '../data/levels';

interface CourseProps {
  level: LevelConfig;
}

export const Course: React.FC<CourseProps> = ({ level }) => {
  const [hx, hy] = level.hole;
  const courseSpan = Math.max(12, hx + 4);

  // Alternating mowed-grass stripes along the x-axis with wide 3D fairway profile
  const stripes = useMemo(() => {
    const items: Array<{ x: number; isDark: boolean }> = [];
    for (let x = -3; x <= courseSpan + 1; x += 1) {
      items.push({ x, isDark: Math.abs(x) % 2 === 0 });
    }
    return items;
  }, [courseSpan]);

  // Trees in the background and foreground rough for realistic golf course landscaping
  const sceneryObjects = useMemo(() => {
    const trees: Array<{ x: number; z: number; scale: number; type: 'pine' | 'oak' }> = [];
    const rocks: Array<{ x: number; z: number; scale: number; rot: number }> = [];

    // Background trees along north rough (z = -3.8 to -5.5)
    for (let x = -2; x <= courseSpan + 2; x += 2.2) {
      trees.push({
        x: x + (Math.sin(x * 3) * 0.4),
        z: -3.8 - Math.abs(Math.cos(x * 2)) * 1.5,
        scale: 0.75 + Math.abs(Math.sin(x * 5)) * 0.35,
        type: Math.abs(x) % 3 === 0 ? 'oak' : 'pine'
      });
    }

    // Foreground trees along south rough (z = 3.6 to 4.8)
    for (let x = 1; x <= courseSpan; x += 3.4) {
      trees.push({
        x: x + (Math.cos(x * 2) * 0.5),
        z: 3.6 + Math.abs(Math.sin(x)) * 1.0,
        scale: 0.65 + Math.abs(Math.cos(x * 3)) * 0.25,
        type: 'pine'
      });
    }

    // Decorative boulders along the hazard lines
    for (let x = 0; x <= courseSpan; x += 2.8) {
      rocks.push({
        x: x + 0.8,
        z: (x % 2 === 0 ? -2.8 : 2.8) + Math.sin(x) * 0.3,
        scale: 0.3 + Math.abs(Math.cos(x * 4)) * 0.22,
        rot: x * 1.3
      });
    }

    return { trees, rocks };
  }, [courseSpan]);

  // Gentle wind sway for tree foliage
  const foliageRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (foliageRef.current) {
      const t = clock.getElapsedTime();
      foliageRef.current.children.forEach((child, i) => {
        child.rotation.z = Math.sin(t * 1.4 + i * 0.7) * 0.025;
      });
    }
  });

  return (
    <group>
      {/* 1. MOWED FAIRWAY STRIPES (3D depth: 5.6 units wide in Z) */}
      <group>
        {stripes.map((s, idx) => (
          <mesh
            key={`stripe-${idx}`}
            position={[s.x + 0.5, -0.15, 0]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[1.005, 0.3, 5.4]} />
            <meshStandardMaterial
              color={s.isDark ? '#15803d' : '#22c55e'}
              roughness={0.65}
              metalness={0.04}
            />
          </mesh>
        ))}
      </group>

      {/* 2. OUTER ROUGH BORDERS (North and South fringes with slight dip) */}
      {/* North Rough (Back) */}
      <mesh position={[courseSpan / 2 - 1, -0.22, -3.2]} receiveShadow>
        <boxGeometry args={[courseSpan + 8, 0.26, 1.4]} />
        <meshStandardMaterial color="#14532d" roughness={0.9} />
      </mesh>
      {/* South Rough (Front) */}
      <mesh position={[courseSpan / 2 - 1, -0.22, 3.2]} receiveShadow>
        <boxGeometry args={[courseSpan + 8, 0.26, 1.4]} />
        <meshStandardMaterial color="#14532d" roughness={0.9} />
      </mesh>

      {/* 3. SCULPTED ISLAND FOUNDATION: Beveled rock strata cross-section */}
      {/* Topsoil & Loam layer */}
      <mesh position={[courseSpan / 2 - 1, -0.55, 0]} receiveShadow>
        <boxGeometry args={[courseSpan + 6.8, 0.5, 6.8]} />
        <meshStandardMaterial color="#573418" roughness={0.92} />
      </mesh>
      {/* Sedimentary Bedrock layer */}
      <mesh position={[courseSpan / 2 - 1, -1.35, 0]} receiveShadow>
        <boxGeometry args={[courseSpan + 6.2, 1.1, 6.2]} />
        <meshStandardMaterial color="#44403c" roughness={0.88} />
      </mesh>
      {/* Deep Sub-base layer with tapered cliff styling */}
      <mesh position={[courseSpan / 2 - 1, -2.15, 0]} receiveShadow>
        <boxGeometry args={[courseSpan + 5.2, 0.8, 5.2]} />
        <meshStandardMaterial color="#292524" roughness={0.95} />
      </mesh>

      {/* 4. PUTTING GREEN PLATFORM (elevated, sculpted surface with collar) */}
      <group position={[hx, hy, 0]}>
        {/* Main bentgrass putting green platform */}
        <mesh position={[0, -0.12, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.55, 1.75, 0.28, 32]} />
          <meshStandardMaterial color="#16a34a" roughness={0.52} metalness={0.05} />
        </mesh>
        {/* Fine putting green collar / fringe */}
        <mesh position={[0, 0.025, 0]} receiveShadow>
          <cylinderGeometry args={[1.32, 1.35, 0.04, 32]} />
          <meshStandardMaterial color="#4ade80" roughness={0.48} />
        </mesh>
        {/* White target approach circle */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.34, 0.38, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* 5. TEE BOX: Tee deck, tournament markers, wooden tee peg */}
      <group position={[level.tee[0], level.tee[1], 0]}>
        {/* Manicured Tee Deck */}
        <mesh position={[0, -0.06, 0]} receiveShadow>
          <cylinderGeometry args={[0.85, 0.95, 0.12, 24]} />
          <meshStandardMaterial color="#86efac" roughness={0.55} />
        </mesh>

        {/* Real Wooden Golf Tee Peg supporting the ball */}
        <mesh position={[0, 0.08, 0.15]} castShadow>
          <cylinderGeometry args={[0.035, 0.015, 0.22, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.65} />
        </mesh>
        {/* Tee peg cup rim */}
        <mesh position={[0, 0.18, 0.15]}>
          <cylinderGeometry args={[0.065, 0.035, 0.03, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.65} />
        </mesh>

        {/* Tournament Tee Markers (Glossy Red & Blue) */}
        <mesh position={[-0.3, 0.1, 0.65]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ef4444" metalness={0.3} roughness={0.25} />
        </mesh>
        <mesh position={[-0.3, 0.1, -0.65]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.25} />
        </mesh>
      </group>

      {/* 6. LANDSCAPING: Natural 3D Trees and Foliage */}
      <group ref={foliageRef}>
        {sceneryObjects.trees.map((t, idx) => (
          <group key={`tree-${idx}`} position={[t.x, 0, t.z]} scale={t.scale}>
            {/* Trunk */}
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.14, 0.22, 1.4, 10]} />
              <meshStandardMaterial color="#78350f" roughness={0.88} />
            </mesh>
            {t.type === 'pine' ? (
              // Multi-layered realistic Pine tree
              <group position={[0, 1.4, 0]}>
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                  <coneGeometry args={[0.85, 1.2, 10]} />
                  <meshStandardMaterial color="#14532d" roughness={0.75} />
                </mesh>
                <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
                  <coneGeometry args={[0.68, 1.0, 10]} />
                  <meshStandardMaterial color="#166534" roughness={0.72} />
                </mesh>
                <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
                  <coneGeometry args={[0.48, 0.85, 10]} />
                  <meshStandardMaterial color="#15803d" roughness={0.7} />
                </mesh>
              </group>
            ) : (
              // Lush Oak tree canopy
              <group position={[0, 1.6, 0]}>
                <mesh position={[0, 0, 0]} castShadow receiveShadow>
                  <sphereGeometry args={[0.9, 14, 14]} />
                  <meshStandardMaterial color="#15803d" roughness={0.78} />
                </mesh>
                <mesh position={[0.3, 0.35, 0.2]} castShadow receiveShadow>
                  <sphereGeometry args={[0.65, 12, 12]} />
                  <meshStandardMaterial color="#16a34a" roughness={0.74} />
                </mesh>
                <mesh position={[-0.3, 0.25, -0.2]} castShadow receiveShadow>
                  <sphereGeometry args={[0.6, 12, 12]} />
                  <meshStandardMaterial color="#22c55e" roughness={0.74} />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>

      {/* 7. NATURAL BOULDERS along the perimeter */}
      {sceneryObjects.rocks.map((r, idx) => (
        <mesh
          key={`rock-${idx}`}
          position={[r.x, 0.05, r.z]}
          rotation={[0.2, r.rot, 0.15]}
          scale={r.scale}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#78716c" roughness={0.85} metalness={0.1} />
        </mesh>
      ))}

      {/* 8. 150-YARD DISTANCE FAIRWAY MARKER POLE */}
      {courseSpan > 8 && (
        <group position={[Math.floor(courseSpan * 0.5), 0, 2.5]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.18, 12]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
};
