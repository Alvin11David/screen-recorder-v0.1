import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Download, Heart, ShieldCheck, Smartphone } from "lucide-react";

const APK_URL = "/ScreenFlow.apk";

const STEPS = [
  {
    icon: Download,
    title: "Download the APK",
    text: "Your download starts automatically. If it doesn't, tap the button below.",
  },
  {
    icon: ShieldCheck,
    title: "Allow installs from this source",
    text: "Android may ask you to allow installing unknown apps — tap Settings and enable it for your browser.",
  },
  {
    icon: Smartphone,
    title: "Install & launch",
    text: "Open the downloaded file and tap Install. You can then open ScreenFlow from your home screen.",
  },
];

export const Route = createFileRoute("/install")({
  head: () => ({
    meta: [
      { title: "Thank You — Download ScreenFlow for Android" },
      {
        name: "description",
        content: "Thank you for downloading ScreenFlow. Follow these steps to install the Android app.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InstallPage,
});

function InstallPage() {
  const downloaded = useRef(false);

  useEffect(() => {
    if (downloaded.current) return;
    downloaded.current = true;
    // Kick off the download automatically once the page loads.
    const a = document.createElement("a");
    a.href = APK_URL;
    a.download = "ScreenFlow.apk";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.74_0.15_222/0.12)_0%,transparent_55%)]" />

      <div className="relative w-full max-w-lg">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-2xl bg-card/80 p-8 shadow-[0_24px_64px_-16px_oklch(0_0_0/0.5)] ring-1 ring-border backdrop-blur-xl sm:p-10">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.74_0.15_222)] to-[oklch(0.72_0.16_200)] shadow-[0_0_24px_oklch(0.74_0.15_222/0.35)]">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Thank you!</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your ScreenFlow APK download has started.
              </p>
            </div>
          </div>

          <a
            href={APK_URL}
            download
            className="relative mb-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[oklch(0.74_0.15_222)] to-[oklch(0.72_0.16_200)] py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_oklch(0.74_0.15_222/0.3)] transition-all hover:shadow-[0_0_28px_oklch(0.74_0.15_222/0.45)] hover:brightness-110 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Download APK
          </a>

          <div className="mb-8 h-px bg-border" />

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[oklch(0.74_0.15_222)]" />
              <h2 className="text-sm font-semibold text-foreground">Next steps to install</h2>
            </div>
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="flex gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.74_0.15_222/0.12)] ring-1 ring-[oklch(0.74_0.15_222/0.2)]">
                  <Icon className="h-4 w-4 text-[oklch(0.74_0.15_222)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <span className="mr-1.5 text-muted-foreground">{i + 1}.</span>
                    {title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
