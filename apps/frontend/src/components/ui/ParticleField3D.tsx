'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleSystem({ count = 600 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const colorA = new THREE.Color('#00f5d4');
    const colorB = new THREE.Color('#7b2ff7');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;

      const t = Math.random();
      const color = new THREE.Color().lerpColors(colorA, colorB, t);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return { positions: pos, velocities: vel, colors: cols };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      posArray[ix] += velocities[ix];
      posArray[iy] += velocities[iy];
      posArray[iz] += velocities[iz];

      if (posArray[ix] > 8 || posArray[ix] < -8) velocities[ix] *= -1;
      if (posArray[iy] > 6 || posArray[iy] < -6) velocities[iy] *= -1;
      if (posArray[iz] > 3 || posArray[iz] < -3) velocities[iz] *= -1;

      const dx = pointer.x * 5 - posArray[ix];
      const dy = pointer.y * 4 - posArray[iy];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2) {
        posArray[ix] -= dx * 0.001;
        posArray[iy] -= dy * 0.001;
      }
    }
    posAttr.needsUpdate = true;

    pointsRef.current.rotation.y += 0.0003;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ count }: { count?: number }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <ParticleSystem count={count} />
    </>
  );
}

export function ParticleField3D({ count = 600 }: { count?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.5 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene count={count} />
      </Canvas>
    </div>
  );
}
