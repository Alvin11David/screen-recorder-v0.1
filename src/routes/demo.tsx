import { createFileRoute } from "@tanstack/react-router";
import LiquidMetalHero from "@/components/ui/liquid-metal-hero";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Liquid Metal Hero — ScreenFlow" },
      { name: "description", content: "Preview the liquid metal hero animation." },
    ],
  }),
  component: LiquidMetalHeroDemo,
});

function LiquidMetalHeroDemo() {
  return (
    <LiquidMetalHero
      badge="Next Generation UI"
      title="Fluid Design Excellence"
      subtitle="Experience the future of web interfaces with liquid metal aesthetics that adapt, flow, and captivate. Built for modern applications that demand both beauty and performance."
      primaryCtaLabel="Start Building"
      secondaryCtaLabel="View Examples"
      onPrimaryCtaClick={() => alert("Primary CTA clicked!")}
      onSecondaryCtaClick={() => alert("Secondary CTA clicked!")}
      features={[
        "Seamless Animations",
        "Responsive Excellence",
        "Modern Architecture",
      ]}
    />
  );
}
