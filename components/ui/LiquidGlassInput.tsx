import React, { useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface LiquidGlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

// List of props to omit for framer-motion compatibility
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

export const LiquidGlassInput: React.FC<LiquidGlassInputProps> = ({ className = "", ...props }) => {
  const controls = useAnimation();
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Type assertion to omit incompatible props
  const safeProps = omitProps(props, OMIT_PROPS) as Omit<React.InputHTMLAttributes<HTMLInputElement>, typeof OMIT_PROPS[number]>;

  return (
    <motion.input
      ref={inputRef}
      className={`glass-bg-silver glass-blur-md glass-shadow glass-radius px-4 py-2 font-medium text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-glass-teal transition-all duration-300 ${className}`}
      style={{ border: "1.5px solid var(--glass-teal)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      animate={controls}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...safeProps}
    />
  );
};

export default LiquidGlassInput;
