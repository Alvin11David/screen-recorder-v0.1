import { createFileRoute } from "@tanstack/react-router";
import { Camera, Video, Mic, Sparkles, ShieldCheck, Users } from "lucide-react";
import { SeoLandingLayout } from "@/components/seo/SeoLandingLayout";
import { seoMeta } from "@/components/seo/seo-head";

export const Route = createFileRoute("/webcam-recorder")({
  head: () => ({
    meta: seoMeta({
      title: "Webcam Recorder — Record Camera Videos Online Free | ScreenFlow",
      description:
        "Record webcam videos online for free with ScreenFlow. Capture your camera and microphone, add your screen, and edit — all in the browser with no downloads.",
      path: "/webcam-recorder",
      breadcrumbName: "Webcam Recorder",
      faqs: [
        {
          q: "How do I record a video with my webcam?",
          a: "Open ScreenFlow, click record, and allow camera and microphone access. Your webcam feed is captured right away, and you can add a screen capture if you want to show something alongside.",
        },
        {
          q: "Can I record webcam and screen at the same time?",
          a: "Yes. Use the webcam overlay while recording your screen, window, or tab — ideal for tutorial videos, product demos, and walkthroughs.",
        },
        {
          q: "What quality does ScreenFlow record my webcam in?",
          a: "Your webcam records at whatever resolution your camera supports, commonly 720p or 1080p. Output video can be configured up to 4K.",
        },
        {
          q: "Do I need special software to use my webcam as a recorder?",
          a: "No. ScreenFlow runs in your browser and uses your webcam through the standard MediaDevices API. There is nothing to install.",
        },
        {
          q: "Are my webcam recordings private?",
          a: "Yes. Webcam footage is processed locally and saved to your device. It is never uploaded or visible to anyone else.",
        },
      ],
    }),
  }),
  component: WebcamRecorderPage,
});

const FEATURES = [
  {
    icon: Camera,
    title: "Crisp webcam capture",
    text: "Record your camera at full quality with automatic exposure and focus handled by your device.",
  },
  {
    icon: Mic,
    title: "Voiceover with clarity",
    text: "Capture your microphone with echo cancellation and noise suppression for studio-clean audio.",
  },
  {
    icon: Video,
    title: "Screen overlay",
    text: "Put your camera in a corner while recording your screen — the standard layout for tutorials.",
  },
  {
    icon: Sparkles,
    title: "Virtual backdrop effects",
    text: "Blur or replace your background for a polished, distraction-free look. Privacy without a green screen.",
  },
  {
    icon: Users,
    title: "Made for creators",
    text: "Ideal for YouTube, courses, meetings, and social media — no editor or encoder needed.",
  },
  {
    icon: ShieldCheck,
    title: "Local-only footage",
    text: "Your camera video is recorded and saved entirely on your device. Nothing is streamed or stored online.",
  },
];

const STEPS = [
  {
    title: "Allow camera access",
    text: "Open ScreenFlow and grant camera and microphone permission in your browser.",
  },
  {
    title: "Adjust your framing",
    text: "Enable a blurred or custom backdrop, then position yourself in the frame.",
  },
  {
    title: "Record and export",
    text: "Press record, capture your video, edit if needed, and save it locally.",
  },
];

export function WebcamRecorderPage() {
  return (
    <SeoLandingLayout
      badge="Free Webcam Recorder"
      h1="Webcam recorder — create camera videos online, free"
      subtitle="ScreenFlow is a free webcam recorder that captures your camera and microphone right in the browser. Add your screen as an overlay, blur your background, edit, and download — with no installs and nothing uploaded."
      ctaLabel="Record with your webcam"
      features={FEATURES}
      steps={STEPS}
      related={[
        {
          name: "Video Recorder",
          path: "/video-recorder",
          description: "Record screen, webcam, and mic together.",
        },
        {
          name: "Screen Recorder",
          path: "/screen-recorder",
          description: "Pair webcam overlay with screen capture.",
        },
        {
          name: "Free Screen Recorder",
          path: "/free-screen-recorder",
          description: "Free recording with no watermark.",
        },
        {
          name: "Online Screen Recorder",
          path: "/online-screen-recorder",
          description: "Record entirely in the browser.",
        },
        {
          name: "4K Screen Recorder",
          path: "/4k-screen-recorder",
          description: "High-resolution screen capture.",
        },
        {
          name: "How to Record Your Screen",
          path: "/guides/how-to-record-your-screen",
          description: "Tips for combining webcam and screen.",
        },
      ]}
    />
  );
}
