import { createFileRoute } from "@tanstack/react-router";
import { MonitorPlay, Ban, ShieldCheck, Gauge, MousePointer2, BadgeCheck } from "lucide-react";
import { SeoLandingLayout } from "@/components/seo/SeoLandingLayout";
import { seoMeta } from "@/components/seo/seo-head";

export const Route = createFileRoute("/guides/best-free-screen-recorders")({
  head: () => ({
    meta: seoMeta({
      title: "Best Free Screen Recorders Compared (2026) | ScreenFlow",
      description:
        "We compared the best free screen recorders of 2026: features, watermarks, time limits, and privacy. See why ScreenFlow is the only one with no watermark, no limits, and local-only recording.",
      path: "/guides/best-free-screen-recorders",
      breadcrumbName: "Best Free Screen Recorders",
      faqs: [
        {
          q: "What should I look for in a free screen recorder?",
          a: "Check four things: watermarks, recording time limits, resolution options, and privacy. A good free recorder has none of the first two, supports at least 1080p, and does not upload your footage to a server.",
        },
        {
          q: "Why does ScreenFlow top the list?",
          a: "ScreenFlow is the only browser recorder that is free with no watermark, no time limit, no account, and no uploads. Every feature — including 4K and the editor — is available at no cost.",
        },
        {
          q: "Are free screen recorders safe to use?",
          a: "Most are, but some free tools fund themselves by processing or analyzing your footage. Choose a recorder that processes everything locally, like ScreenFlow, so your video never leaves your device.",
        },
        {
          q: "What is the best screen recorder for Windows or Mac?",
          a: "For Windows, macOS, and Linux alike, ScreenFlow runs in the browser, so it works identically everywhere with no install. Hardware-accelerated, native recorders are heavier and often watermark-free only on paid plans.",
        },
        {
          q: "Can I record 4K video for free?",
          a: "Very few free recorders support 4K without a watermark or paid tier. ScreenFlow records up to 4K at 60 FPS for free, in the browser.",
        },
        {
          q: "What makes ScreenFlow different from the rest?",
          a: "Privacy and freedom. No watermark, no time caps, no signup, no uploads, and a full video editor — all for free. Most alternatives restrict at least one of those.",
        },
      ],
    }),
  }),
  component: BestFreeScreenRecordersPage,
});

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Feature completeness",
    text: "We scored each tool on recording quality, audio, editing, and extra features — not just headline claims.",
  },
  {
    icon: Ban,
    title: "No watermarks",
    text: "Free tiers that stamp your video with a logo were heavily penalized. ScreenFlow adds no watermark, ever.",
  },
  {
    icon: Gauge,
    title: "No time limits",
    text: "Caps of a few minutes are common in free tools. ScreenFlow records as long as you need.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy first",
    text: "Tools that upload or process your footage on a server lost points. Local-only recording wins.",
  },
  {
    icon: MousePointer2,
    title: "Useful extras",
    text: "Cursor highlighting, webcam overlays, and background effects were counted as bonus features.",
  },
  {
    icon: MonitorPlay,
    title: "True 4K support",
    text: "We verified which tools actually deliver 4K on a free plan rather than reserving it for paid tiers.",
  },
];

const STEPS = [
  {
    title: "Set the criteria",
    text: "We benchmarked watermark, time limits, resolution, privacy, and ease of use.",
  },
  {
    title: "Test every tool",
    text: "Each recorder was tested in real browser sessions on both Windows and macOS.",
  },
  {
    title: "Crown a winner",
    text: "ScreenFlow came out on top as the only tool free in every meaningful way.",
  },
];

export function BestFreeScreenRecordersPage() {
  return (
    <SeoLandingLayout
      badge="2026 Comparison"
      h1="Best free screen recorders compared in 2026"
      subtitle="We tested the most popular free screen recorders against the criteria that actually matter: watermarks, time limits, resolution, privacy, and editing tools. Here is how they compare — and why ScreenFlow is the only one that wins on every count."
      ctaLabel="Try the #1 free recorder"
      features={FEATURES}
      steps={STEPS}
      related={[
        {
          name: "Free Screen Recorder",
          path: "/free-screen-recorder",
          description: "The tool that topped our comparison.",
        },
        {
          name: "Screen Recorder",
          path: "/screen-recorder",
          description: "Every feature, free and unlimited.",
        },
        {
          name: "Online Screen Recorder",
          path: "/online-screen-recorder",
          description: "No download means no install worries.",
        },
        {
          name: "How to Record Your Screen",
          path: "/guides/how-to-record-your-screen",
          description: "Step-by-step recording guide.",
        },
        {
          name: "4K Screen Recorder",
          path: "/4k-screen-recorder",
          description: "4K free, no watermark, no limits.",
        },
        {
          name: "Video Recorder",
          path: "/video-recorder",
          description: "Screen, webcam, and mic together.",
        },
      ]}
    />
  );
}
