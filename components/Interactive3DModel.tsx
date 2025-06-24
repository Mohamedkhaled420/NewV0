import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import { Mesh, Color } from "three";

interface Interactive3DModelProps {
  className?: string;
  style?: React.CSSProperties;
}

// Stylized "D" shape using torus and box primitives, now with compass needle and markers
const StylizedDCompass: React.FC = () => {
  const group = useRef<any>(null);
  // Animate rotation and glow
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.003;
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() / 2) * 0.08;
    }
  });
  return (
    <group ref={group}>
      {/* Main D body: thick torus */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <torusGeometry args={[0.7, 0.22, 32, 100, Math.PI * 1.5]} />
        <meshPhysicalMaterial
          color={new Color("#7f5af0")}
          roughness={0.18}
          metalness={0.7}
          transmission={0.7}
          thickness={0.4}
          clearcoat={0.6}
          ior={1.3}
          emissive={new Color("#00ffe7")}
          emissiveIntensity={0.12}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* D stem: box */}
      <mesh castShadow receiveShadow position={[0.35, -0.25, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.18, 0.7, 0.22]} />
        <meshPhysicalMaterial
          color={new Color("#7f5af0")}
          roughness={0.18}
          metalness={0.7}
          transmission={0.7}
          thickness={0.4}
          clearcoat={0.6}
          ior={1.3}
          emissive={new Color("#00ffe7")}
          emissiveIntensity={0.12}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Subtle glowing ring accent */}
      <mesh position={[0, 0, -0.13]}>
        <torusGeometry args={[0.7, 0.03, 16, 80]} />
        <meshBasicMaterial color="#00ffe7" transparent opacity={0.18} />
      </mesh>
      {/* Compass needle: thin, long cone */}
      <mesh position={[0, 0, 0.23]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.7, 32]} />
        <meshPhysicalMaterial
          color={new Color("#00ffe7")}
          roughness={0.1}
          metalness={0.8}
          transmission={0.8}
          thickness={0.5}
          clearcoat={0.8}
          ior={1.4}
          emissive={new Color("#7f5af0")}
          emissiveIntensity={0.18}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Cardinal direction markers (N, E, S, W) as small glowing spheres */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#00ffe7" emissiveIntensity={0.7} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.95, 0, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#00ffe7" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#00ffe7" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.95, 0, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#00ffe7" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

const Interactive3DModel: React.FC<Interactive3DModelProps> = ({ className = "", style = {} }) => {
  const [zoom, setZoom] = useState(1.5);
  return (
    <div className={className} style={{ width: "100%", height: 320, ...style }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [2, 2, 3], fov: 50, zoom }}>
        <color attach="background" args={["#181c2f"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 6, 4]} intensity={1.2} castShadow color="#b7bfff" />
        <pointLight position={[-2, 2, 2]} intensity={0.7} color="#00ffe7" />
        <StylizedDCompass />
        <OrbitControls enablePan={false} enableZoom={true} minDistance={1.2} maxDistance={3.5} />
        <Html position={[0, -1.2, 0]} center style={{ color: '#fff', fontWeight: 600, fontSize: 16, textShadow: '0 2px 8px #0008' }}>InnerCompass AI</Html>
      </Canvas>
    </div>
  );
};

export default Interactive3DModel;
