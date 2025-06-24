import React, { useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({ children, className = "", ...props }) => {
  const controls = useAnimation();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    controls.start({
      boxShadow: "0 0 0 2px var(--glass-teal), 0 8px 32px 0 hsla(240, 40%, 30%, 0.18)",
      background: "var(--glass-teal)",
      transition: { duration: 0.3 },
    });
  }, [controls]);
  const handleMouseLeave = useCallback(() => {
    controls.start({
      boxShadow: "var(--glass-shadow)",
      background: "var(--glass-indigo)",
      transition: { duration: 0.3 },
    });
  }, [controls]);

  // Remove drag-related and animation-related props to avoid type conflict with framer-motion
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    onDrag, onDragStart, onDragEnd, onDragOver, onDragEnter, onDragLeave, onDrop,
    onAnimationStart, onAnimationEnd, onTransitionEnd,
    ...restProps
  } = props;

  return (
    <motion.button
      ref={btnRef}
      className={`glass-bg-indigo glass-blur-md glass-shadow glass-radius px-5 py-2 font-semibold text-white relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-glass-teal transition-all duration-300 ${className}`}
      style={{ border: "1.5px solid var(--glass-teal)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      animate={controls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...restProps}
    >
      {children}
      {/* Ripple/Glow effect on hover */}
      <motion.span
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.18, background: "var(--glass-teal)" }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default LiquidGlassButton;
