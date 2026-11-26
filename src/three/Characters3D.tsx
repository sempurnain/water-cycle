import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createTeardropGeometry(scale = 1): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * 1.45 * scale;
    let r = 0;
    if (t < 0.45) {
      const u = t / 0.45;
      r = Math.sin(u * Math.PI * 0.5) * 0.62 * scale;
    } else {
      const u = (t - 0.45) / 0.55;
      r = Math.cos(u * Math.PI * 0.5) * 0.62 * scale * (1 - u * 0.35);
    }
    points.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  const geo = new THREE.LatheGeometry(points, 28);
  geo.computeVertexNormals();
  return geo;
}

function createSmileGeometry(width = 0.22, depth = 0.08): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-width, 0.04, 0),
    new THREE.Vector3(-width * 0.45, -depth, 0.03),
    new THREE.Vector3(0, -depth * 1.15, 0.04),
    new THREE.Vector3(width * 0.45, -depth, 0.03),
    new THREE.Vector3(width, 0.04, 0),
  ]);
  return new THREE.TubeGeometry(curve, 16, 0.024, 8, false);
}

interface CharacterProps {
  position?: [number, number, number];
  scale?: number;
  isSoftwareGl?: boolean;
  onClick?: () => void;
}

export function AquaCharacter({
  position = [0, 0, 0],
  scale = 1,
  isSoftwareGl = false,
  onClick,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const dropGeo = useMemo(() => createTeardropGeometry(1), []);
  const innerGeo = useMemo(() => createTeardropGeometry(0.68), []);
  const smileGeo = useMemo(() => createSmileGeometry(0.16, 0.06), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2.4) * 0.14;
      const squash = 1 + Math.sin(t * 2.4) * 0.035;
      groupRef.current.scale.set(scale / Math.sqrt(squash), scale * squash, scale / Math.sqrt(squash));
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.22;
    }
    if (ringRef.current) {
      const pulse = 0.92 + Math.sin(t * 2.4) * 0.1;
      ringRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* 1. Primary translucent water drop silhouette */}
      <mesh geometry={dropGeo} castShadow={!isSoftwareGl} receiveShadow={!isSoftwareGl}>
        <meshPhysicalMaterial
          color="#38A8E8"
          roughness={0.08}
          metalness={0.02}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          transparent
          opacity={isSoftwareGl ? 0.88 : 0.8}
          ior={1.33}
        />
      </mesh>

      {/* 2. Inner luminous water core */}
      <mesh geometry={innerGeo} position={[0, 0.12, 0]}>
        <meshStandardMaterial
          color="#70C8E8"
          emissive="#1677B8"
          emissiveIntensity={0.25}
          roughness={0.25}
          transparent
          opacity={0.78}
        />
      </mesh>

      {/* 3-4. Left and right eye sclera */}
      <mesh position={[-0.18, 0.56, 0.48]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <mesh position={[0.18, 0.56, 0.48]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>

      {/* 5-6. Pupils */}
      <mesh position={[-0.18, 0.56, 0.555]}>
        <sphereGeometry args={[0.056, 14, 14]} />
        <meshStandardMaterial color="#24394D" roughness={0.15} />
      </mesh>
      <mesh position={[0.18, 0.56, 0.555]}>
        <sphereGeometry args={[0.056, 14, 14]} />
        <meshStandardMaterial color="#24394D" roughness={0.15} />
      </mesh>

      {/* 7-8. Eye specular catchlights */}
      <mesh position={[-0.155, 0.59, 0.6]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.205, 0.59, 0.6]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* 9-10. Rosy cheeks */}
      <mesh position={[-0.31, 0.42, 0.42]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#F79489" roughness={0.8} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.31, 0.42, 0.42]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#F79489" roughness={0.8} transparent opacity={0.75} />
      </mesh>

      {/* 11. Cheerful smile */}
      <mesh geometry={smileGeo} position={[0, 0.39, 0.52]}>
        <meshStandardMaterial color="#24394D" roughness={0.4} />
      </mesh>

      {/* 12. Ground ripple halo */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.55, 0.72, 28]} />
        <meshBasicMaterial color="#70C8E8" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function RainyCharacter({
  position = [0, 0, 0],
  scale = 1,
  onClick,
}: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dropGeo = useMemo(() => createTeardropGeometry(0.75), []);
  const smileGeo = useMemo(() => createSmileGeometry(0.12, 0.04), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2.8 + 1.4) * 0.12;
      groupRef.current.rotation.z = Math.sin(t * 1.9) * 0.08;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <mesh geometry={dropGeo}>
        <meshPhysicalMaterial
          color="#1D8AD8"
          roughness={0.12}
          clearcoat={0.9}
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh position={[-0.12, 0.42, 0.37]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <mesh position={[0.12, 0.42, 0.37]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <mesh position={[-0.12, 0.42, 0.415]}>
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshStandardMaterial color="#24394D" />
      </mesh>
      <mesh position={[0.12, 0.42, 0.415]}>
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshStandardMaterial color="#24394D" />
      </mesh>
      <mesh geometry={smileGeo} position={[0, 0.28, 0.39]}>
        <meshStandardMaterial color="#24394D" />
      </mesh>
    </group>
  );
}

export function SunnyCharacter({
  position = [0, 0, 0],
  scale = 1,
  onClick,
}: CharacterProps) {
  const raysRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const smileGeo = useMemo(() => createSmileGeometry(0.18, 0.06), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (raysRef.current) {
      raysRef.current.rotation.z = t * 0.45;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.8) * 0.06;
      haloRef.current.scale.set(s, s, s);
    }
  });

  const rayAngles = useMemo(
    () => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2),
    [],
  );

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Soft luminous solar corona */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.08, 20, 20]} />
        <meshBasicMaterial color="#FFE58F" transparent opacity={0.22} depthWrite={false} />
      </mesh>

      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshStandardMaterial
          color="#F4C85A"
          emissive="#F4A825"
          emissiveIntensity={0.5}
          roughness={0.32}
        />
      </mesh>
      {/* Rotating ray cones */}
      <group ref={raysRef}>
        {rayAngles.map((angle, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(angle) * 0.96, Math.sin(angle) * 0.96, 0]}
            rotation={[0, 0, angle - Math.PI / 2]}
          >
            <coneGeometry args={[0.16, 0.42, 10]} />
            <meshStandardMaterial
              color="#F9D976"
              emissive="#F4C85A"
              emissiveIntensity={0.35}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
      {/* Eyes */}
      <mesh position={[-0.2, 0.14, 0.66]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#24394D" roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 0.14, 0.66]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#24394D" roughness={0.3} />
      </mesh>
      {/* Smile */}
      <mesh geometry={smileGeo} position={[0, -0.04, 0.66]}>
        <meshStandardMaterial color="#24394D" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function CloudyCharacter({
  position = [0, 0, 0],
  scale = 1,
  rainHeavy = false,
  onClick,
}: CharacterProps & { rainHeavy?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const smileGeo = useMemo(() => createSmileGeometry(0.16, 0.05), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.4 + 1) * 0.1;
    }
  });

  const puffColor = rainHeavy ? '#CBD9E6' : '#F4F7FA';

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.62, 20, 20]} />
        <meshStandardMaterial color={puffColor} roughness={0.92} />
      </mesh>
      <mesh position={[-0.55, 0.0, 0.02]}>
        <sphereGeometry args={[0.48, 18, 18]} />
        <meshStandardMaterial color={puffColor} roughness={0.92} />
      </mesh>
      <mesh position={[0.55, 0.02, 0.02]}>
        <sphereGeometry args={[0.48, 18, 18]} />
        <meshStandardMaterial color={puffColor} roughness={0.92} />
      </mesh>
      <mesh position={[-0.25, -0.15, 0.08]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color={rainHeavy ? '#B6C9DC' : '#E7F0F7'} roughness={0.94} />
      </mesh>
      <mesh position={[0.25, -0.15, 0.08]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color={rainHeavy ? '#B6C9DC' : '#E7F0F7'} roughness={0.94} />
      </mesh>
      {/* Eyes + smile */}
      <mesh position={[-0.17, 0.08, 0.56]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#24394D" roughness={0.3} />
      </mesh>
      <mesh position={[0.17, 0.08, 0.56]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#24394D" roughness={0.3} />
      </mesh>
      <mesh geometry={smileGeo} position={[0, -0.07, 0.54]}>
        <meshStandardMaterial color="#24394D" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function FloraCharacter({
  position = [0, 0, 0],
  scale = 1,
  onClick,
}: CharacterProps) {
  const stemGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.25, 0),
      new THREE.Vector3(0.05, 0.7, 0.04),
      new THREE.Vector3(0, 1.15, 0),
    ]);
    return new THREE.TubeGeometry(curve, 14, 0.065, 8, false);
  }, []);

  const leafGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.28, 0.16, 0.45, 0);
    shape.quadraticCurveTo(0.28, -0.16, 0, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01 });
  }, []);

  return (
    <group
      position={position}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Mound base */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.38, 0.48, 0.3, 16]} />
        <meshStandardMaterial color="#8A5E3B" roughness={0.88} />
      </mesh>
      {/* Stem */}
      <mesh geometry={stemGeo}>
        <meshStandardMaterial color="#589A50" roughness={0.7} />
      </mesh>
      {/* Leaves */}
      <mesh geometry={leafGeo} position={[0.03, 0.55, 0]} rotation={[0.2, 0.2, 0.45]}>
        <meshStandardMaterial color="#83BC7A" roughness={0.6} />
      </mesh>
      <mesh geometry={leafGeo} position={[-0.03, 0.65, 0]} rotation={[0.2, Math.PI - 0.2, 0.45]}>
        <meshStandardMaterial color="#6DAA64" roughness={0.6} />
      </mesh>
      {/* Blossom face */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.28, 18, 18]} />
        <meshStandardMaterial color="#83BC7A" roughness={0.55} />
      </mesh>
      <mesh position={[-0.09, 1.28, 0.24]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial color="#24394D" />
      </mesh>
      <mesh position={[0.09, 1.28, 0.24]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial color="#24394D" />
      </mesh>
    </group>
  );
}
