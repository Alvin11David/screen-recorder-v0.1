import type { ReactNode } from "react";
import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";

interface Props {
  children?: ReactNode;
  className?: string;
}

export function LiquidMetalBackground({ children, className = "" }: Props) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      <LiquidMetal
        {...liquidMetalPresets[2]}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
}
