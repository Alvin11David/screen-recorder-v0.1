import type { ReactNode } from "react";
import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";

interface Props {
  children?: ReactNode;
  className?: string;
}

export function LiquidMetalBackground({ children, className = "" }: Props) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        <LiquidMetal
          {...liquidMetalPresets[2]}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
}
