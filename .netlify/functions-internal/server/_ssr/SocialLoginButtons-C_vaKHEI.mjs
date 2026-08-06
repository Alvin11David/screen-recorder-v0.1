import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, n as liquidMetalPresets, r as require_jsx_runtime, t as LiquidMetal } from "../_libs/@paper-design/shaders-react+[...].mjs";
import { n as useAuth } from "./use-auth-DJQ4K-sd.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getGitHubAuthUrl } from "./github-auth-VMEoFI45.mjs";
import { s as Video } from "../_libs/lucide-react.mjs";
import { n as getGoogleAuthUrl } from "./google-auth-BaQiYv-4.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SocialLoginButtons-C_vaKHEI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) { t+=a*noise(p); p*=2.*m; a*=.5; }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a); d=a; p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`;
function AnimatedShaderHero({ children, className = "" }) {
	const canvasRef = (0, import_react.useRef)(null);
	const animRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const dpr = Math.max(1, .5 * window.devicePixelRatio);
		const gl = canvas.getContext("webgl2");
		if (!gl) return;
		const vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
		const compile = (shader, source) => {
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
		};
		const vs = gl.createShader(gl.VERTEX_SHADER);
		const fs = gl.createShader(gl.FRAGMENT_SHADER);
		compile(vs, vertexSrc);
		compile(fs, defaultShaderSource);
		const program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			1,
			-1,
			-1,
			1,
			1,
			1,
			-1
		]), gl.STATIC_DRAW);
		const position = gl.getAttribLocation(program, "position");
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
		const uResolution = gl.getUniformLocation(program, "resolution");
		const uTime = gl.getUniformLocation(program, "time");
		const resize = () => {
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			gl.viewport(0, 0, canvas.width * dpr, canvas.height * dpr);
		};
		resize();
		window.addEventListener("resize", resize);
		const loop = (now) => {
			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.useProgram(program);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.uniform2f(uResolution, canvas.width, canvas.height);
			gl.uniform1f(uTime, now * .001);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			animRef.current = requestAnimationFrame(loop);
		};
		animRef.current = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(animRef.current);
			window.removeEventListener("resize", resize);
			gl.deleteProgram(program);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative w-full h-screen overflow-hidden bg-black ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "absolute inset-0 w-full h-full touch-none",
			style: { background: "black" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 z-10 overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-full items-center justify-center",
				children
			})
		})]
	});
}
function LiquidMetalBackground({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative min-h-screen overflow-hidden ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiquidMetal, {
				...liquidMetalPresets[2],
				style: {
					width: "100%",
					height: "100%"
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 flex items-center justify-center min-h-screen",
			children
		})]
	});
}
var backgrounds = {
	shader: AnimatedShaderHero,
	"liquid-metal": LiquidMetalBackground
};
function AuthLayout({ title, subtitle, children, footer, background = "shader" }) {
	const Bg = backgrounds[background];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bg, {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 pointer-events-none overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-primary opacity-10 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-primary opacity-10 blur-[120px]" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex flex-col items-center justify-center gap-8 w-full max-w-md px-4 py-12",
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
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground/80",
								children: subtitle
							})
						]
					}), children]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground/70 hero-fade-in-up",
					style: { animationDelay: "0.4s" },
					children: footer
				})
			]
		})]
	});
}
var PROVIDERS = [
	{
		id: "google",
		label: "Google",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: "h-5 w-5",
			fill: "none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
					fill: "#4285F4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
					fill: "#34A853"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
					fill: "#FBBC05"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
					fill: "#EA4335"
				})
			]
		})
	},
	{
		id: "github",
		label: "GitHub",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			className: "h-5 w-5",
			fill: "currentColor",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" })
		})
	},
	{
		id: "microsoft",
		label: "Microsoft",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: "h-5 w-5",
			fill: "none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "2",
					y: "2",
					width: "9",
					height: "9",
					rx: "1",
					fill: "#F25022"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "13",
					y: "2",
					width: "9",
					height: "9",
					rx: "1",
					fill: "#7FBA00"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "2",
					y: "13",
					width: "9",
					height: "9",
					rx: "1",
					fill: "#00A4EF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "13",
					y: "13",
					width: "9",
					height: "9",
					rx: "1",
					fill: "#FFB900"
				})
			]
		})
	}
];
function SocialLoginButtons({ onSuccess }) {
	const { loginWithOAuth, isLoading } = useAuth();
	const [error, setError] = (0, import_react.useState)(null);
	const handleClick = async (provider) => {
		setError(null);
		if (provider.id === "github" || provider.id === "google") {
			try {
				const url = provider.id === "github" ? getGitHubAuthUrl(window.location.origin) : getGoogleAuthUrl(window.location.origin);
				window.location.href = url;
			} catch (err) {
				setError(err instanceof Error ? err.message : `Failed to initiate ${provider.label} sign in.`);
			}
			return;
		}
		const err = await loginWithOAuth(provider.id);
		if (err) setError(err);
		else onSuccess?.();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border/40" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-transparent px-3 text-xs text-muted-foreground/40",
						children: "or continue with"
					})
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-destructive/80 text-center",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2.5",
				children: PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: isLoading,
					onClick: () => handleClick(provider),
					className: cn("flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200", "bg-white/[0.04] hover:bg-white/[0.09] active:bg-white/[0.12]", "ring-1 ring-border/40 hover:ring-border/70", "disabled:opacity-50 disabled:cursor-not-allowed", "group"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "opacity-70 group-hover:opacity-100 transition-opacity",
						children: provider.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground/70 group-hover:text-foreground transition-colors hidden sm:inline",
						children: provider.label
					})]
				}, provider.id))
			})
		]
	});
}
//#endregion
export { SocialLoginButtons as n, AuthLayout as t };
