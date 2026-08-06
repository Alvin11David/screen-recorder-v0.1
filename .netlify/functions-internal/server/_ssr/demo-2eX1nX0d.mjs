import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, n as liquidMetalPresets, r as require_jsx_runtime, t as LiquidMetal } from "../_libs/@paper-design/shaders-react+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-MDIfryYM.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-2eX1nX0d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
function LiquidMetalHero({ badge, title, subtitle, primaryCtaLabel, secondaryCtaLabel, onPrimaryCtaClick, onSecondaryCtaClick, features = [] }) {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: .2,
				staggerChildren: .15
			}
		}
	};
	const itemVariants = {
		hidden: {
			opacity: 0,
			y: 30
		},
		visible: {
			opacity: 1,
			y: 0
		}
	};
	const buttonVariants = {
		hidden: {
			opacity: 0,
			scale: .9
		},
		visible: {
			opacity: 1,
			scale: 1
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-screen flex items-center justify-center overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiquidMetal, {
			...liquidMetalPresets[2],
			style: {
				position: "fixed",
				inset: 0,
				zIndex: -10
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container mx-auto px-6 lg:px-8 max-w-7xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				className: "text-center space-y-8",
				variants: containerVariants,
				initial: "hidden",
				animate: "visible",
				transition: {
					duration: .8,
					ease: [
						.25,
						.1,
						.25,
						1
					]
				},
				children: [
					badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "flex justify-center",
						variants: itemVariants,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "bg-foreground/10 text-foreground border-foreground/20 hover:bg-foreground/20 transition-colors duration-300 backdrop-blur-sm",
							children: badge
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						className: "space-y-6",
						variants: itemVariants,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
							role: "heading",
							"aria-level": 1,
							className: "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-tight tracking-tight",
							variants: itemVariants,
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
							className: "max-w-3xl mx-auto text-xl sm:text-2xl text-foreground/90 leading-relaxed",
							variants: itemVariants,
							children: subtitle
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						className: "flex flex-col sm:flex-row gap-4 justify-center items-center",
						variants: buttonVariants,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							whileHover: { scale: 1.05 },
							whileTap: { scale: .95 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: onPrimaryCtaClick,
								size: "lg",
								className: "bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 shadow-2xl text-lg px-8 py-6 font-semibold",
								children: primaryCtaLabel
							})
						}), secondaryCtaLabel && onSecondaryCtaClick && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							whileHover: { scale: 1.05 },
							whileTap: { scale: .95 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: onSecondaryCtaClick,
								variant: "outline",
								size: "lg",
								className: "border-foreground/30 text-foreground hover:bg-foreground/10 hover:border-foreground/50 transition-all duration-300 backdrop-blur-sm text-lg px-8 py-6 font-semibold",
								children: secondaryCtaLabel
							})
						})]
					}),
					features.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "pt-12",
						variants: itemVariants,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							whileHover: { y: -4 },
							transition: { duration: .3 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "bg-foreground/10 border-foreground/20 backdrop-blur-md shadow-2xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 md:grid-cols-3 gap-6",
										children: features.map((feature, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
											className: "flex items-center justify-center text-center",
											initial: {
												opacity: 0,
												x: -20
											},
											animate: {
												opacity: 1,
												x: 0
											},
											transition: {
												duration: .6,
												delay: .8 + index * .1
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-foreground/90 font-medium text-lg",
												children: feature
											})
										}, index))
									})
								})
							})
						})
					})
				]
			})
		})]
	});
}
function LiquidMetalHeroDemo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiquidMetalHero, {
		badge: "Next Generation UI",
		title: "Fluid Design Excellence",
		subtitle: "Experience the future of web interfaces with liquid metal aesthetics that adapt, flow, and captivate. Built for modern applications that demand both beauty and performance.",
		primaryCtaLabel: "Start Building",
		secondaryCtaLabel: "View Examples",
		onPrimaryCtaClick: () => alert("Primary CTA clicked!"),
		onSecondaryCtaClick: () => alert("Secondary CTA clicked!"),
		features: [
			"Seamless Animations",
			"Responsive Excellence",
			"Modern Architecture"
		]
	});
}
//#endregion
export { LiquidMetalHeroDemo as component };
