'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MeshData {
  mesh: THREE.Points;
  verticesDown: number;
  verticesUp: number;
  direction: number;
  speed: number;
  delay: number;
  start: number;
}

// Dynamic Particles for ARE YOU READY slide - based on Three.js webgl_points_dynamic
export function DynamicWaveParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const meshDataRef = useRef<MeshData[]>([]);
  const clockRef = useRef(0);

  // Create sphere geometry for particles
  const particlePositions = useMemo(() => {
    const geometry = new THREE.SphereGeometry(200, 32, 32);
    const positions = geometry.attributes.position;
    return positions;
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    meshDataRef.current = [];

    // Create multiple particle systems with different colors and positions
    const configs = [
      { x: 0, y: 0, z: 0, color: 0xff69b4 }, // Pink
      { x: -400, y: 0, z: 200, color: 0xff1493 }, // Deep pink
      { x: 400, y: 0, z: -200, color: 0xda70d6 }, // Orchid
      { x: 0, y: 200, z: 400, color: 0xba55d3 }, // Medium orchid
      { x: 200, y: -100, z: -300, color: 0x9370db }, // Medium purple
    ];

    configs.forEach((config, index) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', particlePositions.clone());
      geometry.setAttribute('initialPosition', particlePositions.clone());

      const posAttr = geometry.attributes.position;
      if (posAttr instanceof THREE.BufferAttribute) {
        posAttr.setUsage(THREE.DynamicDrawUsage);
      }

      const material = new THREE.PointsMaterial({
        size: 15,
        color: config.color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      const mesh = new THREE.Points(geometry, material);
      mesh.position.set(config.x, config.y, config.z);
      mesh.scale.set(2, 2, 2);

      groupRef.current!.add(mesh);

      meshDataRef.current.push({
        mesh,
        verticesDown: 0,
        verticesUp: 0,
        direction: 0,
        speed: 15,
        delay: Math.floor(200 + 200 * Math.random()),
        start: Math.floor(100 + 200 * Math.random() * index),
      });
    });

    return () => {
      meshDataRef.current.forEach((data) => {
        data.mesh.geometry.dispose();
        (data.mesh.material as THREE.Material).dispose();
      });
    };
  }, [particlePositions]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    clockRef.current += delta;
    const scaledDelta = Math.min(delta * 10, 2);

    // Rotate the entire group
    groupRef.current.rotation.y += -0.02 * scaledDelta;

    // Animate each particle system
    meshDataRef.current.forEach((data) => {
      const positions = data.mesh.geometry.attributes.position;
      const initialPositions = data.mesh.geometry.attributes.initialPosition;
      const count = positions.count;

      if (data.start > 0) {
        data.start -= 1;
      } else {
        if (data.direction === 0) {
          data.direction = -1;
        }
      }

      for (let i = 0; i < count; i++) {
        const px = positions.getX(i);
        const py = positions.getY(i);
        const pz = positions.getZ(i);

        // Falling down
        if (data.direction < 0) {
          if (py > -200) {
            positions.setXYZ(
              i,
              px + 1.5 * (0.5 - Math.random()) * data.speed * scaledDelta,
              py + 3.0 * (0.25 - Math.random()) * data.speed * scaledDelta,
              pz + 1.5 * (0.5 - Math.random()) * data.speed * scaledDelta,
            );
          } else {
            data.verticesDown += 1;
          }
        }

        // Rising up
        if (data.direction > 0) {
          const ix = initialPositions.getX(i);
          const iy = initialPositions.getY(i);
          const iz = initialPositions.getZ(i);

          const dx = Math.abs(px - ix);
          const dy = Math.abs(py - iy);
          const dz = Math.abs(pz - iz);

          const d = dx + dy + dz;

          if (d > 1) {
            positions.setXYZ(
              i,
              px - ((px - ix) / (dx || 1)) * data.speed * scaledDelta * (0.85 - Math.random()),
              py - ((py - iy) / (dy || 1)) * data.speed * scaledDelta * (1 + Math.random()),
              pz - ((pz - iz) / (dz || 1)) * data.speed * scaledDelta * (0.85 - Math.random()),
            );
          } else {
            data.verticesUp += 1;
          }
        }
      }

      // All vertices down
      if (data.verticesDown >= count) {
        if (data.delay <= 0) {
          data.direction = 1;
          data.speed = 5;
          data.verticesDown = 0;
          data.delay = 320;
        } else {
          data.delay -= 1;
        }
      }

      // All vertices up
      if (data.verticesUp >= count) {
        if (data.delay <= 0) {
          data.direction = -1;
          data.speed = 15;
          data.verticesUp = 0;
          data.delay = 120;
        } else {
          data.delay -= 1;
        }
      }

      positions.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Additional ambient particles for background effect */}
      <points position={[0, -300, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[3000, 3000, 32, 32]} />
        <pointsMaterial color={0xff69b4} size={5} transparent opacity={0.3} />
      </points>
    </group>
  );
}
