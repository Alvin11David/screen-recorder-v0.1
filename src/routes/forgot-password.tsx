import { createFileRoute } from "@tanstack/react-router";
import AetherFlowHero from "@/components/ui/aether-flow-hero";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Aether Flow — ScreenCapture Pro" },
      { name: "description", content: "Aether Flow hero animation." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <main className="bg-black">
      <AetherFlowHero />
    </main>
  );
}
