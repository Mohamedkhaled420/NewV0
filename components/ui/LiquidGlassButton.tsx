import React, { useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const OMIT_PROPS = [
  "onDrag", "onDragStart", "onDragEnd", "onDragOver", "onDrop",
  "onAnimationStart", "onAnimationEnd", "onAnimationIteration"
];

function omitProps<T extends object>(props: T, keys: string[]): Partial<T> {
  const result: Partial<T> = {};
  Object.keys(props).forEach((key) => {
    if (!keys.includes(key)) {
      // @ts-expect-error framer-motion/React prop compatibility
      result[key] = props[key];
    }
  });
  return result;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({ children, className = "", ...props }) => {
  const controls = useAnimation();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = useCallback(() => {
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

  const safeProps = omitProps(props, OMIT_PROPS) as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, typeof OMIT_PROPS[number]>;

  return (
    <motion.button
      ref={btnRef}
      className={`glass-bg-indigo glass-blur-md glass-shadow glass-radius px-5 py-2 font-semibold text-white relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-glass-teal transition-all duration-300 ${className}`}
      style={{ border: "1.5px solid var(--glass-teal)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      animate={controls}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...safeProps}
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
