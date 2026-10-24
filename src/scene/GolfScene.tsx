import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows } from '@react-three/drei';
import { useGameStore } from '../game/store';
import { samplePiecewiseCurve, sampleSingleCurve } from '../game/mathEngine';
import { evaluateCurveCollision } from '../game/collision';
import { Course } from './Course';
import { Flag } from './Flag';
import { Ball } from './Ball';
import { Hazards } from './Hazards';
import { CurveTube } from './CurveTube';
import { GraphOverlay } from './GraphOverlay';
import { CameraRig } from './CameraRig';
import { Splash } from './effects/Splash';
import { SandPuff } from './effects/SandPuff';
import { CameraToolbar } from '../ui/CameraToolbar';
import { sfx } from '../audio/sfx';

export const GolfScene: React.FC = () => {
  const {
    currentLevel,
    ballOrigin,
    inputMode,
    typedEquation,
    domain,
    pieces,
    hintStep,
    devShowSolution,
    isSwinging,
    isReplaying,
    lastImpact,
    showGrid,
    colorBlindMode,
    reducedMotion,
    completeSwing
  } = useGameStore();

  // Live sample the player's current curve for instant ghost preview
  const sampled = useMemo(() => {
    if (inputMode === 'piecewise') {
      return samplePiecewiseCurve(pieces, 0.02);
    }
    return sampleSingleCurve(typedEquation, domain, ballOrigin, 0.02);
  }, [inputMode, pieces, typedEquation, domain, ballOrigin]);

  // Evaluate collision on the live preview so obstacles glow red before swinging
  const collision = useMemo(() => {
    return evaluateCurveCollision(
      sampled.points,
      currentLevel.obstacles,
      currentLevel.hole,
      currentLevel.tolerance
    );
  }, [sampled.points, currentLevel.obstacles, currentLevel.hole, currentLevel.tolerance]);

  // Optional ghost solution curve when Hint Step 3 or Dev/Teacher Show Solution is active
  const solutionPoints = useMemo(() => {
    if (hintStep < 3 && !devShowSolution) return undefined;
    const sol = currentLevel.solution;
    const res =
      sol.pieces && sol.pieces.length > 0
        ? samplePiecewiseCurve(sol.pieces, 0.02)
        : sampleSingleCurve(sol.equation, sol.domain, currentLevel.tee, 0.02);
    return res.points;
  }, [hintStep, devShowSolution, currentLevel]);

  const handleSwingFinish = () => {
    const pts = collision.flightPoints;
    const lastPt: [number, number] =
      pts.length > 0
        ? [pts[pts.length - 1].x, pts[pts.length - 1].y]
        : [ballOrigin[0], ballOrigin[1]];

    if (collision.inHole) {
      sfx.playCupRattleAndCheer();
    } else if (collision.hitObstacle) {
      if (collision.obstacleType === 'water') {
        sfx.playSplash();
      } else {
        sfx.playSandThud();
      }
    } else {
      sfx.playSandThud();
    }

    completeSwing({
      inHole: collision.inHole,
      hitObstacle: collision.hitObstacle,
      obstacleType: collision.obstacleType,
      endPoint: lastPt,
      caddieTip: collision.caddieTip
    });
  };

  return (
    <div className="relative w-full h-full">
      {/* Floating Camera Toolbar below top bar on top-right of 3D viewport */}
      <div className="absolute top-14 right-3 z-30 pointer-events-auto">
        <CameraToolbar />
      </div>

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [4, 4.5, 14], fov: 40, near: 0.1, far: 2000 }}
      >
        <color attach="background" args={['#38bdf8']} />

        {/* Realistic Atmospheric Sky */}
        <Sky
          distance={1000}
          sunPosition={[24, 38, 20]}
          inclination={0.55}
          azimuth={0.22}
          turbidity={4}
          rayleigh={1.2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        {/* Ambient & Hemisphere Lighting */}
        <ambientLight intensity={0.45} />
        <hemisphereLight args={['#dbeafe', '#14532d', 0.65]} />

        {/* High Resolution Directional Sunlight with Soft PCF Shadows */}
        <directionalLight
          position={[14, 25, 18]}
          intensity={1.75}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0003}
        />

        {/* Soft Contact Ground Shadows */}
        <ContactShadows
          position={[currentLevel.hole[0] * 0.5, -0.25, 0]}
          opacity={0.4}
          scale={35}
          blur={1.8}
          far={4}
        />

        <CameraRig
          tee={ballOrigin}
          hole={currentLevel.hole}
          isSwinging={isSwinging}
          flightPoints={collision.flightPoints}
          reducedMotion={reducedMotion}
        />

        <Course level={currentLevel} />
        <GraphOverlay
          visible={showGrid}
          maxX={currentLevel.hole[0]}
          origin={ballOrigin}
        />

        <Hazards
          obstacles={currentLevel.obstacles}
          highlightedIndex={collision.obstacleIndex}
          reducedMotion={reducedMotion}
          colorBlindMode={colorBlindMode}
        />

        <Flag position={currentLevel.hole} reducedMotion={reducedMotion} />

        <CurveTube
          points={collision.flightPoints}
          hitObstacle={collision.hitObstacle}
          inHole={collision.inHole}
          solutionPoints={solutionPoints}
          colorBlindMode={colorBlindMode}
        />

        <Ball
          origin={ballOrigin}
          flightPoints={collision.flightPoints}
          isSwinging={isSwinging}
          isReplaying={isReplaying}
          reducedMotion={reducedMotion}
          onSwingFinish={handleSwingFinish}
        />

        <Splash
          point={lastImpact.point}
          active={lastImpact.type === 'water'}
        />
        <SandPuff
          point={lastImpact.point}
          active={lastImpact.type === 'sand' || lastImpact.type === 'wall' || lastImpact.type === 'tree'}
        />
      </Canvas>
    </div>
  );
};
