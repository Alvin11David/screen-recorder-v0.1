import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/@paper-design/shaders-react+[...].mjs";
import { n as useAuth } from "./use-auth-DJQ4K-sd.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./callback-Cqck-wfZ.mjs";
import { t as exchangeGitHubCode } from "./github-auth-VMEoFI45.mjs";
import { ct as CircleCheck, lt as CircleAlert, z as LoaderCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/callback-DWzlTxyr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GitHubCallbackPage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const { register: _, ...auth } = useAuth();
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const { code, state } = search;
		if (!code) {
			setStatus("error");
			setError("No authorization code received from GitHub.");
			return;
		}
		const savedState = sessionStorage.getItem("github_oauth_state");
		sessionStorage.removeItem("github_oauth_state");
		if (state && savedState && state !== savedState) {
			setStatus("error");
			setError("State mismatch — authentication was rejected for security.");
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const user = await exchangeGitHubCode({ data: code });
				if (cancelled) return;
				localStorage.setItem("sc-auth-user", JSON.stringify(user));
				localStorage.setItem("sc-auth-token", user.token);
				setStatus("success");
				await new Promise((r) => setTimeout(r, 800));
				if (!cancelled) navigate({ to: "/" });
			} catch (err) {
				if (cancelled) return;
				setStatus("error");
				setError(err instanceof Error ? err.message : "Authentication failed.");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [search, navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 text-center max-w-sm px-4",
			children: [
				status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-7 w-7 animate-spin text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Completing GitHub sign in…"
				})] }),
				status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-7 w-7 text-emerald-500" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-emerald-500 font-medium",
					children: "Signed in successfully!"
				})] }),
				status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-7 w-7 text-destructive" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive font-medium",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({ to: "/login" }),
						className: "mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]",
						children: "Back to sign in"
					})
				] })
			]
		})
	});
}
//#endregion
export { GitHubCallbackPage as component };
