'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

function RotatingGeo() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 1.2;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.8;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshBasicMaterial color="#050507" transparent opacity={0.4} />
      <Edges
        threshold={15}
        color="#00f5d4"
        scale={1.01}
      />
    </mesh>
  );
}

function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime) * 0.2;
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[1.6, 0.02, 16, 64]} />
      <meshBasicMaterial color="#00f5d4" transparent opacity={0.6} />
    </mesh>
  );
}

export function SplashScene3D() {
  return (
    <div className="w-[120px] h-[120px]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={1} color="#00f5d4" />
        <RotatingGeo />
        <GlowRing />
      </Canvas>
    </div>
  );
}
