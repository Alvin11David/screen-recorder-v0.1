import { Link } from "@tanstack/react-router";

const EXPLORE_LINKS = [
  { name: "Screen Recorder", path: "/screen-recorder" },
  { name: "Video Recorder", path: "/video-recorder" },
  { name: "Free Screen Recorder", path: "/free-screen-recorder" },
  { name: "Online Screen Recorder", path: "/online-screen-recorder" },
  { name: "4K Screen Recorder", path: "/4k-screen-recorder" },
  { name: "Webcam Recorder", path: "/webcam-recorder" },
];

const GUIDE_LINKS = [
  { name: "How to Record Your Screen", path: "/guides/how-to-record-your-screen" },
  { name: "Best Free Screen Recorders", path: "/guides/best-free-screen-recorders" },
];

export function SeoFooter() {
  return (
    <footer className="border-t border-white/5 bg-black/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V5z" />
                  <circle cx="12" cy="12" r="2" fill="oklch(0.15 0.025 264)" />
                </svg>
              </span>
              <span className="font-display text-sm font-bold tracking-tight text-white">ScreenFlow</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Record your screen, webcam, and audio in up to 4K directly in the browser. No installs, no
              watermarks, no data leaving your machine.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70">Recorders</h3>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70">Guides</h3>
            <ul className="mt-4 space-y-2.5">
              {GUIDE_LINKS.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  Start Recording
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-muted-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ScreenFlow. All rights reserved.</p>
          <p>Record privately — everything stays on your device.</p>
        </div>
      </div>
    </footer>
  );
}
