import React, { useRef, ReactElement } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Blur } from "react-blur";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Dynamic light/refraction effect
  const lightX = useTransform(mouseX, [0, 1], ["0%", "100%"]);
  const lightY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Check if Interactive3DModel is a direct child
  const is3DModel = (child: React.ReactNode) => {
    if (!React.isValidElement(child)) return false;
    const type = (child as ReactElement).type;
    return typeof type === "function" && (type as any).name === "Interactive3DModel";
  };

  // Separate children for special handling
  let has3DModel = false;
  React.Children.forEach(children, (child) => {
    if (is3DModel(child)) has3DModel = true;
  });

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl p-6 shadow-xl ${className}`}
      style={{
        background: has3DModel
          ? "rgba(255,255,255,0.10)" // slightly less opaque for 3D
          : "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.18)",
        backdropFilter: has3DModel ? "blur(4px)" : "blur(8px)",
        WebkitBackdropFilter: has3DModel ? "blur(4px)" : "blur(8px)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      initial={{ scale: 0.98, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
      whileHover={{ scale: 1.01, boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Dynamic reflection/refractive light */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        style={{
          background: has3DModel
            ? `radial-gradient(circle at ${lightX.get()} ${lightY.get()}, rgba(255,255,255,0.10) 0%, transparent 80%)`
            : `radial-gradient(circle at ${lightX.get()} ${lightY.get()}, rgba(255,255,255,0.25) 0%, transparent 80%)`,
          mixBlendMode: has3DModel ? "lighten" : "screen",
          opacity: has3DModel ? 0.7 : 1,
        }}
        aria-hidden
      />
      {/* Blur effect overlay (subtle for 3D) */}
      {has3DModel ? (
        <Blur img="" blurRadius={3} enableStyles={false} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.3, mixBlendMode: "lighten" }} />
      ) : (
        <Blur img="" blurRadius={8} enableStyles={false} className="absolute inset-0 pointer-events-none" />
      )}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default LiquidGlassCard;
