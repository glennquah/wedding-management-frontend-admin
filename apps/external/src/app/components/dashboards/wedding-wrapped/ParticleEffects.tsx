'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Type definitions for particle userData
interface ParticleUserData {
  positions: number[];
  velocities: number[];
  time?: number;
  scales?: number[];
  phases?: number[];
}

// Confetti Particles for Guest Experience
export function ConfettiParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 200;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const velocities: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        Math.random() * 15 + 5,
        (Math.random() - 0.5) * 20,
      );
      velocities.push(
        (Math.random() - 0.5) * 0.02,
        -Math.random() * 0.05 - 0.02,
        (Math.random() - 0.5) * 0.02,
      );
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.8, 0.6);
      colors.push(color.r, color.g, color.b);
    }

    meshRef.current.userData = { positions, velocities } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(
        i,
        new THREE.Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]),
      );
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, velocities } = userData;
    if (!positions || !velocities) return;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (positions[i * 3 + 1] < -5) {
        positions[i * 3 + 1] = 15;
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.x += 0.02;
      dummy.rotation.y += 0.02;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.2, 0.2, 0.02]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}

// Floating Hearts for Gifts & Support
export function FloatingHearts() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 100;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const velocities: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 15,
        Math.random() * 20 - 5,
        (Math.random() - 0.5) * 15,
      );
      velocities.push(Math.sin(i) * 0.01, Math.random() * 0.02 + 0.01, Math.cos(i) * 0.01);
    }

    meshRef.current.userData = { positions, velocities, time: 0 } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.set(0.3, 0.3, 0.3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, velocities, time } = userData;
    if (!positions || !velocities) return;

    const currentTime = (time || 0) + 0.01;
    userData.time = currentTime;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] + Math.sin(currentTime + i) * 0.01;
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(currentTime + i) * 0.01;

      if (positions[i * 3 + 1] > 15) {
        positions[i * 3 + 1] = -5;
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      }

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.y = currentTime + i;
      dummy.scale.set(
        0.3 + Math.sin(currentTime + i) * 0.1,
        0.3 + Math.sin(currentTime + i) * 0.1,
        0.3,
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#ff69b4" emissive="#ff1493" emissiveIntensity={0.5} />
    </instancedMesh>
  );
}

// Sparkling Stars for Planning Journey
export function SparklingStars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 150;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const scales: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
      );
      scales.push(Math.random() * 0.3 + 0.1);
    }

    meshRef.current.userData = { positions, velocities: [], scales, time: 0 } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(scales[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, scales, time } = userData;
    if (!positions || !scales) return;

    const currentTime = (time || 0) + 0.02;
    userData.time = currentTime;

    for (let i = 0; i < count; i++) {
      const scale = scales[i] * (1 + Math.sin(currentTime * 2 + i) * 0.5);
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(scale);
      dummy.rotation.z = currentTime + i;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.8} />
    </instancedMesh>
  );
}

// Camera Flashes for Memories & Moments
export function CameraFlashes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 80;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const phases: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      );
      phases.push(Math.random() * Math.PI * 2);
    }

    meshRef.current.userData = { positions, velocities: [], phases, time: 0 } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(0.3);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, phases, time } = userData;
    if (!positions || !phases) return;

    const currentTime = (time || 0) + 0.05;
    userData.time = currentTime;

    for (let i = 0; i < count; i++) {
      const flash = Math.max(
        0,
        Math.sin(currentTime + phases[i]) * Math.sin(currentTime * 2 + phases[i]),
      );
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(0.3 + flash * 0.5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
    </instancedMesh>
  );
}
