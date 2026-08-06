import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/@paper-design/shaders-react+[...].mjs";
import { t as AuthProvider } from "./use-auth-DJQ4K-sd.mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$15 } from "./callback-Cqck-wfZ.mjs";
import { A as MousePointer2, B as Lightbulb, F as Mic, J as Globe, N as MonitorPlay, S as Scissors, W as Infinity$1, X as Film, Y as Gauge, _t as BadgeCheck, c as Users, gt as Ban, i as Wifi, j as Monitor, mt as Camera, n as Zap, r as X, s as Video, tt as Download, v as Sparkles, x as Settings2, y as ShieldCheck, yt as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as Route$16 } from "./callback-CGA-qVa3.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-MIcitewU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CKtwsNlH.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var PERKS = [
	{
		icon: Monitor,
		text: "Opens as a native window"
	},
	{
		icon: Wifi,
		text: "Works fully offline"
	},
	{
		icon: Zap,
		text: "Faster launch, no browser UI"
	}
];
function PwaInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(null);
	const [show, setShow] = (0, import_react.useState)(false);
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	const [installing, setInstalling] = (0, import_react.useState)(false);
	const [installed, setInstalled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(display-mode: standalone)").matches) return;
		const handler = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setTimeout(() => setShow(true), 3e3);
		};
		window.addEventListener("beforeinstallprompt", handler);
		const installedHandler = () => setInstalled(true);
		window.addEventListener("appinstalled", installedHandler);
		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
			window.removeEventListener("appinstalled", installedHandler);
		};
	}, []);
	const handleInstall = async () => {
		if (!deferredPrompt) return;
		setInstalling(true);
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			setDeferredPrompt(null);
			setInstalled(true);
		}
		setInstalling(false);
		setShow(false);
	};
	const handleDismiss = () => {
		setDismissed(true);
		setShow(false);
	};
	if (installed || dismissed) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: show && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 24,
			scale: .96
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		exit: {
			opacity: 0,
			y: 16,
			scale: .97
		},
		transition: {
			type: "spring",
			stiffness: 340,
			damping: 28
		},
		className: "fixed bottom-6 right-6 z-[9998] w-[320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 rounded-3xl bg-[radial-gradient(ellipse,oklch(0.74_0.15_222/0.15)_0%,transparent_70%)] blur-xl pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative rounded-2xl bg-[oklch(0.14_0.025_264/0.95)] backdrop-blur-2xl ring-1 ring-white/[0.1] shadow-[0_24px_64px_-16px_oklch(0_0_0/0.7),0_0_0_1px_oklch(1_0_0/0.05)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[2px] w-full rounded-t-2xl bg-gradient-to-r from-transparent via-[oklch(0.74_0.15_222)] to-transparent opacity-60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.74_0.15_222)] to-[oklch(0.72_0.16_200)] shadow-[0_0_20px_oklch(0.74_0.15_222/0.35)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-white leading-tight",
								children: "Install ScreenFlow"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-white/40 mt-0.5",
								children: "Add to your desktop"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleDismiss,
							className: "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/25 transition-all hover:bg-white/[0.07] hover:text-white/60",
							"aria-label": "Dismiss",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 space-y-2",
						children: PERKS.map(({ icon: Icon, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[oklch(0.74_0.15_222/0.15)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3 text-[oklch(0.74_0.15_222)]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-white/50",
								children: text
							})]
						}, text))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-4 h-px bg-white/[0.05]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleInstall,
							disabled: installing,
							className: "relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[oklch(0.74_0.15_222)] to-[oklch(0.72_0.16_200)] py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_oklch(0.74_0.15_222/0.3)] transition-all hover:shadow-[0_0_28px_oklch(0.74_0.15_222/0.45)] hover:brightness-110 active:scale-[0.98] disabled:opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), installing ? "Installing…" : "Install App"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleDismiss,
							className: "rounded-xl bg-white/[0.05] px-4 py-2.5 text-sm text-white/40 ring-1 ring-white/[0.07] transition-all hover:bg-white/[0.08] hover:text-white/60",
							children: "Later"
						})]
					})
				]
			})]
		})]
	}) });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: ({ match, matches }) => {
		const siteUrl = "https://screenflow26.netlify.app";
		const leafMatch = matches[matches.length - 1] ?? match;
		const canonicalUrl = `${siteUrl}${leafMatch.pathname === "/" ? "/" : leafMatch.pathname.replace(/\/$/, "")}`;
		const ogImage = `${siteUrl}/og-image.png`;
		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1"
				},
				{ title: "ScreenFlow — High-Quality Browser Screen Recorder" },
				{
					name: "description",
					content: "Record your screen in stunning HD, Full HD and 4K directly in your browser and save it locally. No installs, no watermarks."
				},
				{
					name: "author",
					content: "ScreenFlow"
				},
				{
					property: "og:title",
					content: "ScreenFlow — Record Your Screen in 4K"
				},
				{
					property: "og:description",
					content: "Record your screen in HD, Full HD and 4K directly in your browser and save it locally. No installs, no watermarks."
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:url",
					content: canonicalUrl
				},
				{
					property: "og:image",
					content: ogImage
				},
				{
					property: "og:image:width",
					content: "1200"
				},
				{
					property: "og:image:height",
					content: "630"
				},
				{
					property: "og:image:alt",
					content: "ScreenFlow — Record your screen in 4K"
				},
				{
					property: "og:site_name",
					content: "ScreenFlow"
				},
				{
					property: "og:locale",
					content: "en_US"
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: "ScreenFlow — Record Your Screen in 4K"
				},
				{
					name: "twitter:description",
					content: "Record your screen in HD, Full HD and 4K directly in your browser and save it locally. No installs, no watermarks."
				},
				{
					name: "twitter:image",
					content: ogImage
				},
				{
					name: "twitter:site",
					content: "@ScreenFlow"
				},
				{
					name: "theme-color",
					content: "#0f0f1a"
				},
				{
					name: "apple-mobile-web-app-capable",
					content: "yes"
				},
				{
					name: "apple-mobile-web-app-status-bar-style",
					content: "black-translucent"
				},
				{
					name: "mobile-web-app-capable",
					content: "yes"
				}
			],
			links: [
				{
					rel: "canonical",
					href: canonicalUrl
				},
				{
					rel: "manifest",
					href: "/manifest.webmanifest"
				},
				{
					rel: "icon",
					type: "image/x-icon",
					href: "/favicon.ico"
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "192x192",
					href: "/pwa-192x192.png"
				},
				{
					rel: "apple-touch-icon",
					href: "/pwa-192x192.png"
				},
				{
					rel: "preconnect",
					href: "https://fonts.googleapis.com"
				},
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossOrigin: "anonymous"
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Grotesk:wght@500;600;700&display=swap"
				},
				{
					rel: "stylesheet",
					href: styles_default
				}
			]
		};
	},
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function OfflineIndicator() {
	const [offline, setOffline] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const on = () => setOffline(false);
		const off = () => setOffline(true);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);
	if (!offline) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 bg-yellow-500/20 py-1.5 text-xs text-yellow-300 backdrop-blur-md ring-1 ring-yellow-500/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 16 16",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M1 1l14 14M1 9l2-2M13 7l2-2M4 11l2-2M10 7l2-2M7 10l2-2" })
		}), "You're offline — recordings still work and are saved locally"]
	});
}
function ServiceWorkerRegister() {
	(0, import_react.useEffect)(() => {
		if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
	}, []);
	return null;
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineIndicator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceWorkerRegister, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaInstallPrompt, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		] })
	});
}
var EXPLORE_LINKS = [
	{
		name: "Screen Recorder",
		path: "/screen-recorder"
	},
	{
		name: "Video Recorder",
		path: "/video-recorder"
	},
	{
		name: "Free Screen Recorder",
		path: "/free-screen-recorder"
	},
	{
		name: "Online Screen Recorder",
		path: "/online-screen-recorder"
	},
	{
		name: "4K Screen Recorder",
		path: "/4k-screen-recorder"
	},
	{
		name: "Webcam Recorder",
		path: "/webcam-recorder"
	}
];
var GUIDE_LINKS = [{
	name: "How to Record Your Screen",
	path: "/guides/how-to-record-your-screen"
}, {
	name: "Best Free Screen Recorders",
	path: "/guides/best-free-screen-recorders"
}];
function SeoFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-white/5 bg-black/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-6 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-10 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								width: "14",
								height: "14",
								viewBox: "0 0 24 24",
								fill: "currentColor",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V5z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "12",
									cy: "12",
									r: "2",
									fill: "oklch(0.15 0.025 264)"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm font-bold tracking-tight text-white",
							children: "ScreenFlow"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground",
						children: "Record your screen, webcam, and audio in up to 4K directly in the browser. No installs, no watermarks, no data leaving your machine."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-semibold uppercase tracking-wider text-white/70",
						children: "Recorders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2.5",
						children: EXPLORE_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.path,
							className: "text-sm text-muted-foreground transition-colors hover:text-primary",
							children: l.name
						}) }, l.path))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-semibold uppercase tracking-wider text-white/70",
						children: "Guides"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2.5",
						children: [GUIDE_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.path,
							className: "text-sm text-muted-foreground transition-colors hover:text-primary",
							children: l.name
						}) }, l.path)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "text-sm text-muted-foreground transition-colors hover:text-primary",
							children: "Start Recording"
						}) })]
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-muted-foreground/60 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ScreenFlow. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Record privately — everything stays on your device." })]
			})]
		})
	});
}
function SeoLandingLayout({ badge, h1, subtitle, ctaLabel, ctaTo = "/", features = [], steps = [], faqs = [], related = [], children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: cn("flex-1", className),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mx-auto max-w-4xl px-6 pt-20 pb-16 text-center sm:pt-28",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/70",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorPlay, { className: "h-3.5 w-3.5 text-primary" }), badge]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl",
									children: h1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
									children: subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: ctaTo,
										className: "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-7 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]",
										children: [ctaLabel, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/screen-recorder",
										className: "inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-7 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08]",
										children: "Learn more"
									})]
								})
							]
						})]
					}),
					children,
					features.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-6xl px-6 py-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Everything you need to record great video"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
							children: features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-card rounded-2xl p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 font-display text-base font-semibold text-white",
										children: f.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: f.text
									})
								]
							}, f.title))
						})]
					}),
					steps.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-5xl px-6 py-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "How it works"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3",
							children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative rounded-2xl border border-white/5 bg-white/[0.02] p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary font-display text-sm font-bold text-primary-foreground",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 font-display text-base font-semibold text-white",
										children: s.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: s.text
									})
								]
							}, s.title))
						})]
					}),
					faqs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-3xl px-6 py-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Frequently asked questions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 space-y-3",
							children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "glass-card group rounded-2xl px-6 py-5 open:pb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
									className: "flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-sm font-semibold text-white [&::-webkit-details-marker]:hidden",
									children: [f.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
											width: "16",
											height: "16",
											viewBox: "0 0 16 16",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M8 2v12M2 8h12",
												strokeLinecap: "round"
											})
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted-foreground",
									children: f.a
								})]
							}, f.q))
						})]
					}),
					related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-6xl px-6 py-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-center font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Keep exploring"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: r.path,
								className: "group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-primary/30 hover:bg-white/[0.04]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold text-white group-hover:text-primary transition-colors",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: r.description
								})]
							}, r.path))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mx-auto max-w-4xl px-6 py-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass-card relative overflow-hidden rounded-3xl p-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-primary/10" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "relative font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
									children: "Start recording in seconds"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground",
									children: "Open ScreenFlow, hit record, and capture your screen in up to 4K. Free forever — no account needed, everything stays on your device."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: ctaTo,
									className: "relative mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-8 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 active:scale-[0.98]",
									children: ctaLabel
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoFooter, {})
		]
	});
}
function SeoNav() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							width: "16",
							height: "16",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V5z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "12",
								cy: "12",
								r: "2",
								fill: "oklch(0.15 0.025 264)"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-base font-bold tracking-tight text-white",
						children: "ScreenFlow"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-white",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/screen-recorder",
							className: "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-white",
							children: "Recorder"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/guides/how-to-record-your-screen",
							className: "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-white",
							children: "Guides"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-flex h-9 items-center justify-center rounded-lg bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110",
					children: "Record now"
				})
			]
		})
	});
}
var SITE = "https://screenflow26.netlify.app";
function seoMeta(page) {
	const jsonLd = [{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [{
			"@type": "ListItem",
			position: 1,
			name: "Home",
			item: `${SITE}/`
		}, {
			"@type": "ListItem",
			position: 2,
			name: page.breadcrumbName,
			item: `${SITE}${page.path}`
		}]
	}];
	if (page.faqs && page.faqs.length > 0) jsonLd.push({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: page.faqs.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: {
				"@type": "Answer",
				text: f.a
			}
		}))
	});
	return [
		{ title: page.title },
		{
			name: "description",
			content: page.description
		},
		...jsonLd.map((data) => ({ "script:ld+json": data }))
	];
}
var Route$13 = createFileRoute("/webcam-recorder")({
	head: () => ({ meta: seoMeta({
		title: "Webcam Recorder — Record Camera Videos Online Free | ScreenFlow",
		description: "Record webcam videos online for free with ScreenFlow. Capture your camera and microphone, add your screen, and edit — all in the browser with no downloads.",
		path: "/webcam-recorder",
		breadcrumbName: "Webcam Recorder",
		faqs: [
			{
				q: "How do I record a video with my webcam?",
				a: "Open ScreenFlow, click record, and allow camera and microphone access. Your webcam feed is captured right away, and you can add a screen capture if you want to show something alongside."
			},
			{
				q: "Can I record webcam and screen at the same time?",
				a: "Yes. Use the webcam overlay while recording your screen, window, or tab — ideal for tutorial videos, product demos, and walkthroughs."
			},
			{
				q: "What quality does ScreenFlow record my webcam in?",
				a: "Your webcam records at whatever resolution your camera supports, commonly 720p or 1080p. Output video can be configured up to 4K."
			},
			{
				q: "Do I need special software to use my webcam as a recorder?",
				a: "No. ScreenFlow runs in your browser and uses your webcam through the standard MediaDevices API. There is nothing to install."
			},
			{
				q: "Are my webcam recordings private?",
				a: "Yes. Webcam footage is processed locally and saved to your device. It is never uploaded or visible to anyone else."
			}
		]
	}) }),
	component: WebcamRecorderPage
});
var FEATURES$7 = [
	{
		icon: Camera,
		title: "Crisp webcam capture",
		text: "Record your camera at full quality with automatic exposure and focus handled by your device."
	},
	{
		icon: Mic,
		title: "Voiceover with clarity",
		text: "Capture your microphone with echo cancellation and noise suppression for studio-clean audio."
	},
	{
		icon: Video,
		title: "Screen overlay",
		text: "Put your camera in a corner while recording your screen — the standard layout for tutorials."
	},
	{
		icon: Sparkles,
		title: "Virtual backdrop effects",
		text: "Blur or replace your background for a polished, distraction-free look. Privacy without a green screen."
	},
	{
		icon: Users,
		title: "Made for creators",
		text: "Ideal for YouTube, courses, meetings, and social media — no editor or encoder needed."
	},
	{
		icon: ShieldCheck,
		title: "Local-only footage",
		text: "Your camera video is recorded and saved entirely on your device. Nothing is streamed or stored online."
	}
];
var STEPS$7 = [
	{
		title: "Allow camera access",
		text: "Open ScreenFlow and grant camera and microphone permission in your browser."
	},
	{
		title: "Adjust your framing",
		text: "Enable a blurred or custom backdrop, then position yourself in the frame."
	},
	{
		title: "Record and export",
		text: "Press record, capture your video, edit if needed, and save it locally."
	}
];
function WebcamRecorderPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoLandingLayout, {
		badge: "Free Webcam Recorder",
		h1: "Webcam recorder — create camera videos online, free",
		subtitle: "ScreenFlow is a free webcam recorder that captures your camera and microphone right in the browser. Add your screen as an overlay, blur your background, edit, and download — with no installs and nothing uploaded.",
		ctaLabel: "Record with your webcam",
		features: FEATURES$7,
		steps: STEPS$7,
		related: [
			{
				name: "Video Recorder",
				path: "/video-recorder",
				description: "Record screen, webcam, and mic together."
			},
			{
				name: "Screen Recorder",
				path: "/screen-recorder",
				description: "Pair webcam overlay with screen capture."
			},
			{
				name: "Free Screen Recorder",
				path: "/free-screen-recorder",
				description: "Free recording with no watermark."
			},
			{
				name: "Online Screen Recorder",
				path: "/online-screen-recorder",
				description: "Record entirely in the browser."
			},
			{
				name: "4K Screen Recorder",
				path: "/4k-screen-recorder",
				description: "High-resolution screen capture."
			},
			{
				name: "How to Record Your Screen",
				path: "/guides/how-to-record-your-screen",
				description: "Tips for combining webcam and screen."
			}
		]
	});
}
var Route$12 = createFileRoute("/video-recorder")({
	head: () => ({ meta: seoMeta({
		title: "Video Recorder — Record Videos Online Free | ScreenFlow",
		description: "Record videos online for free: capture your screen, webcam, and microphone together in up to 4K. No software to install, no watermark, everything stays on your device.",
		path: "/video-recorder",
		breadcrumbName: "Video Recorder",
		faqs: [
			{
				q: "Can I record a video of my screen and webcam at the same time?",
				a: "Yes. ScreenFlow lets you record your screen, a specific window, or a browser tab while your webcam feed appears as an overlay. Microphone audio is captured alongside, so you can make videos like a presenter or streamer."
			},
			{
				q: "Do I need to download software to record videos?",
				a: "No. ScreenFlow is a web-based video recorder that runs in any modern browser. There is nothing to install, and it works on Windows, macOS, Linux, and ChromeOS."
			},
			{
				q: "Can I edit the video after recording?",
				a: "Yes. A built-in editor lets you trim, crop, resize, merge clips, add captions, and even add background music before you save your final video."
			},
			{
				q: "What video formats does ScreenFlow record?",
				a: "ScreenFlow records using the WebM container with the most efficient codec your browser supports, typically VP9. The file is saved locally and plays in any modern browser."
			},
			{
				q: "Is there a limit on video length?",
				a: "No. You can record as long as you need — there is no time limit and no watermark, even on the free plan."
			}
		]
	}) }),
	component: VideoRecorderPage
});
var FEATURES$6 = [
	{
		icon: MonitorPlay,
		title: "Screen + webcam + mic",
		text: "Combine all three into one video. Perfect for tutorials, product demos, and video lessons."
	},
	{
		icon: Camera,
		title: "Custom webcam framing",
		text: "Move and resize your camera feed anywhere on the canvas, or switch shapes between circle, rounded, and square."
	},
	{
		icon: Mic,
		title: "Studio-quality audio",
		text: "Built-in echo cancellation and noise suppression keep your voice clean, even in noisy rooms."
	},
	{
		icon: Scissors,
		title: "Edit before you save",
		text: "Trim the start and end, remove mistakes, merge clips, and add captions — all in the same page."
	},
	{
		icon: ShieldCheck,
		title: "Nothing leaves your device",
		text: "Recording and editing happen locally. Your raw footage is never uploaded or stored on a server."
	},
	{
		icon: Globe,
		title: "Works on any device",
		text: "Windows, macOS, Linux, and ChromeOS. All you need is a modern browser and a camera."
	}
];
var STEPS$6 = [
	{
		title: "Turn on your sources",
		text: "Select your screen or tab, enable your webcam and microphone, and position the camera overlay."
	},
	{
		title: "Press record",
		text: "A short countdown gives you time to get ready. Record for as long as you like."
	},
	{
		title: "Edit and download",
		text: "Stop, trim or caption your video, then save it locally as a WebM file."
	}
];
function VideoRecorderPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoLandingLayout, {
		badge: "Free Video Recorder",
		h1: "Record videos online — no software needed",
		subtitle: "ScreenFlow is a free video recorder that captures your screen, webcam, and microphone together in up to 4K. Record, edit, and download your video straight from the browser — no installs, no watermarks, no uploads.",
		ctaLabel: "Record a video now",
		features: FEATURES$6,
		steps: STEPS$6,
		related: [
			{
				name: "Screen Recorder",
				path: "/screen-recorder",
				description: "Capture your screen in up to 4K for free."
			},
			{
				name: "Online Screen Recorder",
				path: "/online-screen-recorder",
				description: "Record in the browser with nothing to install."
			},
			{
				name: "Webcam Recorder",
				path: "/webcam-recorder",
				description: "Record talking-head videos with your camera."
			},
			{
				name: "Free Screen Recorder",
				path: "/free-screen-recorder",
				description: "Free recording with no watermark or time limit."
			},
			{
				name: "4K Screen Recorder",
				path: "/4k-screen-recorder",
				description: "Record crisp, high-resolution video."
			},
			{
				name: "How to Record Your Screen",
				path: "/guides/how-to-record-your-screen",
				description: "Learn the steps to record professional videos."
			}
		]
	});
}
var BASE_URL = "https://screenflow26.netlify.app";
var Route$11 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				lastmod: today,
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/screen-recorder",
				lastmod: today,
				changefreq: "monthly",
				priority: "0.9"
			},
			{
				path: "/video-recorder",
				lastmod: today,
				changefreq: "monthly",
				priority: "0.9"
			},
			{
				path: "/free-screen-recorder",
				lastmod: today,
				changefreq: "monthly",
				priority: "0.9"
			},
			{
				path: "/online-screen-recorder",
				lastmod: today,
				changefreq: "monthly",
				priority: "0.9"
			},
			{
				path: "/4k-screen-recorder",
				lastmod: today,
				changefreq: "monthly",
				priority: "0.8"
			},
			{
				path: "/webcam-recorder",
				lastmod: today,
				changefreq: "monthly",
				priority: "0.8"
			},
			{
				path: "/guides/how-to-record-your-screen",
				lastmod: today,
				changefreq: "monthly",
				priority: "0.7"
			},
			{
				path: "/guides/best-free-screen-recorders",
				lastmod: today,
				changefreq: "monthly",
				priority: "0.7"
			}
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var Route$10 = createFileRoute("/screen-recorder")({
	head: () => ({ meta: seoMeta({
		title: "Screen Recorder — Record Your Screen Online Free | ScreenFlow",
		description: "Record your screen, webcam, and audio in HD up to 4K directly in your browser. Free online screen recorder with no download, no watermark, and no signup.",
		path: "/screen-recorder",
		breadcrumbName: "Screen Recorder",
		faqs: [
			{
				q: "Is ScreenFlow really free to use?",
				a: "Yes. ScreenFlow is completely free with no time limits, no watermarks, and no account required. Every feature, including 4K recording and the built-in video editor, is available at no cost."
			},
			{
				q: "Do I need to install anything to record my screen?",
				a: "No. ScreenFlow runs entirely in your browser using the standard MediaRecorder API. There is nothing to download or install — just open the page and press record."
			},
			{
				q: "Can I record my webcam and screen at the same time?",
				a: "Yes. You can record your screen, a specific tab, or a window, and overlay your webcam in a picture-in-picture style. You can also capture microphone audio with echo cancellation and noise suppression."
			},
			{
				q: "Where are my recordings saved?",
				a: "On your own device. Recordings are processed locally in your browser and saved straight to your computer. Your video never uploads to a server, so your content stays private."
			},
			{
				q: "What is the maximum recording resolution?",
				a: "ScreenFlow supports recording in HD (720p), Full HD (1080p), and 4K (2160p), depending on your display and browser capabilities. You can also record at high frame rates for smooth playback."
			}
		]
	}) }),
	component: ScreenRecorderPage
});
var FEATURES$5 = [
	{
		icon: MonitorPlay,
		title: "Full screen, window, or tab",
		text: "Capture your entire monitor, a single application window, or a browser tab — including internal audio from the tab."
	},
	{
		icon: Camera,
		title: "Webcam overlay",
		text: "Add a picture-in-picture webcam feed with adjustable size, position, and shape. Ideal for tutorials and walkthroughs."
	},
	{
		icon: Mic,
		title: "Microphone audio",
		text: "Record crisp voiceover with echo cancellation and noise suppression so your narration is always clear."
	},
	{
		icon: Film,
		title: "Built-in video editor",
		text: "Trim, merge, crop, resize, add captions, and layer background music — all without leaving your browser."
	},
	{
		icon: ShieldCheck,
		title: "Private by design",
		text: "Everything is processed locally. Your recordings never leave your device, so nothing is stored or tracked."
	},
	{
		icon: Zap,
		title: "4K at high frame rate",
		text: "Record in up to 4K resolution at smooth frame rates for professional-looking captures on any modern browser."
	}
];
var STEPS$5 = [
	{
		title: "Choose your capture area",
		text: "Click record and pick your entire screen, a window, or a browser tab. Enable your webcam and microphone if you need them."
	},
	{
		title: "Hit record",
		text: "A countdown starts so you can prepare. Record as long as you like — there is no time limit."
	},
	{
		title: "Save locally",
		text: "Stop recording, preview the result, edit it if you like, and save it to your device. It stays on your machine."
	}
];
function ScreenRecorderPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoLandingLayout, {
		badge: "Free Screen Recorder",
		h1: "Record your screen — free, online, in the browser",
		subtitle: "ScreenFlow is a free screen recorder that captures your screen, webcam, and audio in up to 4K directly in your browser. No downloads, no watermarks, and nothing is ever uploaded — your recordings stay on your device.",
		ctaLabel: "Start recording now",
		features: FEATURES$5,
		steps: STEPS$5,
		related: [
			{
				name: "Free Screen Recorder",
				path: "/free-screen-recorder",
				description: "Record for free with no watermark and no time limit."
			},
			{
				name: "Online Screen Recorder",
				path: "/online-screen-recorder",
				description: "Capture your screen in the browser — no download required."
			},
			{
				name: "4K Screen Recorder",
				path: "/4k-screen-recorder",
				description: "Record video in crisp 4K resolution."
			},
			{
				name: "Video Recorder",
				path: "/video-recorder",
				description: "Record videos with screen, webcam, and mic together."
			},
			{
				name: "Webcam Recorder",
				path: "/webcam-recorder",
				description: "Record your camera and create talking-head videos online."
			},
			{
				name: "How to Record Your Screen",
				path: "/guides/how-to-record-your-screen",
				description: "A beginner's guide to recording great screen videos."
			}
		]
	});
}
var $$splitComponentImporter$4 = () => import("./register-BOG5ZtwT.mjs");
var Route$9 = createFileRoute("/register")({
	head: () => ({ meta: [
		{ title: "Create account — ScreenFlow" },
		{
			name: "description",
			content: "Create your ScreenFlow account."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var Route$8 = createFileRoute("/online-screen-recorder")({
	head: () => ({ meta: seoMeta({
		title: "Online Screen Recorder — Record in Browser, No Download | ScreenFlow",
		description: "Record your screen online without downloading anything. Free browser-based screen recorder with webcam, mic, 4K quality, and local-only saving.",
		path: "/online-screen-recorder",
		breadcrumbName: "Online Screen Recorder",
		faqs: [
			{
				q: "Do I really not need to download anything?",
				a: "Correct. ScreenFlow is a web app that uses your browser's built-in screen capture and recording capabilities. There is no installer and no plugin — it works the moment you open the page."
			},
			{
				q: "Which browsers support online screen recording?",
				a: "ScreenFlow works in any Chromium-based browser (Chrome, Edge, Brave, Opera) and in Firefox. It uses the standard getDisplayMedia and MediaRecorder APIs."
			},
			{
				q: "Can I record sound in my browser?",
				a: "Yes. You can capture microphone audio, and when you record a browser tab you can also capture that tab's internal audio."
			},
			{
				q: "Is an online recorder slower than desktop software?",
				a: "No. Recording happens locally using your device's hardware, so performance is comparable to desktop apps. Output is saved directly to your computer at up to 4K."
			},
			{
				q: "Where is my recording uploaded?",
				a: "Nowhere. Unlike many online recorders, ScreenFlow does not upload your video to a server. Files are saved locally on your device and stay private."
			}
		]
	}) }),
	component: OnlineScreenRecorderPage
});
var FEATURES$4 = [
	{
		icon: Download,
		title: "No download or install",
		text: "Everything runs in the browser. Ideal for school computers, work machines, and locked-down devices where installing software is not possible."
	},
	{
		icon: Globe,
		title: "Works everywhere",
		text: "Use it on Windows, macOS, Linux, or ChromeOS. Nothing to update — the latest version is always a refresh away."
	},
	{
		icon: MonitorPlay,
		title: "Screen, window, or tab",
		text: "Capture any source your operating system exposes, including individual browser tabs."
	},
	{
		icon: ShieldCheck,
		title: "Local and private",
		text: "Your video never touches a server. Record, edit, and save entirely on your own machine."
	},
	{
		icon: Film,
		title: "Full editing suite",
		text: "Trim, crop, merge, add captions, and mix in music before exporting your final video."
	},
	{
		icon: Zap,
		title: "4K at high FPS",
		text: "Capture up to 4K resolution at high frame rates — the same quality you would expect from desktop software."
	}
];
var STEPS$4 = [
	{
		title: "Open the page",
		text: "Navigate to ScreenFlow in your browser. No account and no installation required."
	},
	{
		title: "Pick your sources",
		text: "Choose a screen, window, or tab and enable webcam and microphone as needed."
	},
	{
		title: "Record and download",
		text: "Press record, then save your finished video locally to your device."
	}
];
function OnlineScreenRecorderPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoLandingLayout, {
		badge: "No Download Required",
		h1: "Online screen recorder — record right in your browser",
		subtitle: "ScreenFlow is a free online screen recorder that captures your screen, webcam, and audio in up to 4K with no download and no install. Open the page, record, and save your video locally — nothing is ever uploaded.",
		ctaLabel: "Start recording online",
		features: FEATURES$4,
		steps: STEPS$4,
		related: [
			{
				name: "Screen Recorder",
				path: "/screen-recorder",
				description: "The full-featured browser recorder."
			},
			{
				name: "Free Screen Recorder",
				path: "/free-screen-recorder",
				description: "No watermark and no time limits."
			},
			{
				name: "4K Screen Recorder",
				path: "/4k-screen-recorder",
				description: "Record in crisp 4K resolution."
			},
			{
				name: "Video Recorder",
				path: "/video-recorder",
				description: "Record videos online for free."
			},
			{
				name: "Webcam Recorder",
				path: "/webcam-recorder",
				description: "Capture your camera in the browser."
			},
			{
				name: "How to Record Your Screen",
				path: "/guides/how-to-record-your-screen",
				description: "A complete beginner's guide."
			}
		]
	});
}
var $$splitComponentImporter$3 = () => import("./login-Bc3qrwok.mjs");
var Route$7 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Sign in — ScreenFlow" },
		{
			name: "description",
			content: "Sign in to your ScreenFlow account."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var Route$6 = createFileRoute("/free-screen-recorder")({
	head: () => ({ meta: seoMeta({
		title: "Free Screen Recorder — No Watermark, No Time Limit | ScreenFlow",
		description: "A 100% free screen recorder with no watermark, no time limits, and no account. Record your screen and webcam in up to 4K directly in your browser.",
		path: "/free-screen-recorder",
		breadcrumbName: "Free Screen Recorder",
		faqs: [
			{
				q: "Does the free screen recorder add a watermark?",
				a: "No. ScreenFlow never adds watermarks, on any plan — there is no paid plan. Your recordings are completely clean from start to finish."
			},
			{
				q: "Is there a recording time limit?",
				a: "No. You can record for as long as you need. There are no 5-minute caps, no hidden limits, and no prompts to upgrade."
			},
			{
				q: "Do I need to create an account to record for free?",
				a: "No. ScreenFlow works without signing up. Open the page, press record, and save your video locally to your device."
			},
			{
				q: "What quality can I record in for free?",
				a: "Every feature is free, including 4K recording, webcam overlays, microphone audio, and the built-in video editor."
			},
			{
				q: "Is a free web-based screen recorder safe to use?",
				a: "Yes. ScreenFlow records and processes video locally in your browser. Your footage never uploads to a server, so there is nothing to share or leak."
			}
		]
	}) }),
	component: FreeScreenRecorderPage
});
var FEATURES$3 = [
	{
		icon: Ban,
		title: "No watermark — ever",
		text: "Unlike other free recorders, ScreenFlow never stamps your videos with a logo or brand. Your output is clean."
	},
	{
		icon: Infinity$1,
		title: "No time limits",
		text: "Record 30 minutes or 3 hours. There is no cap on recording length, free or otherwise."
	},
	{
		icon: MonitorPlay,
		title: "Up to 4K quality",
		text: "Free access to HD, Full HD, and 4K recording with configurable frame rates."
	},
	{
		icon: ShieldCheck,
		title: "Private and local",
		text: "Everything happens in your browser. Your video is saved straight to your device and never uploaded."
	},
	{
		icon: Film,
		title: "Editor included",
		text: "Trim, crop, merge, caption, and add music — no extra paid tools required."
	},
	{
		icon: MousePointer2,
		title: "Click and cursor effects",
		text: "Highlight your cursor and clicks during recording so viewers never lose track of your actions."
	}
];
var STEPS$3 = [
	{
		title: "Open ScreenFlow",
		text: "No download, no signup, no credit card. Just open the page in your browser."
	},
	{
		title: "Choose what to capture",
		text: "Pick your whole screen, a window, or a tab. Add webcam and mic if you want them."
	},
	{
		title: "Record and save",
		text: "Press record, capture as long as you need, then save the video directly to your device."
	}
];
function FreeScreenRecorderPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoLandingLayout, {
		badge: "100% Free · No Signup",
		h1: "Free screen recorder with no watermark and no time limit",
		subtitle: "ScreenFlow is a genuinely free screen recorder. Record your screen, webcam, and audio in up to 4K directly in the browser — with no watermark, no recording time limits, and no account required.",
		ctaLabel: "Record for free",
		features: FEATURES$3,
		steps: STEPS$3,
		related: [
			{
				name: "Screen Recorder",
				path: "/screen-recorder",
				description: "The full-featured browser screen recorder."
			},
			{
				name: "Online Screen Recorder",
				path: "/online-screen-recorder",
				description: "Record in the browser — nothing to download."
			},
			{
				name: "4K Screen Recorder",
				path: "/4k-screen-recorder",
				description: "Record free 4K screen videos."
			},
			{
				name: "Webcam Recorder",
				path: "/webcam-recorder",
				description: "Free webcam recording with camera overlay."
			},
			{
				name: "Best Free Screen Recorders",
				path: "/guides/best-free-screen-recorders",
				description: "How ScreenFlow compares to other free tools."
			},
			{
				name: "Video Recorder",
				path: "/video-recorder",
				description: "Record screen, webcam, and mic together."
			}
		]
	});
}
var $$splitComponentImporter$2 = () => import("./forgot-password-B1q22DpY.mjs");
var Route$5 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [
		{ title: "Reset password — ScreenFlow" },
		{
			name: "description",
			content: "Reset your ScreenFlow password."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./demo-2eX1nX0d.mjs");
var Route$4 = createFileRoute("/demo")({
	head: () => ({ meta: [
		{ title: "Liquid Metal Hero — ScreenFlow" },
		{
			name: "description",
			content: "Preview the liquid metal hero animation."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var Route$3 = createFileRoute("/4k-screen-recorder")({
	head: () => ({ meta: seoMeta({
		title: "4K Screen Recorder — Record 4K Video Online Free | ScreenFlow",
		description: "Record your screen in crisp 4K resolution online and free. Webcam overlay, microphone audio, and a built-in editor — all in your browser with no download.",
		path: "/4k-screen-recorder",
		breadcrumbName: "4K Screen Recorder",
		faqs: [
			{
				q: "Can my browser really record in 4K?",
				a: "Yes. ScreenFlow lets you select 4K (2160p) as your output resolution. Whether your display and hardware can sustain it depends on your GPU and available resources, but modern machines handle it comfortably."
			},
			{
				q: "What is the highest resolution ScreenFlow supports?",
				a: "ScreenFlow supports 720p, 1080p, and 4K (2160p), plus high frame rates. If your screen itself is 4K, the recording is pixel-perfect."
			},
			{
				q: "Will a 4K recording be very large?",
				a: "4K footage is larger than 1080p, but ScreenFlow uses efficient codecs (typically VP9) and reasonable bitrates to keep files manageable without sacrificing quality."
			},
			{
				q: "Do I need a 4K monitor to record 4K video?",
				a: "No. You can capture a 4K browser tab or window even if your physical display is smaller, since tab capture follows the page's resolution. For full-screen capture, a 4K display helps."
			},
			{
				q: "Is 4K recording available for free?",
				a: "Yes. Every ScreenFlow feature, including 4K resolution, is free with no watermark and no time limit."
			}
		]
	}) }),
	component: UhdScreenRecorderPage
});
var FEATURES$2 = [
	{
		icon: Video,
		title: "True 4K output",
		text: "Record at 2160p for pixel-perfect captures of UHD displays, games, and design work."
	},
	{
		icon: Gauge,
		title: "High frame rates",
		text: "Choose 30 or 60 FPS so fast-moving content like gameplay stays silky smooth."
	},
	{
		icon: MonitorPlay,
		title: "Screen, window, or tab",
		text: "Capture full screen or any individual window or tab at full resolution."
	},
	{
		icon: Camera,
		title: "4K-friendly webcam overlay",
		text: "Add your camera feed on top with adjustable size and position for pro-style videos."
	},
	{
		icon: Settings2,
		title: "Advanced controls",
		text: "Fine-tune resolution, bitrate, and audio settings so you balance quality and file size."
	},
	{
		icon: ShieldCheck,
		title: "Local-only processing",
		text: "4K footage is big — that is why ScreenFlow keeps it on your device and never uploads it."
	}
];
var STEPS$2 = [
	{
		title: "Set your resolution",
		text: "Choose 4K (2160p) and your preferred frame rate before you start."
	},
	{
		title: "Pick your capture area",
		text: "Select your screen, a window, or a tab, and add webcam or mic if needed."
	},
	{
		title: "Record and save",
		text: "Capture your footage, edit if you like, then save the 4K video locally."
	}
];
function UhdScreenRecorderPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoLandingLayout, {
		badge: "Up to 4K · 60 FPS",
		h1: "4K screen recorder — capture video in ultra-high definition",
		subtitle: "ScreenFlow records your screen in true 4K (2160p) up to 60 FPS, free and online. Add a webcam overlay and microphone audio, edit in the browser, and keep your footage local — no downloads, no watermarks.",
		ctaLabel: "Record in 4K now",
		features: FEATURES$2,
		steps: STEPS$2,
		related: [
			{
				name: "Screen Recorder",
				path: "/screen-recorder",
				description: "The full-featured browser recorder."
			},
			{
				name: "Video Recorder",
				path: "/video-recorder",
				description: "Record 4K video online for free."
			},
			{
				name: "Free Screen Recorder",
				path: "/free-screen-recorder",
				description: "Free recording with no limits."
			},
			{
				name: "Online Screen Recorder",
				path: "/online-screen-recorder",
				description: "Record in the browser, no download."
			},
			{
				name: "Webcam Recorder",
				path: "/webcam-recorder",
				description: "Pair your camera with 4K screen capture."
			},
			{
				name: "How to Record Your Screen",
				path: "/guides/how-to-record-your-screen",
				description: "Settings and tips for the best quality."
			}
		]
	});
}
var $$splitComponentImporter = () => import("./routes-DIUUwU6c.mjs");
var Route$2 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ScreenFlow — Record Your Screen in 4K" },
		{
			name: "description",
			content: "Capture your screen in HD, Full HD and 4K straight from the browser and save it locally."
		},
		{ "script:ld+json": {
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			name: "ScreenFlow",
			url: "https://screenflow26.netlify.app/",
			image: "https://screenflow26.netlify.app/og-image.png",
			description: "Record your screen in HD, Full HD and 4K directly in the browser and save it locally. No installs, no watermarks, no data leaving your machine.",
			applicationCategory: "MultimediaApplication",
			operatingSystem: "Any",
			browserRequirements: "Requires a modern browser with MediaRecorder support",
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD"
			},
			featureList: [
				"4K screen recording",
				"Webcam overlay",
				"Microphone audio",
				"Built-in video editor",
				"Local-only storage"
			]
		} }
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$1 = createFileRoute("/guides/how-to-record-your-screen")({
	head: () => ({ meta: seoMeta({
		title: "How to Record Your Screen — Step-by-Step Guide | ScreenFlow",
		description: "Learn how to record your screen step by step: choose your capture area, add webcam and mic, record, and edit. Free browser-based tips for Windows, Mac, and Linux.",
		path: "/guides/how-to-record-your-screen",
		breadcrumbName: "How to Record Your Screen",
		faqs: [
			{
				q: "What do I need to record my screen?",
				a: "Just a modern browser such as Chrome, Edge, or Firefox. ScreenFlow uses your device's built-in capture capabilities, so there is no software to install and no account required."
			},
			{
				q: "Should I record my whole screen or just a window?",
				a: "For a clean, focused video, record a single window or browser tab. Whole-screen recording captures everything visible, including notifications, which can be distracting."
			},
			{
				q: "How do I record my voice at the same time?",
				a: "Enable microphone access before you start and keep your mic within a foot or two of your mouth. ScreenFlow applies noise suppression automatically for clearer audio."
			},
			{
				q: "What resolution should I use for my screen recording?",
				a: "1080p is the sweet spot for most videos — great quality without huge files. Choose 4K only when you need the extra detail, such as for design or game footage."
			},
			{
				q: "Can I edit my screen recording after recording it?",
				a: "Yes. ScreenFlow includes a built-in editor so you can trim the start and end, cut out mistakes, add captions, and merge multiple clips before saving."
			},
			{
				q: "How do I make my screen recording look professional?",
				a: "Clean your desktop first, close irrelevant tabs, plan a rough script, and add your webcam in the corner. Then trim dead time and add captions in the editor."
			}
		]
	}) }),
	component: HowToRecordYourScreenPage
});
var FEATURES$1 = [
	{
		icon: MonitorPlay,
		title: "1. Choose your capture area",
		text: "Decide between the whole screen, a single window, or a browser tab. For most tutorials a tab or window is cleaner and protects your privacy."
	},
	{
		icon: Mic,
		title: "2. Turn on your audio",
		text: "Enable your microphone for narration and, if you record a tab, capture that tab's internal audio for music or videos."
	},
	{
		icon: Camera,
		title: "3. Add your webcam",
		text: "Show yourself in a corner overlay to build trust and engagement, especially for tutorials and lessons."
	},
	{
		icon: Download,
		title: "4. Record and save",
		text: "Press record, capture your content, then stop. Preview the result and download the video to your device."
	},
	{
		icon: Scissors,
		title: "5. Trim and polish",
		text: "Use the built-in editor to cut the awkward start and end, remove mistakes, and add captions for accessibility."
	},
	{
		icon: Lightbulb,
		title: "Pro tips",
		text: "Clean your desktop, close noisy apps, plan a script, and record in a quiet room for the best results."
	}
];
var STEPS$1 = [
	{
		title: "Open ScreenFlow in your browser",
		text: "No download, no signup. Works on Windows, macOS, Linux, and ChromeOS."
	},
	{
		title: "Pick your sources",
		text: "Choose screen, window, or tab; enable microphone and webcam as needed."
	},
	{
		title: "Record, edit, and share",
		text: "Capture your video, trim and caption it in the editor, then save it locally."
	}
];
function HowToRecordYourScreenPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoLandingLayout, {
		badge: "Step-by-Step Guide",
		h1: "How to record your screen: a simple step-by-step guide",
		subtitle: "Recording your screen is easier than ever — you can do it right in your browser. This guide walks you through choosing a capture area, adding your mic and webcam, recording, and polishing the result with the built-in editor.",
		ctaLabel: "Start recording now",
		features: FEATURES$1,
		steps: STEPS$1,
		related: [
			{
				name: "Screen Recorder",
				path: "/screen-recorder",
				description: "The recorder used in this guide."
			},
			{
				name: "Video Recorder",
				path: "/video-recorder",
				description: "Combine screen, webcam, and mic."
			},
			{
				name: "Best Free Screen Recorders",
				path: "/guides/best-free-screen-recorders",
				description: "Compare ScreenFlow with other tools."
			},
			{
				name: "Webcam Recorder",
				path: "/webcam-recorder",
				description: "Add a professional webcam overlay."
			},
			{
				name: "Free Screen Recorder",
				path: "/free-screen-recorder",
				description: "Free recording with no watermark."
			},
			{
				name: "4K Screen Recorder",
				path: "/4k-screen-recorder",
				description: "Get the best possible video quality."
			}
		]
	});
}
var Route = createFileRoute("/guides/best-free-screen-recorders")({
	head: () => ({ meta: seoMeta({
		title: "Best Free Screen Recorders Compared (2026) | ScreenFlow",
		description: "We compared the best free screen recorders of 2026: features, watermarks, time limits, and privacy. See why ScreenFlow is the only one with no watermark, no limits, and local-only recording.",
		path: "/guides/best-free-screen-recorders",
		breadcrumbName: "Best Free Screen Recorders",
		faqs: [
			{
				q: "What should I look for in a free screen recorder?",
				a: "Check four things: watermarks, recording time limits, resolution options, and privacy. A good free recorder has none of the first two, supports at least 1080p, and does not upload your footage to a server."
			},
			{
				q: "Why does ScreenFlow top the list?",
				a: "ScreenFlow is the only browser recorder that is free with no watermark, no time limit, no account, and no uploads. Every feature — including 4K and the editor — is available at no cost."
			},
			{
				q: "Are free screen recorders safe to use?",
				a: "Most are, but some free tools fund themselves by processing or analyzing your footage. Choose a recorder that processes everything locally, like ScreenFlow, so your video never leaves your device."
			},
			{
				q: "What is the best screen recorder for Windows or Mac?",
				a: "For Windows, macOS, and Linux alike, ScreenFlow runs in the browser, so it works identically everywhere with no install. Hardware-accelerated, native recorders are heavier and often watermark-free only on paid plans."
			},
			{
				q: "Can I record 4K video for free?",
				a: "Very few free recorders support 4K without a watermark or paid tier. ScreenFlow records up to 4K at 60 FPS for free, in the browser."
			},
			{
				q: "What makes ScreenFlow different from the rest?",
				a: "Privacy and freedom. No watermark, no time caps, no signup, no uploads, and a full video editor — all for free. Most alternatives restrict at least one of those."
			}
		]
	}) }),
	component: BestFreeScreenRecordersPage
});
var FEATURES = [
	{
		icon: BadgeCheck,
		title: "Feature completeness",
		text: "We scored each tool on recording quality, audio, editing, and extra features — not just headline claims."
	},
	{
		icon: Ban,
		title: "No watermarks",
		text: "Free tiers that stamp your video with a logo were heavily penalized. ScreenFlow adds no watermark, ever."
	},
	{
		icon: Gauge,
		title: "No time limits",
		text: "Caps of a few minutes are common in free tools. ScreenFlow records as long as you need."
	},
	{
		icon: ShieldCheck,
		title: "Privacy first",
		text: "Tools that upload or process your footage on a server lost points. Local-only recording wins."
	},
	{
		icon: MousePointer2,
		title: "Useful extras",
		text: "Cursor highlighting, webcam overlays, and background effects were counted as bonus features."
	},
	{
		icon: MonitorPlay,
		title: "True 4K support",
		text: "We verified which tools actually deliver 4K on a free plan rather than reserving it for paid tiers."
	}
];
var STEPS = [
	{
		title: "Set the criteria",
		text: "We benchmarked watermark, time limits, resolution, privacy, and ease of use."
	},
	{
		title: "Test every tool",
		text: "Each recorder was tested in real browser sessions on both Windows and macOS."
	},
	{
		title: "Crown a winner",
		text: "ScreenFlow came out on top as the only tool free in every meaningful way."
	}
];
function BestFreeScreenRecordersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeoLandingLayout, {
		badge: "2026 Comparison",
		h1: "Best free screen recorders compared in 2026",
		subtitle: "We tested the most popular free screen recorders against the criteria that actually matter: watermarks, time limits, resolution, privacy, and editing tools. Here is how they compare — and why ScreenFlow is the only one that wins on every count.",
		ctaLabel: "Try the #1 free recorder",
		features: FEATURES,
		steps: STEPS,
		related: [
			{
				name: "Free Screen Recorder",
				path: "/free-screen-recorder",
				description: "The tool that topped our comparison."
			},
			{
				name: "Screen Recorder",
				path: "/screen-recorder",
				description: "Every feature, free and unlimited."
			},
			{
				name: "Online Screen Recorder",
				path: "/online-screen-recorder",
				description: "No download means no install worries."
			},
			{
				name: "How to Record Your Screen",
				path: "/guides/how-to-record-your-screen",
				description: "Step-by-step recording guide."
			},
			{
				name: "4K Screen Recorder",
				path: "/4k-screen-recorder",
				description: "4K free, no watermark, no limits."
			},
			{
				name: "Video Recorder",
				path: "/video-recorder",
				description: "Screen, webcam, and mic together."
			}
		]
	});
}
var WebcamRecorderRoute = Route$13.update({
	id: "/webcam-recorder",
	path: "/webcam-recorder",
	getParentRoute: () => Route$14
});
var VideoRecorderRoute = Route$12.update({
	id: "/video-recorder",
	path: "/video-recorder",
	getParentRoute: () => Route$14
});
var SitemapDotxmlRoute = Route$11.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$14
});
var ScreenRecorderRoute = Route$10.update({
	id: "/screen-recorder",
	path: "/screen-recorder",
	getParentRoute: () => Route$14
});
var RegisterRoute = Route$9.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$14
});
var OnlineScreenRecorderRoute = Route$8.update({
	id: "/online-screen-recorder",
	path: "/online-screen-recorder",
	getParentRoute: () => Route$14
});
var LoginRoute = Route$7.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$14
});
var FreeScreenRecorderRoute = Route$6.update({
	id: "/free-screen-recorder",
	path: "/free-screen-recorder",
	getParentRoute: () => Route$14
});
var ForgotPasswordRoute = Route$5.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$14
});
var DemoRoute = Route$4.update({
	id: "/demo",
	path: "/demo",
	getParentRoute: () => Route$14
});
var R4kScreenRecorderRoute = Route$3.update({
	id: "/4k-screen-recorder",
	path: "/4k-screen-recorder",
	getParentRoute: () => Route$14
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var GuidesHowToRecordYourScreenRoute = Route$1.update({
	id: "/guides/how-to-record-your-screen",
	path: "/guides/how-to-record-your-screen",
	getParentRoute: () => Route$14
});
var GuidesBestFreeScreenRecordersRoute = Route.update({
	id: "/guides/best-free-screen-recorders",
	path: "/guides/best-free-screen-recorders",
	getParentRoute: () => Route$14
});
var AuthGoogleCallbackRoute = Route$16.update({
	id: "/auth/google/callback",
	path: "/auth/google/callback",
	getParentRoute: () => Route$14
});
var rootRouteChildren = {
	IndexRoute,
	R4kScreenRecorderRoute,
	DemoRoute,
	ForgotPasswordRoute,
	FreeScreenRecorderRoute,
	LoginRoute,
	OnlineScreenRecorderRoute,
	RegisterRoute,
	ScreenRecorderRoute,
	SitemapDotxmlRoute,
	VideoRecorderRoute,
	WebcamRecorderRoute,
	GuidesBestFreeScreenRecordersRoute,
	GuidesHowToRecordYourScreenRoute,
	AuthGithubCallbackRoute: Route$15.update({
		id: "/auth/github/callback",
		path: "/auth/github/callback",
		getParentRoute: () => Route$14
	}),
	AuthGoogleCallbackRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
