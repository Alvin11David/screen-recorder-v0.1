import { createFileRoute } from "@tanstack/react-router";
import { MonitorPlay, Mic, Camera, Scissors, Lightbulb, Download } from "lucide-react";
import { SeoLandingLayout } from "@/components/seo/SeoLandingLayout";
import { seoMeta } from "@/components/seo/seo-head";

export const Route = createFileRoute("/guides/how-to-record-your-screen")({
  head: () => ({
    meta: seoMeta({
      title: "How to Record Your Screen — Step-by-Step Guide | ScreenFlow",
      description:
        "Learn how to record your screen step by step: choose your capture area, add webcam and mic, record, and edit. Free browser-based tips for Windows, Mac, and Linux.",
      path: "/guides/how-to-record-your-screen",
      breadcrumbName: "How to Record Your Screen",
      faqs: [
        {
          q: "What do I need to record my screen?",
          a: "Just a modern browser such as Chrome, Edge, or Firefox. ScreenFlow uses your device's built-in capture capabilities, so there is no software to install and no account required.",
        },
        {
          q: "Should I record my whole screen or just a window?",
          a: "For a clean, focused video, record a single window or browser tab. Whole-screen recording captures everything visible, including notifications, which can be distracting.",
        },
        {
          q: "How do I record my voice at the same time?",
          a: "Enable microphone access before you start and keep your mic within a foot or two of your mouth. ScreenFlow applies noise suppression automatically for clearer audio.",
        },
        {
          q: "What resolution should I use for my screen recording?",
          a: "1080p is the sweet spot for most videos — great quality without huge files. Choose 4K only when you need the extra detail, such as for design or game footage.",
        },
        {
          q: "Can I edit my screen recording after recording it?",
          a: "Yes. ScreenFlow includes a built-in editor so you can trim the start and end, cut out mistakes, add captions, and merge multiple clips before saving.",
        },
        {
          q: "How do I make my screen recording look professional?",
          a: "Clean your desktop first, close irrelevant tabs, plan a rough script, and add your webcam in the corner. Then trim dead time and add captions in the editor.",
        },
      ],
    }),
  }),
  component: HowToRecordYourScreenPage,
});

const FEATURES = [
  {
    icon: MonitorPlay,
    title: "1. Choose your capture area",
    text: "Decide between the whole screen, a single window, or a browser tab. For most tutorials a tab or window is cleaner and protects your privacy.",
  },
  {
    icon: Mic,
    title: "2. Turn on your audio",
    text: "Enable your microphone for narration and, if you record a tab, capture that tab's internal audio for music or videos.",
  },
  {
    icon: Camera,
    title: "3. Add your webcam",
    text: "Show yourself in a corner overlay to build trust and engagement, especially for tutorials and lessons.",
  },
  {
    icon: Download,
    title: "4. Record and save",
    text: "Press record, capture your content, then stop. Preview the result and download the video to your device.",
  },
  {
    icon: Scissors,
    title: "5. Trim and polish",
    text: "Use the built-in editor to cut the awkward start and end, remove mistakes, and add captions for accessibility.",
  },
  {
    icon: Lightbulb,
    title: "Pro tips",
    text: "Clean your desktop, close noisy apps, plan a script, and record in a quiet room for the best results.",
  },
];

const STEPS = [
  {
    title: "Open ScreenFlow in your browser",
    text: "No download, no signup. Works on Windows, macOS, Linux, and ChromeOS.",
  },
  {
    title: "Pick your sources",
    text: "Choose screen, window, or tab; enable microphone and webcam as needed.",
  },
  {
    title: "Record, edit, and share",
    text: "Capture your video, trim and caption it in the editor, then save it locally.",
  },
];

export function HowToRecordYourScreenPage() {
  return (
    <SeoLandingLayout
      badge="Step-by-Step Guide"
      h1="How to record your screen: a simple step-by-step guide"
      subtitle="Recording your screen is easier than ever — you can do it right in your browser. This guide walks you through choosing a capture area, adding your mic and webcam, recording, and polishing the result with the built-in editor."
      ctaLabel="Start recording now"
      features={FEATURES}
      steps={STEPS}
      related={[
        {
          name: "Screen Recorder",
          path: "/screen-recorder",
          description: "The recorder used in this guide.",
        },
        {
          name: "Video Recorder",
          path: "/video-recorder",
          description: "Combine screen, webcam, and mic.",
        },
        {
          name: "Best Free Screen Recorders",
          path: "/guides/best-free-screen-recorders",
          description: "Compare ScreenFlow with other tools.",
        },
        {
          name: "Webcam Recorder",
          path: "/webcam-recorder",
          description: "Add a professional webcam overlay.",
        },
        {
          name: "Free Screen Recorder",
          path: "/free-screen-recorder",
          description: "Free recording with no watermark.",
        },
        {
          name: "4K Screen Recorder",
          path: "/4k-screen-recorder",
          description: "Get the best possible video quality.",
        },
      ]}
    />
  );
}
