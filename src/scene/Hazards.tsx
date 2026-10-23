import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Obstacle } from '../data/levels';

interface HazardsProps {
  obstacles: Obstacle[];
  highlightedIndex: number | null;
  reducedMotion: boolean;
  colorBlindMode: boolean;
}

export const Hazards: React.FC<HazardsProps> = ({
  obstacles,
  highlightedIndex,
  reducedMotion,
  colorBlindMode
}) => {
  const waterRefs = useRef<Array<THREE.Mesh | null>>([]);
  const treeRefs = useRef<Array<THREE.Group | null>>([]);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();
    waterRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.y += Math.sin(t * 2.5 + i) * 0.0015;
      }
    });
    treeRefs.current.forEach((grp, i) => {
      if (grp) {
        grp.rotation.z = Math.sin(t * 1.5 + i) * 0.035;
      }
    });
  });

  const hitColor = colorBlindMode ? '#f97316' : '#f43f5e';

  return (
    <group>
      {obstacles.map((obs, idx) => {
        const isHit = highlightedIndex === idx;

        if (obs.shape === 'rect') {
          const cx = obs.x + obs.w / 2;
          const cy = obs.y + obs.h / 2;

          if (obs.type === 'water') {
            return (
              <group key={idx} position={[cx, cy, 0]}>
                {/* Main translucent sparkling water body */}
                <mesh
                  ref={(el) => {
                    waterRefs.current[idx] = el;
                  }}
                  receiveShadow
                >
                  <boxGeometry args={[obs.w, obs.h, 5.5]} />
                  <meshPhysicalMaterial
                    color={isHit ? hitColor : '#0284c7'}
                    roughness={0.06}
                    metalness={0.15}
                    transmission={0.65}
                    ior={1.33}
                    transparent
                    opacity={0.88}
                  />
                </mesh>
                {/* Shoreline edge frame */}
                <mesh position={[0, -obs.h / 2 - 0.04, 0]} receiveShadow>
                  <boxGeometry args={[obs.w + 0.18, 0.1, 5.65]} />
                  <meshStandardMaterial color="#44403c" roughness={0.9} />
                </mesh>
                {/* Animated surface ripple rings */}
                <mesh position={[0, obs.h / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[Math.min(obs.w, 1.4) * 0.25, Math.min(obs.w, 1.4) * 0.35, 28]} />
                  <meshBasicMaterial color="#e0f2fe" side={THREE.DoubleSide} transparent opacity={0.65} />
                </mesh>
              </group>
            );
          }

          if (obs.type === 'sand') {
            return (
              <group key={idx} position={[cx, cy, 0]}>
                {/* Main bunker sand bed */}
                <mesh receiveShadow>
                  <boxGeometry args={[obs.w, obs.h, 5.2]} />
                  <meshStandardMaterial
                    color={isHit ? hitColor : '#fde047'}
                    roughness={0.96}
                    metalness={0.02}
                  />
                </mesh>
                {/* Soft bunker grassy rim lip */}
                <mesh position={[0, obs.h / 2, 0]} scale={[obs.w * 0.52, 0.14, 2.6]}>
                  <sphereGeometry args={[1, 20, 14]} />
                  <meshStandardMaterial color={isHit ? hitColor : '#eab308'} roughness={0.92} />
                </mesh>
              </group>
            );
          }

          // Brick/Stone wall with realistic masonry
          return (
            <group key={idx} position={[cx, cy, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[obs.w, obs.h, 4.8]} />
                <meshStandardMaterial
                  color={isHit ? hitColor : '#9a3412'}
                  roughness={0.85}
                  metalness={0.1}
                />
              </mesh>
              {/* Granite coping stone cap on top */}
              <mesh position={[0, obs.h / 2 + 0.08, 0]} castShadow receiveShadow>
                <boxGeometry args={[obs.w + 0.16, 0.16, 4.95]} />
                <meshStandardMaterial color={isHit ? hitColor : '#cbd5e1'} roughness={0.65} />
              </mesh>
            </group>
          );
        }

        // Circular obstacle (Tree canopy with trunk)
        return (
          <group
            key={idx}
            ref={(el) => {
              treeRefs.current[idx] = el;
            }}
            position={[obs.cx, obs.cy, 0]}
          >
            {/* Trunk extending down toward ground */}
            <mesh position={[0, -obs.r - 0.6, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.38, obs.r + 1.4, 12]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            {/* Dense 3D spherical foliage */}
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[obs.r, 24, 24]} />
              <meshStandardMaterial
                color={isHit ? hitColor : '#166534'}
                roughness={0.75}
              />
            </mesh>
            <mesh position={[obs.r * 0.35, obs.r * 0.25, 0.25]} castShadow>
              <sphereGeometry args={[obs.r * 0.65, 18, 18]} />
              <meshStandardMaterial
                color={isHit ? hitColor : '#22c55e'}
                roughness={0.7}
              />
            </mesh>
            <mesh position={[-obs.r * 0.3, obs.r * 0.15, -0.25]} castShadow>
              <sphereGeometry args={[obs.r * 0.55, 16, 16]} />
              <meshStandardMaterial
                color={isHit ? hitColor : '#15803d'}
                roughness={0.72}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
