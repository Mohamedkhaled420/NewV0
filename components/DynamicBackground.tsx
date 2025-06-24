import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Configurable: number of nodes, connection distance, color palette
const NODE_COUNT = 32;
const CONNECTION_DIST = 1.2;
const COLORS = ["#00ffe7", "#7f5af0", "#b7bfff", "#181c2f"];

// Generate random positions for nodes in a D-like arc
function generateDNodes(count: number): [number, number, number][] {
  const nodes: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    // Parametric D: arc + stem
    const t = Math.random() * Math.PI * 1.5;
    const isArc = Math.random() > 0.2;
    if (isArc) {
      // Arc of D
      const r = 1 + Math.random() * 0.12;
      nodes.push([
        Math.cos(t) * r,
        Math.sin(t) * r * 1.1 - 0.2,
        (Math.random() - 0.5) * 0.5,
      ]);
    } else {
      // Stem of D
      nodes.push([
        0.7 + (Math.random() - 0.5) * 0.1,
        Math.random() * 1.2 - 0.6,
        (Math.random() - 0.5) * 0.5,
      ]);
    }
  }
  return nodes;
}

const nodes = generateDNodes(NODE_COUNT);

const DynamicBackground: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "", style = {} }) => {
  const group = useRef<THREE.Group>(null);
  // Animate group rotation for subtle movement
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() / 6) * 0.08;
      group.current.rotation.y = Math.cos(state.clock.getElapsedTime() / 8) * 0.08;
    }
  });
  // Memoize connections
  const connections = useMemo(() => {
    const lines: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.sqrt(
          (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
        );
        if (dist < CONNECTION_DIST) lines.push([i, j]);
      }
    }
    return lines;
  }, []);

  return (
    <div className={className} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", ...style }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 2]}>
        <group ref={group}>
          {/* Glowing nodes */}
          {nodes.map((pos, i) => (
            <mesh key={i} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial
                color={COLORS[i % COLORS.length]}
                emissive={COLORS[i % COLORS.length]}
                emissiveIntensity={0.8}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
          {/* Connecting lines */}
          {connections.map(([a, b], i) => {
            const start = nodes[a], end = nodes[b];
            const points = [start, end];
            return (
              <line key={i}>
                <bufferGeometry attach="geometry">
                  <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(points.flat()), 3]}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color="#00ffe7"
                  transparent
                  opacity={0.22}
                  linewidth={1.2}
                />
              </line>
            );
          })}
        </group>
        {/* Soft ambient light */}
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
};

export default DynamicBackground;
