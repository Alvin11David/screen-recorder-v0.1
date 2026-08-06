import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/@paper-design/shaders-react+[...].mjs";
import { n as useAuth } from "./use-auth-DJQ4K-sd.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as Mail, R as Lock, U as KeyRound, bt as ArrowLeft, lt as CircleAlert, n as Zap, s as Video, yt as ArrowRight, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-B1q22DpY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AetherFlowHero = ({ children }) => {
	const canvasRef = import_react.useRef(null);
	import_react.useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		let animationFrameId;
		let particles = [];
		const mouse = {
			x: null,
			y: null,
			radius: 200
		};
		class Particle {
			x;
			y;
			directionX;
			directionY;
			size;
			color;
			constructor(x, y, directionX, directionY, size, color) {
				this.x = x;
				this.y = y;
				this.directionX = directionX;
				this.directionY = directionY;
				this.size = size;
				this.color = color;
			}
			draw() {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
				ctx.fillStyle = this.color;
				ctx.fill();
			}
			update() {
				if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
				if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
				if (mouse.x !== null && mouse.y !== null) {
					const dx = mouse.x - this.x;
					const dy = mouse.y - this.y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					if (distance < mouse.radius + this.size) {
						const forceDirectionX = dx / distance;
						const forceDirectionY = dy / distance;
						const force = (mouse.radius - distance) / mouse.radius;
						this.x -= forceDirectionX * force * 5;
						this.y -= forceDirectionY * force * 5;
					}
				}
				this.x += this.directionX;
				this.y += this.directionY;
				this.draw();
			}
		}
		function init() {
			particles = [];
			const w = canvas.width;
			const h = canvas.height;
			const numberOfParticles = h * w / 9e3;
			for (let i = 0; i < numberOfParticles; i++) {
				const size = Math.random() * 2 + 1;
				const x = Math.random() * (w - size * 2) + size * 2;
				const y = Math.random() * (h - size * 2) + size * 2;
				const directionX = Math.random() * .4 - .2;
				const directionY = Math.random() * .4 - .2;
				particles.push(new Particle(x, y, directionX, directionY, size, "rgba(191, 128, 255, 0.8)"));
			}
		}
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			init();
		};
		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();
		const connect = () => {
			for (let a = 0; a < particles.length; a++) for (let b = a; b < particles.length; b++) {
				const distance = (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) + (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y);
				if (distance < canvas.width / 7 * (canvas.height / 7)) {
					const opacityValue = 1 - distance / 2e4;
					const dxMouseA = particles[a].x - (mouse.x ?? 0);
					const dyMouseA = particles[a].y - (mouse.y ?? 0);
					const distanceMouseA = Math.sqrt(dxMouseA * dxMouseA + dyMouseA * dyMouseA);
					if (mouse.x !== null && distanceMouseA < mouse.radius) ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
					else ctx.strokeStyle = `rgba(200, 150, 255, ${opacityValue})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(particles[a].x, particles[a].y);
					ctx.lineTo(particles[b].x, particles[b].y);
					ctx.stroke();
				}
			}
		};
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
			for (let i = 0; i < particles.length; i++) particles[i].update();
			connect();
		};
		const handleMouseMove = (event) => {
			mouse.x = event.clientX;
			mouse.y = event.clientY;
		};
		const handleMouseOut = () => {
			mouse.x = null;
			mouse.y = null;
		};
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseout", handleMouseOut);
		init();
		animate();
		return () => {
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseout", handleMouseOut);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);
	const fadeUpVariants = {
		hidden: {
			opacity: 0,
			y: 20
		},
		visible: (i) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * .2 + .5,
				duration: .8,
				ease: "easeInOut"
			}
		})
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-screen w-full flex flex-col items-center justify-center overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "absolute top-0 left-0 w-full h-full"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 w-full",
			children: children ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						custom: 0,
						variants: fadeUpVariants,
						initial: "hidden",
						animate: "visible",
						className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-gray-200",
							children: "Dynamic Rendering Engine"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
						custom: 1,
						variants: fadeUpVariants,
						initial: "hidden",
						animate: "visible",
						className: "text-5xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400",
						children: "Aether Flow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						custom: 2,
						variants: fadeUpVariants,
						initial: "hidden",
						animate: "visible",
						className: "max-w-2xl mx-auto text-lg text-gray-400 mb-10",
						children: "An intelligent, adaptive framework for creating fluid digital experiences that feel alive and respond to user interaction in real-time."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						custom: 3,
						variants: fadeUpVariants,
						initial: "hidden",
						animate: "visible",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 mx-auto",
							children: ["Explore the Engine", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5" })]
						})
					})
				]
			})
		})]
	});
};
function ForgotPasswordPage() {
	const navigate = useNavigate();
	const { sendResetLink, verifyResetCode, resetPassword, isLoading } = useAuth();
	const [email, setEmail] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)([
		"",
		"",
		"",
		""
	]);
	const [codeError, setCodeError] = (0, import_react.useState)(null);
	const [verifying, setVerifying] = (0, import_react.useState)(false);
	const [codeVerified, setCodeVerified] = (0, import_react.useState)(false);
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [resetError, setResetError] = (0, import_react.useState)(null);
	const [resetting, setResetting] = (0, import_react.useState)(false);
	const inputRefs = (0, import_react.useRef)([]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		if (!email.trim()) {
			setError("Email is required.");
			return;
		}
		const err = await sendResetLink(email);
		if (err) setError(err);
		else setSent(true);
	};
	const handleCodeChange = (index, value) => {
		if (!/^\d*$/.test(value)) return;
		const newCode = [...code];
		newCode[index] = value.slice(-1);
		setCode(newCode);
		setCodeError(null);
		if (value && index < 3) inputRefs.current[index + 1]?.focus();
	};
	const handleCodeKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
	};
	const handleCodePaste = (e) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
		const newCode = [...code];
		for (let i = 0; i < 4; i++) newCode[i] = pasted[i] || "";
		setCode(newCode);
		const nextIndex = Math.min(pasted.length, 3);
		inputRefs.current[nextIndex]?.focus();
	};
	const handleVerifyCode = async () => {
		const fullCode = code.join("");
		if (fullCode.length !== 4) {
			setCodeError("Please enter the full 4-digit code.");
			return;
		}
		setVerifying(true);
		setCodeError(null);
		const err = await verifyResetCode(email, fullCode);
		setVerifying(false);
		if (err) {
			setCodeError(err);
			return;
		}
		setCodeVerified(true);
	};
	const handleResetPassword = async () => {
		if (newPassword.length < 6) {
			setResetError("Password must be at least 6 characters.");
			return;
		}
		setResetting(true);
		setResetError(null);
		const err = await resetPassword(email, code.join(""), newPassword);
		setResetting(false);
		if (err) {
			setResetError(err);
			return;
		}
		navigate({ to: "/login" });
	};
	const handleSendAgain = () => {
		setSent(false);
		setCode([
			"",
			"",
			"",
			""
		]);
		setCodeError(null);
		sendResetLink(email);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AetherFlowHero, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 pointer-events-none overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-primary opacity-10 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-primary opacity-10 blur-[120px]" })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 flex flex-col items-center justify-center gap-8 w-full max-w-md px-4 py-12 min-h-screen mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2.5 hero-fade-in-down group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-[var(--shadow-glow)] ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-5 w-5 text-primary-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg font-bold tracking-tight text-white/90 group-hover:text-white transition-colors duration-300",
					children: "ScreenFlow"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong card-border-glow w-full rounded-2xl p-7 md:p-9 hero-fade-in-up",
				style: { animationDelay: "0.2s" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-7 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-3 h-1 w-10 rounded-full bg-gradient-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-foreground",
							children: sent ? "Check your inbox" : "Reset your password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground/80",
							children: sent ? `Enter the 4-digit code sent to ${email}` : "Enter your email and we'll send you a reset code."
						})
					]
				}), codeVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-5 py-2 animate-in fade-in duration-300",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-7 w-7 text-emerald-500" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-emerald-500 font-medium",
							children: "Code verified"
						}),
						resetError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm ring-1 ring-destructive/20 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-destructive-foreground/90 leading-snug",
								children: resetError
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1.5 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "new-password",
								className: "text-xs font-medium text-muted-foreground/70 tracking-wider uppercase",
								children: "New password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "new-password",
										type: showPassword ? "text" : "password",
										value: newPassword,
										onChange: (e) => setNewPassword(e.target.value),
										placeholder: "At least 6 characters",
										autoComplete: "new-password",
										className: "input-base h-12 pr-10"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPassword(!showPassword),
										className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors",
										tabIndex: -1,
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleResetPassword,
							disabled: resetting,
							className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
							children: [resetting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" }), resetting ? "Resetting..." : "Reset password"]
						})
					]
				}) : sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-6 py-2 animate-in fade-in duration-300",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary/20 ring-1 ring-primary/30 shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/40%)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-7 w-7 text-primary" })
						}),
						codeError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3.5 text-sm ring-1 ring-destructive/20 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-destructive-foreground/90 leading-snug",
								children: codeError
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3",
							onPaste: handleCodePaste,
							children: code.map((digit, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: (el) => {
									inputRefs.current[i] = el;
								},
								type: "text",
								inputMode: "numeric",
								maxLength: 1,
								value: digit,
								onChange: (e) => handleCodeChange(i, e.target.value),
								onKeyDown: (e) => handleCodeKeyDown(i, e),
								className: "h-14 w-12 rounded-xl bg-white/[0.04] text-center text-xl font-semibold text-foreground ring-1 ring-border/50 outline-none transition-all focus:ring-2 focus:ring-primary/50 focus:bg-white/[0.06]"
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleVerifyCode,
								disabled: verifying,
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_oklch(1_0_0/6%),0_0_30px_-8px_oklch(0.74_0.15_222/50%)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[var(--shadow-glow)]",
								children: [verifying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" }), verifying ? "Verifying..." : "Verify code"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleSendAgain,
								className: "text-xs text-primary/70 hover:text-primary transition-colors",
								children: "Send again"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
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
								htmlFor: "reset-email",
								className: "text-xs font-medium text-muted-foreground/70 tracking-wider uppercase",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "reset-email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "you@example.com",
									autoComplete: "email",
									autoFocus: true,
									className: "input-base h-12"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: isLoading,
							className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_0_1px_oklch(1_0_0/6%),0_0_30px_-8px_oklch(0.74_0.15_222/50%)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[var(--shadow-glow)]",
							children: [isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }), isLoading ? "Sending..." : "Send reset code"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground/50 hero-fade-in-up",
				style: { animationDelay: "0.4s" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/login",
					className: "inline-flex items-center gap-1.5 text-primary hover:underline font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Back to sign in"]
				})
			})
		]
	})] });
}
//#endregion
export { ForgotPasswordPage as component };
