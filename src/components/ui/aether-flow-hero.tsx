import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import ParticleBackground from "./particle-background";

interface AetherFlowHeroProps {
  children?: React.ReactNode;
}

const AetherFlowHero = ({ children }: AetherFlowHeroProps) => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.5,
        duration: 0.8,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <ParticleBackground paint="black" />
      </div>

      <div className="relative z-10 w-full">
        {children ? (
          children
        ) : (
          <div className="text-center p-6">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm"
            >
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-200">Dynamic Rendering Engine</span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
            >
              Aether Flow
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl mx-auto text-lg text-gray-400 mb-10"
            >
              An intelligent, adaptive framework for creating fluid digital experiences that feel
              alive and respond to user interaction in real-time.
            </motion.p>

            <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto">
                Explore the Engine
                <ArrowRight className="h-5 w-5" />
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AetherFlowHero;
