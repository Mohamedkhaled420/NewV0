import React, { useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface LiquidGlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const LiquidGlassInput: React.FC<LiquidGlassInputProps> = ({ className = "", ...props }) => {
  const controls = useAnimation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Remove event handlers and animation props that are incompatible with Framer Motion's motion.input
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...filteredProps
  } = props;

  const handleFocus = () => {
    controls.start({
      boxShadow: "0 0 0 2px var(--glass-teal), 0 8px 32px 0 hsla(240, 40%, 30%, 0.18)",
      background: "var(--glass-silver)",
      transition: { duration: 0.3 },
    });
  };
  const handleBlur = () => {
    controls.start({
      boxShadow: "var(--glass-shadow)",
      background: "var(--glass-silver)",
      transition: { duration: 0.3 },
    });
  };

  return (
    <motion.input
      ref={inputRef}
      className={`glass-bg-silver glass-blur-md glass-shadow glass-radius px-4 py-2 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-300 ${className}`}
      style={{ border: "1.5px solid var(--glass-teal)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      animate={controls}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...filteredProps}
    />
  );
};

export default LiquidGlassInput;
