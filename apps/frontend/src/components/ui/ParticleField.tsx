'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdditiveBlending } from 'three';

function Particles() {
  const meshRef = useRef(null!);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const isCyan = Math.random() > 0.3;
      if (isCyan) {
        col[i * 3] = 0;
        col[i * 3 + 1] = 0.96;
        col[i * 3 + 2] = 0.83;
      } else {
        col[i * 3] = 0.48;
        col[i * 3 + 1] = 0.18;
        col[i * 3 + 2] = 0.97;
      }
    }
    return col;
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current as unknown as { rotation: { x: number; y: number } } | null;
    if (!mesh) return;
    mesh.rotation.y = state.clock.getElapsedTime() * 0.02;
    mesh.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={AdditiveBlending}
      />
    </points>
  );
}

export function ParticleField() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
