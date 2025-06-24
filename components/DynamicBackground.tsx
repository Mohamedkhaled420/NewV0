import React from "react";

// Pure CSS animated gradient background as a placeholder for debugging R3F issues
const DynamicBackground: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "", style = {} }) => {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "linear-gradient(120deg, #181c2f 0%, #232a4d 50%, #7f5af0 100%)",
        backgroundSize: "200% 200%",
        animation: "gradientMove 8s ease-in-out infinite",
        ...style,
      }}
    >
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default DynamicBackground;
