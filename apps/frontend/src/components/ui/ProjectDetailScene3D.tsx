'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function OrbitingShape({
  geometry,
  color,
  radius,
  speed,
  size,
  offset,
}: {
  geometry: 'torus' | 'sphere' | 'octahedron' | 'tetrahedron' | 'dodecahedron';
  color: string;
  radius: number;
  speed: number;
  size: number;
  offset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.y = Math.sin(t * 0.7) * radius * 0.5;
    meshRef.current.position.z = Math.sin(t) * radius * 0.3;
    meshRef.current.rotation.x = t * 0.5;
    meshRef.current.rotation.y = t * 0.3;
  });

  const getGeometry = () => {
    switch (geometry) {
      case 'torus':
        return <torusGeometry args={[size, size * 0.35, 16, 32]} />;
      case 'sphere':
        return <sphereGeometry args={[size, 16, 16]} />;
      case 'octahedron':
        return <octahedronGeometry args={[size]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[size]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[size]} />;
    }
  };

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        {getGeometry()}
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.2}
          transmission={0.6}
          thickness={0.5}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#00f5d4" />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#7b2ff7" />

      <Environment preset="night" />

      <OrbitingShape geometry="torus" color="#00f5d4" radius={1.2} speed={0.4} size={0.3} offset={0} />
      <OrbitingShape geometry="octahedron" color="#4361ee" radius={1} speed={0.6} size={0.25} offset={Math.PI * 0.5} />
      <OrbitingShape geometry="sphere" color="#7b2ff7" radius={0.8} speed={0.8} size={0.2} offset={Math.PI} />
      <OrbitingShape geometry="dodecahedron" color="#f72585" radius={1.1} speed={0.5} size={0.22} offset={Math.PI * 1.5} />
      <OrbitingShape geometry="tetrahedron" color="#00f5d4" radius={0.9} speed={0.7} size={0.18} offset={Math.PI * 0.75} />
    </>
  );
}

export function ProjectDetailScene3D() {
  return (
    <div className="w-[200px] h-[200px] pointer-events-none mx-auto">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
