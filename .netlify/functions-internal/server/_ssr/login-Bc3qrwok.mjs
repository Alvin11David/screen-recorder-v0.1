import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/@paper-design/shaders-react+[...].mjs";
import { n as useAuth } from "./use-auth-DJQ4K-sd.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as Mail, L as LogIn, Q as EyeOff, R as Lock, Z as Eye, lt as CircleAlert, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as SocialLoginButtons, t as AuthLayout } from "./SocialLoginButtons-C_vaKHEI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Bc3qrwok.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const { login, isLoading } = useAuth();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [remember, setRemember] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [focusedField, setFocusedField] = (0, import_react.useState)(null);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		if (!email.trim()) {
			setError("Email is required.");
			return;
		}
		if (!password) {
			setError("Password is required.");
			return;
		}
		const err = await login(email, password);
		if (err) setError(err);
		else navigate({ to: "/" });
	};
	const handleOAuthSuccess = () => navigate({ to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLayout, {
		title: "Welcome back",
		subtitle: "Sign in to your account to continue recording.",
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"Don't have an account?",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/register",
				className: "text-primary hover:underline font-medium",
				children: "Sign up"
			})
		] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "flex flex-col gap-5",
			children: [
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm ring-1 ring-destructive/20 animate-in fade-in slide-in-from-top-2 duration-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-destructive-foreground/90 leading-snug",
						children: error
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "email",
						className: "text-xs font-medium text-muted-foreground/70 tracking-wider uppercase",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "email",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							onFocus: () => setFocusedField("email"),
							onBlur: () => setFocusedField(null),
							placeholder: "you@example.com",
							autoComplete: "email",
							autoFocus: true,
							className: "input-base h-12"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "password",
							className: "text-xs font-medium text-muted-foreground/70 tracking-wider uppercase",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/forgot-password",
							className: "text-xs text-primary/70 hover:text-primary transition-colors",
							children: "Forgot?"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "password",
								type: showPassword ? "text" : "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								onFocus: () => setFocusedField("password"),
								onBlur: () => setFocusedField(null),
								placeholder: "Enter your password",
								autoComplete: "current-password",
								className: "input-base h-12 pr-10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors",
								tabIndex: -1,
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2.5 cursor-pointer group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: remember,
								onChange: (e) => setRemember(e.target.checked),
								className: "peer sr-only"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4.5 w-4.5 rounded-[4px] border border-border/60 bg-white/[0.04] transition-all duration-200 peer-checked:bg-gradient-primary peer-checked:border-primary/60 group-hover:border-border/90" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 12 12",
								className: "absolute h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M2.5 6L5 8.5L9.5 3",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors select-none",
						children: "Remember me"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: isLoading,
					className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_oklch(1_0_0/6%),0_0_30px_-8px_oklch(0.74_0.15_222/50%)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[var(--shadow-glow)]",
					children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), isLoading ? "Signing in..." : "Sign in"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLoginButtons, { onSuccess: handleOAuthSuccess })
			]
		})
	});
}
//#endregion
export { LoginPage as component };
