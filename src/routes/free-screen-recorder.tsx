import { createFileRoute } from "@tanstack/react-router";
import {
  MonitorPlay,
  Ban,
  Infinity as InfinityIcon,
  ShieldCheck,
  Film,
  MousePointer2,
} from "lucide-react";
import { SeoLandingLayout } from "@/components/seo/SeoLandingLayout";
import { seoMeta } from "@/components/seo/seo-head";

export const Route = createFileRoute("/free-screen-recorder")({
  head: () => ({
    meta: seoMeta({
      title: "Free Screen Recorder — No Watermark, No Time Limit | ScreenFlow",
      description:
        "A 100% free screen recorder with no watermark, no time limits, and no account. Record your screen and webcam in up to 4K directly in your browser.",
      path: "/free-screen-recorder",
      breadcrumbName: "Free Screen Recorder",
      faqs: [
        {
          q: "Does the free screen recorder add a watermark?",
          a: "No. ScreenFlow never adds watermarks, on any plan — there is no paid plan. Your recordings are completely clean from start to finish.",
        },
        {
          q: "Is there a recording time limit?",
          a: "No. You can record for as long as you need. There are no 5-minute caps, no hidden limits, and no prompts to upgrade.",
        },
        {
          q: "Do I need to create an account to record for free?",
          a: "No. ScreenFlow works without signing up. Open the page, press record, and save your video locally to your device.",
        },
        {
          q: "What quality can I record in for free?",
          a: "Every feature is free, including 4K recording, webcam overlays, microphone audio, and the built-in video editor.",
        },
        {
          q: "Is a free web-based screen recorder safe to use?",
          a: "Yes. ScreenFlow records and processes video locally in your browser. Your footage never uploads to a server, so there is nothing to share or leak.",
        },
      ],
    }),
  }),
  component: FreeScreenRecorderPage,
});

const FEATURES = [
  {
    icon: Ban,
    title: "No watermark — ever",
    text: "Unlike other free recorders, ScreenFlow never stamps your videos with a logo or brand. Your output is clean.",
  },
  {
    icon: InfinityIcon,
    title: "No time limits",
    text: "Record 30 minutes or 3 hours. There is no cap on recording length, free or otherwise.",
  },
  {
    icon: MonitorPlay,
    title: "Up to 4K quality",
    text: "Free access to HD, Full HD, and 4K recording with configurable frame rates.",
  },
  {
    icon: ShieldCheck,
    title: "Private and local",
    text: "Everything happens in your browser. Your video is saved straight to your device and never uploaded.",
  },
  {
    icon: Film,
    title: "Editor included",
    text: "Trim, crop, merge, caption, and add music — no extra paid tools required.",
  },
  {
    icon: MousePointer2,
    title: "Click and cursor effects",
    text: "Highlight your cursor and clicks during recording so viewers never lose track of your actions.",
  },
];

const STEPS = [
  {
    title: "Open ScreenFlow",
    text: "No download, no signup, no credit card. Just open the page in your browser.",
  },
  {
    title: "Choose what to capture",
    text: "Pick your whole screen, a window, or a tab. Add webcam and mic if you want them.",
  },
  {
    title: "Record and save",
    text: "Press record, capture as long as you need, then save the video directly to your device.",
  },
];

export function FreeScreenRecorderPage() {
  return (
    <SeoLandingLayout
      badge="100% Free · No Signup"
      h1="Free screen recorder with no watermark and no time limit"
      subtitle="ScreenFlow is a genuinely free screen recorder. Record your screen, webcam, and audio in up to 4K directly in the browser — with no watermark, no recording time limits, and no account required."
      ctaLabel="Record for free"
      features={FEATURES}
      steps={STEPS}
      related={[
        {
          name: "Screen Recorder",
          path: "/screen-recorder",
          description: "The full-featured browser screen recorder.",
        },
        {
          name: "Online Screen Recorder",
          path: "/online-screen-recorder",
          description: "Record in the browser — nothing to download.",
        },
        {
          name: "4K Screen Recorder",
          path: "/4k-screen-recorder",
          description: "Record free 4K screen videos.",
        },
        {
          name: "Webcam Recorder",
          path: "/webcam-recorder",
          description: "Free webcam recording with camera overlay.",
        },
        {
          name: "Best Free Screen Recorders",
          path: "/guides/best-free-screen-recorders",
          description: "How ScreenFlow compares to other free tools.",
        },
        {
          name: "Video Recorder",
          path: "/video-recorder",
          description: "Record screen, webcam, and mic together.",
        },
      ]}
    />
  );
}
