import { createFileRoute } from "@tanstack/react-router";
import { MonitorPlay, Camera, Mic, ShieldCheck, Film, Zap } from "lucide-react";
import { SeoLandingLayout } from "@/components/seo/SeoLandingLayout";
import { seoMeta } from "@/components/seo/seo-head";

export const Route = createFileRoute("/screen-recorder")({
  head: () => ({
    meta: seoMeta({
      title: "Screen Recorder — Record Your Screen Online Free | ScreenFlow",
      description:
        "Record your screen, webcam, and audio in HD up to 4K directly in your browser. Free online screen recorder with no download, no watermark, and no signup.",
      path: "/screen-recorder",
      breadcrumbName: "Screen Recorder",
      faqs: [
        {
          q: "Is ScreenFlow really free to use?",
          a: "Yes. ScreenFlow is completely free with no time limits, no watermarks, and no account required. Every feature, including 4K recording and the built-in video editor, is available at no cost.",
        },
        {
          q: "Do I need to install anything to record my screen?",
          a: "No. ScreenFlow runs entirely in your browser using the standard MediaRecorder API. There is nothing to download or install — just open the page and press record.",
        },
        {
          q: "Can I record my webcam and screen at the same time?",
          a: "Yes. You can record your screen, a specific tab, or a window, and overlay your webcam in a picture-in-picture style. You can also capture microphone audio with echo cancellation and noise suppression.",
        },
        {
          q: "Where are my recordings saved?",
          a: "On your own device. Recordings are processed locally in your browser and saved straight to your computer. Your video never uploads to a server, so your content stays private.",
        },
        {
          q: "What is the maximum recording resolution?",
          a: "ScreenFlow supports recording in HD (720p), Full HD (1080p), and 4K (2160p), depending on your display and browser capabilities. You can also record at high frame rates for smooth playback.",
        },
      ],
    }),
  }),
  component: ScreenRecorderPage,
});

const FEATURES = [
  {
    icon: MonitorPlay,
    title: "Full screen, window, or tab",
    text: "Capture your entire monitor, a single application window, or a browser tab — including internal audio from the tab.",
  },
  {
    icon: Camera,
    title: "Webcam overlay",
    text: "Add a picture-in-picture webcam feed with adjustable size, position, and shape. Ideal for tutorials and walkthroughs.",
  },
  {
    icon: Mic,
    title: "Microphone audio",
    text: "Record crisp voiceover with echo cancellation and noise suppression so your narration is always clear.",
  },
  {
    icon: Film,
    title: "Built-in video editor",
    text: "Trim, merge, crop, resize, add captions, and layer background music — all without leaving your browser.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Everything is processed locally. Your recordings never leave your device, so nothing is stored or tracked.",
  },
  {
    icon: Zap,
    title: "4K at high frame rate",
    text: "Record in up to 4K resolution at smooth frame rates for professional-looking captures on any modern browser.",
  },
];

const STEPS = [
  {
    title: "Choose your capture area",
    text: "Click record and pick your entire screen, a window, or a browser tab. Enable your webcam and microphone if you need them.",
  },
  {
    title: "Hit record",
    text: "A countdown starts so you can prepare. Record as long as you like — there is no time limit.",
  },
  {
    title: "Save locally",
    text: "Stop recording, preview the result, edit it if you like, and save it to your device. It stays on your machine.",
  },
];

export function ScreenRecorderPage() {
  return (
    <SeoLandingLayout
      badge="Free Screen Recorder"
      h1="Record your screen — free, online, in the browser"
      subtitle="ScreenFlow is a free screen recorder that captures your screen, webcam, and audio in up to 4K directly in your browser. No downloads, no watermarks, and nothing is ever uploaded — your recordings stay on your device."
      ctaLabel="Start recording now"
      features={FEATURES}
      steps={STEPS}
      related={[
        {
          name: "Free Screen Recorder",
          path: "/free-screen-recorder",
          description: "Record for free with no watermark and no time limit.",
        },
        {
          name: "Online Screen Recorder",
          path: "/online-screen-recorder",
          description: "Capture your screen in the browser — no download required.",
        },
        {
          name: "4K Screen Recorder",
          path: "/4k-screen-recorder",
          description: "Record video in crisp 4K resolution.",
        },
        {
          name: "Video Recorder",
          path: "/video-recorder",
          description: "Record videos with screen, webcam, and mic together.",
        },
        {
          name: "Webcam Recorder",
          path: "/webcam-recorder",
          description: "Record your camera and create talking-head videos online.",
        },
        {
          name: "How to Record Your Screen",
          path: "/guides/how-to-record-your-screen",
          description: "A beginner's guide to recording great screen videos.",
        },
      ]}
    />
  );
}
