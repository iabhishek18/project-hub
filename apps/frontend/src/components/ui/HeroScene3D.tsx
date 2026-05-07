'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count = 300 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#00f5d4'),
      new THREE.Color('#4361ee'),
      new THREE.Color('#7b2ff7'),
      new THREE.Color('#f72585'),
    ];
    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    meshRef.current.position.x = pointer.x * 0.3;
    meshRef.current.position.y = pointer.y * 0.3;
  });

  return (
    <points ref={meshRef}>
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
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingIcosahedron({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.15 * speed;
    meshRef.current.position.x = position[0] + pointer.x * 0.4;
    meshRef.current.position.y = position[1] + pointer.y * 0.4;
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.8, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.3}
          wireframe
          distort={0.2}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
    meshRef.current.position.x = position[0] + pointer.x * 0.2;
    meshRef.current.position.y = position[1] + pointer.y * 0.2;
  });

  return (
    <Float speed={2 * speed} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.6, 0]} />
        <MeshWobbleMaterial
          color={color}
          transparent
          opacity={0.25}
          wireframe
          factor={0.3}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function TorusKnot({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    meshRef.current.position.x = position[0] + pointer.x * 0.15;
    meshRef.current.position.y = position[1] + pointer.y * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position}>
        <torusKnotGeometry args={[0.5, 0.15, 80, 12, 2, 3]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.2}
          wireframe
          distort={0.1}
          speed={1}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f5d4" />
      <pointLight position={[-5, -5, 3]} intensity={0.6} color="#7b2ff7" />
      <pointLight position={[0, 3, -5]} intensity={0.4} color="#4361ee" />

      <Particles count={400} />

      <FloatingIcosahedron position={[-3, 1.5, -2]} color="#00f5d4" speed={0.8} />
      <FloatingIcosahedron position={[3.5, -1, -3]} color="#4361ee" speed={1.2} />
      <FloatingOctahedron position={[-2.5, -2, -1]} color="#7b2ff7" speed={0.9} />
      <FloatingOctahedron position={[2, 2.5, -2.5]} color="#f72585" speed={1.1} />
      <TorusKnot position={[0, -0.5, -4]} color="#00f5d4" />
      <TorusKnot position={[-4, 0, -3]} color="#4361ee" />
    </>
  );
}

export function HeroScene3D() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" style={{ opacity: 0.7 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
