"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Mesh, Color, Object3D } from "three";
import * as THREE from "three";
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing';

interface Interactive3DModelProps {
  className?: string;
  style?: React.CSSProperties;
}

// Stylized "D" shape using torus and box primitives, now with compass needle and markers
const StylizedDCompass: React.FC = React.memo(() => {
  const group = useRef<THREE.Group>(null);
  // Animate rotation and glow
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.003;
      group.current.rotation.x = Math.sin(state.clock.getElapsedTime() / 2) * 0.08;
    }
  });

  // Memoize geometry/materials
  const torusGeometry = useMemo(() => new Mesh().geometry = new THREE.TorusGeometry(0.7, 0.22, 32, 100, Math.PI * 1.5), []);
  const torusAccentGeometry = useMemo(() => new Mesh().geometry = new THREE.TorusGeometry(0.7, 0.03, 16, 80), []);
  const boxGeometry = useMemo(() => new Mesh().geometry = new THREE.BoxGeometry(0.18, 0.7, 0.22), []);
  const coneGeometry = useMemo(() => new Mesh().geometry = new THREE.ConeGeometry(0.07, 0.7, 32), []);
  const sphereGeometry = useMemo(() => new Mesh().geometry = new THREE.SphereGeometry(0.035, 16, 16), []);
  const sphereGeometryN = useMemo(() => new Mesh().geometry = new THREE.SphereGeometry(0.045, 16, 16), []);

  const dMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new Color("#7f5af0"),
    roughness: 0.18,
    metalness: 0.7,
    transmission: 0.7,
    thickness: 0.4,
    clearcoat: 0.6,
    ior: 1.3,
    emissive: new Color("#00ffe7"),
    emissiveIntensity: 0.12,
    transparent: true,
    opacity: 0.95,
  }), []);
  const accentMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#00ffe7", transparent: true, opacity: 0.18 }), []);
  const needleMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new Color("#00ffe7"),
    roughness: 0.1,
    metalness: 0.8,
    transmission: 0.8,
    thickness: 0.5,
    clearcoat: 0.8,
    ior: 1.4,
    emissive: new Color("#7f5af0"),
    emissiveIntensity: 0.18,
    transparent: true,
    opacity: 0.92,
  }), []);
  const markerMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#fff", emissive: "#00ffe7", emissiveIntensity: 0.5, transparent: true, opacity: 0.5 }), []);
  const markerMaterialN = useMemo(() => new THREE.MeshStandardMaterial({ color: "#fff", emissive: "#00ffe7", emissiveIntensity: 0.7, transparent: true, opacity: 0.7 }), []);

  // Instanced mesh for E, S, W markers
  const markerPositions = useMemo(() => [
    [0.95, 0, 0],
    [0, -0.95, 0],
    [-0.95, 0, 0],
  ] as [number, number, number][], []);

  // Ref for instanced mesh
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  React.useEffect(() => {
    if (instancedRef.current) {
      markerPositions.forEach((pos, i) => {
        const obj = new Object3D();
        obj.position.set(pos[0], pos[1], pos[2]);
        obj.updateMatrix();
        instancedRef.current!.setMatrixAt(i, obj.matrix);
      });
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [markerPositions]);

  return (
    <group ref={group}>
      {/* Main D body: thick torus */}
      <mesh castShadow receiveShadow position={[0, 0, 0]} geometry={torusGeometry} material={dMaterial} />
      {/* D stem: box */}
      <mesh castShadow receiveShadow position={[0.35, -0.25, 0]} rotation={[0, 0, 0.08]} geometry={boxGeometry} material={dMaterial} />
      {/* Subtle glowing ring accent */}
      <mesh position={[0, 0, -0.13]} geometry={torusAccentGeometry} material={accentMaterial} />
      {/* Compass needle: thin, long cone */}
      <mesh position={[0, 0, 0.23]} rotation={[-Math.PI / 2, 0, 0]} geometry={coneGeometry} material={needleMaterial} />
      {/* Cardinal direction marker N (bigger) */}
      <mesh position={[0, 0.95, 0]} geometry={sphereGeometryN} material={markerMaterialN} />
      {/* Instanced mesh for E, S, W markers */}
      <instancedMesh ref={instancedRef} args={[sphereGeometry, markerMaterial, 3]} />
    </group>
  );
});
StylizedDCompass.displayName = "StylizedDCompass";

const Interactive3DModel: React.FC<Interactive3DModelProps> = ({ className = "", style = {} }) => {
  return (
    <div className={className} style={{ width: "100%", height: 320, ...style }} aria-label="InnerCompass AI 3D Logo">
      <Suspense fallback={<div style={{height:320,display:'flex',alignItems:'center',justifyContent:'center',color:'#7f5af0'}}>Loading 3D...</div>}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [2, 2, 3.5], fov: 50 }}>
          <color attach="background" args={["#181c2f"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 6, 4]} intensity={1.1} castShadow color="#b7bfff" />
          <pointLight position={[-2, 2, 2]} intensity={0.6} color="#00ffe7" />
          {/* Slightly move the model back for glass overlay effect */}
          <group position={[0, 0, -0.18]}>
            <StylizedDCompass />
          </group>
          <EffectComposer>
            <Bloom luminanceThreshold={0.18} luminanceSmoothing={0.25} intensity={0.7} />
            <DepthOfField focusDistance={0.015} focalLength={0.25} bokehScale={2.2} height={320} />
            <ChromaticAberration offset={[0.001, 0.0015]} />
          </EffectComposer>
          <OrbitControls enablePan={false} enableZoom={true} minDistance={1.2} maxDistance={3.5} />
          <Html position={[0, -1.2, 0]} center style={{ color: '#fff', fontWeight: 600, fontSize: 16, textShadow: '0 2px 8px #0008' }}>InnerCompass AI</Html>
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Interactive3DModel;
