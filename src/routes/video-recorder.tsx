import { createFileRoute } from "@tanstack/react-router";
import { MonitorPlay, Camera, Mic, Scissors, ShieldCheck, Globe } from "lucide-react";
import { SeoLandingLayout } from "@/components/seo/SeoLandingLayout";
import { seoMeta } from "@/components/seo/seo-head";

export const Route = createFileRoute("/video-recorder")({
  head: () => ({
    meta: seoMeta({
      title: "Video Recorder — Record Videos Online Free | ScreenFlow",
      description:
        "Record videos online for free: capture your screen, webcam, and microphone together in up to 4K. No software to install, no watermark, everything stays on your device.",
      path: "/video-recorder",
      breadcrumbName: "Video Recorder",
      faqs: [
        {
          q: "Can I record a video of my screen and webcam at the same time?",
          a: "Yes. ScreenFlow lets you record your screen, a specific window, or a browser tab while your webcam feed appears as an overlay. Microphone audio is captured alongside, so you can make videos like a presenter or streamer.",
        },
        {
          q: "Do I need to download software to record videos?",
          a: "No. ScreenFlow is a web-based video recorder that runs in any modern browser. There is nothing to install, and it works on Windows, macOS, Linux, and ChromeOS.",
        },
        {
          q: "Can I edit the video after recording?",
          a: "Yes. A built-in editor lets you trim, crop, resize, merge clips, add captions, and even add background music before you save your final video.",
        },
        {
          q: "What video formats does ScreenFlow record?",
          a: "ScreenFlow records using the WebM container with the most efficient codec your browser supports, typically VP9. The file is saved locally and plays in any modern browser.",
        },
        {
          q: "Is there a limit on video length?",
          a: "No. You can record as long as you need — there is no time limit and no watermark, even on the free plan.",
        },
      ],
    }),
  }),
  component: VideoRecorderPage,
});

const FEATURES = [
  {
    icon: MonitorPlay,
    title: "Screen + webcam + mic",
    text: "Combine all three into one video. Perfect for tutorials, product demos, and video lessons.",
  },
  {
    icon: Camera,
    title: "Custom webcam framing",
    text: "Move and resize your camera feed anywhere on the canvas, or switch shapes between circle, rounded, and square.",
  },
  {
    icon: Mic,
    title: "Studio-quality audio",
    text: "Built-in echo cancellation and noise suppression keep your voice clean, even in noisy rooms.",
  },
  {
    icon: Scissors,
    title: "Edit before you save",
    text: "Trim the start and end, remove mistakes, merge clips, and add captions — all in the same page.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing leaves your device",
    text: "Recording and editing happen locally. Your raw footage is never uploaded or stored on a server.",
  },
  {
    icon: Globe,
    title: "Works on any device",
    text: "Windows, macOS, Linux, and ChromeOS. All you need is a modern browser and a camera.",
  },
];

const STEPS = [
  {
    title: "Turn on your sources",
    text: "Select your screen or tab, enable your webcam and microphone, and position the camera overlay.",
  },
  {
    title: "Press record",
    text: "A short countdown gives you time to get ready. Record for as long as you like.",
  },
  {
    title: "Edit and download",
    text: "Stop, trim or caption your video, then save it locally as a WebM file.",
  },
];

export function VideoRecorderPage() {
  return (
    <SeoLandingLayout
      badge="Free Video Recorder"
      h1="Record videos online — no software needed"
      subtitle="ScreenFlow is a free video recorder that captures your screen, webcam, and microphone together in up to 4K. Record, edit, and download your video straight from the browser — no installs, no watermarks, no uploads."
      ctaLabel="Record a video now"
      features={FEATURES}
      steps={STEPS}
      related={[
        {
          name: "Screen Recorder",
          path: "/screen-recorder",
          description: "Capture your screen in up to 4K for free.",
        },
        {
          name: "Online Screen Recorder",
          path: "/online-screen-recorder",
          description: "Record in the browser with nothing to install.",
        },
        {
          name: "Webcam Recorder",
          path: "/webcam-recorder",
          description: "Record talking-head videos with your camera.",
        },
        {
          name: "Free Screen Recorder",
          path: "/free-screen-recorder",
          description: "Free recording with no watermark or time limit.",
        },
        {
          name: "4K Screen Recorder",
          path: "/4k-screen-recorder",
          description: "Record crisp, high-resolution video.",
        },
        {
          name: "How to Record Your Screen",
          path: "/guides/how-to-record-your-screen",
          description: "Learn the steps to record professional videos.",
        },
      ]}
    />
  );
}
