import React, { useRef, ReactElement } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Blur } from "react-blur";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  blurIntensity?: "sm" | "md" | "lg";
  variant?: "primary" | "accent" | "silver" | "purple" | "indigo";
  borderColor?: string;
  hoverGlow?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = "",
  blurIntensity = "md",
  variant = "primary",
  borderColor,
  hoverGlow = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  // Parallax for background
  const parallaxX = useSpring(useTransform(mouseX, [0, 1], [12, -12]), { stiffness: 80, damping: 20 });
  const parallaxY = useSpring(useTransform(mouseY, [0, 1], [12, -12]), { stiffness: 80, damping: 20 });

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
    return typeof type === "function" && (type as { name?: string }).name === "Interactive3DModel";
  };

  let has3DModel = false;
  React.Children.forEach(children, (child) => {
    if (is3DModel(child)) has3DModel = true;
  });

  // Variant color mapping
  const variantBg: Record<string, string> = {
    primary: "var(--glass-indigo)",
    accent: "var(--glass-teal)",
    silver: "var(--glass-silver)",
    purple: "var(--glass-purple)",
    indigo: "var(--glass-indigo)",
  };
  const bgColor = variantBg[variant] || variantBg.primary;
  const border = borderColor || (variant === "accent" ? "var(--glass-teal)" : "var(--glass-silver)");
  const blurMap = { sm: 4, md: 8, lg: 16 };
  const blur = blurMap[blurIntensity] || 8;

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden glass-radius ${className}`}
      style={{
        background: bgColor,
        border: `1.5px solid ${border}`,
        boxShadow: "var(--glass-shadow)",
        borderRadius: "var(--glass-radius)",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        transition: "background 0.4s, box-shadow 0.4s, border 0.4s, backdrop-filter 0.4s",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0.5);
        mouseY.set(0.5);
      }}
      initial={{ scale: 0.98, boxShadow: "var(--glass-shadow)", borderColor: border }}
      whileHover={{
        scale: 1.01,
        boxShadow: hoverGlow ? "0 0 0 2px var(--glass-teal), var(--glass-shadow)" : "var(--glass-shadow)",
        borderColor: hoverGlow ? "var(--glass-teal)" : border,
        background: `linear-gradient(120deg, ${bgColor} 80%, var(--glass-silver) 100%)`,
        backdropFilter: `blur(${blur + 4}px)`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Parallax/Refraction effect */}
      <motion.div
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        style={{
          background: `radial-gradient(circle at ${lightX.get()} ${lightY.get()}, rgba(255,255,255,0.18) 0%, transparent 80%)`,
          mixBlendMode: "screen",
          opacity: 0.7,
          transform: `translate3d(${parallaxX.get()}px, ${parallaxY.get()}px, 0)`,
          transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
        }}
        aria-hidden
      />
      {/* Subtle inner glow/border on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        initial={{ boxShadow: "0 0 0 0 var(--glass-teal)" }}
        whileHover={hoverGlow ? { boxShadow: "0 0 16px 2px var(--glass-teal) inset" } : {}}
        transition={{ duration: 0.4 }}
        aria-hidden
      />
      {/* Blur overlay for extra glassiness (subtle for 3D) */}
      {has3DModel ? (
        <Blur img="" blurRadius={blur / 2} enableStyles={false} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.2, mixBlendMode: "lighten" }} />
      ) : (
        <Blur img="" blurRadius={blur} enableStyles={false} className="absolute inset-0 pointer-events-none" />
      )}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full"
        style={{ color: "rgba(20,20,30,0.92)", textShadow: "0 1px 2px rgba(255,255,255,0.08)" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default LiquidGlassCard;
