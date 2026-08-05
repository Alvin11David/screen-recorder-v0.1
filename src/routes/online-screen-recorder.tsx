import { createFileRoute } from "@tanstack/react-router";
import { MonitorPlay, Download, Globe, ShieldCheck, Film, Zap } from "lucide-react";
import { SeoLandingLayout } from "@/components/seo/SeoLandingLayout";
import { seoMeta } from "@/components/seo/seo-head";

export const Route = createFileRoute("/online-screen-recorder")({
  head: () => ({
    meta: seoMeta({
      title: "Online Screen Recorder — Record in Browser, No Download | ScreenFlow",
      description:
        "Record your screen online without downloading anything. Free browser-based screen recorder with webcam, mic, 4K quality, and local-only saving.",
      path: "/online-screen-recorder",
      breadcrumbName: "Online Screen Recorder",
      faqs: [
        {
          q: "Do I really not need to download anything?",
          a: "Correct. ScreenFlow is a web app that uses your browser's built-in screen capture and recording capabilities. There is no installer and no plugin — it works the moment you open the page.",
        },
        {
          q: "Which browsers support online screen recording?",
          a: "ScreenFlow works in any Chromium-based browser (Chrome, Edge, Brave, Opera) and in Firefox. It uses the standard getDisplayMedia and MediaRecorder APIs.",
        },
        {
          q: "Can I record sound in my browser?",
          a: "Yes. You can capture microphone audio, and when you record a browser tab you can also capture that tab's internal audio.",
        },
        {
          q: "Is an online recorder slower than desktop software?",
          a: "No. Recording happens locally using your device's hardware, so performance is comparable to desktop apps. Output is saved directly to your computer at up to 4K.",
        },
        {
          q: "Where is my recording uploaded?",
          a: "Nowhere. Unlike many online recorders, ScreenFlow does not upload your video to a server. Files are saved locally on your device and stay private.",
        },
      ],
    }),
  }),
  component: OnlineScreenRecorderPage,
});

const FEATURES = [
  {
    icon: Download,
    title: "No download or install",
    text: "Everything runs in the browser. Ideal for school computers, work machines, and locked-down devices where installing software is not possible.",
  },
  {
    icon: Globe,
    title: "Works everywhere",
    text: "Use it on Windows, macOS, Linux, or ChromeOS. Nothing to update — the latest version is always a refresh away.",
  },
  {
    icon: MonitorPlay,
    title: "Screen, window, or tab",
    text: "Capture any source your operating system exposes, including individual browser tabs.",
  },
  {
    icon: ShieldCheck,
    title: "Local and private",
    text: "Your video never touches a server. Record, edit, and save entirely on your own machine.",
  },
  {
    icon: Film,
    title: "Full editing suite",
    text: "Trim, crop, merge, add captions, and mix in music before exporting your final video.",
  },
  {
    icon: Zap,
    title: "4K at high FPS",
    text: "Capture up to 4K resolution at high frame rates — the same quality you would expect from desktop software.",
  },
];

const STEPS = [
  {
    title: "Open the page",
    text: "Navigate to ScreenFlow in your browser. No account and no installation required.",
  },
  {
    title: "Pick your sources",
    text: "Choose a screen, window, or tab and enable webcam and microphone as needed.",
  },
  {
    title: "Record and download",
    text: "Press record, then save your finished video locally to your device.",
  },
];

export function OnlineScreenRecorderPage() {
  return (
    <SeoLandingLayout
      badge="No Download Required"
      h1="Online screen recorder — record right in your browser"
      subtitle="ScreenFlow is a free online screen recorder that captures your screen, webcam, and audio in up to 4K with no download and no install. Open the page, record, and save your video locally — nothing is ever uploaded."
      ctaLabel="Start recording online"
      features={FEATURES}
      steps={STEPS}
      related={[
        {
          name: "Screen Recorder",
          path: "/screen-recorder",
          description: "The full-featured browser recorder.",
        },
        {
          name: "Free Screen Recorder",
          path: "/free-screen-recorder",
          description: "No watermark and no time limits.",
        },
        {
          name: "4K Screen Recorder",
          path: "/4k-screen-recorder",
          description: "Record in crisp 4K resolution.",
        },
        {
          name: "Video Recorder",
          path: "/video-recorder",
          description: "Record videos online for free.",
        },
        {
          name: "Webcam Recorder",
          path: "/webcam-recorder",
          description: "Capture your camera in the browser.",
        },
        {
          name: "How to Record Your Screen",
          path: "/guides/how-to-record-your-screen",
          description: "A complete beginner's guide.",
        },
      ]}
    />
  );
}
