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

// Confetti Particles for Guest Experience - HUGE and IMPRESSIVE
export function ConfettiParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 500; // Increased from 200
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const velocities: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 60, // MUCH wider spread
        Math.random() * 40 + 20, // Start higher
        (Math.random() - 0.5) * 60,
      );
      velocities.push(
        (Math.random() - 0.5) * 0.08, // Faster horizontal movement
        -Math.random() * 0.15 - 0.08, // Faster falling
        (Math.random() - 0.5) * 0.08,
      );
      const color = new THREE.Color();
      // Vibrant Spotify Wrapped-style colors
      const hue = Math.random();
      color.setHSL(hue, 1.0, 0.65);
      colors.push(color.r, color.g, color.b);
    }

    meshRef.current.userData = { positions, velocities } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.setScalar(0.5 + Math.random() * 1.5); // Varied sizes
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

      // Reset when out of view
      if (positions[i * 3 + 1] < -20) {
        positions[i * 3 + 1] = 40;
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      }

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.x += 0.05; // Faster spinning
      dummy.rotation.y += 0.05;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.6, 0.6, 0.05]} />
      <meshStandardMaterial metalness={0.8} roughness={0.2} />
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

// Camera Flashes for Memories & Moments - BIGGER and BRIGHTER
export function CameraFlashes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 150; // Increased
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const phases: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 50, // Much wider spread
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
      );
      phases.push(Math.random() * Math.PI * 2);
    }

    meshRef.current.userData = { positions, velocities: [], phases, time: 0 } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.scale.setScalar(0.8);
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
      dummy.scale.setScalar(0.8 + flash * 1.5); // Bigger flash effect
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.6, 12, 12]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
    </instancedMesh>
  );
}

// FIREWORKS ANIMATION - Spotify Wrapped Style!
interface FireworkParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

interface FireworkUserData {
  fireworks: FireworkParticle[][];
  nextLaunch: number;
}

export function FireworksParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const particleSystemsRef = useRef<THREE.Points[]>([]);
  const fireworksDataRef = useRef<FireworkUserData>({
    fireworks: [],
    nextLaunch: 0,
  });

  useEffect(() => {
    return () => {
      particleSystemsRef.current.forEach((system) => {
        system.geometry.dispose();
        (system.material as THREE.Material).dispose();
      });
    };
  }, []);

  const launchFirework = () => {
    const particleCount = 80;
    const particles: FireworkParticle[] = [];

    // Launch position
    const launchX = (Math.random() - 0.5) * 40;
    const launchZ = (Math.random() - 0.5) * 40;
    const explosionHeight = 10 + Math.random() * 15;

    // Create explosion particles
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.3 + Math.random() * 0.4;

      particles.push({
        position: new THREE.Vector3(launchX, explosionHeight, launchZ),
        velocity: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed,
        ),
        life: 1.0,
        maxLife: 1.0,
      });
    }

    fireworksDataRef.current.fireworks.push(particles);

    // Create Points for this firework
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Random vibrant color for this firework
    const baseColor = new THREE.Color();
    baseColor.setHSL(Math.random(), 1.0, 0.6);

    for (let i = 0; i < particleCount; i++) {
      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    if (groupRef.current) {
      groupRef.current.add(points);
      particleSystemsRef.current.push(points);
    }
  };

  useFrame(() => {
    const data = fireworksDataRef.current;

    // Launch new fireworks periodically
    data.nextLaunch--;
    if (data.nextLaunch <= 0) {
      launchFirework();
      data.nextLaunch = 20 + Math.random() * 30; // Random interval
    }

    // Update all fireworks
    for (let i = data.fireworks.length - 1; i >= 0; i--) {
      const firework = data.fireworks[i];
      const system = particleSystemsRef.current[i];
      if (!system) continue;

      const positions = system.geometry.attributes.position.array as Float32Array;
      let allDead = true;

      for (let j = 0; j < firework.length; j++) {
        const particle = firework[j];

        if (particle.life > 0) {
          // Update physics
          particle.velocity.y -= 0.015; // Gravity
          particle.position.add(particle.velocity);
          particle.life -= 0.015;

          // Update position in geometry
          positions[j * 3] = particle.position.x;
          positions[j * 3 + 1] = particle.position.y;
          positions[j * 3 + 2] = particle.position.z;

          allDead = false;
        }
      }

      system.geometry.attributes.position.needsUpdate = true;
      (system.material as THREE.PointsMaterial).opacity = Math.max(0, firework[0]?.life || 0);

      // Remove dead fireworks
      if (allDead) {
        if (groupRef.current) {
          groupRef.current.remove(system);
        }
        system.geometry.dispose();
        (system.material as THREE.Material).dispose();
        data.fireworks.splice(i, 1);
        particleSystemsRef.current.splice(i, 1);
      }
    }
  });

  return <group ref={groupRef} />;
}

// FLOWER PETALS - Romantic and Beautiful
export function FlowerPetals() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 300;
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (!meshRef.current) return;

    const positions: number[] = [];
    const velocities: number[] = [];
    const phases: number[] = [];

    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 50,
        Math.random() * 50 + 20,
        (Math.random() - 0.5) * 50,
      );
      velocities.push(
        (Math.random() - 0.5) * 0.03,
        -Math.random() * 0.04 - 0.02,
        (Math.random() - 0.5) * 0.03,
      );
      phases.push(Math.random() * Math.PI * 2);
    }

    meshRef.current.userData = { positions, velocities, phases, time: 0 } as ParticleUserData;

    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(0.4 + Math.random() * 0.3, 0.4 + Math.random() * 0.3, 0.1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Pink to white gradient for petals
      const petalColor = new THREE.Color();
      petalColor.setHSL(0.95 + Math.random() * 0.05, 0.6 + Math.random() * 0.4, 0.85 + Math.random() * 0.1);
      meshRef.current.setColorAt(i, petalColor);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const userData = meshRef.current.userData as ParticleUserData;
    const { positions, velocities, phases, time } = userData;
    if (!positions || !velocities || !phases) return;

    const currentTime = (time || 0) + 0.01;
    userData.time = currentTime;

    for (let i = 0; i < count; i++) {
      // Gentle swaying motion
      positions[i * 3] += velocities[i * 3] + Math.sin(currentTime + phases[i]) * 0.02;
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(currentTime + phases[i]) * 0.02;

      // Reset when out of view
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 50;
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      }

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      // Gentle spinning and rocking motion
      dummy.rotation.x = currentTime * 0.2 + phases[i];
      dummy.rotation.y = currentTime * 0.3 + phases[i];
      dummy.rotation.z = Math.sin(currentTime + phases[i]) * 0.3;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.8, 0.8]} />
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        metalness={0.3}
        roughness={0.7}
      />
    </instancedMesh>
  );
}
