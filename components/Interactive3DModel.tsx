import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Mesh } from "three";

interface Interactive3DModelProps {
  className?: string;
  style?: React.CSSProperties;
}

const SpinningCube: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const isDragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const rotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useFrame(() => {
    if (meshRef.current && !isDragging.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      rotation.current.x = meshRef.current.rotation.x;
      rotation.current.y = meshRef.current.rotation.y;
    }
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    lastPointer.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !meshRef.current || !lastPointer.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    meshRef.current.rotation.y = rotation.current.y + dx * 0.01;
    meshRef.current.rotation.x = rotation.current.x + dy * 0.01;
  };

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
      onPointerMove={handlePointerMove}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4f8cff" metalness={0.5} roughness={0.2} />
    </mesh>
  );
};

const Interactive3DModel: React.FC<Interactive3DModelProps> = ({ className = "", style = {} }) => {
  return (
    <div className={className} style={{ width: "100%", height: 300, ...style }}>
      <Canvas shadows camera={{ position: [2, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <SpinningCube />
      </Canvas>
    </div>
  );
};

export default Interactive3DModel;
