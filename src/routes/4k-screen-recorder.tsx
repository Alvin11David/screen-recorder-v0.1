import { createFileRoute } from "@tanstack/react-router";
import { MonitorPlay, Video, Camera, Gauge, ShieldCheck, Settings2 } from "lucide-react";
import { SeoLandingLayout } from "@/components/seo/SeoLandingLayout";
import { seoMeta } from "@/components/seo/seo-head";

export const Route = createFileRoute("/4k-screen-recorder")({
  head: () => ({
    meta: seoMeta({
      title: "4K Screen Recorder — Record 4K Video Online Free | ScreenFlow",
      description:
        "Record your screen in crisp 4K resolution online and free. Webcam overlay, microphone audio, and a built-in editor — all in your browser with no download.",
      path: "/4k-screen-recorder",
      breadcrumbName: "4K Screen Recorder",
      faqs: [
        {
          q: "Can my browser really record in 4K?",
          a: "Yes. ScreenFlow lets you select 4K (2160p) as your output resolution. Whether your display and hardware can sustain it depends on your GPU and available resources, but modern machines handle it comfortably.",
        },
        {
          q: "What is the highest resolution ScreenFlow supports?",
          a: "ScreenFlow supports 720p, 1080p, and 4K (2160p), plus high frame rates. If your screen itself is 4K, the recording is pixel-perfect.",
        },
        {
          q: "Will a 4K recording be very large?",
          a: "4K footage is larger than 1080p, but ScreenFlow uses efficient codecs (typically VP9) and reasonable bitrates to keep files manageable without sacrificing quality.",
        },
        {
          q: "Do I need a 4K monitor to record 4K video?",
          a: "No. You can capture a 4K browser tab or window even if your physical display is smaller, since tab capture follows the page's resolution. For full-screen capture, a 4K display helps.",
        },
        {
          q: "Is 4K recording available for free?",
          a: "Yes. Every ScreenFlow feature, including 4K resolution, is free with no watermark and no time limit.",
        },
      ],
    }),
  }),
  component: UhdScreenRecorderPage,
});

const FEATURES = [
  {
    icon: Video,
    title: "True 4K output",
    text: "Record at 2160p for pixel-perfect captures of UHD displays, games, and design work.",
  },
  {
    icon: Gauge,
    title: "High frame rates",
    text: "Choose 30 or 60 FPS so fast-moving content like gameplay stays silky smooth.",
  },
  {
    icon: MonitorPlay,
    title: "Screen, window, or tab",
    text: "Capture full screen or any individual window or tab at full resolution.",
  },
  {
    icon: Camera,
    title: "4K-friendly webcam overlay",
    text: "Add your camera feed on top with adjustable size and position for pro-style videos.",
  },
  {
    icon: Settings2,
    title: "Advanced controls",
    text: "Fine-tune resolution, bitrate, and audio settings so you balance quality and file size.",
  },
  {
    icon: ShieldCheck,
    title: "Local-only processing",
    text: "4K footage is big — that is why ScreenFlow keeps it on your device and never uploads it.",
  },
];

const STEPS = [
  {
    title: "Set your resolution",
    text: "Choose 4K (2160p) and your preferred frame rate before you start.",
  },
  {
    title: "Pick your capture area",
    text: "Select your screen, a window, or a tab, and add webcam or mic if needed.",
  },
  {
    title: "Record and save",
    text: "Capture your footage, edit if you like, then save the 4K video locally.",
  },
];

export function UhdScreenRecorderPage() {
  return (
    <SeoLandingLayout
      badge="Up to 4K · 60 FPS"
      h1="4K screen recorder — capture video in ultra-high definition"
      subtitle="ScreenFlow records your screen in true 4K (2160p) up to 60 FPS, free and online. Add a webcam overlay and microphone audio, edit in the browser, and keep your footage local — no downloads, no watermarks."
      ctaLabel="Record in 4K now"
      features={FEATURES}
      steps={STEPS}
      related={[
        {
          name: "Screen Recorder",
          path: "/screen-recorder",
          description: "The full-featured browser recorder.",
        },
        {
          name: "Video Recorder",
          path: "/video-recorder",
          description: "Record 4K video online for free.",
        },
        {
          name: "Free Screen Recorder",
          path: "/free-screen-recorder",
          description: "Free recording with no limits.",
        },
        {
          name: "Online Screen Recorder",
          path: "/online-screen-recorder",
          description: "Record in the browser, no download.",
        },
        {
          name: "Webcam Recorder",
          path: "/webcam-recorder",
          description: "Pair your camera with 4K screen capture.",
        },
        {
          name: "How to Record Your Screen",
          path: "/guides/how-to-record-your-screen",
          description: "Settings and tips for the best quality.",
        },
      ]}
    />
  );
}
