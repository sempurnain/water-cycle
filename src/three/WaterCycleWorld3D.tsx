import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { RegionId, WaterCycleStage } from '../types';
import { EXPLORE_REGIONS, HERO_ARTWORK_URL } from '../data/waterCycleData';
import {
  applyStudioEnvironment,
  createOceanColorTexture,
  createTerrainColorTexture,
  detectSoftwareGl,
  isWebGLAvailable,
} from './webglUtils';
import {
  AquaCharacter,
  CloudyCharacter,
  FloraCharacter,
  RainyCharacter,
  SunnyCharacter,
} from './Characters3D';

const _dummy = new THREE.Object3D();
const _vec3 = new THREE.Vector3();
const _color = new THREE.Color();

export interface WaterCycleWorld3DProps {
  mode: 'hero' | 'explore' | 'simulator';
  activeStage?: WaterCycleStage | 'all';
  selectedRegion?: RegionId | null;
  onSelectRegion?: (regionId: RegionId) => void;
  onTriggerInteraction?: (stage: WaterCycleStage) => void;
  showLabels?: boolean;
  sunIntensity?: number;
  coolingLevel?: number;
  isPlaying?: boolean;
  exploredRegions?: RegionId[];
  className?: string;
}

class CanvasErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function StudioSetup({ isSoftwareGl }: { isSoftwareGl: boolean }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.06;
    const disposeEnv = applyStudioEnvironment(gl, scene);
    scene.fog = new THREE.FogExp2('#BCE4FA', 0.014);
    return () => {
      disposeEnv();
    };
  }, [gl, scene, isSoftwareGl]);

  return null;
}

function CameraRig({
  mode,
  selectedRegion,
  activeStage,
}: {
  mode: 'hero' | 'explore' | 'simulator';
  selectedRegion?: RegionId | null;
  activeStage?: WaterCycleStage | 'all';
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const transitioningRef = useRef(false);
  const targetPosRef = useRef(new THREE.Vector3(0.4, 5.4, 13.4));
  const targetLookRef = useRef(new THREE.Vector3(-0.2, 1.5, 0));

  useEffect(() => {
    if (mode === 'hero') {
      if (activeStage === 'evaporasi') {
        targetPosRef.current.set(-6.2, 4.4, 10.6);
        targetLookRef.current.set(-4.2, 1.2, 1.8);
      } else if (activeStage === 'kondensasi') {
        targetPosRef.current.set(-1.2, 6.2, 11.4);
        targetLookRef.current.set(0.0, 4.4, -0.5);
      } else if (activeStage === 'presipitasi') {
        targetPosRef.current.set(5.8, 5.6, 10.6);
        targetLookRef.current.set(3.4, 2.8, -1.8);
      } else if (activeStage === 'pengumpulan') {
        targetPosRef.current.set(1.8, 4.8, 11.2);
        targetLookRef.current.set(0.2, 1.0, 1.4);
      } else {
        targetPosRef.current.set(0.4, 5.4, 13.4);
        targetLookRef.current.set(-0.2, 1.5, 0);
      }
      transitioningRef.current = true;
      return;
    }
    if (mode === 'explore' && selectedRegion) {
      const region = EXPLORE_REGIONS.find((r) => r.id === selectedRegion);
      if (region) {
        targetPosRef.current.set(...region.cameraPosition);
        targetLookRef.current.set(...region.cameraTarget);
        transitioningRef.current = true;
      }
      return;
    }
    if (mode === 'simulator') {
      if (activeStage === 'evaporasi') {
        targetPosRef.current.set(-7.5, 4.4, 9.2);
        targetLookRef.current.set(-4.8, 1.3, 1.8);
      } else if (activeStage === 'kondensasi') {
        targetPosRef.current.set(-1.5, 7.0, 10.5);
        targetLookRef.current.set(0.2, 5.2, -0.5);
      } else if (activeStage === 'presipitasi') {
        targetPosRef.current.set(7.2, 6.2, 8.8);
        targetLookRef.current.set(4.0, 3.0, -2.2);
      } else if (activeStage === 'pengumpulan') {
        targetPosRef.current.set(2.5, 4.8, 9.8);
        targetLookRef.current.set(0.5, 0.8, 1.6);
      } else if (activeStage === 'transpirasi') {
        targetPosRef.current.set(7.4, 3.8, 8.0);
        targetLookRef.current.set(4.6, 1.3, 2.0);
      } else {
        targetPosRef.current.set(0, 7.2, 15.2);
        targetLookRef.current.set(0, 1.8, 0);
      }
      transitioningRef.current = true;
    }
  }, [mode, selectedRegion, activeStage]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (transitioningRef.current) {
      const dt = Math.min(delta, 0.1);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPosRef.current.x, 4.2, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPosRef.current.y, 4.2, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPosRef.current.z, 4.2, dt);

      controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookRef.current.x, 4.2, dt);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookRef.current.y, 4.2, dt);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookRef.current.z, 4.2, dt);

      if (
        camera.position.distanceTo(targetPosRef.current) < 0.08 &&
        controls.target.distanceTo(targetLookRef.current) < 0.08
      ) {
        transitioningRef.current = false;
      }
    }
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.07}
      maxPolarAngle={Math.PI / 2.12}
      minPolarAngle={Math.PI / 8}
      minDistance={5.5}
      maxDistance={22}
      enablePan={mode !== 'hero'}
      autoRotate={mode === 'hero'}
      autoRotateSpeed={0.32}
      onStart={() => {
        transitioningRef.current = false;
      }}
    />
  );
}

function DriftingBackdropClouds({ isPlaying = true }: { isPlaying?: boolean }) {
  const cloudGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!cloudGroupRef.current || !isPlaying) return;
    const t = state.clock.getElapsedTime();
    cloudGroupRef.current.children.forEach((child, idx) => {
      const baseX = idx === 0 ? -9.5 : idx === 1 ? 8.8 : 0.8;
      child.position.x = baseX + Math.sin(t * 0.16 + idx * 2.1) * 1.1;
    });
  });

  return (
    <group ref={cloudGroupRef}>
      {[
        { pos: [-9.5, 6.8, -6.5] as [number, number, number], s: 0.9 },
        { pos: [8.8, 7.1, -6.2] as [number, number, number], s: 1.05 },
        { pos: [0.8, 7.6, -8.0] as [number, number, number], s: 0.85 },
      ].map((c, idx) => (
        <group key={idx} position={c.pos} scale={c.s}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.75, 14, 14]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.95} />
          </mesh>
          <mesh position={[-0.65, -0.1, 0.05]}>
            <sphereGeometry args={[0.56, 12, 12]} />
            <meshStandardMaterial color="#F4F7FA" roughness={0.95} />
          </mesh>
          <mesh position={[0.68, -0.08, 0.05]}>
            <sphereGeometry args={[0.58, 12, 12]} />
            <meshStandardMaterial color="#F4F7FA" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TerrainAndWater({
  isSoftwareGl,
  onTriggerInteraction,
  onSelectRegion,
}: {
  isSoftwareGl: boolean;
  onTriggerInteraction?: (stage: WaterCycleStage) => void;
  onSelectRegion?: (regionId: RegionId) => void;
}) {
  const { gl } = useThree();
  const oceanRef = useRef<THREE.Mesh>(null);
  const foamRingRef = useRef<THREE.Mesh>(null);
  const islandFoamRef = useRef<THREE.Mesh>(null);
  const maxAniso = useMemo(() => gl.capabilities.getMaxAnisotropy(), [gl]);
  const oceanTex = useMemo(() => createOceanColorTexture(maxAniso), [maxAniso]);
  const terrainTex = useMemo(() => createTerrainColorTexture(maxAniso), [maxAniso]);

  const riverGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.9, 2.35, -2.0),
      new THREE.Vector3(3.3, 1.55, -1.2),
      new THREE.Vector3(2.4, 1.08, -0.3),
      new THREE.Vector3(0.8, 0.65, 0.9),
      new THREE.Vector3(-0.7, 0.35, 1.7),
      new THREE.Vector3(-3.0, 0.14, 2.3),
    ]);
    return new THREE.TubeGeometry(curve, 36, 0.36, 8, false);
  }, []);

  const waterfallGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(4.0, 2.95, -2.25),
      new THREE.Vector3(3.55, 2.25, -1.75),
      new THREE.Vector3(3.1, 1.45, -1.25),
    ]);
    return new THREE.TubeGeometry(curve, 18, 0.28, 8, false);
  }, []);

  const canopiesRef = useRef<THREE.InstancedMesh>(null);
  const trunksRef = useRef<THREE.InstancedMesh>(null);
  const treePositions = useMemo(
    () => [
      [3.8, 0.85, 1.6],
      [4.5, 0.88, 2.5],
      [5.3, 0.9, 1.8],
      [4.1, 0.85, 3.1],
      [5.7, 0.84, 2.9],
      [6.1, 0.9, 1.4],
      [3.3, 0.92, 2.8],
      [4.9, 0.88, 0.8],
      [2.6, 1.05, -1.5],
      [5.8, 1.15, -1.4],
      [6.3, 0.95, -0.2],
      [3.1, 1.02, 0.2],
      [5.2, 0.85, 3.7],
      [3.7, 0.82, 3.6],
      [6.4, 0.88, 2.3],
      [4.6, 1.1, -0.4],
      [2.3, 0.9, 2.3],
      [5.5, 1.2, -2.5],
      [2.9, 1.15, -2.8],
      [6.8, 0.85, 0.8],
      [4.0, 0.9, -0.8],
      [-4.9, 0.32, 2.7],
      [-5.5, 0.34, 1.9],
    ],
    [],
  );

  useEffect(() => {
    const canopyMesh = canopiesRef.current;
    const trunkMesh = trunksRef.current;
    if (!canopyMesh || !trunkMesh) return;

    treePositions.forEach(([x, y, z], idx) => {
      const s = 0.82 + ((idx * 37) % 30) / 100;
      _dummy.position.set(x, y + 0.55 * s, z);
      _dummy.scale.set(s, s * 1.18, s);
      _dummy.rotation.y = idx * 0.7;
      _dummy.updateMatrix();
      canopyMesh.setMatrixAt(idx, _dummy.matrix);
      _color.setHSL(0.3 + (idx % 4) * 0.015, 0.46, 0.46 + (idx % 3) * 0.06);
      canopyMesh.setColorAt(idx, _color);

      _dummy.position.set(x, y + 0.16 * s, z);
      _dummy.scale.set(s * 0.85, s, s * 0.85);
      _dummy.updateMatrix();
      trunkMesh.setMatrixAt(idx, _dummy.matrix);
    });

    canopyMesh.instanceMatrix.needsUpdate = true;
    if (canopyMesh.instanceColor) canopyMesh.instanceColor.needsUpdate = true;
    canopyMesh.computeBoundingSphere();
    trunkMesh.instanceMatrix.needsUpdate = true;
    trunkMesh.computeBoundingSphere();
  }, [treePositions]);

  useFrame((state, delta) => {
    oceanTex.offset.x += delta * 0.038;
    oceanTex.offset.y += delta * 0.016;
    const t = state.clock.getElapsedTime();
    if (foamRingRef.current) {
      const s = 1 + Math.sin(t * 1.8) * 0.025;
      foamRingRef.current.scale.set(s, s, 1);
    }
    if (islandFoamRef.current) {
      const s = 1 + Math.cos(t * 1.9) * 0.03;
      islandFoamRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group>
      {/* Horizon ocean */}
      <mesh
        ref={oceanRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-1.5, 0, 0]}
        receiveShadow={!isSoftwareGl}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerInteraction?.('evaporasi');
          onSelectRegion?.('sunlight-island');
        }}
      >
        <circleGeometry args={[36, 48]} />
        <meshStandardMaterial
          map={oceanTex}
          color="#1D84C6"
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Sunlight Island sandy coastal bay + animated surf ring */}
      <mesh
        position={[-4.5, 0.14, 2.2]}
        receiveShadow={!isSoftwareGl}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerInteraction?.('evaporasi');
          onSelectRegion?.('sunlight-island');
        }}
      >
        <cylinderGeometry args={[2.6, 3.2, 0.32, 24]} />
        <meshStandardMaterial color="#EBD29B" roughness={0.88} />
      </mesh>
      <mesh
        ref={islandFoamRef}
        position={[-4.5, 0.03, 2.2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[3.15, 3.48, 32]} />
        <meshBasicMaterial color="#E6F7FF" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>

      {/* Main lush archipelago landmass + animated shore foam */}
      <mesh
        position={[3.2, 0.42, 0.4]}
        receiveShadow={!isSoftwareGl}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerInteraction?.('pengumpulan');
          onSelectRegion?.('river-valley');
        }}
      >
        <cylinderGeometry args={[6.2, 7.4, 0.9, 32]} />
        <meshStandardMaterial map={terrainTex} color="#7CB673" roughness={0.86} />
      </mesh>
      <mesh
        ref={foamRingRef}
        position={[3.2, 0.03, 0.4]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[7.35, 7.72, 40]} />
        <meshBasicMaterial color="#DFF4FF" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Coastal accent rocks */}
      {[
        [-1.8, 0.25, 3.8, 0.45],
        [-2.4, 0.22, 3.3, 0.3],
        [1.2, 0.92, -3.9, 0.55],
        [6.6, 0.9, -2.8, 0.5],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow={!isSoftwareGl}>
          <dodecahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color="#7C8D9B" roughness={0.9} />
        </mesh>
      ))}

      {/* Rainy Mountain primary peak & secondary terraced peaks */}
      <group
        position={[4.3, 0.85, -2.5]}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerInteraction?.('presipitasi');
          onSelectRegion?.('rainy-mountain');
        }}
      >
        <mesh position={[0, 1.95, 0]} castShadow={!isSoftwareGl} receiveShadow={!isSoftwareGl}>
          <coneGeometry args={[2.65, 3.9, 12]} />
          <meshStandardMaterial color="#5E9C57" roughness={0.85} />
        </mesh>
        <mesh position={[-1.9, 1.25, 0.9]} castShadow={!isSoftwareGl} receiveShadow={!isSoftwareGl}>
          <coneGeometry args={[1.8, 2.5, 10]} />
          <meshStandardMaterial color="#6BA862" roughness={0.86} />
        </mesh>
        <mesh position={[1.7, 1.1, 1.1]} castShadow={!isSoftwareGl} receiveShadow={!isSoftwareGl}>
          <coneGeometry args={[1.6, 2.2, 10]} />
          <meshStandardMaterial color="#578E50" roughness={0.87} />
        </mesh>
        {/* Terraced rice field rings */}
        <mesh position={[-0.7, 0.42, 1.6]} rotation={[0, 0.3, 0]}>
          <cylinderGeometry args={[1.75, 2.05, 0.25, 16]} />
          <meshStandardMaterial color="#8CC57B" roughness={0.78} />
        </mesh>
      </group>

      {/* Cascading Mountain Waterfall */}
      <mesh
        geometry={waterfallGeo}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerInteraction?.('pengumpulan');
          onSelectRegion?.('river-valley');
        }}
      >
        <meshStandardMaterial
          color="#7ED9FF"
          emissive="#1677B8"
          emissiveIntensity={0.22}
          roughness={0.14}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* River Valley water channel & calm inland lake */}
      <mesh
        geometry={riverGeo}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerInteraction?.('pengumpulan');
          onSelectRegion?.('river-valley');
        }}
      >
        <meshStandardMaterial color="#3AA7E4" roughness={0.16} metalness={0.12} />
      </mesh>

      <mesh
        position={[-0.4, 0.9, 1.65]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerInteraction?.('pengumpulan');
          onSelectRegion?.('river-valley');
        }}
      >
        <circleGeometry args={[1.22, 24]} />
        <meshStandardMaterial color="#2D96D8" roughness={0.15} metalness={0.14} />
      </mesh>

      {/* Forest of Life instanced tree trunks + canopies */}
      <instancedMesh
        ref={trunksRef}
        args={[undefined, undefined, treePositions.length]}
      >
        <cylinderGeometry args={[0.07, 0.1, 0.42, 6]} />
        <meshStandardMaterial color="#7E5638" roughness={0.9} />
      </instancedMesh>
      <instancedMesh
        ref={canopiesRef}
        args={[undefined, undefined, treePositions.length]}
        castShadow={!isSoftwareGl}
        receiveShadow={!isSoftwareGl}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerInteraction?.('transpirasi');
          onSelectRegion?.('forest-of-life');
        }}
      >
        <coneGeometry args={[0.42, 1.12, 8]} />
        <meshStandardMaterial roughness={0.78} />
      </instancedMesh>
    </group>
  );
}

function WaterCycleParticles({
  activeStage,
  sunIntensity = 1,
  coolingLevel = 1,
  isPlaying = true,
}: {
  activeStage: WaterCycleStage | 'all';
  sunIntensity: number;
  coolingLevel: number;
  isPlaying: boolean;
}) {
  const vaporCount = 48;
  const rainCount = 68;
  const riverDropCount = 28;
  const leafVaporCount = 24;

  const vaporRef = useRef<THREE.InstancedMesh>(null);
  const rainRef = useRef<THREE.InstancedMesh>(null);
  const riverRef = useRef<THREE.InstancedMesh>(null);
  const leafVaporRef = useRef<THREE.InstancedMesh>(null);

  const riverCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.9, 2.45, -2.0),
        new THREE.Vector3(3.2, 1.6, -1.2),
        new THREE.Vector3(2.4, 1.15, -0.3),
        new THREE.Vector3(0.8, 0.72, 0.9),
        new THREE.Vector3(-0.7, 0.44, 1.7),
        new THREE.Vector3(-3.0, 0.25, 2.3),
      ]),
    [],
  );

  const showVapor = activeStage === 'all' || activeStage === 'evaporasi' || activeStage === 'kondensasi';
  const showRain = activeStage === 'all' || activeStage === 'presipitasi';
  const showRiver = activeStage === 'all' || activeStage === 'pengumpulan';
  const showTranspiration = activeStage === 'all' || activeStage === 'transpirasi';

  useFrame((state) => {
    const t = isPlaying ? state.clock.getElapsedTime() : 1.5;

    if (vaporRef.current) {
      for (let i = 0; i < vaporCount; i++) {
        if (!showVapor) {
          _dummy.scale.set(0, 0, 0);
          _dummy.updateMatrix();
          vaporRef.current.setMatrixAt(i, _dummy.matrix);
          continue;
        }
        const phase = (t * 0.24 * sunIntensity + i / vaporCount) % 1;
        const angle = i * 1.37;
        const x = -5.2 + Math.cos(angle) * (1.8 - phase * 0.8) + phase * 3.8;
        const y = 0.45 + phase * 5.2;
        const z = 2.0 + Math.sin(angle) * 1.4 - phase * 2.1;
        const s = 0.08 + Math.sin(phase * Math.PI) * 0.07;
        _dummy.position.set(x, y, z);
        _dummy.scale.set(s, s, s);
        _dummy.updateMatrix();
        vaporRef.current.setMatrixAt(i, _dummy.matrix);
      }
      vaporRef.current.instanceMatrix.needsUpdate = true;
    }

    if (rainRef.current) {
      for (let i = 0; i < rainCount; i++) {
        if (!showRain) {
          _dummy.scale.set(0, 0, 0);
          _dummy.updateMatrix();
          rainRef.current.setMatrixAt(i, _dummy.matrix);
          continue;
        }
        const phase = (t * 0.95 * coolingLevel + i / rainCount) % 1;
        const ox = ((i * 73) % 100) / 100;
        const oz = ((i * 37) % 100) / 100;
        const x = 2.6 + ox * 3.4;
        const y = 5.4 - phase * 3.6;
        const z = -3.8 + oz * 2.8;
        _dummy.position.set(x, y, z);
        _dummy.scale.set(0.04, 0.22, 0.04);
        _dummy.updateMatrix();
        rainRef.current.setMatrixAt(i, _dummy.matrix);
      }
      rainRef.current.instanceMatrix.needsUpdate = true;
    }

    if (riverRef.current) {
      for (let i = 0; i < riverDropCount; i++) {
        if (!showRiver) {
          _dummy.scale.set(0, 0, 0);
          _dummy.updateMatrix();
          riverRef.current.setMatrixAt(i, _dummy.matrix);
          continue;
        }
        const phase = (t * 0.22 + i / riverDropCount) % 1;
        riverCurve.getPoint(phase, _vec3);
        _dummy.position.copy(_vec3);
        _dummy.scale.set(0.14, 0.1, 0.14);
        _dummy.updateMatrix();
        riverRef.current.setMatrixAt(i, _dummy.matrix);
      }
      riverRef.current.instanceMatrix.needsUpdate = true;
    }

    if (leafVaporRef.current) {
      for (let i = 0; i < leafVaporCount; i++) {
        if (!showTranspiration) {
          _dummy.scale.set(0, 0, 0);
          _dummy.updateMatrix();
          leafVaporRef.current.setMatrixAt(i, _dummy.matrix);
          continue;
        }
        const phase = (t * 0.28 * sunIntensity + i / leafVaporCount) % 1;
        const x = 3.6 + ((i * 41) % 24) / 10;
        const y = 1.6 + phase * 3.4;
        const z = 1.2 + ((i * 59) % 22) / 10;
        const s = 0.06 + Math.sin(phase * Math.PI) * 0.05;
        _dummy.position.set(x, y, z);
        _dummy.scale.set(s, s, s);
        _dummy.updateMatrix();
        leafVaporRef.current.setMatrixAt(i, _dummy.matrix);
      }
      leafVaporRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Rising evaporation thermal currents carrying invisible water vapor */}
      <instancedMesh ref={vaporRef} args={[undefined, undefined, vaporCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#E6F7FF" transparent opacity={0.48} />
      </instancedMesh>

      {/* Falling precipitation raindrops */}
      <instancedMesh ref={rainRef} args={[undefined, undefined, rainCount]} frustumCulled={false}>
        <cylinderGeometry args={[0.7, 1, 1, 6]} />
        <meshBasicMaterial color="#3DA9E8" transparent opacity={0.85} />
      </instancedMesh>

      {/* Flowing river & waterfall collection droplets */}
      <instancedMesh ref={riverRef} args={[undefined, undefined, riverDropCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color="#8BE0FF" emissive="#1677B8" emissiveIntensity={0.25} roughness={0.2} />
      </instancedMesh>

      {/* Forest transpiration motes */}
      <instancedMesh ref={leafVaporRef} args={[undefined, undefined, leafVaporCount]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#D6F4D2" transparent opacity={0.62} />
      </instancedMesh>
    </group>
  );
}

function WorldSceneContent({
  mode,
  activeStage = 'all',
  selectedRegion,
  onSelectRegion,
  onTriggerInteraction,
  showLabels = false,
  sunIntensity = 1,
  coolingLevel = 1,
  isPlaying = true,
  exploredRegions = [],
  isSoftwareGl,
}: WaterCycleWorld3DProps & { isSoftwareGl: boolean }) {
  return (
    <>
      <color attach="background" args={['#BBE4FA']} />
      <StudioSetup isSoftwareGl={isSoftwareGl} />

      {/* Warm Sunlight Key + Cool Sky/Ground Hemisphere Fill */}
      <hemisphereLight args={['#CBEBFB', '#628B58', 0.78]} />
      <directionalLight
        position={[-10, 14, 9]}
        intensity={1.5 * sunIntensity}
        color="#FFF3D6"
        castShadow={!isSoftwareGl}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[10, 6, -8]} intensity={0.48} color="#A6DCFA" />

      <CameraRig mode={mode} selectedRegion={selectedRegion} activeStage={activeStage} />

      <DriftingBackdropClouds isPlaying={isPlaying} />

      <TerrainAndWater
        isSoftwareGl={isSoftwareGl}
        onTriggerInteraction={onTriggerInteraction}
        onSelectRegion={onSelectRegion}
      />

      {/* All 5 Companions positioned in their natural biomes */}
      <AquaCharacter
        position={[-2.9, 0.24, 2.3]}
        scale={0.96}
        isSoftwareGl={isSoftwareGl}
        onClick={() => onSelectRegion?.('river-valley')}
      />
      <SunnyCharacter
        position={[-6.8, 7.2, -1.6]}
        scale={1.08}
        onClick={() => {
          onTriggerInteraction?.('evaporasi');
          onSelectRegion?.('sunlight-island');
        }}
      />
      <CloudyCharacter
        position={[-0.8, 5.8, -0.5]}
        scale={1.22}
        onClick={() => {
          onTriggerInteraction?.('kondensasi');
          onSelectRegion?.('cloud-kingdom');
        }}
      />
      <CloudyCharacter
        position={[4.2, 5.7, -2.5]}
        scale={1.36}
        rainHeavy={activeStage === 'all' || activeStage === 'presipitasi'}
        onClick={() => {
          onTriggerInteraction?.('presipitasi');
          onSelectRegion?.('rainy-mountain');
        }}
      />
      <RainyCharacter
        position={[3.8, 3.9, -1.2]}
        scale={0.85}
        onClick={() => {
          onTriggerInteraction?.('presipitasi');
          onSelectRegion?.('rainy-mountain');
        }}
      />
      <FloraCharacter
        position={[4.8, 0.88, 2.3]}
        scale={0.95}
        onClick={() => {
          onTriggerInteraction?.('transpirasi');
          onSelectRegion?.('forest-of-life');
        }}
      />

      <WaterCycleParticles
        activeStage={activeStage}
        sunIntensity={sunIntensity}
        coolingLevel={coolingLevel}
        isPlaying={isPlaying}
      />

      {/* Interactive Region Markers in Explore mode */}
      {mode === 'explore' &&
        EXPLORE_REGIONS.map((region) => {
          const isSelected = selectedRegion === region.id;
          const isExplored = exploredRegions.includes(region.id);
          return (
            <Html
              key={region.id}
              position={region.markerPosition}
              center
              distanceFactor={12}
              zIndexRange={[10, 0]}
            >
              <button
                type="button"
                onClick={() => onSelectRegion?.(region.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-md transition-transform cursor-pointer border ${
                  isSelected
                    ? 'bg-[#24394D] text-white border-[#F4C85A] scale-110'
                    : isExplored
                      ? 'bg-[#83BC7A] text-white border-white/80 hover:scale-105'
                      : 'bg-white/95 text-[#24394D] border-[#1677B8]/40 hover:scale-105'
                }`}
              >
                {region.name} · {region.topic}
              </button>
            </Html>
          );
        })}

      {/* Scientific Labels in Simulator mode */}
      {mode === 'simulator' && showLabels && (
        <>
          <Html position={[-5.4, 2.2, 2.1]} center distanceFactor={13}>
            <div className="px-3 py-1.5 rounded-lg bg-[#24394D]/92 text-white text-xs font-semibold whitespace-nowrap shadow-md border border-[#F4C85A]/50">
              1. Evaporasi (Air cair → Uap air tak terlihat)
            </div>
          </Html>
          <Html position={[-0.8, 7.1, -0.5]} center distanceFactor={13}>
            <div className="px-3 py-1.5 rounded-lg bg-[#24394D]/92 text-white text-xs font-semibold whitespace-nowrap shadow-md border border-[#70C8E8]/50">
              2. Kondensasi (Uap air → Tetesan air kecil / awan)
            </div>
          </Html>
          <Html position={[4.2, 4.1, -2.5]} center distanceFactor={13}>
            <div className="px-3 py-1.5 rounded-lg bg-[#24394D]/92 text-white text-xs font-semibold whitespace-nowrap shadow-md border border-[#1677B8]/60">
              3. Presipitasi (Hujan jatuh karena gravitasi)
            </div>
          </Html>
          <Html position={[0.4, 1.5, 1.5]} center distanceFactor={13}>
            <div className="px-3 py-1.5 rounded-lg bg-[#24394D]/92 text-white text-xs font-semibold whitespace-nowrap shadow-md border border-[#70C8E8]/50">
              4. Pengumpulan (Sungai, danau, & resapan ke laut)
            </div>
          </Html>
          <Html position={[4.9, 2.5, 2.3]} center distanceFactor={13}>
            <div className="px-3 py-1.5 rounded-lg bg-[#24394D]/92 text-white text-xs font-semibold whitespace-nowrap shadow-md border border-[#83BC7A]/60">
              Transpirasi (Uap air dari daun)
            </div>
          </Html>
        </>
      )}
    </>
  );
}

function Fallback2DScene({
  onSelectRegion,
}: {
  onSelectRegion?: (regionId: RegionId) => void;
}) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#CFEAF8] flex items-center justify-center">
      <img
        src={HERO_ARTWORK_URL}
        alt="Ilustrasi dunia siklus air dengan karakter Aqua"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#24394D]/75 via-transparent to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 justify-center">
        {EXPLORE_REGIONS.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => onSelectRegion?.(region.id)}
            className="px-3.5 py-2 rounded-xl bg-white/95 text-[#24394D] text-xs font-bold shadow hover:bg-[#F4C85A] transition-colors cursor-pointer"
          >
            {region.name} ({region.topic})
          </button>
        ))}
      </div>
    </div>
  );
}

export function WaterCycleWorld3D(props: WaterCycleWorld3DProps) {
  const [contextLost, setContextLost] = useState(false);
  const webglSupported = useMemo(() => isWebGLAvailable(), []);
  const isSoftwareGl = useMemo(() => detectSoftwareGl(), []);

  if (!webglSupported || contextLost) {
    return (
      <div className={props.className || 'w-full h-full'}>
        <Fallback2DScene onSelectRegion={props.onSelectRegion} />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${props.className || ''}`}>
      <CanvasErrorBoundary fallback={<Fallback2DScene onSelectRegion={props.onSelectRegion} />}>
        <Canvas
          dpr={isSoftwareGl ? 1 : [1, 2]}
          shadows={!isSoftwareGl}
          camera={{ position: [0.4, 5.4, 13.4], fov: 46, near: 0.1, far: 120 }}
          gl={{
            antialias: !isSoftwareGl,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setContextLost(true);
            });
            canvas.addEventListener('webglcontextrestored', () => {
              setContextLost(false);
            });
          }}
        >
          <WorldSceneContent {...props} isSoftwareGl={isSoftwareGl} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
