import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/@paper-design/shaders-react+[...].mjs";
import { n as useAuth } from "./use-auth-DJQ4K-sd.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Expand, A as MousePointer2, C as RotateCcw, D as Pause, E as Pencil, F as Mic, G as History, H as Keyboard, J as Globe, K as Highlighter, M as MonitorUp, N as MonitorPlay, O as Music, P as Minus, R as Lock, S as Scissors, T as Play, V as Layers, X as Film, Y as Gauge, _ as Square, a as VolumeX, at as Clock, b as Settings, d as Undo2, dt as ChevronDown, et as Eraser, f as Type, ft as Check, g as Star, h as TextAlignStart, ht as Calendar, it as Crop, j as Monitor, k as Move, l as User, lt as CircleAlert, m as Timer, mt as Camera, n as Zap, nt as Diamond, o as Volume2, ot as Circle, p as Trash2, pt as Captions, q as HardDrive, r as X, rt as Crosshair, s as Video, st as CircleDot, t as ZoomIn, tt as Download, ut as ChevronUp, v as Sparkles, vt as ArrowUpRight, w as Plus, xt as AppWindow, y as ShieldCheck, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-MDIfryYM.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DIUUwU6c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUALITY_PRESETS = [
	{
		label: "720p HD",
		short: "720p",
		width: 1280,
		height: 720
	},
	{
		label: "1080p Full HD",
		short: "1080p",
		width: 1920,
		height: 1080
	},
	{
		label: "1440p QHD",
		short: "1440p",
		width: 2560,
		height: 1440
	},
	{
		label: "4K Ultra HD",
		short: "4K",
		width: 3840,
		height: 2160
	}
];
var DEFAULT_CAMERA_POSITION = {
	x: 85,
	y: 85
};
var pickMimeType = () => {
	for (const type of [
		"video/webm;codecs=vp9,opus",
		"video/webm;codecs=vp9",
		"video/webm;codecs=vp8,opus",
		"video/webm;codecs=vp8",
		"video/webm"
	]) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) return type;
	return "video/webm";
};
function useScreenRecorder() {
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [countdown, setCountdown] = (0, import_react.useState)(0);
	const [stream, setStream] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [includeAudio, setIncludeAudio] = (0, import_react.useState)(true);
	const [quality, setQuality] = (0, import_react.useState)(QUALITY_PRESETS[1]);
	const [includeCamera, setIncludeCamera] = (0, import_react.useState)(false);
	const [fps, setFps] = (0, import_react.useState)(60);
	const [noiseSuppressionEnabled, setNoiseSuppressionEnabled] = (0, import_react.useState)(false);
	const [autoStopMinutes, setAutoStopMinutes] = (0, import_react.useState)(0);
	const fpsRef = (0, import_react.useRef)(fps);
	fpsRef.current = fps;
	const noiseRef = (0, import_react.useRef)(noiseSuppressionEnabled);
	noiseRef.current = noiseSuppressionEnabled;
	const autoStopRef = (0, import_react.useRef)(autoStopMinutes);
	autoStopRef.current = autoStopMinutes;
	const [cameraStream, setCameraStream] = (0, import_react.useState)(null);
	const [cameraPosition, setCameraPosition] = (0, import_react.useState)(DEFAULT_CAMERA_POSITION);
	const [cameraSettings, setCameraSettings] = (0, import_react.useState)({
		mirrored: true,
		borderColor: "#ffffff",
		borderWidth: 3,
		shadowBlur: 20,
		radius: 70,
		shape: "circle"
	});
	const recorderRef = (0, import_react.useRef)(null);
	const chunksRef = (0, import_react.useRef)([]);
	const startTimeRef = (0, import_react.useRef)(0);
	const accumulatedRef = (0, import_react.useRef)(0);
	const timerRef = (0, import_react.useRef)(null);
	const countdownRef = (0, import_react.useRef)(null);
	const trackSettingsRef = (0, import_react.useRef)({
		width: 0,
		height: 0
	});
	const pendingStreamRef = (0, import_react.useRef)(null);
	const multiStreamsRef = (0, import_react.useRef)([]);
	const camPosRef = (0, import_react.useRef)(cameraPosition);
	camPosRef.current = cameraPosition;
	const camSetRef = (0, import_react.useRef)(cameraSettings);
	camSetRef.current = cameraSettings;
	const compositeRunning = (0, import_react.useRef)(false);
	const compositePausedRef = (0, import_react.useRef)(false);
	const compositeScreenVideo = (0, import_react.useRef)(null);
	const compositeCameraVideo = (0, import_react.useRef)(null);
	const compositeCanvas = (0, import_react.useRef)(null);
	const compositeAudioCtx = (0, import_react.useRef)(null);
	const [cropRect, setCropRect] = (0, import_react.useState)(null);
	const [multiStreams, setMultiStreams] = (0, import_react.useState)([]);
	const annotationCanvasRef = (0, import_react.useRef)(null);
	const annotationCtxRef = (0, import_react.useRef)(null);
	const [annotationsEnabled, setAnnotationsEnabled] = (0, import_react.useState)(false);
	const annotationsEnabledRef = (0, import_react.useRef)(false);
	annotationsEnabledRef.current = annotationsEnabled;
	const clearTimer = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};
	const stopRecordingRef = (0, import_react.useRef)(null);
	const startTimer = (0, import_react.useCallback)(() => {
		startTimeRef.current = Date.now();
		clearTimer();
		timerRef.current = setInterval(() => {
			const current = accumulatedRef.current + (Date.now() - startTimeRef.current) / 1e3;
			setElapsed(current);
			if (autoStopRef.current > 0 && current >= autoStopRef.current * 60) stopRecordingRef.current?.();
		}, 250);
	}, []);
	const stopComposite = (0, import_react.useCallback)(() => {
		compositeRunning.current = false;
		compositePausedRef.current = false;
		compositeScreenVideo.current?.pause();
		compositeScreenVideo.current = null;
		compositeCameraVideo.current?.pause();
		compositeCameraVideo.current = null;
		compositeCanvas.current = null;
		if (compositeAudioCtx.current) {
			compositeAudioCtx.current.close();
			compositeAudioCtx.current = null;
		}
	}, []);
	const setupAnnotationCanvas = (0, import_react.useCallback)((width, height) => {
		let canvas = annotationCanvasRef.current;
		if (!canvas) {
			canvas = document.createElement("canvas");
			annotationCanvasRef.current = canvas;
		}
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext("2d");
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		annotationCtxRef.current = ctx;
	}, []);
	const clearAnnotationCanvas = (0, import_react.useCallback)(() => {
		const ctx = annotationCtxRef.current;
		if (!ctx) return;
		const canvas = annotationCanvasRef.current;
		if (!canvas) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}, []);
	const overlayAnnotations = (0, import_react.useCallback)((ctx, w, h) => {
		const ac = annotationCanvasRef.current;
		if (!ac || !annotationsEnabledRef.current) return;
		ctx.drawImage(ac, 0, 0, w, h);
	}, []);
	(0, import_react.useCallback)((fps, drawFn, runningRef, pausedRef) => {
		const frameInterval = 1e3 / fps;
		let lastFrameTime = 0;
		const frame = (timestamp) => {
			if (!runningRef.current) return;
			if (!pausedRef.current) {
				const elapsed = timestamp - lastFrameTime;
				if (elapsed >= frameInterval) {
					lastFrameTime = timestamp - elapsed % frameInterval;
					drawFn();
				}
			}
			requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!includeCamera) {
			if (cameraStream) {
				cameraStream.getTracks().forEach((t) => t.stop());
				setCameraStream(null);
			}
			return;
		}
		let cancelled = false;
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		}).then((cs) => {
			if (!cancelled) setCameraStream(cs);
			else cs.getTracks().forEach((t) => t.stop());
		}).catch(() => {
			setIncludeCamera(false);
			setError("Camera access denied. Please allow camera permissions.");
		});
		return () => {
			cancelled = true;
		};
	}, [includeCamera]);
	const beginCapture = (0, import_react.useCallback)(async (surface) => {
		setError(null);
		if (typeof navigator === "undefined" || !navigator.mediaDevices?.getDisplayMedia) {
			setError("Screen recording isn't supported in this browser.");
			setStatus("idle");
			return;
		}
		try {
			const constraints = {
				displaySurface: surface,
				video: {
					frameRate: {
						ideal: fpsRef.current,
						max: fpsRef.current
					},
					width: { ideal: quality.width },
					height: { ideal: quality.height }
				},
				audio: includeAudio ? {
					echoCancellation: noiseRef.current,
					noiseSuppression: noiseRef.current,
					sampleRate: 44100
				} : false
			};
			const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);
			const [videoTrack] = displayStream.getVideoTracks();
			const settings = videoTrack.getSettings();
			const width = settings.width ?? quality.width;
			const height = settings.height ?? quality.height;
			trackSettingsRef.current = {
				width,
				height
			};
			if (annotationsEnabledRef.current) setupAnnotationCanvas(width, height);
			if (surface === "monitor") {
				pendingStreamRef.current = displayStream;
				setStream(displayStream);
				setStatus("crop");
				return;
			}
			if (surface === "multi-monitor") {
				multiStreamsRef.current = [displayStream];
				setMultiStreams([displayStream]);
				setStream(displayStream);
				setStatus("multi-setup");
				return;
			}
			const pixels = width * height;
			const bitrate = Math.min(Math.max(Math.round(pixels * 7), 5e6), 5e7);
			const mimeType = pickMimeType();
			let recordingStream;
			if (includeCamera && cameraStream) {
				const screenVideo = document.createElement("video");
				screenVideo.srcObject = displayStream;
				screenVideo.muted = true;
				screenVideo.playsInline = true;
				await screenVideo.play();
				const camVideo = document.createElement("video");
				camVideo.srcObject = cameraStream;
				camVideo.muted = true;
				camVideo.playsInline = true;
				await camVideo.play();
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				compositeScreenVideo.current = screenVideo;
				compositeCameraVideo.current = camVideo;
				compositeCanvas.current = canvas;
				compositeRunning.current = true;
				const frameInterval = 1e3 / fpsRef.current;
				let lastFrameTime = 0;
				const frame = (timestamp) => {
					if (!compositeRunning.current) return;
					const elapsed = timestamp - lastFrameTime;
					if (elapsed >= frameInterval) {
						lastFrameTime = timestamp - elapsed % frameInterval;
						if (!compositePausedRef.current) {
							ctx.clearRect(0, 0, width, height);
							ctx.drawImage(screenVideo, 0, 0, width, height);
							const pos = camPosRef.current;
							const set = camSetRef.current;
							const cx = pos.x / 100 * width;
							const cy = pos.y / 100 * height;
							const r = set.radius;
							ctx.save();
							ctx.beginPath();
							if (set.shape === "square") ctx.rect(cx - r, cy - r, r * 2, r * 2);
							else if (set.shape === "rounded") ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * .2);
							else ctx.arc(cx, cy, r, 0, Math.PI * 2);
							ctx.clip();
							const src = camVideo;
							const sw = r * 2;
							const sh = r * 2;
							if (set.mirrored) {
								ctx.save();
								ctx.translate(cx, 0);
								ctx.scale(-1, 1);
								ctx.drawImage(src, -(cx - r), cy - r, sw, sh);
								ctx.restore();
							} else ctx.drawImage(src, cx - r, cy - r, sw, sh);
							ctx.restore();
							ctx.save();
							ctx.shadowColor = "rgba(255,255,255,0.25)";
							ctx.shadowBlur = set.shadowBlur;
							ctx.beginPath();
							if (set.shape === "square") ctx.rect(cx - r, cy - r, r * 2, r * 2);
							else if (set.shape === "rounded") ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * .2);
							else ctx.arc(cx, cy, r, 0, Math.PI * 2);
							ctx.strokeStyle = set.borderColor;
							ctx.lineWidth = set.borderWidth;
							ctx.stroke();
							ctx.restore();
							overlayAnnotations(ctx, width, height);
						}
					}
					requestAnimationFrame(frame);
				};
				requestAnimationFrame(frame);
				const canvasStream = canvas.captureStream(fpsRef.current);
				const audioCtx = new AudioContext();
				if (audioCtx.state === "suspended") audioCtx.resume();
				compositeAudioCtx.current = audioCtx;
				const dest = audioCtx.createMediaStreamDestination();
				if (includeAudio && displayStream.getAudioTracks().length > 0) audioCtx.createMediaStreamSource(displayStream).connect(dest);
				if (cameraStream.getAudioTracks().length > 0) audioCtx.createMediaStreamSource(cameraStream).connect(dest);
				recordingStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
				setStream(recordingStream);
			} else if (annotationsEnabledRef.current) {
				const screenVideo = document.createElement("video");
				screenVideo.srcObject = displayStream;
				screenVideo.muted = true;
				screenVideo.playsInline = true;
				await screenVideo.play();
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				compositeScreenVideo.current = screenVideo;
				compositeCanvas.current = canvas;
				compositeRunning.current = true;
				const frameInterval = 1e3 / fpsRef.current;
				let lastFrameTime = 0;
				const frame = (timestamp) => {
					if (!compositeRunning.current) return;
					const elapsed = timestamp - lastFrameTime;
					if (elapsed >= frameInterval) {
						lastFrameTime = timestamp - elapsed % frameInterval;
						if (!compositePausedRef.current) {
							ctx.clearRect(0, 0, width, height);
							ctx.drawImage(screenVideo, 0, 0, width, height);
							overlayAnnotations(ctx, width, height);
						}
					}
					requestAnimationFrame(frame);
				};
				requestAnimationFrame(frame);
				const canvasStream = canvas.captureStream(fpsRef.current);
				const audioCtx = new AudioContext();
				if (audioCtx.state === "suspended") audioCtx.resume();
				compositeAudioCtx.current = audioCtx;
				const dest = audioCtx.createMediaStreamDestination();
				if (includeAudio && displayStream.getAudioTracks().length > 0) audioCtx.createMediaStreamSource(displayStream).connect(dest);
				recordingStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
				setStream(recordingStream);
			} else {
				recordingStream = displayStream;
				setStream(displayStream);
			}
			const recorder = new MediaRecorder(recordingStream, {
				mimeType,
				videoBitsPerSecond: bitrate,
				audioBitsPerSecond: 128e3
			});
			chunksRef.current = [];
			recorder.ondataavailable = (event) => {
				if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
			};
			const handleStop = () => {
				const blob = new Blob(chunksRef.current, { type: mimeType });
				setResult({
					url: URL.createObjectURL(blob),
					blob,
					durationSeconds: accumulatedRef.current,
					width: trackSettingsRef.current.width,
					height: trackSettingsRef.current.height,
					sizeBytes: blob.size,
					createdAt: /* @__PURE__ */ new Date(),
					mimeType
				});
				displayStream.getTracks().forEach((t) => t.stop());
				setStream(null);
				setStatus("idle");
				clearTimer();
				stopComposite();
			};
			recorder.onstop = handleStop;
			videoTrack.addEventListener("ended", () => {
				if (recorderRef.current && recorderRef.current.state !== "inactive") {
					accumulatedRef.current += (Date.now() - startTimeRef.current) / 1e3;
					recorderRef.current.stop();
				}
			});
			recorderRef.current = recorder;
			accumulatedRef.current = 0;
			setElapsed(0);
			setResult(null);
			recorder.start(1e3);
			setStatus("recording");
			startTimer();
		} catch (err) {
			const e = err;
			if (e.name === "NotAllowedError") setError("Permission denied. Please allow screen sharing to start recording.");
			else setError(e.message || "Could not start screen recording.");
			setStatus("idle");
		}
	}, [
		includeAudio,
		quality,
		includeCamera,
		cameraStream,
		startTimer,
		stopComposite,
		overlayAnnotations,
		setupAnnotationCanvas
	]);
	const confirmCrop = (0, import_react.useCallback)(async (rect) => {
		const displayStream = pendingStreamRef.current;
		if (!displayStream) return;
		setCropRect(rect);
		setStatus("idle");
		if (annotationsEnabledRef.current) setupAnnotationCanvas(rect.width, rect.height);
		const [videoTrack] = displayStream.getVideoTracks();
		videoTrack.getSettings();
		trackSettingsRef.current = {
			width: rect.width,
			height: rect.height
		};
		const mimeType = pickMimeType();
		const pixels = rect.width * rect.height;
		const bitrate = Math.min(Math.max(Math.round(pixels * 7), 5e6), 5e7);
		const screenVideo = document.createElement("video");
		screenVideo.srcObject = displayStream;
		screenVideo.muted = true;
		screenVideo.playsInline = true;
		await screenVideo.play();
		const canvas = document.createElement("canvas");
		canvas.width = rect.width;
		canvas.height = rect.height;
		const ctx = canvas.getContext("2d");
		compositeScreenVideo.current = screenVideo;
		compositeCanvas.current = canvas;
		compositeRunning.current = true;
		let recordingStream;
		if (includeCamera && cameraStream) {
			const camVideo = document.createElement("video");
			camVideo.srcObject = cameraStream;
			camVideo.muted = true;
			camVideo.playsInline = true;
			await camVideo.play();
			compositeCameraVideo.current = camVideo;
			const frame = () => {
				if (!compositeRunning.current) return;
				if (!compositePausedRef.current) {
					ctx.clearRect(0, 0, rect.width, rect.height);
					ctx.drawImage(screenVideo, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
					const pos = camPosRef.current;
					const set = camSetRef.current;
					const cx = pos.x / 100 * rect.width;
					const cy = pos.y / 100 * rect.height;
					const r = set.radius;
					ctx.save();
					ctx.beginPath();
					if (set.shape === "square") ctx.rect(cx - r, cy - r, r * 2, r * 2);
					else if (set.shape === "rounded") ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * .2);
					else ctx.arc(cx, cy, r, 0, Math.PI * 2);
					ctx.clip();
					if (set.mirrored) {
						ctx.save();
						ctx.translate(cx, 0);
						ctx.scale(-1, 1);
						ctx.drawImage(camVideo, -(cx - r), cy - r, r * 2, r * 2);
						ctx.restore();
					} else ctx.drawImage(camVideo, cx - r, cy - r, r * 2, r * 2);
					ctx.restore();
					ctx.save();
					ctx.shadowColor = "rgba(255,255,255,0.25)";
					ctx.shadowBlur = set.shadowBlur;
					ctx.beginPath();
					if (set.shape === "square") ctx.rect(cx - r, cy - r, r * 2, r * 2);
					else if (set.shape === "rounded") ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * .2);
					else ctx.arc(cx, cy, r, 0, Math.PI * 2);
					ctx.strokeStyle = set.borderColor;
					ctx.lineWidth = set.borderWidth;
					ctx.stroke();
					ctx.restore();
					overlayAnnotations(ctx, rect.width, rect.height);
				}
				requestAnimationFrame(frame);
			};
			requestAnimationFrame(frame);
			const canvasStream = canvas.captureStream(fpsRef.current);
			const audioCtx = new AudioContext();
			if (audioCtx.state === "suspended") audioCtx.resume();
			compositeAudioCtx.current = audioCtx;
			const dest = audioCtx.createMediaStreamDestination();
			if (includeAudio && displayStream.getAudioTracks().length > 0) audioCtx.createMediaStreamSource(displayStream).connect(dest);
			if (cameraStream.getAudioTracks().length > 0) audioCtx.createMediaStreamSource(cameraStream).connect(dest);
			recordingStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
		} else {
			const frame = () => {
				if (!compositeRunning.current) return;
				if (!compositePausedRef.current) {
					ctx.drawImage(screenVideo, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
					overlayAnnotations(ctx, rect.width, rect.height);
				}
				requestAnimationFrame(frame);
			};
			requestAnimationFrame(frame);
			const canvasStream = canvas.captureStream(fpsRef.current);
			const audioCtx = new AudioContext();
			if (audioCtx.state === "suspended") audioCtx.resume();
			compositeAudioCtx.current = audioCtx;
			const dest = audioCtx.createMediaStreamDestination();
			if (includeAudio && displayStream.getAudioTracks().length > 0) audioCtx.createMediaStreamSource(displayStream).connect(dest);
			recordingStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
		}
		setStream(recordingStream);
		const recorder = new MediaRecorder(recordingStream, {
			mimeType,
			videoBitsPerSecond: bitrate,
			audioBitsPerSecond: 128e3
		});
		chunksRef.current = [];
		recorder.ondataavailable = (event) => {
			if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
		};
		const handleStop = () => {
			const blob = new Blob(chunksRef.current, { type: mimeType });
			setResult({
				url: URL.createObjectURL(blob),
				blob,
				durationSeconds: accumulatedRef.current,
				width: trackSettingsRef.current.width,
				height: trackSettingsRef.current.height,
				sizeBytes: blob.size,
				createdAt: /* @__PURE__ */ new Date(),
				mimeType
			});
			displayStream.getTracks().forEach((t) => t.stop());
			setStream(null);
			setStatus("idle");
			clearTimer();
			stopComposite();
		};
		recorder.onstop = handleStop;
		videoTrack.addEventListener("ended", () => {
			if (recorderRef.current && recorderRef.current.state !== "inactive") {
				accumulatedRef.current += (Date.now() - startTimeRef.current) / 1e3;
				recorderRef.current.stop();
			}
		});
		recorderRef.current = recorder;
		accumulatedRef.current = 0;
		setElapsed(0);
		setResult(null);
		recorder.start(1e3);
		setStatus("recording");
		startTimer();
	}, [
		includeAudio,
		includeCamera,
		cameraStream,
		startTimer,
		stopComposite,
		overlayAnnotations,
		setupAnnotationCanvas
	]);
	const cancelCrop = (0, import_react.useCallback)(() => {
		const stream = pendingStreamRef.current;
		if (stream) stream.getTracks().forEach((t) => t.stop());
		pendingStreamRef.current = null;
		setStream(null);
		setCropRect(null);
		setStatus("idle");
	}, []);
	const addMonitorStream = (0, import_react.useCallback)(async () => {
		try {
			const newStream = await navigator.mediaDevices.getDisplayMedia({
				video: { frameRate: {
					ideal: fpsRef.current,
					max: fpsRef.current
				} },
				audio: includeAudio ? {
					echoCancellation: noiseRef.current,
					noiseSuppression: noiseRef.current,
					sampleRate: 44100
				} : false
			});
			const updated = [...multiStreamsRef.current, newStream];
			multiStreamsRef.current = updated;
			setMultiStreams(updated);
		} catch {}
	}, [includeAudio]);
	const startMultiRecording = (0, import_react.useCallback)(async () => {
		const streams = multiStreamsRef.current;
		if (streams.length === 0) return;
		setStatus("idle");
		const n = streams.length;
		const cols = n <= 2 ? n : Math.ceil(Math.sqrt(n));
		const rows = Math.ceil(n / cols);
		const settings = streams.map((s) => {
			const t = s.getVideoTracks()[0];
			const ts = t.getSettings();
			return {
				w: ts.width ?? 1920,
				h: ts.height ?? 1080,
				track: t
			};
		});
		const cellW = Math.max(...settings.map((s) => s.w), 1920);
		const cellH = Math.max(...settings.map((s) => s.h), 1080);
		const canvasW = cellW * cols;
		const canvasH = cellH * rows;
		trackSettingsRef.current = {
			width: canvasW,
			height: canvasH
		};
		if (annotationsEnabledRef.current) setupAnnotationCanvas(canvasW, canvasH);
		const mimeType = pickMimeType();
		const bitrate = Math.min(Math.max(Math.round(canvasW * canvasH * 7), 5e6), 5e7);
		const videos = await Promise.all(streams.map(async (s) => {
			const v = document.createElement("video");
			v.srcObject = s;
			v.muted = true;
			v.playsInline = true;
			await v.play();
			return v;
		}));
		const canvas = document.createElement("canvas");
		canvas.width = canvasW;
		canvas.height = canvasH;
		const ctx = canvas.getContext("2d");
		compositeCanvas.current = canvas;
		compositeRunning.current = true;
		const frame = () => {
			if (!compositeRunning.current) return;
			if (!compositePausedRef.current) {
				ctx.clearRect(0, 0, canvasW, canvasH);
				ctx.fillStyle = "#000";
				ctx.fillRect(0, 0, canvasW, canvasH);
				for (let i = 0; i < videos.length; i++) {
					const col = i % cols;
					const row = Math.floor(i / cols);
					ctx.drawImage(videos[i], 0, 0, settings[i].w, settings[i].h, col * cellW, row * cellH, cellW, cellH);
				}
				overlayAnnotations(ctx, canvasW, canvasH);
			}
			requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
		const canvasStream = canvas.captureStream(fpsRef.current);
		const audioCtx = new AudioContext();
		if (audioCtx.state === "suspended") audioCtx.resume();
		compositeAudioCtx.current = audioCtx;
		const dest = audioCtx.createMediaStreamDestination();
		if (includeAudio) {
			for (const s of streams) if (s.getAudioTracks().length > 0) audioCtx.createMediaStreamSource(s).connect(dest);
		}
		const recordingStream = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
		setStream(recordingStream);
		setMultiStreams([]);
		multiStreamsRef.current = [];
		pendingStreamRef.current = null;
		const recorder = new MediaRecorder(recordingStream, {
			mimeType,
			videoBitsPerSecond: bitrate,
			audioBitsPerSecond: 128e3
		});
		chunksRef.current = [];
		recorder.ondataavailable = (event) => {
			if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
		};
		const handleStop = () => {
			const blob = new Blob(chunksRef.current, { type: mimeType });
			setResult({
				url: URL.createObjectURL(blob),
				blob,
				durationSeconds: accumulatedRef.current,
				width: trackSettingsRef.current.width,
				height: trackSettingsRef.current.height,
				sizeBytes: blob.size,
				createdAt: /* @__PURE__ */ new Date(),
				mimeType
			});
			for (const s of streams) s.getTracks().forEach((t) => t.stop());
			for (const v of videos) v.pause();
			setStream(null);
			setStatus("idle");
			clearTimer();
			stopComposite();
		};
		recorder.onstop = handleStop;
		for (const t of streams.map((s) => s.getVideoTracks()[0])) {
			if (!t) continue;
			t.addEventListener("ended", () => {
				if (recorderRef.current && recorderRef.current.state !== "inactive") {
					accumulatedRef.current += (Date.now() - startTimeRef.current) / 1e3;
					recorderRef.current.stop();
				}
			});
		}
		recorderRef.current = recorder;
		accumulatedRef.current = 0;
		setElapsed(0);
		setResult(null);
		recorder.start(1e3);
		setStatus("recording");
		startTimer();
	}, [
		includeAudio,
		startTimer,
		stopComposite,
		overlayAnnotations,
		setupAnnotationCanvas
	]);
	const cancelMultiSetup = (0, import_react.useCallback)(() => {
		for (const s of multiStreamsRef.current) s.getTracks().forEach((t) => t.stop());
		multiStreamsRef.current = [];
		setMultiStreams([]);
		setStream(null);
		setStatus("idle");
	}, []);
	const startRecording = (0, import_react.useCallback)((surface = "monitor") => {
		setError(null);
		let cd = 3;
		setCountdown(cd);
		setStatus("countdown");
		if (countdownRef.current) clearInterval(countdownRef.current);
		countdownRef.current = setInterval(() => {
			cd -= 1;
			setCountdown(cd);
			if (cd <= 0) {
				if (countdownRef.current) clearInterval(countdownRef.current);
				countdownRef.current = null;
				beginCapture(surface);
			}
		}, 1e3);
	}, [beginCapture]);
	const cancelCountdown = (0, import_react.useCallback)(() => {
		if (countdownRef.current) {
			clearInterval(countdownRef.current);
			countdownRef.current = null;
		}
		setStatus("idle");
		setCountdown(0);
	}, []);
	const pauseRecording = (0, import_react.useCallback)(() => {
		const recorder = recorderRef.current;
		if (recorder && recorder.state === "recording") {
			recorder.pause();
			accumulatedRef.current += (Date.now() - startTimeRef.current) / 1e3;
			clearTimer();
			setElapsed(accumulatedRef.current);
			compositePausedRef.current = true;
			compositeScreenVideo.current?.pause();
			compositeCameraVideo.current?.pause();
			compositeAudioCtx.current?.suspend();
			setStatus("paused");
		}
	}, []);
	const resumeRecording = (0, import_react.useCallback)(() => {
		const recorder = recorderRef.current;
		if (recorder && recorder.state === "paused") {
			recorder.resume();
			compositePausedRef.current = false;
			compositeScreenVideo.current?.play().catch(() => {});
			compositeCameraVideo.current?.play().catch(() => {});
			compositeAudioCtx.current?.resume();
			startTimer();
			setStatus("recording");
		}
	}, [startTimer]);
	const stopRecording = (0, import_react.useCallback)(() => {
		const recorder = recorderRef.current;
		if (recorder && recorder.state !== "inactive") {
			if (recorder.state === "recording") accumulatedRef.current += (Date.now() - startTimeRef.current) / 1e3;
			recorder.stop();
		}
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		if (result?.url) URL.revokeObjectURL(result.url);
		setResult(null);
		setElapsed(0);
		setCropRect(null);
		accumulatedRef.current = 0;
		clearAnnotationCanvas();
	}, [result, clearAnnotationCanvas]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (countdownRef.current) clearInterval(countdownRef.current);
			clearTimer();
			if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
			stream?.getTracks().forEach((t) => t.stop());
			cameraStream?.getTracks().forEach((t) => t.stop());
			pendingStreamRef.current?.getTracks().forEach((t) => t.stop());
			for (const s of multiStreamsRef.current) s.getTracks().forEach((t) => t.stop());
			stopComposite();
		};
	}, []);
	stopRecordingRef.current = stopRecording;
	return {
		status,
		elapsed,
		countdown,
		stream,
		result,
		error,
		cropRect,
		multiStreams,
		includeAudio,
		setIncludeAudio,
		quality,
		setQuality,
		fps,
		setFps,
		noiseSuppressionEnabled,
		setNoiseSuppressionEnabled,
		autoStopMinutes,
		setAutoStopMinutes,
		includeCamera,
		setIncludeCamera,
		cameraStream,
		cameraPosition,
		setCameraPosition,
		cameraSettings,
		setCameraSettings,
		startRecording,
		cancelCountdown,
		confirmCrop,
		cancelCrop,
		addMonitorStream,
		startMultiRecording,
		cancelMultiSetup,
		pauseRecording,
		resumeRecording,
		stopRecording,
		reset,
		annotationsEnabled,
		setAnnotationsEnabled,
		annotationCanvasRef,
		setupAnnotationCanvas,
		clearAnnotationCanvas
	};
}
var formatTimer = (totalSeconds) => {
	const s = Math.max(0, Math.floor(totalSeconds));
	const hours = Math.floor(s / 3600);
	const minutes = Math.floor(s % 3600 / 60);
	const seconds = s % 60;
	const pad = (n) => n.toString().padStart(2, "0");
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
var formatBytes = (bytes) => {
	if (!bytes) return "0 B";
	const units = [
		"B",
		"KB",
		"MB",
		"GB"
	];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};
var formatResolution = (width, height) => {
	if (!width || !height) return "Unknown";
	let label = "";
	if (height >= 2160) label = " · 4K";
	else if (height >= 1080) label = " · Full HD";
	else if (height >= 720) label = " · HD";
	return `${width} × ${height}${label}`;
};
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function ClickFX({ active }) {
	const [ripples, setRipples] = (0, import_react.useState)([]);
	const idRef = (0, import_react.useRef)(0);
	const rafRef = (0, import_react.useRef)(0);
	const handleDown = (0, import_react.useCallback)((e) => {
		const id = ++idRef.current;
		setRipples((prev) => [...prev.slice(-24), {
			id,
			x: e.clientX,
			y: e.clientY,
			start: performance.now()
		}]);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		window.addEventListener("mousedown", handleDown);
		return () => window.removeEventListener("mousedown", handleDown);
	}, [active, handleDown]);
	(0, import_react.useEffect)(() => {
		if (!active || ripples.length === 0) return;
		const tick = () => {
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafRef.current);
	}, [active, ripples.length]);
	if (!active) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[9999] pointer-events-none",
		"aria-hidden": "true",
		children: ripples.map((r) => {
			const age = performance.now() - r.start;
			const progress = Math.min(age / 600, 1);
			if (progress >= 1) return null;
			const scale = .3 + progress * 1.2;
			const opacity = 1 - progress;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute rounded-full border-2 border-white/70",
				style: {
					left: r.x - 20,
					top: r.y - 20,
					width: 40,
					height: 40,
					transform: `translate(-50%, -50%) scale(${scale})`,
					opacity,
					transition: "none"
				}
			}, r.id);
		})
	});
}
function CursorFX({ active, whiteboardActive, brushSize = 4, brushColor = "#ffffff", toolName = "Pen" }) {
	const [pos, setPos] = (0, import_react.useState)({
		x: -100,
		y: -100
	});
	const [visible, setVisible] = (0, import_react.useState)(false);
	const target = (0, import_react.useRef)({
		x: -100,
		y: -100
	});
	const rafRef = (0, import_react.useRef)(0);
	const trailRef = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		if (!active) {
			setVisible(false);
			return;
		}
		const onMove = (e) => {
			target.current = {
				x: e.clientX,
				y: e.clientY
			};
			setVisible(true);
		};
		const onLeave = () => setVisible(false);
		const onEnter = () => setVisible(true);
		window.addEventListener("mousemove", onMove);
		document.addEventListener("mouseleave", onLeave);
		document.addEventListener("mouseenter", onEnter);
		return () => {
			window.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("mouseenter", onEnter);
			cancelAnimationFrame(rafRef.current);
		};
	}, [active]);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const lerp = () => {
			setPos((prev) => {
				const next = {
					x: prev.x + (target.current.x - prev.x) * .15,
					y: prev.y + (target.current.y - prev.y) * .15
				};
				trailRef.current = [next, ...trailRef.current.slice(0, 3)];
				return next;
			});
			rafRef.current = requestAnimationFrame(lerp);
		};
		rafRef.current = requestAnimationFrame(lerp);
		return () => cancelAnimationFrame(rafRef.current);
	}, [active]);
	if (!active || !visible) return null;
	const isWhiteboard = whiteboardActive;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[9999] pointer-events-none",
		"aria-hidden": "true",
		children: [isWhiteboard && trailRef.current.slice(1).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute rounded-full",
			style: {
				left: t.x,
				top: t.y,
				width: Math.max(brushSize * .4, 2),
				height: Math.max(brushSize * .4, 2),
				backgroundColor: brushColor,
				opacity: .15 - i * .04,
				transform: "translate(-50%, -50%)"
			}
		}, i)), isWhiteboard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-full border-2",
				style: {
					left: pos.x,
					top: pos.y,
					width: brushSize * 2 + 24,
					height: brushSize * 2 + 24,
					transform: "translate(-50%, -50%)",
					borderColor: brushColor,
					opacity: .3,
					boxShadow: `0 0 12px ${brushColor}22, inset 0 0 12px ${brushColor}11`
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-full",
				style: {
					left: pos.x,
					top: pos.y,
					width: Math.max(brushSize, 2),
					height: Math.max(brushSize, 2),
					transform: "translate(-50%, -50%)",
					backgroundColor: brushColor,
					opacity: .8,
					boxShadow: `0 0 6px ${brushColor}44`
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-md bg-black/60 px-1.5 py-0.5 ring-1 ring-white/[0.06]",
				style: {
					left: pos.x,
					top: pos.y + brushSize + 14,
					transform: "translateX(-50%)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[9px] font-medium text-white/60 whitespace-nowrap",
					children: toolName
				})
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute rounded-full bg-gradient-to-br from-white/25 to-white/10",
			style: {
				left: pos.x,
				top: pos.y,
				width: 28,
				height: 28,
				transform: "translate(-50%, -50%)",
				boxShadow: "0 0 12px oklch(0.74 0.15 222 / 0.25), 0 0 40px oklch(0.74 0.15 222 / 0.12)",
				border: "1px solid oklch(1 0 0 / 0.15)",
				backdropFilter: "blur(2px)"
			}
		})]
	});
}
var COLORS$1 = [
	"#ffffff",
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#3b82f6",
	"#a855f7",
	"#ec4899"
];
var BRUSH_SIZES = [
	2,
	4,
	6,
	8,
	12,
	16,
	24
];
var TOOLS$1 = [
	{
		id: "pen",
		icon: Pencil,
		label: "Pen"
	},
	{
		id: "highlighter",
		icon: Highlighter,
		label: "Highlighter"
	},
	{
		id: "eraser",
		icon: Eraser,
		label: "Eraser"
	},
	{
		id: "line",
		icon: Minus,
		label: "Line"
	},
	{
		id: "arrow",
		icon: ArrowUpRight,
		label: "Arrow"
	},
	{
		id: "rect",
		icon: Square,
		label: "Rectangle"
	},
	{
		id: "circle",
		icon: Circle,
		label: "Circle"
	},
	{
		id: "text",
		icon: Type,
		label: "Text"
	}
];
function CursorPreview({ pos, visible, color, size, tool }) {
	if (!visible) return null;
	const toolLabel = TOOLS$1.find((t) => t.id === tool)?.label ?? "";
	const isShapeTool = tool === "line" || tool === "arrow" || tool === "rect" || tool === "circle";
	const isPenTool = tool === "pen" || tool === "highlighter";
	const isEraser = tool === "eraser";
	const isText = tool === "text";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[9999] pointer-events-none",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute -translate-x-1/2 -translate-y-1/2",
			style: {
				left: pos.x,
				top: pos.y
			},
			children: [
				isPenTool && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-full transition-all duration-75",
					style: {
						width: Math.max(size, 4),
						height: Math.max(size, 4),
						backgroundColor: color,
						opacity: tool === "highlighter" ? .4 : .9,
						marginLeft: -Math.max(size, 4) / 2,
						marginTop: -Math.max(size, 4) / 2
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute rounded-full",
					style: {
						width: 2,
						height: 2,
						backgroundColor: "#fff",
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)"
					}
				})] }),
				isEraser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-full border-2 border-dashed transition-all duration-75",
					style: {
						width: size * 2 + 20,
						height: size * 2 + 20,
						borderColor: "rgba(255,255,255,0.4)",
						marginLeft: -(size + 10),
						marginTop: -(size + 10)
					}
				}),
				isShapeTool && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-full transition-all duration-75",
					style: {
						width: 3,
						height: 3,
						backgroundColor: color,
						marginLeft: -1.5,
						marginTop: -1.5
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute rounded-full border transition-all duration-75",
					style: {
						width: 16,
						height: 16,
						borderColor: color,
						opacity: .5,
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)"
					}
				})] }),
				isText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "transition-all duration-75",
					style: {
						width: 2,
						height: size * 5,
						backgroundColor: color,
						marginLeft: -1,
						marginTop: -(size * 5) / 2,
						opacity: .8
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-black/70 px-1.5 py-0.5 ring-1 ring-white/[0.08]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-medium text-white/70 whitespace-nowrap",
						children: toolLabel
					})
				})
			]
		})
	});
}
function WhiteboardMode({ active, onClose }) {
	const canvasRef = (0, import_react.useRef)(null);
	const containerRef = (0, import_react.useRef)(null);
	const ctxRef = (0, import_react.useRef)(null);
	const drawing = (0, import_react.useRef)(false);
	const undoStack = (0, import_react.useRef)([]);
	const startPos = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const lastPos = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const [tool, setTool] = (0, import_react.useState)("pen");
	const [color, setColor] = (0, import_react.useState)(COLORS$1[0]);
	const [brushSize, setBrushSize] = (0, import_react.useState)(4);
	const [cursorSpeed, setCursorSpeed] = (0, import_react.useState)(.15);
	const [cursorPos, setCursorPos] = (0, import_react.useState)({
		x: -100,
		y: -100
	});
	const [cursorVisible, setCursorVisible] = (0, import_react.useState)(false);
	const targetCursor = (0, import_react.useRef)({
		x: -100,
		y: -100
	});
	const rafRef = (0, import_react.useRef)(0);
	const [textInput, setTextInput] = (0, import_react.useState)(null);
	const toolRef = (0, import_react.useRef)(tool);
	toolRef.current = tool;
	const colorRef = (0, import_react.useRef)(color);
	colorRef.current = color;
	const sizeRef = (0, import_react.useRef)(brushSize);
	sizeRef.current = brushSize;
	const cursorSpeedRef = (0, import_react.useRef)(cursorSpeed);
	cursorSpeedRef.current = cursorSpeed;
	(0, import_react.useEffect)(() => {
		if (!active || !canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		ctxRef.current = ctx;
		const resize = () => {
			const w = window.innerWidth;
			const h = window.innerHeight;
			const dpr = window.devicePixelRatio || 1;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(dpr, dpr);
			ctx.fillStyle = "#0a0a0f";
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = "rgba(255,255,255,0.03)";
			ctx.lineWidth = 1;
			const gridSize = 40;
			for (let x = 0; x <= w; x += gridSize) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, h);
				ctx.stroke();
			}
			for (let y = 0; y <= h; y += gridSize) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(w, y);
				ctx.stroke();
			}
		};
		resize();
		window.addEventListener("resize", resize);
		return () => {
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(rafRef.current);
		};
	}, [active]);
	(0, import_react.useEffect)(() => {
		if (!active) {
			setCursorVisible(false);
			return;
		}
		const onMove = (e) => {
			targetCursor.current = {
				x: e.clientX,
				y: e.clientY
			};
			setCursorVisible(true);
		};
		const onLeave = () => setCursorVisible(false);
		const onEnter = () => setCursorVisible(true);
		window.addEventListener("mousemove", onMove);
		document.addEventListener("mouseleave", onLeave);
		document.addEventListener("mouseenter", onEnter);
		return () => {
			window.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("mouseenter", onEnter);
		};
	}, [active]);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const lerp = () => {
			const speed = cursorSpeedRef.current;
			setCursorPos((prev) => ({
				x: prev.x + (targetCursor.current.x - prev.x) * speed,
				y: prev.y + (targetCursor.current.y - prev.y) * speed
			}));
			rafRef.current = requestAnimationFrame(lerp);
		};
		rafRef.current = requestAnimationFrame(lerp);
		return () => cancelAnimationFrame(rafRef.current);
	}, [active]);
	const saveSnapshot = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = ctxRef.current;
		if (!ctx) return;
		const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
		undoStack.current.push(data);
		if (undoStack.current.length > 30) undoStack.current.shift();
	}, []);
	const handleUndo = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		if (!canvas || !ctx) return;
		const prev = undoStack.current.pop();
		if (!prev) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			return;
		}
		ctx.putImageData(prev, 0, 0);
	}, []);
	const getCtxProps = (0, import_react.useCallback)((ctx) => {
		const t = toolRef.current;
		if (t === "eraser") {
			ctx.globalCompositeOperation = "destination-out";
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = sizeRef.current * 10;
			ctx.fillStyle = "rgba(0,0,0,1)";
		} else if (t === "highlighter") {
			ctx.strokeStyle = colorRef.current;
			ctx.globalAlpha = .3;
			ctx.lineWidth = sizeRef.current * 4;
			ctx.fillStyle = colorRef.current;
		} else {
			ctx.strokeStyle = colorRef.current;
			ctx.globalAlpha = 1;
			ctx.lineWidth = sizeRef.current;
			ctx.fillStyle = colorRef.current;
		}
	}, []);
	const handlePointerDown = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		if (!canvas || !ctx) return;
		const t = toolRef.current;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		if (t === "text") {
			setTextInput({
				x,
				y,
				value: ""
			});
			return;
		}
		drawing.current = true;
		startPos.current = {
			x,
			y
		};
		lastPos.current = {
			x,
			y
		};
		if (t === "pen" || t === "highlighter" || t === "eraser") {
			saveSnapshot();
			getCtxProps(ctx);
			ctx.beginPath();
			ctx.moveTo(x, y);
		}
	}, [saveSnapshot, getCtxProps]);
	const handlePointerMove = (0, import_react.useCallback)((e) => {
		if (!drawing.current) return;
		e.preventDefault();
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		if (!canvas || !ctx) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const t = toolRef.current;
		if (t === "pen" || t === "highlighter" || t === "eraser") {
			getCtxProps(ctx);
			ctx.lineTo(x, y);
			ctx.stroke();
		} else {
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			const dpr = window.devicePixelRatio || 1;
			ctx.scale(dpr, dpr);
			ctx.restore();
			ctx.save();
			getCtxProps(ctx);
			ctx.globalAlpha = 1;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			const x1 = startPos.current.x;
			const y1 = startPos.current.y;
			sizeRef.current;
			colorRef.current;
			window.devicePixelRatio;
			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.restore();
			const prev = undoStack.current[undoStack.current.length - 1];
			if (prev) ctx.putImageData(prev, 0, 0);
			ctx.save();
			getCtxProps(ctx);
			ctx.globalAlpha = 1;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			switch (t) {
				case "line":
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x, y);
					ctx.stroke();
					break;
				case "arrow": {
					const angle = Math.atan2(y - y1, x - x1);
					const headLen = 12;
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x, y);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
					ctx.moveTo(x, y);
					ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));
					ctx.stroke();
					break;
				}
				case "rect":
					ctx.strokeRect(Math.min(x1, x), Math.min(y1, y), Math.abs(x - x1), Math.abs(y - y1));
					break;
				case "circle": {
					const cx = (x1 + x) / 2;
					const cy = (y1 + y) / 2;
					const rx = Math.abs(x - x1) / 2;
					const ry = Math.abs(y - y1) / 2;
					ctx.beginPath();
					ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
					ctx.stroke();
					break;
				}
			}
			ctx.restore();
		}
		lastPos.current = {
			x,
			y
		};
	}, [getCtxProps]);
	const handlePointerUp = (0, import_react.useCallback)((e) => {
		if (!drawing.current) return;
		drawing.current = false;
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		if (!canvas || !ctx) return;
		const t = toolRef.current;
		if (t === "pen" || t === "highlighter" || t === "eraser") return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const x1 = startPos.current.x;
		const y1 = startPos.current.y;
		saveSnapshot();
		const prev = undoStack.current[undoStack.current.length - 2];
		if (prev) ctx.putImageData(prev, 0, 0);
		ctx.save();
		getCtxProps(ctx);
		ctx.globalAlpha = 1;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		switch (t) {
			case "line":
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x, y);
				ctx.stroke();
				break;
			case "arrow": {
				const angle = Math.atan2(y - y1, x - x1);
				const headLen = 12;
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x, y);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(x, y);
				ctx.lineTo(x - headLen * Math.cos(angle - Math.PI / 6), y - headLen * Math.sin(angle - Math.PI / 6));
				ctx.moveTo(x, y);
				ctx.lineTo(x - headLen * Math.cos(angle + Math.PI / 6), y - headLen * Math.sin(angle + Math.PI / 6));
				ctx.stroke();
				break;
			}
			case "rect":
				ctx.strokeRect(Math.min(x1, x), Math.min(y1, y), Math.abs(x - x1), Math.abs(y - y1));
				break;
			case "circle": {
				const cx = (x1 + x) / 2;
				const cy = (y1 + y) / 2;
				const rx = Math.abs(x - x1) / 2;
				const ry = Math.abs(y - y1) / 2;
				ctx.beginPath();
				ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
				ctx.stroke();
				break;
			}
		}
		ctx.restore();
	}, [saveSnapshot, getCtxProps]);
	const handleClear = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		if (!canvas || !ctx) return;
		saveSnapshot();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}, [saveSnapshot]);
	const commitText = (0, import_react.useCallback)((text, x, y) => {
		if (!text.trim()) return;
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		if (!canvas || !ctx) return;
		saveSnapshot();
		ctx.save();
		ctx.font = `${sizeRef.current * 5}px sans-serif`;
		ctx.fillStyle = colorRef.current;
		ctx.globalAlpha = 1;
		ctx.textBaseline = "top";
		const lines = text.split("\n");
		const lineH = sizeRef.current * 6;
		lines.forEach((line, i) => {
			ctx.fillText(line, x, y + i * lineH);
		});
		ctx.restore();
	}, [saveSnapshot]);
	if (!active) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CursorPreview, {
			pos: cursorPos,
			visible: cursorVisible,
			color,
			size: brushSize,
			tool
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: containerRef,
			className: "fixed inset-0 z-[9995]",
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
			style: {
				touchAction: "none",
				cursor: "none"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "h-full w-full"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9996] pointer-events-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .3,
					ease: [
						.25,
						.1,
						.25,
						1
					]
				},
				className: "flex items-center gap-2 rounded-2xl bg-black/80 px-3 py-2 backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-2xl pointer-events-auto",
				children: [
					TOOLS$1.map(({ id, icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: label,
						onClick: () => setTool(id),
						className: cn("flex h-8 w-8 items-center justify-center rounded-lg transition-all", tool === id ? "bg-white/[0.12] text-white shadow-sm" : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					}, id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-white/[0.08]" }),
					COLORS$1.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: c,
						onClick: () => setColor(c),
						className: cn("h-5 w-5 rounded-full ring-1 ring-white/[0.15] transition-all shrink-0", color === c && "ring-2 ring-white scale-110"),
						style: { backgroundColor: c }
					}, c)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-white/[0.08]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5",
						children: BRUSH_SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: `${s}px`,
							onClick: () => setBrushSize(s),
							className: cn("flex items-center justify-center rounded-lg transition-all", brushSize === s ? "bg-white/[0.1]" : "hover:bg-white/[0.04]"),
							style: {
								width: 20,
								height: 20
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-full bg-white/60",
								style: {
									width: Math.max(2, s / 24 * 12),
									height: Math.max(2, s / 24 * 12)
								}
							})
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-white/[0.08]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						title: "Cursor speed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, { className: "h-3.5 w-3.5 text-white/40 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 5,
							max: 100,
							step: 5,
							value: Math.round(cursorSpeed * 100),
							onChange: (e) => setCursorSpeed(Number(e.target.value) / 100),
							className: "w-14 h-1 accent-white/50 cursor-pointer"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-white/[0.08]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: "Undo",
						onClick: handleUndo,
						className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: "Clear all",
						onClick: handleClear,
						className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.06] transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-white/[0.08]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						title: "Close whiteboard",
						onClick: onClose,
						className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})
				]
			})
		}),
		textInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[9997]",
			onPointerDown: () => {
				if (textInput.value.trim()) commitText(textInput.value, textInput.x, textInput.y);
				setTextInput(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				autoFocus: true,
				value: textInput.value,
				onChange: (e) => setTextInput({
					...textInput,
					value: e.target.value
				}),
				onKeyDown: (e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						commitText(textInput.value, textInput.x, textInput.y);
						setTextInput(null);
					}
					if (e.key === "Escape") setTextInput(null);
				},
				onPointerDown: (e) => e.stopPropagation(),
				className: "absolute bg-black/80 text-white rounded-lg border border-white/20 p-2 shadow-2xl outline-none resize-none overflow-hidden",
				style: {
					left: textInput.x,
					top: textInput.y,
					minWidth: 120,
					minHeight: 36,
					fontSize: Math.max(12, brushSize * 2.5),
					lineHeight: 1.4,
					fontFamily: "sans-serif",
					color
				},
				rows: 1,
				placeholder: "Type here..."
			})
		})
	] });
}
function CountdownOverlay({ countdown, onCancel, status }) {
	const [phase, setPhase] = (0, import_react.useState)(null);
	const [showCancel, setShowCancel] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (countdown > 0) {
			setPhase("countdown");
			setShowCancel(true);
		}
	}, [countdown]);
	(0, import_react.useEffect)(() => {
		let t;
		if (countdown === 0 && phase === "countdown" && (status === "countdown" || status === "recording")) {
			setPhase("go");
			setShowCancel(false);
			t = setTimeout(() => setPhase(null), 600);
		}
		return () => clearTimeout(t);
	}, [
		countdown,
		phase,
		status
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape" && showCancel) onCancel();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onCancel, showCancel]);
	(0, import_react.useEffect)(() => {
		if (phase && status !== "countdown" && status !== "recording") {
			setPhase(null);
			setShowCancel(true);
		}
	}, [status, phase]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: phase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .15 },
		className: "fixed inset-0 z-[9998] flex items-center justify-center bg-black/40",
		children: [phase === "countdown" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
					initial: {
						scale: .3,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					exit: {
						scale: 1.5,
						opacity: 0
					},
					transition: {
						duration: .25,
						ease: "easeOut"
					},
					className: "block font-display text-[10rem] font-bold text-white drop-shadow-2xl",
					style: { textShadow: "0 0 60px oklch(0.74 0.15 222 / 0.4)" },
					children: countdown
				}, countdown)
			}), showCancel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: 20
				},
				onClick: onCancel,
				className: "mt-8 rounded-full bg-white/[0.06] px-6 py-3 text-sm text-white/50 ring-1 ring-white/[0.08] backdrop-blur-xl transition-all hover:bg-white/[0.1] hover:text-white/80",
				children: "Cancel (Esc)"
			})]
		}), phase === "go" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
			initial: {
				scale: .5,
				opacity: 0
			},
			animate: {
				scale: 1,
				opacity: 1
			},
			exit: {
				scale: 2,
				opacity: 0
			},
			transition: {
				duration: .3,
				ease: "easeOut"
			},
			className: "font-display text-[6rem] font-bold text-white",
			style: { textShadow: "0 0 60px oklch(0.74 0.15 222 / 0.4)" },
			children: "Go!"
		})]
	}) });
}
function CameraOverlay({ cameraStream, position, onPositionChange, settings, onSettingsChange, active }) {
	const videoRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)(false);
	const dragStart = (0, import_react.useRef)({
		x: 0,
		y: 0,
		px: 0,
		py: 0
	});
	const [showEnhancers, setShowEnhancers] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (videoRef.current && cameraStream) {
			videoRef.current.srcObject = cameraStream;
			videoRef.current.play().catch(() => {});
		}
	}, [cameraStream]);
	const handleDown = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		dragRef.current = true;
		dragStart.current = {
			x: e.clientX,
			y: e.clientY,
			px: position.x,
			py: position.y
		};
		const onMove = (ev) => {
			if (!dragRef.current) return;
			const dx = (ev.clientX - dragStart.current.x) / window.innerWidth * 100;
			const dy = (ev.clientY - dragStart.current.y) / window.innerHeight * 100;
			onPositionChange({
				x: Math.max(5, Math.min(95, dragStart.current.px + dx)),
				y: Math.max(5, Math.min(95, dragStart.current.py + dy))
			});
		};
		const onUp = () => {
			dragRef.current = false;
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
	}, [position, onPositionChange]);
	if (!active || !cameraStream) return null;
	const r = settings.radius;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed z-50",
		style: {
			left: `${position.x}%`,
			top: `${position.y}%`,
			transform: "translate(-50%, -50%)",
			width: r * 2,
			height: r * 2
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onMouseDown: handleDown,
			className: "relative h-full w-full cursor-grab active:cursor-grabbing select-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full w-full overflow-hidden",
					style: { borderRadius: {
						circle: "50%",
						square: "0%",
						rounded: "20%"
					}[settings.shape] },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						muted: true,
						playsInline: true,
						className: cn("h-full w-full object-cover", settings.mirrored && "scale-x-[-1]")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("pointer-events-none absolute inset-0", {
						circle: "rounded-full",
						square: "",
						rounded: "rounded-[20%]"
					}[settings.shape]),
					style: { boxShadow: `0 0 0 ${settings.borderWidth}px ${settings.borderColor}, 0 0 ${settings.shadowBlur}px rgba(255,255,255,0.2)` }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm ring-1 ring-white/[0.1]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "12",
						height: "12",
						viewBox: "0 0 12 12",
						fill: "none",
						className: "text-white/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "4",
								cy: "2",
								r: "1",
								fill: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "8",
								cy: "2",
								r: "1",
								fill: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "4",
								cy: "6",
								r: "1",
								fill: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "8",
								cy: "6",
								r: "1",
								fill: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "4",
								cy: "10",
								r: "1",
								fill: "currentColor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "8",
								cy: "10",
								r: "1",
								fill: "currentColor"
							})
						]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute -top-1 right-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setShowEnhancers(!showEnhancers),
				className: "flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white/60 backdrop-blur-sm ring-1 ring-white/[0.1] transition-all hover:bg-white/[0.1] hover:text-white/90",
				title: "Camera settings",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					width: "12",
					height: "12",
					viewBox: "0 0 16 16",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.5",
					strokeLinecap: "round",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "8",
						cy: "8",
						r: "2.5"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 2v1.5M8 12.5V14M14 8h-1.5M3.5 8H2M12.1 3.9l-1.1 1.1M5 11l-1.1 1.1M12.1 12.1l-1.1-1.1M5 5L3.9 3.9" })]
				})
			})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showEnhancers && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 8,
			scale: .95
		},
		animate: {
			opacity: 1,
			y: 0,
			scale: 1
		},
		exit: {
			opacity: 0,
			y: 8,
			scale: .95
		},
		transition: { duration: .15 },
		className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-5 rounded-2xl bg-black/70 px-5 py-3 backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex cursor-pointer items-center gap-2 text-xs text-white/60 select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: settings.mirrored,
					onChange: () => onSettingsChange({
						...settings,
						mirrored: !settings.mirrored
					}),
					className: "h-3.5 w-3.5 accent-white/50 rounded"
				}), "Mirror"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-white/[0.06]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1",
				children: [
					{
						value: "circle",
						label: "Circle",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 14 14",
							fill: "none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "7",
								cy: "7",
								r: "5.5",
								stroke: "currentColor",
								strokeWidth: "1.2"
							})
						})
					},
					{
						value: "rounded",
						label: "Rounded",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 14 14",
							fill: "none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "1.5",
								y: "1.5",
								width: "11",
								height: "11",
								rx: "3",
								stroke: "currentColor",
								strokeWidth: "1.2"
							})
						})
					},
					{
						value: "square",
						label: "Square",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							width: "14",
							height: "14",
							viewBox: "0 0 14 14",
							fill: "none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: "1.5",
								y: "1.5",
								width: "11",
								height: "11",
								rx: "0.5",
								stroke: "currentColor",
								strokeWidth: "1.2"
							})
						})
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: s.label,
					onClick: () => onSettingsChange({
						...settings,
						shape: s.value
					}),
					className: cn("flex h-6 w-6 items-center justify-center rounded-md transition-all", settings.shape === s.value ? "bg-white/15 text-white/90 ring-1 ring-white/20" : "text-white/40 hover:bg-white/[0.08] hover:text-white/60"),
					children: s.icon
				}, s.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-white/[0.06]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-white/40 uppercase tracking-wider",
					children: "Border"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 6,
					step: 1,
					value: settings.borderWidth,
					onChange: (e) => onSettingsChange({
						...settings,
						borderWidth: Number(e.target.value)
					}),
					className: "w-16 h-1 accent-white/50"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-white/[0.06]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-white/40 uppercase tracking-wider",
					children: "Glow"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 40,
					step: 2,
					value: settings.shadowBlur,
					onChange: (e) => onSettingsChange({
						...settings,
						shadowBlur: Number(e.target.value)
					}),
					className: "w-16 h-1 accent-white/50"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-px bg-white/[0.06]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-white/40 uppercase tracking-wider",
					children: "Size"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 40,
					max: 120,
					step: 5,
					value: settings.radius,
					onChange: (e) => onSettingsChange({
						...settings,
						radius: Number(e.target.value)
					}),
					className: "w-16 h-1 accent-white/50"
				})]
			})
		]
	}) })] });
}
var MIN_SIZE = 80;
var HANDLE_SIZE = 10;
var HANDLE_CURSOR = {
	n: "cursor-n-resize",
	s: "cursor-s-resize",
	e: "cursor-e-resize",
	w: "cursor-w-resize",
	nw: "cursor-nw-resize",
	ne: "cursor-ne-resize",
	sw: "cursor-sw-resize",
	se: "cursor-se-resize"
};
function CropOverlay({ stream, onConfirm, onCancel }) {
	const videoRef = (0, import_react.useRef)(null);
	const overlayRef = (0, import_react.useRef)(null);
	const [selection, setSelection] = (0, import_react.useState)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [dragStart, setDragStart] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [isMoving, setIsMoving] = (0, import_react.useState)(false);
	const [moveStart, setMoveStart] = (0, import_react.useState)({
		x: 0,
		y: 0,
		rx: 0,
		ry: 0
	});
	const [activeHandle, setActiveHandle] = (0, import_react.useState)(null);
	const [resizeStart, setResizeStart] = (0, import_react.useState)({
		x: 0,
		y: 0,
		rect: {
			x: 0,
			y: 0,
			w: 0,
			h: 0
		}
	});
	const [step, setStep] = (0, import_react.useState)("draw");
	const [showHints, setShowHints] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
			videoRef.current.play().catch(() => {});
		}
	}, [stream]);
	(0, import_react.useEffect)(() => {
		if (selection && step === "draw") setStep("adjust");
	}, [selection, step]);
	(0, import_react.useEffect)(() => {
		if (!showHints) return;
		const t = setTimeout(() => setShowHints(false), 4e3);
		return () => clearTimeout(t);
	}, [showHints]);
	const getOverlayRect = (0, import_react.useCallback)(() => {
		const el = overlayRef.current;
		if (!el) return {
			left: 0,
			top: 0,
			width: 1,
			height: 1
		};
		return el.getBoundingClientRect();
	}, []);
	const clientToOverlay = (0, import_react.useCallback)((cx, cy) => {
		const r = getOverlayRect();
		return {
			x: cx - r.left,
			y: cy - r.top
		};
	}, [getOverlayRect]);
	const constrainRect = (0, import_react.useCallback)((rect, bounds) => {
		let { x, y, width, height } = rect;
		if (width < MIN_SIZE) width = MIN_SIZE;
		if (height < MIN_SIZE) height = MIN_SIZE;
		if (x < 0) x = 0;
		if (y < 0) y = 0;
		if (x + width > bounds.w) x = bounds.w - width;
		if (y + height > bounds.h) y = bounds.h - height;
		if (x < 0) {
			x = 0;
			width = bounds.w;
		}
		if (y < 0) {
			y = 0;
			height = bounds.h;
		}
		return {
			x,
			y,
			width,
			height
		};
	}, []);
	const handlePointerDown = (0, import_react.useCallback)((e) => {
		const pos = clientToOverlay(e.clientX, e.clientY);
		if (selection && !activeHandle) {
			const s = selection;
			if (pos.x >= s.x && pos.x <= s.x + s.width && pos.y >= s.y && pos.y <= s.y + s.height) {
				setIsMoving(true);
				setMoveStart({
					x: e.clientX,
					y: e.clientY,
					rx: s.x,
					ry: s.y
				});
				e.target.setPointerCapture(e.pointerId);
				return;
			}
		}
		setIsDragging(true);
		setDragStart(pos);
		setSelection({
			x: pos.x,
			y: pos.y,
			width: 0,
			height: 0
		});
		e.target.setPointerCapture(e.pointerId);
	}, [
		clientToOverlay,
		selection,
		activeHandle
	]);
	const handlePointerMove = (0, import_react.useCallback)((e) => {
		if (activeHandle) {
			const pos = clientToOverlay(e.clientX, e.clientY);
			const bounds = getOverlayRect();
			let { x, y, w, h } = resizeStart.rect;
			const dx = pos.x - resizeStart.x;
			const dy = pos.y - resizeStart.y;
			switch (activeHandle) {
				case "se":
					w = resizeStart.rect.w + dx;
					h = resizeStart.rect.h + dy;
					break;
				case "sw":
					x = resizeStart.rect.x + dx;
					w = resizeStart.rect.w - dx;
					h = resizeStart.rect.h + dy;
					break;
				case "ne":
					y = resizeStart.rect.y + dy;
					w = resizeStart.rect.w + dx;
					h = resizeStart.rect.h - dy;
					break;
				case "nw":
					x = resizeStart.rect.x + dx;
					y = resizeStart.rect.y + dy;
					w = resizeStart.rect.w - dx;
					h = resizeStart.rect.h - dy;
					break;
				case "n":
					y = resizeStart.rect.y + dy;
					h = resizeStart.rect.h - dy;
					break;
				case "s":
					h = resizeStart.rect.h + dy;
					break;
				case "w":
					x = resizeStart.rect.x + dx;
					w = resizeStart.rect.w - dx;
					break;
				case "e":
					w = resizeStart.rect.w + dx;
					break;
			}
			setSelection(constrainRect({
				x,
				y,
				width: w,
				height: h
			}, {
				w: bounds.width,
				h: bounds.height
			}));
			return;
		}
		if (isMoving) {
			const pos = clientToOverlay(e.clientX, e.clientY);
			const bounds = getOverlayRect();
			const startPos = clientToOverlay(moveStart.x, moveStart.y);
			const dx = pos.x - startPos.x;
			const dy = pos.y - startPos.y;
			setSelection(constrainRect({
				x: moveStart.rx + dx,
				y: moveStart.ry + dy,
				width: selection.width,
				height: selection.height
			}, {
				w: bounds.width,
				h: bounds.height
			}));
			return;
		}
		if (!isDragging) return;
		const pos = clientToOverlay(e.clientX, e.clientY);
		setSelection({
			x: Math.min(dragStart.x, pos.x),
			y: Math.min(dragStart.y, pos.y),
			width: Math.abs(pos.x - dragStart.x),
			height: Math.abs(pos.y - dragStart.y)
		});
	}, [
		isDragging,
		isMoving,
		dragStart,
		moveStart,
		clientToOverlay,
		getOverlayRect,
		activeHandle,
		resizeStart,
		selection,
		constrainRect
	]);
	const handlePointerUp = (0, import_react.useCallback)(() => {
		if (activeHandle) {
			setActiveHandle(null);
			return;
		}
		if (isMoving) {
			setIsMoving(false);
			return;
		}
		setIsDragging(false);
		if (selection && (selection.width < MIN_SIZE || selection.height < MIN_SIZE)) setSelection(null);
	}, [
		activeHandle,
		isMoving,
		selection
	]);
	const handleResizeStart = (0, import_react.useCallback)((handle) => (e) => {
		e.stopPropagation();
		if (!selection) return;
		setActiveHandle(handle);
		setResizeStart({
			x: e.clientX,
			y: e.clientY,
			rect: {
				x: selection.x,
				y: selection.y,
				w: selection.width,
				h: selection.height
			}
		});
		e.target.setPointerCapture(e.pointerId);
	}, [selection]);
	const videoW = stream?.getVideoTracks()[0]?.getSettings().width ?? 1920;
	const videoH = stream?.getVideoTracks()[0]?.getSettings().height ?? 1080;
	const handleConfirm = () => {
		if (!selection || selection.width < MIN_SIZE || selection.height < MIN_SIZE) return;
		const el = overlayRef.current;
		if (!el) return;
		const vr = el.getBoundingClientRect();
		const scaleX = videoW / vr.width;
		const scaleY = videoH / vr.height;
		onConfirm({
			x: Math.round(selection.x * scaleX),
			y: Math.round(selection.y * scaleY),
			width: Math.round(selection.width * scaleX),
			height: Math.round(selection.height * scaleY)
		});
	};
	const hasValidSelection = selection && selection.width >= MIN_SIZE && selection.height >= MIN_SIZE;
	const overlayRect = overlayRef.current?.getBoundingClientRect();
	const recordedW = overlayRect ? Math.round(selection ? selection.width * (videoW / overlayRect.width) : videoW) : videoW;
	const recordedH = overlayRect ? Math.round(selection ? selection.height * (videoH / overlayRect.height) : videoH) : videoH;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[9999] flex flex-col bg-black/70 select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: videoRef,
			muted: true,
			playsInline: true,
			className: "absolute inset-0 h-full w-full object-contain opacity-30 pointer-events-none"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex flex-col h-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-8 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${step === "draw" ? "bg-white text-black scale-110 shadow-[0_0_20px_-4px_rgba(255,255,255,0.3)]" : "bg-white/[0.06] text-white/40"}`,
									children: "1"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-semibold transition-colors ${step === "draw" ? "text-white" : "text-white/30"}`,
										children: "Draw area"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-white/25",
										children: "Click & drag on the preview"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-12 bg-white/[0.08]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${step === "adjust" ? "bg-white text-black scale-110 shadow-[0_0_20px_-4px_rgba(255,255,255,0.3)]" : "bg-white/[0.06] text-white/40"}`,
									children: "2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-semibold transition-colors ${step === "adjust" ? "text-white" : "text-white/30"}`,
										children: "Adjust"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-white/25",
										children: "Drag edges or corners to fine-tune"
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-white/[0.04] px-3 py-1.5 text-[11px] font-mono text-white/50 ring-1 ring-white/[0.06]",
							children: [
								"Source: ",
								videoW,
								"×",
								videoH
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: overlayRef,
					className: "relative flex-1 overflow-hidden",
					onPointerDown: handlePointerDown,
					onPointerMove: handlePointerMove,
					onPointerUp: handlePointerUp,
					onPointerLeave: handlePointerUp,
					style: { touchAction: "none" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: selection && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						exit: {
							opacity: 0,
							transition: { duration: .15 }
						},
						className: "absolute",
						style: {
							left: selection.x,
							top: selection.y,
							width: selection.width,
							height: selection.height,
							cursor: isDragging || activeHandle ? "default" : "move"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 rounded-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 rounded-lg pointer-events-none",
									style: {
										border: "2px solid rgba(255,255,255,0.9)",
										boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3), 0 0 0 9999px rgba(0,0,0,0.6)"
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "absolute inset-0 h-full w-full pointer-events-none opacity-20",
									viewBox: "0 0 100 100",
									preserveAspectRatio: "none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "33.3",
											y1: "0",
											x2: "33.3",
											y2: "100",
											stroke: "white",
											strokeWidth: "0.5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "66.6",
											y1: "0",
											x2: "66.6",
											y2: "100",
											stroke: "white",
											strokeWidth: "0.5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "0",
											y1: "33.3",
											x2: "100",
											y2: "33.3",
											stroke: "white",
											strokeWidth: "0.5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "0",
											y1: "66.6",
											x2: "100",
											y2: "66.6",
											stroke: "white",
											strokeWidth: "0.5"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: !isDragging && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: -4
								},
								animate: {
									opacity: 1,
									y: 0
								},
								exit: {
									opacity: 0,
									y: -4
								},
								className: "absolute -top-9 left-0 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-mono text-white/80 backdrop-blur-sm ring-1 ring-white/[0.12]",
									children: [
										recordedW,
										" × ",
										recordedH
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white/50 backdrop-blur-sm ring-1 ring-white/[0.08]",
									children: selection.width >= MIN_SIZE && selection.height >= MIN_SIZE ? (recordedW / recordedH).toFixed(2) : "-"
								})]
							}) }),
							!isDragging && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [[
								"nw",
								"ne",
								"sw",
								"se"
							].map((dir) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onPointerDown: handleResizeStart(dir),
								className: `absolute z-10 ${HANDLE_CURSOR[dir]} flex items-center justify-center`,
								style: {
									width: 16,
									height: 16,
									[dir.includes("n") ? "top" : "bottom"]: -8,
									[dir.includes("w") ? "left" : "right"]: -8
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full rounded-full border-2 border-white bg-white/90 shadow-lg" })
							}, dir)), [
								"n",
								"s",
								"e",
								"w"
							].map((dir) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onPointerDown: handleResizeStart(dir),
								className: `absolute z-10 ${HANDLE_CURSOR[dir]} flex items-center justify-center`,
								style: {
									width: dir === "e" || dir === "w" ? 26 : HANDLE_SIZE - 4,
									height: dir === "n" || dir === "s" ? 26 : HANDLE_SIZE - 4,
									...dir === "n" ? {
										top: -2,
										left: "50%",
										transform: "translateX(-50%)"
									} : {},
									...dir === "s" ? {
										bottom: -2,
										left: "50%",
										transform: "translateX(-50%)"
									} : {},
									...dir === "e" ? {
										right: -2,
										top: "50%",
										transform: "translateY(-50%)"
									} : {},
									...dir === "w" ? {
										left: -2,
										top: "50%",
										transform: "translateY(-50%)"
									} : {}
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-full bg-white/60 ring-1 ring-white/30",
									style: {
										width: dir === "e" || dir === "w" ? 6 : 4,
										height: dir === "n" || dir === "s" ? 6 : 4
									}
								})
							}, dir))] })
						]
					}, "selection") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showHints && !selection && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -8
						},
						transition: { duration: .3 },
						className: "absolute inset-0 flex items-center justify-center pointer-events-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-3 rounded-2xl bg-black/50 px-8 py-6 backdrop-blur-md ring-1 ring-white/[0.08]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, { className: "h-6 w-6 text-white/60" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-white/80",
									children: "Click & drag to select an area"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-white/40",
									children: "Drag the edges or corners to fine-tune"
								})]
							})]
						})
					}, "hints") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-6 px-8 py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onCancel,
							className: "flex items-center gap-2 rounded-full bg-white/[0.06] px-6 py-3 text-sm text-white/50 ring-1 ring-white/[0.08] transition-all hover:bg-white/[0.1] hover:text-white/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Cancel"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [selection && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-white/40 ring-1 ring-white/[0.06]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									recordedW,
									"×",
									recordedH,
									" @ ",
									Math.round(recordedW * recordedH * 30 / 1e6),
									" ",
									"Mbps"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleConfirm,
								disabled: !hasValidSelection,
								className: "flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/0.4)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crop, { className: "h-4 w-4" }), hasValidSelection ? "Start Recording" : "Select an area first"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 rounded-lg bg-white/[0.03] px-3 py-2 text-[10px] text-white/20 ring-1 ring-white/[0.06]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Esc to cancel" })]
						})
					]
				})
			]
		})]
	});
}
function MultiMonitorSetup({ streams, onAddMonitor, onStart, onCancel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-sm select-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex flex-col h-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between px-6 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-medium text-white/70",
						children: [
							"Multi-monitor setup — ",
							streams.length,
							" display",
							streams.length !== 1 ? "s" : "",
							" selected"
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex items-center justify-center p-6 gap-6",
					children: [streams.map((stream, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorPreview, {
						stream,
						label: `Display ${i + 1}`
					}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onAddMonitor,
						className: "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/[0.15] bg-white/[0.02] px-10 py-12 transition-all hover:border-white/[0.3] hover:bg-white/[0.04]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-8 w-8 text-white/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-white/40",
							children: "Add another display"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-4 px-6 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onCancel,
						className: "flex items-center gap-2 rounded-full bg-white/[0.06] px-6 py-3 text-sm text-white/60 ring-1 ring-white/[0.08] backdrop-blur-xl transition-all hover:bg-white/[0.1] hover:text-white/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Cancel"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onStart,
						disabled: streams.length < 2,
						className: "flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/0.4)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }),
							"Record All (",
							streams.length,
							")"
						]
					})]
				})
			]
		})
	});
}
function MonitorPreview({ stream, label }) {
	const videoRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
			videoRef.current.play().catch(() => {});
		}
	}, [stream]);
	const track = stream.getVideoTracks()[0];
	const settings = track?.getSettings();
	const label_text = track?.label ?? label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video w-64 overflow-hidden rounded-xl bg-black/60 ring-1 ring-white/[0.08]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				muted: true,
				playsInline: true,
				className: "h-full w-full object-contain"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 ring-1 ring-white/[0.08]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-3 w-3 text-white/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] text-white/60 truncate max-w-32",
					children: label_text
				})]
			})]
		}), settings && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-[11px] text-white/30 font-mono",
			children: [
				settings.width,
				"×",
				settings.height
			]
		})]
	});
}
var COLORS = [
	"#ffffff",
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899"
];
var TOOLS = [
	{
		id: "pen",
		icon: Pencil,
		label: "Pen"
	},
	{
		id: "highlighter",
		icon: Highlighter,
		label: "Highlighter"
	},
	{
		id: "eraser",
		icon: Eraser,
		label: "Eraser"
	},
	{
		id: "line",
		icon: Minus,
		label: "Line"
	},
	{
		id: "arrow",
		icon: ArrowUpRight,
		label: "Arrow"
	},
	{
		id: "rect",
		icon: Square,
		label: "Rectangle"
	},
	{
		id: "fill-rect",
		icon: Square,
		label: "Filled Rect"
	},
	{
		id: "circle",
		icon: Circle,
		label: "Circle"
	},
	{
		id: "fill-circle",
		icon: Circle,
		label: "Filled Circle"
	},
	{
		id: "diamond",
		icon: Diamond,
		label: "Diamond"
	},
	{
		id: "star",
		icon: Star,
		label: "Star"
	},
	{
		id: "text",
		icon: Type,
		label: "Text"
	}
];
function DrawingOverlay({ enabled, annotationCanvasRef, recordingWidth, recordingHeight, onClear }) {
	const displayCanvasRef = (0, import_react.useRef)(null);
	const containerRef = (0, import_react.useRef)(null);
	const drawing = (0, import_react.useRef)(false);
	const undoStack = (0, import_react.useRef)([]);
	const startPos = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const lastPos = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const [tool, setTool] = (0, import_react.useState)("pen");
	const [color, setColor] = (0, import_react.useState)(COLORS[0]);
	const [size, setSize] = (0, import_react.useState)(3);
	const [textInput, setTextInput] = (0, import_react.useState)(null);
	const toolRef = (0, import_react.useRef)(tool);
	toolRef.current = tool;
	const colorRef = (0, import_react.useRef)(color);
	colorRef.current = color;
	const sizeRef = (0, import_react.useRef)(size);
	sizeRef.current = size;
	const toRecording = (0, import_react.useCallback)((clientX, clientY) => {
		const el = containerRef.current;
		if (!el) return {
			x: 0,
			y: 0
		};
		const r = el.getBoundingClientRect();
		return {
			x: (clientX - r.left) / r.width * recordingWidth,
			y: (clientY - r.top) / r.height * recordingHeight
		};
	}, [recordingWidth, recordingHeight]);
	const syncDisplay = (0, import_react.useCallback)(() => {
		const ac = annotationCanvasRef.current;
		const dc = displayCanvasRef.current;
		const el = containerRef.current;
		if (!ac || !dc || !el) return;
		const r = el.getBoundingClientRect();
		dc.width = Math.round(r.width);
		dc.height = Math.round(r.height);
		const dctx = dc.getContext("2d");
		dctx.clearRect(0, 0, dc.width, dc.height);
		dctx.drawImage(ac, 0, 0, dc.width, dc.height);
	}, [annotationCanvasRef]);
	const saveSnapshot = (0, import_react.useCallback)(() => {
		const ac = annotationCanvasRef.current;
		if (!ac) return;
		const ctx = ac.getContext("2d");
		if (!ctx) return;
		const data = ctx.getImageData(0, 0, ac.width, ac.height);
		undoStack.current.push(data);
		if (undoStack.current.length > 30) undoStack.current.shift();
	}, [annotationCanvasRef]);
	const handleUndo = (0, import_react.useCallback)(() => {
		const ac = annotationCanvasRef.current;
		if (!ac) return;
		const ctx = ac.getContext("2d");
		if (!ctx) return;
		const prev = undoStack.current.pop();
		if (!prev) {
			ctx.clearRect(0, 0, ac.width, ac.height);
			syncDisplay();
			return;
		}
		ctx.putImageData(prev, 0, 0);
		syncDisplay();
	}, [annotationCanvasRef, syncDisplay]);
	const drawOnAnnotation = (0, import_react.useCallback)((drawFn) => {
		const ac = annotationCanvasRef.current;
		if (!ac) return;
		const ctx = ac.getContext("2d");
		if (!ctx) return;
		ctx.save();
		drawFn(ctx);
		ctx.restore();
	}, [annotationCanvasRef]);
	const getCtxProps = (0, import_react.useCallback)((ctx) => {
		const t = toolRef.current;
		if (t === "eraser") {
			ctx.globalCompositeOperation = "destination-out";
			ctx.strokeStyle = "rgba(0,0,0,1)";
			ctx.lineWidth = sizeRef.current * 8;
		} else if (t === "highlighter") {
			ctx.strokeStyle = colorRef.current;
			ctx.globalAlpha = .3;
			ctx.lineWidth = sizeRef.current * 4;
		} else {
			ctx.strokeStyle = colorRef.current;
			ctx.globalAlpha = 1;
			ctx.lineWidth = sizeRef.current;
		}
	}, []);
	const handlePointerDown = (0, import_react.useCallback)((e) => {
		if (!enabled) return;
		e.preventDefault();
		const t = toolRef.current;
		if (t === "text") {
			const el = containerRef.current;
			if (!el) return;
			const r = el.getBoundingClientRect();
			setTextInput({
				x: toRecording(e.clientX, e.clientY).x,
				y: toRecording(e.clientX, e.clientY).y,
				displayX: e.clientX - r.left,
				displayY: e.clientY - r.top,
				value: ""
			});
			return;
		}
		drawing.current = true;
		const pos = toRecording(e.clientX, e.clientY);
		startPos.current = pos;
		lastPos.current = pos;
		if (t === "pen" || t === "highlighter" || t === "eraser") {
			saveSnapshot();
			drawOnAnnotation((ctx) => {
				getCtxProps(ctx);
				ctx.beginPath();
				ctx.moveTo(pos.x, pos.y);
			});
		}
	}, [
		enabled,
		toRecording,
		saveSnapshot,
		drawOnAnnotation,
		getCtxProps
	]);
	const handlePointerMove = (0, import_react.useCallback)((e) => {
		if (!drawing.current) return;
		e.preventDefault();
		const pos = toRecording(e.clientX, e.clientY);
		const t = toolRef.current;
		if (t === "pen" || t === "highlighter" || t === "eraser") {
			drawOnAnnotation((ctx) => {
				getCtxProps(ctx);
				ctx.lineTo(pos.x, pos.y);
				ctx.stroke();
			});
			syncDisplay();
		} else {
			const ac = annotationCanvasRef.current;
			const dc = displayCanvasRef.current;
			const el = containerRef.current;
			if (!ac || !dc || !el) return;
			const r = el.getBoundingClientRect();
			const dctx = dc.getContext("2d");
			dctx.clearRect(0, 0, dc.width, dc.height);
			dctx.drawImage(ac, 0, 0, dc.width, dc.height);
			const sx = r.width / recordingWidth;
			const sy = r.height / recordingHeight;
			const x1 = startPos.current.x * sx;
			const y1 = startPos.current.y * sy;
			const x2 = pos.x * sx;
			const y2 = pos.y * sy;
			dctx.save();
			dctx.strokeStyle = colorRef.current;
			dctx.globalAlpha = 1;
			dctx.lineWidth = sizeRef.current * sx;
			dctx.lineCap = "round";
			dctx.lineJoin = "round";
			switch (t) {
				case "line":
					dctx.beginPath();
					dctx.moveTo(x1, y1);
					dctx.lineTo(x2, y2);
					dctx.stroke();
					break;
				case "arrow": {
					const angle = Math.atan2(y2 - y1, x2 - x1);
					const headLen = 12 * sx;
					dctx.beginPath();
					dctx.moveTo(x1, y1);
					dctx.lineTo(x2, y2);
					dctx.stroke();
					dctx.beginPath();
					dctx.moveTo(x2, y2);
					dctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
					dctx.moveTo(x2, y2);
					dctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
					dctx.stroke();
					break;
				}
				case "rect":
				case "fill-rect":
					dctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
					if (t === "fill-rect") {
						dctx.fillStyle = colorRef.current;
						dctx.globalAlpha = .3;
						dctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
					}
					break;
				case "circle":
				case "fill-circle": {
					const cx = (x1 + x2) / 2;
					const cy = (y1 + y2) / 2;
					const rx = Math.abs(x2 - x1) / 2;
					const ry = Math.abs(y2 - y1) / 2;
					dctx.beginPath();
					dctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
					dctx.stroke();
					if (t === "fill-circle") {
						dctx.fillStyle = colorRef.current;
						dctx.globalAlpha = .3;
						dctx.fill();
					}
					break;
				}
				case "diamond":
					dctx.beginPath();
					dctx.moveTo((x1 + x2) / 2, y1);
					dctx.lineTo(x2, (y1 + y2) / 2);
					dctx.lineTo((x1 + x2) / 2, y2);
					dctx.lineTo(x1, (y1 + y2) / 2);
					dctx.closePath();
					dctx.stroke();
					break;
				case "star": {
					const cx = (x1 + x2) / 2;
					const cy = (y1 + y2) / 2;
					const rx = Math.abs(x2 - x1) / 2;
					const ry = Math.abs(y2 - y1) / 2;
					const spikes = 5;
					const outerR = Math.min(rx, ry);
					const innerR = outerR * .4;
					dctx.beginPath();
					for (let i = 0; i < spikes * 2; i++) {
						const r2 = i % 2 === 0 ? outerR : innerR;
						const a = Math.PI * i / spikes - Math.PI / 2;
						const px = cx + r2 * Math.cos(a);
						const py = cy + r2 * Math.sin(a);
						if (i === 0) dctx.moveTo(px, py);
						else dctx.lineTo(px, py);
					}
					dctx.closePath();
					dctx.stroke();
					break;
				}
			}
			dctx.restore();
		}
		lastPos.current = pos;
	}, [
		toRecording,
		drawOnAnnotation,
		getCtxProps,
		syncDisplay,
		annotationCanvasRef,
		recordingWidth,
		recordingHeight
	]);
	const handlePointerUp = (0, import_react.useCallback)((e) => {
		if (!drawing.current) return;
		drawing.current = false;
		const t = toolRef.current;
		if (t === "pen" || t === "highlighter" || t === "eraser") return;
		const pos = toRecording(e.clientX, e.clientY);
		saveSnapshot();
		drawOnAnnotation((ctx) => {
			getCtxProps(ctx);
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			const x1 = startPos.current.x;
			const y1 = startPos.current.y;
			const x2 = pos.x;
			const y2 = pos.y;
			switch (t) {
				case "line":
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
					break;
				case "arrow": {
					const angle = Math.atan2(y2 - y1, x2 - x1);
					const headLen = 12;
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(x2, y2);
					ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
					ctx.moveTo(x2, y2);
					ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
					ctx.stroke();
					break;
				}
				case "rect":
				case "fill-rect":
					ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
					if (t === "fill-rect") {
						ctx.fillStyle = colorRef.current;
						ctx.globalAlpha = .3;
						ctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
					}
					break;
				case "circle":
				case "fill-circle": {
					const cx = (x1 + x2) / 2;
					const cy = (y1 + y2) / 2;
					const rx = Math.abs(x2 - x1) / 2;
					const ry = Math.abs(y2 - y1) / 2;
					ctx.beginPath();
					ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
					ctx.stroke();
					if (t === "fill-circle") {
						ctx.fillStyle = colorRef.current;
						ctx.globalAlpha = .3;
						ctx.fill();
					}
					break;
				}
				case "diamond":
					ctx.beginPath();
					ctx.moveTo((x1 + x2) / 2, y1);
					ctx.lineTo(x2, (y1 + y2) / 2);
					ctx.lineTo((x1 + x2) / 2, y2);
					ctx.lineTo(x1, (y1 + y2) / 2);
					ctx.closePath();
					ctx.stroke();
					break;
				case "star": {
					const cx = (x1 + x2) / 2;
					const cy = (y1 + y2) / 2;
					const rx = Math.abs(x2 - x1) / 2;
					const ry = Math.abs(y2 - y1) / 2;
					const spikes = 5;
					const outerR = Math.min(rx, ry);
					const innerR = outerR * .4;
					ctx.beginPath();
					for (let i = 0; i < spikes * 2; i++) {
						const r2 = i % 2 === 0 ? outerR : innerR;
						const a = Math.PI * i / spikes - Math.PI / 2;
						const px = cx + r2 * Math.cos(a);
						const py = cy + r2 * Math.sin(a);
						if (i === 0) ctx.moveTo(px, py);
						else ctx.lineTo(px, py);
					}
					ctx.closePath();
					ctx.stroke();
					break;
				}
			}
		});
		syncDisplay();
	}, [
		toRecording,
		saveSnapshot,
		drawOnAnnotation,
		getCtxProps,
		syncDisplay
	]);
	const commitText = (0, import_react.useCallback)((text, x, y) => {
		if (!text.trim()) return;
		saveSnapshot();
		drawOnAnnotation((ctx) => {
			ctx.save();
			ctx.font = `${sizeRef.current * 6}px sans-serif`;
			ctx.fillStyle = colorRef.current;
			ctx.globalAlpha = 1;
			ctx.textBaseline = "top";
			const lines = text.split("\n");
			const lineH = sizeRef.current * 7;
			lines.forEach((line, i) => {
				ctx.fillText(line, x, y + i * lineH);
			});
			ctx.restore();
		});
		syncDisplay();
	}, [
		saveSnapshot,
		drawOnAnnotation,
		syncDisplay
	]);
	(0, import_react.useEffect)(() => {
		if (enabled) syncDisplay();
	}, [enabled, syncDisplay]);
	(0, import_react.useEffect)(() => {
		if (!enabled || !containerRef.current) return;
		const ro = new ResizeObserver(() => syncDisplay());
		ro.observe(containerRef.current);
		return () => ro.disconnect();
	}, [enabled, syncDisplay]);
	if (!enabled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[9997] pointer-events-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				className: "absolute inset-0 pointer-events-auto",
				onPointerDown: handlePointerDown,
				onPointerMove: handlePointerMove,
				onPointerUp: handlePointerUp,
				style: { touchAction: "none" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: displayCanvasRef,
					className: "h-full w-full"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-2xl bg-black/70 px-3 py-2 backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-2xl",
					children: [
						TOOLS.map(({ id, icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: label,
							onClick: () => setTool(id),
							className: cn("flex h-8 w-8 items-center justify-center rounded-lg transition-all", tool === id ? "bg-white/[0.12] text-white" : "text-white/40 hover:text-white/70 hover:bg-white/[0.06]"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}, id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-white/[0.08]" }),
						COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: c,
							onClick: () => setColor(c),
							className: cn("h-5 w-5 rounded-full ring-1 ring-white/[0.15] transition-all", color === c && "ring-2 ring-white scale-110"),
							style: { backgroundColor: c }
						}, c)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-white/[0.08]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: 12,
							step: 1,
							value: size,
							onChange: (e) => setSize(Number(e.target.value)),
							className: "w-16 h-1 accent-white/50",
							title: "Brush size"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 h-6 w-px bg-white/[0.08]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Undo",
							onClick: handleUndo,
							className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Clear all",
							onClick: onClear,
							className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.06] transition-all",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})
					]
				})
			}),
			textInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[9998] pointer-events-auto",
				onPointerDown: () => {
					if (textInput.value.trim()) commitText(textInput.value, textInput.x, textInput.y);
					setTextInput(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					autoFocus: true,
					value: textInput.value,
					onChange: (e) => setTextInput({
						...textInput,
						value: e.target.value
					}),
					onKeyDown: (e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							commitText(textInput.value, textInput.x, textInput.y);
							setTextInput(null);
						}
						if (e.key === "Escape") setTextInput(null);
					},
					onPointerDown: (e) => e.stopPropagation(),
					className: "absolute bg-black/80 text-white rounded-lg border border-white/20 p-2 shadow-2xl outline-none resize-none overflow-hidden",
					style: {
						left: textInput.displayX,
						top: textInput.displayY,
						minWidth: 120,
						minHeight: 36,
						fontSize: Math.max(12, size * 2.5),
						lineHeight: 1.4,
						fontFamily: "sans-serif",
						color
					},
					rows: 1,
					placeholder: "Type here..."
				})
			})
		]
	});
}
function getSupportedMimeType() {
	for (const t of [
		"video/webm;codecs=vp9",
		"video/webm;codecs=vp8",
		"video/webm"
	]) if (MediaRecorder.isTypeSupported(t)) return t;
	return "video/webm";
}
function loadVideo(blob) {
	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
		video.src = URL.createObjectURL(blob);
		video.muted = true;
		video.playsInline = true;
		video.preload = "auto";
		video.onloadedmetadata = () => resolve(video);
		video.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load video"));
	});
}
function createRecorder(canvas, fps, onDone, onError) {
	const stream = canvas.captureStream(fps);
	const mimeType = getSupportedMimeType();
	const recorder = new MediaRecorder(stream, { mimeType });
	const chunks = [];
	recorder.ondataavailable = (e) => {
		if (e.data.size > 0) chunks.push(e.data);
	};
	recorder.onstop = () => {
		onDone(new Blob(chunks, { type: "video/webm" }));
	};
	recorder.onerror = (e) => onError(e.error);
	recorder.start();
	return recorder;
}
async function processFrames(blob, outputWidth, outputHeight, fps, renderFrame) {
	const video = await loadVideo(blob);
	const canvas = document.createElement("canvas");
	canvas.width = outputWidth;
	canvas.height = outputHeight;
	const ctx = canvas.getContext("2d");
	return new Promise((resolve, reject) => {
		const recorder = createRecorder(canvas, fps, (result) => {
			URL.revokeObjectURL(video.src);
			resolve(result);
		}, (err) => {
			URL.revokeObjectURL(video.src);
			reject(err);
		});
		let running = true;
		const tick = () => {
			if (!running) return;
			if (!renderFrame(video, ctx, canvas)) {
				running = false;
				if (recorder.state === "recording") recorder.stop();
				return;
			}
			requestAnimationFrame(tick);
		};
		video.play().then(() => {
			requestAnimationFrame(tick);
		}).catch((err) => {
			running = false;
			if (recorder.state === "recording") recorder.stop();
			reject(err);
		});
	});
}
async function cropVideo(blob, cropRect, outputWidth, outputHeight, options) {
	const fps = options.fps ?? 30;
	const canvas = document.createElement("canvas");
	canvas.width = outputWidth;
	canvas.height = outputHeight;
	const ctx = canvas.getContext("2d");
	return processFrames(blob, outputWidth, outputHeight, fps, (video, _ctx, _canvas) => {
		if (video.ended) return false;
		ctx.drawImage(video, cropRect.x, cropRect.y, cropRect.width, cropRect.height, 0, 0, outputWidth, outputHeight);
		return true;
	});
}
async function resizeVideo(blob, outputWidth, outputHeight, options) {
	return processFrames(blob, outputWidth, outputHeight, options.fps ?? 30, (video, _ctx, _canvas) => {
		if (video.ended) return false;
		_ctx.drawImage(video, 0, 0, outputWidth, outputHeight);
		return true;
	});
}
async function mergeClips(blobs, options) {
	if (blobs.length === 0) throw new Error("No clips to merge");
	if (blobs.length === 1) return blobs[0];
	const fps = options.fps ?? 30;
	const canvas = document.createElement("canvas");
	canvas.width = options.width;
	canvas.height = options.height;
	const ctx = canvas.getContext("2d");
	return new Promise((resolve, reject) => {
		const recorder = createRecorder(canvas, fps, resolve, reject);
		let index = 0;
		const video = document.createElement("video");
		video.muted = true;
		video.playsInline = true;
		const urls = [];
		const playNext = () => {
			if (index >= blobs.length) {
				if (recorder.state === "recording") recorder.stop();
				urls.forEach((u) => URL.revokeObjectURL(u));
				return;
			}
			const url = URL.createObjectURL(blobs[index]);
			urls.push(url);
			video.src = url;
			video.onloadedmetadata = () => video.play();
			index++;
		};
		const tick = () => {
			if (recorder.state !== "recording") return;
			if (!video.paused && !video.ended && video.readyState >= 2) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			if (video.ended) playNext();
			requestAnimationFrame(tick);
		};
		playNext();
		requestAnimationFrame(tick);
	});
}
async function processWithEffects(blob, options) {
	const video = await loadVideo(blob);
	const canvas = document.createElement("canvas");
	canvas.width = options.width;
	canvas.height = options.height;
	const ctx = canvas.getContext("2d");
	const fps = options.fps ?? 30;
	const speed = options.speed ?? 1;
	const captionList = options.captions ?? [];
	const hasMusic = !!options.music;
	return new Promise((resolve, reject) => {
		run().catch(reject);
		async function run() {
			let audioTrack = null;
			let audioCtx = null;
			let audioEl = null;
			const cleanupUrls = [];
			let audioStarted = false;
			if (hasMusic && options.music) try {
				audioCtx = new AudioContext();
				audioEl = document.createElement("audio");
				const musicUrl = URL.createObjectURL(options.music.blob);
				cleanupUrls.push(musicUrl);
				audioEl.src = musicUrl;
				audioEl.loop = false;
				audioEl.volume = 1;
				const source = audioCtx.createMediaElementSource(audioEl);
				const gain = audioCtx.createGain();
				gain.gain.value = options.music.volume;
				const dest = audioCtx.createMediaStreamDestination();
				source.connect(gain);
				gain.connect(dest);
				audioTrack = dest.stream.getAudioTracks()[0];
			} catch (err) {
				console.warn("Music setup failed, continuing without audio", err);
			}
			const tracks = canvas.captureStream(fps).getVideoTracks();
			if (audioTrack) tracks.push(audioTrack);
			const combinedStream = new MediaStream(tracks);
			const mimeType = getSupportedMimeType();
			const recorder = new MediaRecorder(combinedStream, { mimeType });
			const chunks = [];
			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunks.push(e.data);
			};
			recorder.onstop = () => {
				const result = new Blob(chunks, { type: "video/webm" });
				cleanupUrls.forEach((u) => URL.revokeObjectURL(u));
				URL.revokeObjectURL(video.src);
				if (audioCtx) audioCtx.close().catch(() => {});
				resolve(result);
			};
			recorder.onerror = (e) => reject(e.error);
			if (options.trim) {
				video.currentTime = options.trim.start;
				await new Promise((res) => {
					video.onseeked = () => res();
					video.onerror = () => res();
				});
			}
			recorder.start();
			const endTime = options.trim?.end ?? video.duration;
			video.playbackRate = speed;
			await video.play();
			if (audioEl && audioTrack) {
				audioEl.currentTime = 0;
				audioEl.play().catch(() => {});
				audioStarted = true;
			}
			const tick = () => {
				if (recorder.state === "inactive") return;
				if (video.currentTime >= endTime || video.ended) {
					video.pause();
					if (audioEl && audioStarted) audioEl.pause();
					if (recorder.state === "recording") recorder.stop();
					return;
				}
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				const ct = video.currentTime;
				for (const cap of captionList) if (ct >= cap.start && ct <= cap.end) {
					const fontSize = Math.max(14, Math.round(canvas.width * .035));
					ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`;
					const metrics = ctx.measureText(cap.text);
					const pad = Math.round(canvas.width * .02);
					const textX = canvas.width / 2;
					const textY = canvas.height * .88;
					const bw = metrics.width + pad * 2;
					const bh = fontSize * 1.6;
					const bx = textX - bw / 2;
					const by = textY - bh / 2;
					ctx.fillStyle = "rgba(0,0,0,0.65)";
					ctx.beginPath();
					ctx.roundRect(bx, by, bw, bh, Math.round(fontSize * .4));
					ctx.fill();
					ctx.fillStyle = "#ffffff";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(cap.text, textX, textY);
				}
				requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		}
	});
}
var ASPECTS = [
	{
		label: "16:9",
		w: 16,
		h: 9
	},
	{
		label: "4:3",
		w: 4,
		h: 3
	},
	{
		label: "1:1",
		w: 1,
		h: 1
	},
	{
		label: "9:16",
		w: 9,
		h: 16
	}
];
function formatTime(sec) {
	const m = Math.floor(sec / 60);
	const s = Math.floor(sec % 60);
	return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
function VideoEditor({ blob, onClose }) {
	const videoRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const [videoUrl, setVideoUrl] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [currentTime, setCurrentTime] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("trim");
	const [trimStart, setTrimStart] = (0, import_react.useState)(0);
	const [trimEnd, setTrimEnd] = (0, import_react.useState)(0);
	const [mergeClips$1, setMergeClips] = (0, import_react.useState)([blob]);
	const [cropX, setCropX] = (0, import_react.useState)(.1);
	const [cropY, setCropY] = (0, import_react.useState)(.1);
	const [cropW, setCropW] = (0, import_react.useState)(.8);
	const [cropH, setCropH] = (0, import_react.useState)(.8);
	const [outputW, setOutputW] = (0, import_react.useState)(1920);
	const [outputH, setOutputH] = (0, import_react.useState)(1080);
	const [aspectLocked, setAspectLocked] = (0, import_react.useState)(true);
	const [vidW, setVidW] = (0, import_react.useState)(1920);
	const [vidH, setVidH] = (0, import_react.useState)(1080);
	const [speed, setSpeed] = (0, import_react.useState)(1);
	const [captions, setCaptions] = (0, import_react.useState)([]);
	const [newCaptionText, setNewCaptionText] = (0, import_react.useState)("");
	const [newCaptionStart, setNewCaptionStart] = (0, import_react.useState)(0);
	const [newCaptionEnd, setNewCaptionEnd] = (0, import_react.useState)(0);
	const [editingCaptionId, setEditingCaptionId] = (0, import_react.useState)(null);
	const [musicBlob, setMusicBlob] = (0, import_react.useState)(null);
	const [musicVolume, setMusicVolume] = (0, import_react.useState)(.5);
	const musicInputRef = (0, import_react.useRef)(null);
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [processingLabel, setProcessingLabel] = (0, import_react.useState)("");
	const [resultBlob, setResultBlob] = (0, import_react.useState)(null);
	const [resultUrl, setResultUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const url = URL.createObjectURL(blob);
		setVideoUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [blob]);
	(0, import_react.useEffect)(() => {
		if (!videoRef.current) return;
		const v = videoRef.current;
		const onMeta = () => {
			setDuration(v.duration);
			setTrimEnd(v.duration);
			setVidW(v.videoWidth || 1920);
			setVidH(v.videoHeight || 1080);
		};
		const onTime = () => setCurrentTime(v.currentTime);
		const onEnd = () => setPlaying(false);
		v.addEventListener("loadedmetadata", onMeta);
		v.addEventListener("timeupdate", onTime);
		v.addEventListener("ended", onEnd);
		return () => {
			v.removeEventListener("loadedmetadata", onMeta);
			v.removeEventListener("timeupdate", onTime);
			v.removeEventListener("ended", onEnd);
		};
	}, [videoUrl]);
	const togglePlay = (0, import_react.useCallback)(() => {
		if (!videoRef.current) return;
		if (playing) videoRef.current.pause();
		else videoRef.current.play();
		setPlaying(!playing);
	}, [playing]);
	const seekTo = (0, import_react.useCallback)((time) => {
		if (!videoRef.current) return;
		videoRef.current.currentTime = time;
		setCurrentTime(time);
	}, []);
	const handleTrimStart = (val) => {
		if (val >= trimEnd) return;
		setTrimStart(val);
		seekTo(val);
	};
	const handleTrimEnd = (val) => {
		if (val <= trimStart) return;
		setTrimEnd(val);
		seekTo(val);
	};
	const applyTrim = async () => {
		const actualEnd = Math.min(trimEnd, duration);
		if (actualEnd - trimStart < .5) return;
		setProcessing(true);
		setProcessingLabel("Applying effects…");
		try {
			setResultBlob(await processWithEffects(blob, {
				width: vidW,
				height: vidH,
				fps: 30,
				trim: {
					start: trimStart,
					end: actualEnd
				},
				speed,
				captions,
				music: musicBlob ? {
					blob: musicBlob,
					volume: musicVolume
				} : void 0
			}));
		} catch (err) {
			console.error("Processing failed", err);
		} finally {
			setProcessing(false);
		}
	};
	const addClip = (e) => {
		const vidFiles = Array.from(e.target.files || []).filter((f) => f.type.startsWith("video/"));
		if (vidFiles.length === 0) return;
		setMergeClips((prev) => [...prev, ...vidFiles]);
		e.target.value = "";
	};
	const removeClip = (idx) => {
		setMergeClips((prev) => prev.filter((_, i) => i !== idx));
	};
	const applyMerge = async () => {
		if (mergeClips$1.length < 2) return;
		setProcessing(true);
		setProcessingLabel("Merging clips…");
		try {
			setResultBlob(await mergeClips(mergeClips$1, {
				width: vidW,
				height: vidH,
				fps: 30
			}));
		} catch (err) {
			console.error("Merge failed", err);
		} finally {
			setProcessing(false);
		}
	};
	const setAspect = (w, h) => {
		setCropH(cropW / (w / h));
	};
	const applyCrop = async () => {
		const rect = {
			x: Math.round(cropX * vidW),
			y: Math.round(cropY * vidH),
			width: Math.round(cropW * vidW),
			height: Math.round(cropH * vidH)
		};
		if (rect.width < 16 || rect.height < 16) return;
		setProcessing(true);
		setProcessingLabel(outputW === vidW && outputH === vidH ? "Cropping video…" : "Resizing video…");
		try {
			const cropped = await cropVideo(blob, rect, rect.width, rect.height, {
				width: vidW,
				height: vidH,
				fps: 30
			});
			if (outputW !== rect.width || outputH !== rect.height) setResultBlob(await resizeVideo(cropped, outputW, outputH, {
				width: outputW,
				height: outputH,
				fps: 30
			}));
			else setResultBlob(cropped);
		} catch (err) {
			console.error("Crop failed", err);
		} finally {
			setProcessing(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (resultBlob) {
			const url = URL.createObjectURL(resultBlob);
			setResultUrl(url);
			return () => URL.revokeObjectURL(url);
		}
	}, [resultBlob]);
	const downloadResult = () => {
		if (!resultBlob) return;
		const a = document.createElement("a");
		a.href = resultUrl;
		a.download = `screencapture-pro_edited_${Date.now()}.webm`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	};
	const addCaption = () => {
		if (!newCaptionText.trim()) return;
		const id = crypto.randomUUID();
		setCaptions((prev) => [...prev, {
			id,
			start: newCaptionStart,
			end: newCaptionEnd,
			text: newCaptionText.trim()
		}]);
		setNewCaptionText("");
	};
	const removeCaption = (id) => {
		setCaptions((prev) => prev.filter((c) => c.id !== id));
		if (editingCaptionId === id) setEditingCaptionId(null);
	};
	const updateCaption = (id, updates) => {
		setCaptions((prev) => prev.map((c) => c.id === id ? {
			...c,
			...updates
		} : c));
	};
	const handleMusicFile = (e) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith("audio/")) setMusicBlob(file);
		e.target.value = "";
	};
	const resetEditor = () => {
		setResultBlob(null);
		setResultUrl("");
		setTrimStart(0);
		setTrimEnd(duration);
		setMergeClips([blob]);
		setSpeed(1);
		setCaptions([]);
		setMusicBlob(null);
		setMusicVolume(.5);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				scale: .96,
				y: 10
			},
			animate: {
				opacity: 1,
				scale: 1,
				y: 0
			},
			transition: {
				duration: .3,
				ease: [
					.25,
					.1,
					.25,
					1
				]
			},
			className: "w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-black/80 backdrop-blur-2xl ring-1 ring-white/[0.06] shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-4 border-b border-white/[0.06]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-[0_0_16px_-4px_oklch(0.74_0.15_222/0.3)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-white" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold text-white/90",
							children: resultBlob ? "Edit complete" : "Video Editor"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-video w-full overflow-hidden rounded-xl bg-black/60 ring-1 ring-white/[0.06]",
						children: [
							resultBlob ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: resultUrl,
								autoPlay: true,
								muted: true,
								playsInline: true,
								controls: true,
								className: "h-full w-full object-contain"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								src: videoUrl,
								muted: true,
								playsInline: true,
								className: "h-full w-full object-contain"
							}),
							tab === "crop" && !resultBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute border-2 border-primary/60 bg-primary/5",
									style: {
										left: `${cropX * 100}%`,
										top: `${cropY * 100}%`,
										width: `${cropW * 100}%`,
										height: `${cropH * 100}%`
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 -left-3 h-6 w-6 border-t-2 border-l-2 border-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-3 -right-3 h-6 w-6 border-t-2 border-r-2 border-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-3 -left-3 h-6 w-6 border-b-2 border-l-2 border-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-3 -right-3 h-6 w-6 border-b-2 border-r-2 border-primary" })
									]
								})
							}),
							!playing && !resultBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: togglePlay,
								className: "absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-6 w-6 text-white/80 ml-0.5" })
								})
							}),
							processing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-sm z-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-white/60 font-medium",
									children: processingLabel
								})]
							})
						]
					}), !resultBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: togglePlay,
								className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all ring-1 ring-white/[0.06]",
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5 text-white/60" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 text-white/60 ml-0.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: duration || 1,
								step: .1,
								value: currentTime,
								onChange: (e) => seekTo(Number(e.target.value)),
								className: "flex-1 h-1 accent-primary/60 cursor-pointer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-mono text-white/40 tabular-nums shrink-0 w-20 text-right",
								children: [
									formatTime(currentTime),
									" / ",
									formatTime(duration)
								]
							})
						]
					})]
				}),
				!resultBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 px-6 border-b border-white/[0.06]",
					children: [
						{
							id: "trim",
							icon: Scissors,
							label: "Trim"
						},
						{
							id: "merge",
							icon: Layers,
							label: "Merge"
						},
						{
							id: "crop",
							icon: Crop,
							label: "Crop / Resize"
						},
						{
							id: "captions",
							icon: Captions,
							label: "Captions"
						},
						{
							id: "music",
							icon: Music,
							label: "Music"
						}
					].map(({ id, icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setTab(id),
						className: cn("flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px", tab === id ? "border-primary text-white border-b-primary" : "border-transparent text-white/30 hover:text-white/50"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), label]
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-4",
					children: resultBlob ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-6 w-6 text-emerald-400" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-white/60 text-center max-w-md",
								children: "Your video has been processed. Download it or start over."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 mt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "hero",
									size: "lg",
									onClick: downloadResult,
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Download"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "glass",
									size: "lg",
									onClick: resetEditor,
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Edit again"]
								})]
							})
						]
					}) : tab === "trim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-white/30",
								children: "Set in/out points, adjust speed, then apply all effects."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-white/[0.06]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-primary/40",
										style: {
											left: `${duration > 0 ? trimStart / duration * 100 : 0}%`,
											width: `${duration > 0 ? (trimEnd - trimStart) / duration * 100 : 0}%`
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: duration || 1,
										step: .1,
										value: trimStart,
										onChange: (e) => handleTrimStart(Number(e.target.value)),
										className: "absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg",
										style: { direction: "ltr" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: duration || 1,
										step: .1,
										value: trimEnd,
										onChange: (e) => handleTrimEnd(Number(e.target.value)),
										className: "absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-primary/30",
										style: { direction: "ltr" }
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-white/40",
										children: ["Start: ", formatTime(trimStart)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-white/60",
										children: formatTime(trimEnd - trimStart)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-white/40",
										children: ["End: ", formatTime(trimEnd)]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-[10px] uppercase tracking-wider text-white/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-3 w-3 inline mr-1 -mt-0.5" }), "Speed"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[11px] text-white/40",
										children: [speed.toFixed(2), "x"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: .25,
									max: 4,
									step: .05,
									value: speed,
									onChange: (e) => setSpeed(Number(e.target.value)),
									className: "w-full h-1 accent-primary/60"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[9px] font-mono text-white/20 mt-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0.25x" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1x" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4x" })
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "hero",
								size: "lg",
								onClick: applyTrim,
								disabled: processing || trimEnd - trimStart < .5,
								className: "w-full gap-2",
								children: [processing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "h-4 w-4" }), processing ? "Processing…" : "Apply Effects"]
							})
						]
					}) : tab === "merge" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-white/30",
								children: "Add video clips and merge them together in sequence."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5 max-h-40 overflow-y-auto",
								children: mergeClips$1.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg bg-white/[0.03] px-3.5 py-2.5 ring-1 ring-white/[0.06]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-6 w-6 items-center justify-center rounded bg-white/[0.05] text-[10px] font-bold text-white/30",
											children: i + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm text-white/50",
											children: [
												"Clip ",
												i + 1,
												" ",
												(c.size / 1024 / 1024).toFixed(1),
												"MB"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1",
										children: i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeClip(i),
											className: "flex h-7 w-7 items-center justify-center rounded text-white/20 hover:text-red-400 hover:bg-white/[0.06] transition-all",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})
									})]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileInputRef,
								type: "file",
								accept: "video/*",
								multiple: true,
								onChange: addClip,
								className: "hidden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "glass",
									size: "lg",
									onClick: () => fileInputRef.current?.click(),
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add clips"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "hero",
									size: "lg",
									onClick: applyMerge,
									disabled: processing || mergeClips$1.length < 2,
									className: "flex-1 gap-2",
									children: [processing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" }), processing ? "Merging…" : `Merge ${mergeClips$1.length} clips`]
								})]
							})
						]
					}) : tab === "captions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-white/30",
								children: "Add text captions that appear at specific times."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 max-h-40 overflow-y-auto",
								children: [captions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-white/15 text-center py-6",
									children: "No captions yet. Add one below."
								}), captions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg bg-white/[0.03] px-3.5 py-2.5 ring-1 ring-white/[0.06]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 min-w-0 mr-2",
										children: editingCaptionId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: c.text,
												onChange: (e) => updateCaption(c.id, { text: e.target.value }),
												className: "w-full rounded bg-white/[0.06] px-2 py-1 text-xs text-white/70 outline-none ring-1 ring-white/[0.06]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													step: .1,
													min: 0,
													value: c.start,
													onChange: (e) => updateCaption(c.id, { start: Number(e.target.value) }),
													className: "w-20 rounded bg-white/[0.06] px-2 py-1 text-[10px] font-mono text-white/50 outline-none ring-1 ring-white/[0.06]"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													step: .1,
													min: 0,
													value: c.end,
													onChange: (e) => updateCaption(c.id, { end: Number(e.target.value) }),
													className: "w-20 rounded bg-white/[0.06] px-2 py-1 text-[10px] font-mono text-white/50 outline-none ring-1 ring-white/[0.06]"
												})]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-white/60 block truncate",
											children: c.text
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-white/20",
											children: [
												formatTime(c.start),
												" \\u2013 ",
												formatTime(c.end)
											]
										})] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setEditingCaptionId(editingCaptionId === c.id ? null : c.id),
											className: "flex h-7 w-7 items-center justify-center rounded text-white/20 hover:text-primary/60 hover:bg-white/[0.06] transition-all",
											children: editingCaptionId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeCaption(c.id),
											className: "flex h-7 w-7 items-center justify-center rounded text-white/20 hover:text-red-400 hover:bg-white/[0.06] transition-all",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
										})]
									})]
								}, c.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-white/[0.02] p-3 ring-1 ring-white/[0.06] space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Caption text\\u2026",
									value: newCaptionText,
									onChange: (e) => setNewCaptionText(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter") addCaption();
									},
									className: "w-full rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-white/70 ring-1 ring-white/[0.06] outline-none placeholder:text-white/15"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[9px] uppercase tracking-wider text-white/15 mb-0.5 block",
												children: "Start"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												step: .1,
												min: 0,
												max: duration,
												value: newCaptionStart,
												onChange: (e) => setNewCaptionStart(Number(e.target.value)),
												className: "w-full rounded bg-white/[0.04] px-2 py-1 text-[11px] font-mono text-white/50 outline-none ring-1 ring-white/[0.06]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[9px] uppercase tracking-wider text-white/15 mb-0.5 block",
												children: "End"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												step: .1,
												min: 0,
												max: duration,
												value: newCaptionEnd,
												onChange: (e) => setNewCaptionEnd(Number(e.target.value)),
												className: "w-full rounded bg-white/[0.04] px-2 py-1 text-[11px] font-mono text-white/50 outline-none ring-1 ring-white/[0.06]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: addCaption,
											disabled: !newCaptionText.trim(),
											className: "self-end flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary/70 hover:bg-primary/30 transition-all disabled:opacity-30",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
										})
									]
								})]
							})
						]
					}) : tab === "music" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-white/30",
								children: "Add background music to your video. The music plays at normal speed alongside the video."
							}),
							!musicBlob ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => musicInputRef.current?.click(),
								className: "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-white/[0.08] py-12 hover:border-primary/30 hover:bg-white/[0.02] transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-8 w-8 text-white/15" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-white/40 font-medium",
										children: "Choose a music file"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-white/20 mt-0.5",
										children: "MP3, M4A, WAV, OGG \\u2026"
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-white/[0.03] px-4 py-3.5 ring-1 ring-white/[0.06] space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "h-4 w-4 text-primary/60" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-white/60",
											children: musicBlob.name || "Background music"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] font-mono text-white/20",
											children: [(musicBlob.size / 1024 / 1024).toFixed(1), " MB"]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setMusicBlob(null),
										className: "flex h-7 w-7 items-center justify-center rounded text-white/20 hover:text-red-400 hover:bg-white/[0.06] transition-all",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[10px] uppercase tracking-wider text-white/20",
										children: "Volume"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[11px] text-white/30",
										children: [Math.round(musicVolume * 100), "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 1,
									step: .05,
									value: musicVolume,
									onChange: (e) => setMusicVolume(Number(e.target.value)),
									className: "w-full h-1 accent-primary/60"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: musicInputRef,
								type: "file",
								accept: "audio/*",
								onChange: handleMusicFile,
								className: "hidden"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-white/30",
								children: "Adjust the crop area and set output dimensions."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[10px] uppercase tracking-wider text-white/20 mb-1 block",
											children: "Crop X"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 0,
											max: .8,
											step: .01,
											value: cropX,
											onChange: (e) => setCropX(Number(e.target.value)),
											className: "w-full h-1 accent-primary/60"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-white/20",
											children: [Math.round(cropX * vidW), "px"]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[10px] uppercase tracking-wider text-white/20 mb-1 block",
											children: "Crop Y"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 0,
											max: .8,
											step: .01,
											value: cropY,
											onChange: (e) => setCropY(Number(e.target.value)),
											className: "w-full h-1 accent-primary/60"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-white/20",
											children: [Math.round(cropY * vidH), "px"]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[10px] uppercase tracking-wider text-white/20 mb-1 block",
											children: "Crop Width"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: .1,
											max: 1,
											step: .01,
											value: cropW,
											onChange: (e) => {
												const val = Number(e.target.value);
												setCropW(val);
												if (aspectLocked) setCropH(val / (aspectLocked ? vidW / vidH : 1));
											},
											className: "w-full h-1 accent-primary/60"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-white/20",
											children: [Math.round(cropW * vidW), "px"]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[10px] uppercase tracking-wider text-white/20 mb-1 block",
											children: "Crop Height"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: .1,
											max: 1,
											step: .01,
											value: cropH,
											onChange: (e) => {
												const val = Number(e.target.value);
												setCropH(val);
												if (aspectLocked) setCropW(val * (vidW / vidH));
											},
											className: "w-full h-1 accent-primary/60"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-white/20",
											children: [Math.round(cropH * vidH), "px"]
										})
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] uppercase tracking-wider text-white/20 mb-1.5 block",
								children: "Aspect ratio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [ASPECTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setAspect(a.w, a.h),
									className: cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-all ring-1", Math.abs(cropW / cropH - a.w / a.h) < .01 ? "bg-primary/15 ring-primary/30 text-primary/80" : "bg-white/[0.03] ring-white/[0.06] text-white/30 hover:text-white/50"),
									children: a.label
								}, a.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setAspectLocked(!aspectLocked),
									className: cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-all ring-1", aspectLocked ? "bg-white/[0.06] ring-white/[0.1] text-white/50" : "bg-white/[0.03] ring-white/[0.06] text-white/30"),
									children: ["Lock ", aspectLocked ? "ON" : "OFF"]
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] uppercase tracking-wider text-white/20 mb-1 block",
									children: "Output Width"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 16,
									max: 7680,
									value: outputW,
									onChange: (e) => setOutputW(Math.max(16, Number(e.target.value))),
									className: "w-full rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-white/70 ring-1 ring-white/[0.06] outline-none"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-[10px] uppercase tracking-wider text-white/20 mb-1 block",
									children: "Output Height"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 16,
									max: 4320,
									value: outputH,
									onChange: (e) => setOutputH(Math.max(16, Number(e.target.value))),
									className: "w-full rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-white/70 ring-1 ring-white/[0.06] outline-none"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "hero",
								size: "lg",
								onClick: applyCrop,
								disabled: processing,
								className: "w-full gap-2",
								children: [processing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crop, { className: "h-4 w-4" }), processing ? "Processing…" : "Apply Crop & Resize"]
							})
						]
					})
				})
			]
		})
	});
}
function SpotlightOverlay({ active, spotlightActive, onSpotlightActiveChange, mode, onModeChange }) {
	const [pos, setPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [size, setSize] = (0, import_react.useState)(220);
	const [showHint, setShowHint] = (0, import_react.useState)(false);
	(0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(0);
	const posRef = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const smoothPos = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const onMove = (e) => {
			posRef.current = {
				x: e.clientX,
				y: e.clientY
			};
		};
		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, [active]);
	(0, import_react.useEffect)(() => {
		if (!active || !spotlightActive) return;
		const lerp = () => {
			smoothPos.current = {
				x: smoothPos.current.x + (posRef.current.x - smoothPos.current.x) * .12,
				y: smoothPos.current.y + (posRef.current.y - smoothPos.current.y) * .12
			};
			setPos({ ...smoothPos.current });
			rafRef.current = requestAnimationFrame(lerp);
		};
		rafRef.current = requestAnimationFrame(lerp);
		return () => cancelAnimationFrame(rafRef.current);
	}, [active, spotlightActive]);
	(0, import_react.useEffect)(() => {
		if (!active || !spotlightActive) return;
		const onWheel = (e) => {
			e.preventDefault();
			setSize((s) => Math.max(80, Math.min(500, s - e.deltaY * .5)));
		};
		window.addEventListener("wheel", onWheel, { passive: false });
		return () => window.removeEventListener("wheel", onWheel);
	}, [active, spotlightActive]);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		setShowHint(true);
		const t = setTimeout(() => setShowHint(false), 4e3);
		return () => clearTimeout(t);
	}, [active]);
	if (!active) return null;
	const isSpotlight = mode === "spotlight";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: spotlightActive && isSpotlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .25 },
			className: "fixed inset-0 z-[9990] pointer-events-none",
			style: { background: `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px,
                transparent 0%,
                transparent ${size * .7}px,
                oklch(0 0 0 / 0.55) ${size}px
              )` }
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: spotlightActive && !isSpotlight && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				scale: .8,
				opacity: 0
			},
			animate: {
				scale: 1,
				opacity: 1
			},
			exit: {
				scale: .8,
				opacity: 0
			},
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 28
			},
			className: "fixed z-[9990] pointer-events-none overflow-hidden rounded-full ring-2 ring-white/20 shadow-2xl",
			style: {
				left: pos.x - size / 2,
				top: pos.y - size / 2,
				width: size,
				height: size,
				backdropFilter: `url('#zoom-filter')`,
				background: "oklch(0 0 0 / 0.1)",
				boxShadow: "0 0 0 2px oklch(1 0 0 / 0.2), 0 20px 60px oklch(0 0 0 / 0.5), inset 0 0 0 1px oklch(1 0 0 / 0.1)"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex items-center justify-center pointer-events-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-full h-px bg-white/10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute h-full w-px bg-white/10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 rounded-full border border-white/30" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-mono text-white/40 uppercase tracking-wider",
				children: "2× zoom"
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: spotlightActive && isSpotlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: {
				scale: 0,
				opacity: 0
			},
			animate: {
				scale: 1,
				opacity: 1
			},
			exit: {
				scale: 0,
				opacity: 0
			},
			transition: {
				type: "spring",
				stiffness: 380,
				damping: 26
			},
			className: "fixed z-[9991] pointer-events-none rounded-full",
			style: {
				left: pos.x - size / 2,
				top: pos.y - size / 2,
				width: size,
				height: size,
				boxShadow: `0 0 0 1px oklch(1 0 0 / 0.15), 0 0 40px oklch(0.74 0.15 222 / 0.15)`
			}
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: {
				opacity: 0,
				y: -8
			},
			animate: {
				opacity: 1,
				y: 0
			},
			exit: {
				opacity: 0,
				y: -8
			},
			className: "fixed top-4 left-1/2 -translate-x-1/2 z-[9995] flex items-center gap-2 rounded-full bg-black/75 px-4 py-2 backdrop-blur-xl ring-1 ring-white/[0.1]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[11px] text-white/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/50",
						children: "Alt+S"
					}),
					" ",
					"Spotlight ·",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/50",
						children: "Alt+Z"
					}),
					" ",
					"Zoom · scroll to resize"
				]
			})
		}) }),
		spotlightActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed top-4 right-4 z-[9995] flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-xl ring-1 ring-white/[0.08]",
			children: [isSpotlight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "h-3.5 w-3.5 text-primary/70" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-3.5 w-3.5 text-primary/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[10px] font-mono text-white/50 uppercase tracking-wider",
				children: [
					isSpotlight ? "Spotlight" : "Zoom",
					" · Alt+",
					isSpotlight ? "S" : "Z",
					" to exit"
				]
			})]
		})
	] });
}
function FloatingMiniBar({ status, elapsed, onPause, onResume, onStop, audioLevel = 0 }) {
	const [pos, setPos] = (0, import_react.useState)({
		x: 50,
		y: 94
	});
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const dragStart = (0, import_react.useRef)({
		mx: 0,
		my: 0,
		px: 0,
		py: 0
	});
	const isRecording = status === "recording";
	const visible = isRecording || status === "paused";
	const cleanupDragRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			cleanupDragRef.current?.();
		};
	}, []);
	const handleDown = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		setDragging(true);
		dragStart.current = {
			mx: e.clientX,
			my: e.clientY,
			px: pos.x,
			py: pos.y
		};
		const onMove = (ev) => {
			const dx = (ev.clientX - dragStart.current.mx) / window.innerWidth * 100;
			const dy = (ev.clientY - dragStart.current.my) / window.innerHeight * 100;
			setPos({
				x: Math.max(5, Math.min(95, dragStart.current.px + dx)),
				y: Math.max(5, Math.min(95, dragStart.current.py + dy))
			});
		};
		const onUp = () => {
			setDragging(false);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
			cleanupDragRef.current = null;
		};
		cleanupDragRef.current = () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
	}, [pos]);
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			scale: .8,
			y: 20
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			scale: .8,
			y: 20
		},
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 28
		},
		className: "fixed z-[9980] select-none",
		style: {
			left: `${pos.x}%`,
			top: `${pos.y}%`,
			transform: "translate(-50%, -50%)"
		},
		onMouseEnter: () => setExpanded(true),
		onMouseLeave: () => setExpanded(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute -inset-3 rounded-full blur-xl transition-all duration-500 pointer-events-none", isRecording ? "bg-red-500/15" : "bg-yellow-500/12") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative flex items-center gap-2 rounded-full backdrop-blur-2xl ring-1 transition-all duration-300 shadow-2xl", isRecording ? "bg-red-950/80 ring-red-500/25 pr-3 pl-2" : "bg-yellow-950/80 ring-yellow-500/25 pr-3 pl-2", "py-2"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onMouseDown: handleDown,
					className: cn("flex h-6 w-6 cursor-grab active:cursor-grabbing items-center justify-center rounded-full transition-colors", isRecording ? "text-red-400/60 hover:text-red-300" : "text-yellow-400/60 hover:text-yellow-300"),
					title: "Drag to move",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						width: "10",
						height: "10",
						viewBox: "0 0 10 10",
						fill: "currentColor",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "3",
								cy: "2",
								r: "1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "7",
								cy: "2",
								r: "1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "3",
								cy: "5",
								r: "1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "7",
								cy: "5",
								r: "1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "3",
								cy: "8",
								r: "1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "7",
								cy: "8",
								r: "1"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative flex h-2.5 w-2.5 shrink-0",
					children: [isRecording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("relative inline-flex h-2.5 w-2.5 rounded-full", isRecording ? "bg-red-400" : "bg-yellow-300") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-mono text-sm tabular-nums font-semibold tracking-wider", isRecording ? "text-red-200" : "text-yellow-200"),
					children: formatTimer(elapsed)
				}),
				isRecording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-end gap-[1.5px] h-4",
					children: Array.from({ length: 8 }).map((_, i) => {
						const t = Math.abs(i - 3.5) / 3.5;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-[2px] rounded-full bg-red-400/60 transition-all duration-75",
							style: { height: `${Math.max(2, audioLevel * 14 * (1 - t * .4))}px` }
						}, i);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-5 w-px", isRecording ? "bg-red-400/20" : "bg-yellow-400/20") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [isRecording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onPause,
						className: "flex h-7 w-7 items-center justify-center rounded-full text-red-300/70 transition-all hover:bg-red-400/15 hover:text-red-200",
						title: "Pause (Space)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3.5 w-3.5 fill-current" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onResume,
						className: "flex h-7 w-7 items-center justify-center rounded-full text-yellow-300/70 transition-all hover:bg-yellow-400/15 hover:text-yellow-200",
						title: "Resume (Space)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 fill-current" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onStop,
						className: cn("flex h-7 w-7 items-center justify-center rounded-full transition-all", isRecording ? "text-red-300/70 hover:bg-red-400/15 hover:text-red-200" : "text-yellow-300/70 hover:bg-yellow-400/15 hover:text-yellow-200"),
						title: "Stop (Escape)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3 w-3 fill-current" })
					})]
				})
			]
		})]
	}, "mini-bar") });
}
var STORAGE_KEY = "screencapture-history";
function loadHistory() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
	} catch {
		return [];
	}
}
function saveToHistory(result) {
	try {
		const entries = loadHistory();
		const entry = {
			id: crypto.randomUUID(),
			durationSeconds: result.durationSeconds,
			width: result.width,
			height: result.height,
			sizeBytes: result.sizeBytes,
			createdAt: result.createdAt.toISOString(),
			mimeType: result.mimeType
		};
		entries.unshift(entry);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, 50)));
	} catch {}
}
var STATS = [
	{
		icon: Clock,
		key: "durationSeconds",
		label: "Duration",
		fmt: (v) => formatTimer(v)
	},
	{
		icon: Monitor,
		key: "width",
		label: "Resolution",
		fmt: (_, e) => formatResolution(e.width, e.height)
	},
	{
		icon: HardDrive,
		key: "sizeBytes",
		label: "Size",
		fmt: (v) => formatBytes(v)
	}
];
function RecordingHistory({ open, onClose }) {
	const [entries, setEntries] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (open) setEntries(loadHistory());
	}, [open]);
	const clearAll = (0, import_react.useCallback)(() => {
		localStorage.removeItem(STORAGE_KEY);
		setEntries([]);
	}, []);
	const deleteEntry = (0, import_react.useCallback)((id) => {
		const updated = entries.filter((e) => e.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		setEntries(updated);
	}, [entries]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		onClick: onClose,
		className: "fixed inset-0 z-[9970] bg-black/40 backdrop-blur-sm"
	}, "history-backdrop"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			x: "100%",
			opacity: 0
		},
		animate: {
			x: 0,
			opacity: 1
		},
		exit: {
			x: "100%",
			opacity: 0
		},
		transition: {
			type: "spring",
			stiffness: 340,
			damping: 32
		},
		className: "fixed right-0 top-0 bottom-0 z-[9971] flex w-full max-w-sm flex-col",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex h-full flex-col overflow-hidden bg-[oklch(0.12_0.025_264/0.97)] backdrop-blur-2xl shadow-2xl ring-1 ring-white/[0.07]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-white/[0.05] px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] ring-1 ring-white/[0.07]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-white/50" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-sm font-semibold text-white",
							children: "Recording History"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-white/30",
							children: [
								entries.length,
								" session",
								entries.length !== 1 ? "s" : ""
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [entries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: clearAll,
							className: "rounded-lg px-2.5 py-1.5 text-[11px] text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-red-500/10 hover:text-red-400 hover:ring-red-500/20",
							children: "Clear all"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/70",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-4 py-3 space-y-2.5",
					children: entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full flex-col items-center justify-center gap-4 py-16 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.05]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-6 w-6 text-white/15" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-white/30",
							children: "No recordings yet"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-white/15",
							children: "Your recording sessions will appear here"
						})] })]
					}) : entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						layout: true,
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							x: 20
						},
						className: "group relative rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.05] hover:ring-white/[0.1]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-3.5 w-3.5 text-primary/70" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-white/70",
										children: formatResolution(entry.width, entry.height)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-white/30 flex items-center gap-1 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-2.5 w-2.5" }), new Date(entry.createdAt).toLocaleString(void 0, {
											dateStyle: "medium",
											timeStyle: "short"
										})]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => deleteEntry(entry.id),
									className: "opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-lg text-white/20 transition-all hover:bg-red-500/10 hover:text-red-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: STATS.map(({ icon: Icon, key, label, fmt }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-white/[0.03] p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 mb-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-2.5 w-2.5 text-white/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] uppercase tracking-wider text-white/20",
											children: label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold text-white/60",
										children: key === "width" ? fmt(entry[key], entry) : fmt(entry[key])
									})]
								}, label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-[10px] text-white/25 font-mono uppercase",
								children: [
									entry.mimeType.includes("vp9") ? "VP9" : entry.mimeType.includes("vp8") ? "VP8" : "WebM",
									" · ",
									"WebM container"
								]
							})
						]
					}, entry.id))
				}),
				entries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-white/[0.05] px-5 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[10px] text-white/20",
						children: "History is stored locally on your device"
					})
				})
			]
		})
	}, "history-panel")] }) });
}
var GROUPS = [
	{
		title: "Recording",
		shortcuts: [
			{
				keys: ["Alt", "R"],
				label: "Start recording"
			},
			{
				keys: ["Space"],
				label: "Pause / Resume"
			},
			{
				keys: ["Esc"],
				label: "Stop recording"
			},
			{
				keys: ["Alt", "N"],
				label: "New recording (reset)"
			}
		]
	},
	{
		title: "Overlays & Tools",
		shortcuts: [
			{
				keys: ["Alt", "S"],
				label: "Toggle Spotlight mode"
			},
			{
				keys: ["Alt", "Z"],
				label: "Toggle Zoom lens"
			},
			{
				keys: ["Alt", "W"],
				label: "Toggle Whiteboard"
			},
			{
				keys: ["Alt", "A"],
				label: "Toggle Annotations"
			},
			{
				keys: ["Alt", "T"],
				label: "Toggle Teleprompter"
			}
		]
	},
	{
		title: "Preview Controls",
		shortcuts: [{
			keys: ["Scroll"],
			label: "Resize spotlight / zoom"
		}, {
			keys: ["Drag"],
			label: "Reposition camera or mini-bar"
		}]
	},
	{
		title: "Interface",
		shortcuts: [
			{
				keys: ["Alt", "H"],
				label: "Open recording history"
			},
			{
				keys: ["Alt", "K"],
				label: "Show keyboard shortcuts"
			},
			{
				keys: ["Alt", "E"],
				label: "Open video editor"
			}
		]
	}
];
function Kbd({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
		className: "inline-flex items-center justify-center rounded-md bg-white/[0.07] px-2 py-0.5 font-mono text-[11px] text-white/60 ring-1 ring-white/[0.12] shadow-[0_1px_0_oklch(0_0_0/0.4)] min-w-[28px]",
		children
	});
}
function KeyboardShortcutsPanel({ open, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		onClick: onClose,
		className: "fixed inset-0 z-[9960] bg-black/50 backdrop-blur-sm"
	}, "shortcuts-backdrop"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			scale: .94,
			y: 16
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			scale: .94,
			y: 16
		},
		transition: {
			type: "spring",
			stiffness: 380,
			damping: 28
		},
		className: "fixed inset-0 z-[9961] flex items-center justify-center p-4 pointer-events-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto w-full max-w-lg rounded-2xl bg-[oklch(0.13_0.025_264/0.97)] backdrop-blur-2xl shadow-2xl ring-1 ring-white/[0.08] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-white/[0.06] px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "h-4 w-4 text-primary/70" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-sm font-semibold text-white",
							children: "Keyboard Shortcuts"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/70",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto",
					children: GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25",
						children: group.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: group.shortcuts.map(({ keys, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl bg-white/[0.025] px-3.5 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-white/55",
								children: label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1",
								children: keys.map((key, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-white/20",
										children: "+"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: key })]
								}, i))
							})]
						}, label))
					})] }, group.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-white/[0.05] px-6 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-center text-[10px] text-white/20",
						children: [
							"Shortcuts work when the app is focused · Press ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "Esc" }),
							" to close"
						]
					})
				})
			]
		})
	}, "shortcuts-modal")] }) });
}
var DEFAULT_TEXT = "";
function TeleprompterOverlay({ active, onClose, isRecording }) {
	const [text, setText] = (0, import_react.useState)(DEFAULT_TEXT);
	const [fontSize, setFontSize] = (0, import_react.useState)(28);
	const [speed, setSpeed] = (0, import_react.useState)(40);
	const [scrolling, setScrolling] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(true);
	const [opacity, setOpacity] = (0, import_react.useState)(85);
	const scrollRef = (0, import_react.useRef)(null);
	const posRef = (0, import_react.useRef)(0);
	const rafRef = (0, import_react.useRef)(0);
	const lastTimeRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (isRecording && active && !editing) setScrolling(true);
		if (!isRecording) setScrolling(false);
	}, [
		isRecording,
		active,
		editing
	]);
	(0, import_react.useEffect)(() => {
		if (!scrolling || !scrollRef.current) return;
		const el = scrollRef.current;
		lastTimeRef.current = performance.now();
		const tick = (now) => {
			const dt = (now - lastTimeRef.current) / 1e3;
			lastTimeRef.current = now;
			posRef.current += speed * dt;
			if (posRef.current >= el.scrollHeight - el.clientHeight) {
				posRef.current = el.scrollHeight - el.clientHeight;
				setScrolling(false);
			}
			el.scrollTop = posRef.current;
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafRef.current);
	}, [scrolling, speed]);
	const reset = (0, import_react.useCallback)(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = 0;
		posRef.current = 0;
		setScrolling(false);
	}, []);
	const nudge = (0, import_react.useCallback)((dir) => {
		if (!scrollRef.current) return;
		const delta = dir === "up" ? -80 : 80;
		posRef.current = Math.max(0, posRef.current + delta);
		scrollRef.current.scrollTop = posRef.current;
	}, []);
	if (!active) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: -20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -20
		},
		transition: {
			type: "spring",
			stiffness: 340,
			damping: 28
		},
		className: "fixed inset-x-0 top-0 z-[9950] flex flex-col",
		style: { height: "45vh" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex-1 overflow-hidden",
			style: { backgroundColor: `oklch(0 0 0 / ${opacity / 100})` },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-20 z-10 bg-gradient-to-b from-black/80 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-black/80 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-x-0 z-10",
					style: { top: "40%" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" })
				}),
				editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					className: "h-full w-full resize-none bg-transparent px-16 py-8 text-center font-display font-semibold text-white/80 outline-none placeholder:text-white/20",
					style: {
						fontSize: `${fontSize}px`,
						lineHeight: 1.5
					},
					placeholder: "Type or paste your script here..."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: scrollRef,
					className: "h-full overflow-hidden px-16 py-8",
					style: { scrollBehavior: "auto" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center font-display font-semibold text-white/85 whitespace-pre-wrap leading-relaxed mx-auto max-w-3xl",
						style: {
							fontSize: `${fontSize}px`,
							lineHeight: 1.6
						},
						children: text
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 bg-black/90 px-4 py-2.5 backdrop-blur-xl border-t border-white/[0.06] flex-wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.07] hover:text-white/70 transition-all",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-px bg-white/[0.08]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setEditing(!editing);
						if (editing) reset();
					},
					className: `rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${editing ? "bg-primary/15 text-primary/80 ring-1 ring-primary/25" : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08]"}`,
					children: editing ? "Preview script" : "Edit script"
				}),
				!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-px bg-white/[0.08]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: reset,
						className: "flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.07] hover:text-white/70 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => nudge("up"),
						className: "flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.07] hover:text-white/70 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => nudge("down"),
						className: "flex h-7 w-7 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.07] hover:text-white/70 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setScrolling(!scrolling),
						className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${scrolling ? "bg-primary/15 text-primary/80 ring-1 ring-primary/25" : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08]"}`,
						children: [scrolling ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3" }), scrolling ? "Pause" : "Scroll"]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-px bg-white/[0.08]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-white/25 uppercase tracking-wider",
							children: "Size"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 18,
							max: 60,
							step: 2,
							value: fontSize,
							onChange: (e) => setFontSize(Number(e.target.value)),
							className: "w-20 h-1 accent-primary/70"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-white/30 w-6",
							children: fontSize
						})
					]
				}),
				!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-white/25 uppercase tracking-wider",
							children: "Speed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 10,
							max: 120,
							step: 5,
							value: speed,
							onChange: (e) => setSpeed(Number(e.target.value)),
							className: "w-20 h-1 accent-primary/70"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-white/30 w-6",
							children: speed
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 ml-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-white/25 uppercase tracking-wider",
						children: "Opacity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 40,
						max: 100,
						step: 5,
						value: opacity,
						onChange: (e) => setOpacity(Number(e.target.value)),
						className: "w-16 h-1 accent-primary/70"
					})]
				})
			]
		})]
	}, "teleprompter") });
}
var SOURCES = [
	{
		id: "monitor",
		label: "Entire Screen",
		icon: Monitor,
		description: "Capture everything visible — all monitors, windows, and the desktop.",
		tip: "Best for multi-app walkthroughs and full presentations."
	},
	{
		id: "window",
		label: "Specific Window",
		icon: AppWindow,
		description: "Record a single application window. Other content stays hidden.",
		tip: "Clean recordings — ideal for software demos and tutorials."
	},
	{
		id: "browser",
		label: "Browser Tab",
		icon: Globe,
		description: "Capture only one browser tab. Switch tabs freely while recording.",
		tip: "Most private — notifications and other apps stay out of view."
	},
	{
		id: "multi-monitor",
		label: "All Displays",
		icon: MonitorUp,
		description: "Capture multiple monitors side by side in a single recording.",
		tip: "Great for multi-screen setups and presentations."
	}
];
function useAudioMeter(stream) {
	const [level, setLevel] = (0, import_react.useState)(0);
	const raf = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!stream) {
			setLevel(0);
			return;
		}
		const ctx = new AudioContext();
		if (ctx.state === "suspended") ctx.resume();
		const src = ctx.createMediaStreamSource(stream);
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 256;
		src.connect(analyser);
		const data = new Uint8Array(analyser.frequencyBinCount);
		const tick = () => {
			analyser.getByteFrequencyData(data);
			const avg = data.reduce((a, b) => a + b, 0) / data.length;
			setLevel(Math.min(avg / 128, 1));
			raf.current = requestAnimationFrame(tick);
		};
		tick();
		return () => {
			cancelAnimationFrame(raf.current);
			ctx.close();
		};
	}, [stream]);
	return level;
}
var HERO_BADGES = [
	{
		icon: Zap,
		label: "Zero Installs",
		color: "text-cyan-400",
		bg: "bg-cyan-500/10",
		ring: "ring-cyan-500/25",
		glow: "shadow-[0_0_16px_oklch(0.74_0.15_222/0.5)]"
	},
	{
		icon: ShieldCheck,
		label: "100% Private",
		color: "text-emerald-400",
		bg: "bg-emerald-500/10",
		ring: "ring-emerald-500/25",
		glow: "shadow-[0_0_16px_oklch(0.72_0.16_160/0.5)]"
	},
	{
		icon: Lock,
		label: "No Watermark",
		color: "text-violet-400",
		bg: "bg-violet-500/10",
		ring: "ring-violet-500/25",
		glow: "shadow-[0_0_16px_oklch(0.65_0.2_295/0.5)]"
	},
	{
		icon: Sparkles,
		label: "4K Quality",
		color: "text-amber-400",
		bg: "bg-amber-500/10",
		ring: "ring-amber-500/25",
		glow: "shadow-[0_0_16px_oklch(0.75_0.18_60/0.5)]"
	}
];
var PARTICLES = Array.from({ length: 25 }, (_, i) => ({
	left: `${((i * 3.7 + 1.2) % 100).toFixed(1)}%`,
	top: `${((i * 7.3 + 5.1) % 100).toFixed(1)}%`,
	delay: `${(i * .7 % 5).toFixed(1)}s`,
	size: 1 + i % 3 * .5,
	duration: `${(3 + i % 5 * .5).toFixed(1)}s`
}));
function RecordingPreview({ stream, status, elapsed, result }) {
	const liveRef = (0, import_react.useRef)(null);
	const isLive = status === "recording" || status === "paused";
	const isRecording = status === "recording";
	const isPaused = status === "paused";
	const [livePlayFailed, setLivePlayFailed] = (0, import_react.useState)(false);
	const audioLevel = useAudioMeter(isLive ? stream : null);
	(0, import_react.useEffect)(() => {
		if (liveRef.current && stream) {
			liveRef.current.srcObject = stream;
			setLivePlayFailed(false);
			liveRef.current.play().catch(() => setLivePlayFailed(true));
		}
	}, [stream]);
	const retryPlay = (0, import_react.useCallback)(() => {
		if (liveRef.current) {
			setLivePlayFailed(false);
			liveRef.current.play().catch(() => setLivePlayFailed(true));
		}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute -inset-6 -z-10 rounded-3xl blur-[70px] transition-all duration-1000", isRecording ? "opacity-100 bg-[radial-gradient(ellipse_at_center,oklch(0.63_0.245_27/0.18)_0%,oklch(0.74_0.15_222/0.10)_50%,transparent_80%)]" : isPaused ? "opacity-100 bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.18_80/0.14)_0%,oklch(0.74_0.15_222/0.08)_50%,transparent_80%)]" : result ? "opacity-100 bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.16_160/0.14)_0%,oklch(0.74_0.15_222/0.08)_50%,transparent_80%)]" : "opacity-50 bg-[radial-gradient(ellipse_at_top,oklch(0.74_0.15_222/0.12)_0%,transparent_70%)]") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative aspect-video w-full overflow-hidden rounded-2xl transition-all duration-700", "bg-[oklch(0.09_0.02_264)]", isRecording ? "shadow-[0_0_0_1.5px_oklch(0.63_0.245_27/0.55),0_0_0_4px_oklch(0.63_0.245_27/0.10),0_40px_100px_-24px_oklch(0_0_0/0.85)]" : isPaused ? "shadow-[0_0_0_1.5px_oklch(0.85_0.18_80/0.45),0_0_0_4px_oklch(0.85_0.18_80/0.08),0_40px_100px_-24px_oklch(0_0_0/0.85)]" : "shadow-[0_0_0_1px_oklch(1_0_0/0.08),0_40px_100px_-24px_oklch(0_0_0/0.80)]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isRecording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: [
							.4,
							.7,
							.4
						] },
						exit: { opacity: 0 },
						transition: {
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut"
						},
						className: "absolute inset-0 z-30 rounded-2xl pointer-events-none ring-2 ring-inset ring-red-500/30"
					}, "rec-rim") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-9 bg-gradient-to-b from-white/[0.04] to-transparent border-b border-white/[0.05]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-[6px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[11px] w-[11px] rounded-full bg-[oklch(0.7_0.2_15)] ring-1 ring-white/10 shadow-[0_0_6px_oklch(0.7_0.2_15/0.5)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[11px] w-[11px] rounded-full bg-[oklch(0.82_0.18_85)] ring-1 ring-white/10 shadow-[0_0_6px_oklch(0.82_0.18_85/0.4)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[11px] w-[11px] rounded-full bg-[oklch(0.72_0.2_145)] ring-1 ring-white/10 shadow-[0_0_6px_oklch(0.72_0.2_145/0.4)]" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[9px] tracking-[0.2em] uppercase text-white/15 select-none ml-1",
								children: "screen preview"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [isLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									scale: .8
								},
								animate: {
									opacity: 1,
									scale: 1
								},
								className: cn("flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur-xl", isRecording ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30" : "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex h-1.5 w-1.5",
									children: [isRecording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("relative h-1.5 w-1.5 rounded-full", isRecording ? "bg-red-400" : "bg-yellow-400") })]
								}), isRecording ? "Live" : "Paused"]
							}), result && !isLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									scale: .8
								},
								animate: {
									opacity: 1,
									scale: 1
								},
								className: "flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-400 ring-1 ring-emerald-500/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400" }), "Ready"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-full w-full pt-9",
						children: [
							!isLive && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex h-full w-full flex-col items-center justify-center overflow-hidden",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[image:radial-gradient(circle,oklch(1_0_0/0.06)_1px,transparent_1px)] bg-[size:28px_28px]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_30%,oklch(0.09_0.02_264/0.9)_100%)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[radial-gradient(ellipse,oklch(0.74_0.15_222/0.12)_0%,transparent_70%)] blur-xl" }),
									[
										"top-3 left-3 border-t-2 border-l-2 rounded-tl-sm",
										"top-3 right-3 border-t-2 border-r-2 rounded-tr-sm",
										"bottom-3 left-3 border-b-2 border-l-2 rounded-bl-sm",
										"bottom-3 right-3 border-b-2 border-r-2 rounded-br-sm"
									].map((cls, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute w-5 h-5 border-white/10", cls) }, i)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative z-10 flex flex-col items-center gap-5 text-center px-8",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex items-center justify-center",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
														animate: {
															scale: [
																1,
																1.15,
																1
															],
															opacity: [
																.15,
																.05,
																.15
															]
														},
														transition: {
															duration: 4,
															repeat: Infinity,
															ease: "easeInOut"
														},
														className: "absolute h-24 w-24 rounded-full border border-primary/30"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
														animate: {
															scale: [
																1,
																1.1,
																1
															],
															opacity: [
																.3,
																.12,
																.3
															]
														},
														transition: {
															duration: 3.5,
															repeat: Infinity,
															ease: "easeInOut",
															delay: .5
														},
														className: "absolute h-16 w-16 rounded-full border border-primary/40"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] backdrop-blur-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, {
															className: "h-5 w-5 text-white/25 relative z-10",
															strokeWidth: 1.5
														})]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display text-sm font-semibold text-white/40 tracking-wide",
												children: "Ready to capture"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-[11px] text-white/20 leading-relaxed max-w-[220px] mx-auto",
												children: ["Choose a source below, then hit\xA0", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary/50 font-medium",
													children: "Start Recording"
												})]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 rounded-full bg-white/[0.03] px-3 py-1 ring-1 ring-white/[0.05]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-center gap-[2px]",
													children: [
														.2,
														.45,
														.7,
														.45,
														.2
													].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-[2px] rounded-full bg-white/12",
														style: { height: `${h * 10}px` }
													}, i))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[9px] tracking-widest text-white/15 uppercase",
													children: "No signal"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/[0.08] to-transparent animate-preview-scan pointer-events-none" })
								]
							}),
							isLive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									ref: liveRef,
									muted: true,
									playsInline: true,
									className: cn("h-full w-full object-contain transition-all duration-500", isPaused ? "bg-black/60 brightness-75" : "bg-black/50")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 z-10 pointer-events-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,oklch(0_0_0/0.03)_3px,oklch(0_0_0/0.03)_4px)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-line-scan opacity-60" })]
								}),
								livePlayFailed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: retryPlay,
									className: "absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										initial: {
											scale: .9,
											opacity: 0
										},
										animate: {
											scale: 1,
											opacity: 1
										},
										className: "flex items-center gap-2.5 rounded-full bg-white/10 px-6 py-3.5 ring-1 ring-white/20 hover:bg-white/15 transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5 text-white fill-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold text-white",
											children: "Click to enable preview"
										})]
									})
								}),
								[
									"top-[2.5rem] left-3",
									"top-[2.5rem] right-3",
									"bottom-3 left-3",
									"bottom-3 right-3"
								].map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute w-4 h-4 pointer-events-none z-20", pos, i < 2 ? i === 0 ? "border-t border-l border-white/20 rounded-tl" : "border-t border-r border-white/20 rounded-tr" : i === 2 ? "border-b border-l border-white/20 rounded-bl" : "border-b border-r border-white/20 rounded-br") }, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-10" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-[2.75rem] left-4 flex items-center gap-2 z-20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										initial: {
											opacity: 0,
											x: -8
										},
										animate: {
											opacity: 1,
											x: 0
										},
										className: cn("flex items-center gap-2 rounded-lg px-3 py-1.5 backdrop-blur-2xl ring-1", isRecording ? "bg-red-950/80 ring-red-500/30" : "bg-yellow-950/80 ring-yellow-500/30"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "relative flex h-2 w-2",
											children: [isRecording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("relative inline-flex h-2 w-2 rounded-full", isRecording ? "bg-red-400" : "bg-yellow-300") })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-[10px] font-black uppercase tracking-[0.2em]", isRecording ? "text-red-300" : "text-yellow-200"),
											children: isRecording ? "REC" : "PAUSED"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											x: -8
										},
										animate: {
											opacity: 1,
											x: 0
										},
										transition: { delay: .05 },
										className: "flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-2xl ring-1 ring-white/[0.08]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs tabular-nums text-white/80 tracking-wider",
											children: formatTimer(elapsed)
										})
									})]
								}),
								isRecording && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 8
									},
									animate: {
										opacity: 1,
										y: 0
									},
									className: "absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-2xl ring-1 ring-white/[0.08]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-end gap-[2.5px] h-6",
										children: Array.from({ length: 20 }).map((_, i) => {
											const center = Math.abs(i - 9.5) / 9.5;
											const barLevel = audioLevel * (1 - center * .4);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-[2.5px] rounded-full transition-all duration-75",
												style: {
													height: `${Math.max(3, barLevel * 22 + (1 - center) * 2)}px`,
													backgroundColor: audioLevel > .7 ? `oklch(0.7 0.2 15 / ${Math.max(.25, barLevel * .9)})` : `oklch(0.74 0.15 222 / ${Math.max(.2, barLevel * .85)})`
												}
											}, i);
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] font-mono text-white/25 uppercase tracking-wider ml-1",
										children: "Audio"
									})]
								}),
								isRecording && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									initial: {
										opacity: 0,
										x: 8
									},
									animate: {
										opacity: 1,
										x: 0
									},
									className: "absolute top-[2.75rem] right-4 z-20 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-2xl ring-1 ring-white/[0.08]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[9px] text-white/30 uppercase tracking-wider",
										children: "60 fps"
									})
								})
							] }),
							!isLive && result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-full w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: result.url,
									autoPlay: true,
									muted: true,
									playsInline: true,
									controls: true,
									className: "h-full w-full object-contain bg-black/50"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-2 h-[3px] w-[40%] rounded-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" })
		]
	});
}
function SourceCards({ value, onChange, onSelect, disabled }) {
	const handleMouseMove = (0, import_react.useCallback)((e) => {
		if (disabled) return;
		const el = e.currentTarget;
		const rect = el.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;
		el.style.transform = `perspective(600px) rotateX(${(y - .5) * -12}deg) rotateY(${(x - .5) * 12}deg) scale3d(1.02,1.02,1.02)`;
	}, [disabled]);
	const handleMouseLeave = (0, import_react.useCallback)((e) => {
		if (disabled) return;
		e.currentTarget.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
	}, [disabled]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
		children: SOURCES.map(({ id, label, icon: Icon, description, tip }, idx) => {
			const active = value === id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					delay: idx * .06,
					duration: .4,
					ease: [
						.25,
						.1,
						.25,
						1
					]
				},
				className: "perspective-[600px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled,
					onClick: () => {
						onChange(id);
						onSelect?.(id);
					},
					onMouseMove: handleMouseMove,
					onMouseLeave: handleMouseLeave,
					className: cn("relative flex flex-col items-start gap-2.5 rounded-xl p-4 text-left w-full transition-all duration-200 ease-out text-balance overflow-hidden", "bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]", "hover:border-white/[0.18] hover:bg-white/[0.06]", "disabled:cursor-not-allowed disabled:opacity-30", active && ["bg-white/[0.06] border-primary/30", "shadow-[0_0_30px_-8px_oklch(0.74_0.15_222/0.25)]"]),
					children: [
						active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							layoutId: "source-glow",
							className: "absolute inset-0 -z-10 rounded-xl bg-gradient-to-b from-primary/[0.08] to-transparent",
							transition: {
								type: "spring",
								stiffness: 400,
								damping: 30
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300", active ? "bg-gradient-primary text-white shadow-[0_0_20px_-4px_oklch(0.74_0.15_222/0.35)] ring-1 ring-white/10" : "bg-white/[0.04] text-white/35 ring-1 ring-white/[0.04]"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-[18px] w-[18px]",
									strokeWidth: 1.75
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("block font-display text-sm font-semibold transition-colors truncate", active ? "text-white" : "text-white/55"),
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[10px] text-white/25 mt-0.5 leading-tight hidden md:block",
									children: description
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-white/15 leading-tight italic hidden sm:block",
							children: tip
						})
					]
				})
			}, id);
		})
	});
}
function QualitySelector({ value, onChange, disabled }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled,
			onClick: () => setOpen(!open),
			className: cn("flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ring-1 ring-white/[0.06]", "bg-white/[0.03] backdrop-blur-sm transition-all", "hover:bg-white/[0.06] hover:ring-white/[0.12]", "disabled:cursor-not-allowed disabled:opacity-40"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { className: "h-3.5 w-3.5 text-white/35" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-white/65 font-medium",
					children: value.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					className: "w-3 h-3 text-white/25 ml-0.5",
					fill: "none",
					viewBox: "0 0 12 12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M3 5l3 3 3-3",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: {
				opacity: 0,
				y: -4,
				scale: .96
			},
			animate: {
				opacity: 1,
				y: 0,
				scale: 1
			},
			exit: {
				opacity: 0,
				y: -4,
				scale: .96
			},
			transition: { duration: .15 },
			className: "absolute bottom-full left-0 mb-2 w-48 rounded-xl bg-black/80 p-1.5 ring-1 ring-white/[0.1] backdrop-blur-2xl shadow-2xl z-20",
			children: QUALITY_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					onChange(preset);
					setOpen(false);
				},
				className: cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all", value.short === preset.short ? "bg-white/[0.08] text-white" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold uppercase", value.short === preset.short ? "bg-gradient-primary text-white" : "bg-white/[0.05] text-white/30"),
					children: preset.short.replace("p", "")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium leading-tight",
						children: preset.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "block text-[10px] text-white/30 mt-0.5",
						children: [
							preset.width,
							"×",
							preset.height
						]
					})]
				})]
			}, preset.short))
		}) })]
	});
}
function ControlBar({ status, includeAudio, onIncludeAudioChange, includeCamera, onIncludeCameraChange, onStart, onPause, onResume, onStop, source, quality, onQualityChange, annotationsEnabled, onAnnotationsChange, whiteboardActive, onWhiteboardChange }) {
	const idle = status === "idle";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-4",
		children: [
			idle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 mb-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QualitySelector, {
					value: quality,
					onChange: onQualityChange,
					disabled: !idle
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					idle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						whileHover: { scale: 1.03 },
						whileTap: { scale: .97 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-3 rounded-[20px] bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15 blur-2xl opacity-50 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "hero",
								size: "xl",
								onClick: onStart,
								className: "min-w-56 group relative overflow-hidden text-base",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 -z-10 translate-y-full bg-white/10 transition-transform duration-500 group-hover:translate-y-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDot, { className: "h-5 w-5" }),
									"Start Recording"
								]
							})]
						})
					}),
					status === "recording" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						whileHover: { scale: 1.03 },
						whileTap: { scale: .97 },
						layout: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "glass",
							size: "lg",
							onClick: onPause,
							className: "group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4" }), "Pause"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						whileHover: { scale: 1.03 },
						whileTap: { scale: .97 },
						layout: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							size: "lg",
							onClick: onStop,
							className: "group shadow-[0_0_0_1px_oklch(0.63_0.245_27/0.3),0_0_30px_oklch(0.63_0.245_27/0.1)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4 fill-current" }), "Stop"]
						})
					})] }),
					status === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						whileHover: { scale: 1.03 },
						whileTap: { scale: .97 },
						layout: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "hero",
							size: "lg",
							onClick: onResume,
							className: "group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" }), "Resume"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						whileHover: { scale: 1.03 },
						whileTap: { scale: .97 },
						layout: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							size: "lg",
							onClick: onStop,
							className: "group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4 fill-current" }), "Stop & Save"]
						})
					})] })
				]
			}),
			idle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 flex-wrap justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.label, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "flex cursor-pointer items-center gap-2.5 rounded-full bg-white/[0.03] px-4 py-2 text-xs ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:ring-white/[0.12]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: includeAudio,
							onCheckedChange: onIncludeAudioChange
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-white/50 select-none flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3 w-3" }), "Audio"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.label, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "flex cursor-pointer items-center gap-2.5 rounded-full bg-white/[0.03] px-4 py-2 text-xs ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:ring-white/[0.12]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: includeCamera,
							onCheckedChange: onIncludeCameraChange
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-white/50 select-none flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3 w-3" }), "Webcam"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.label, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "flex cursor-pointer items-center gap-2.5 rounded-full bg-white/[0.03] px-4 py-2 text-xs ring-1 ring-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:ring-white/[0.12]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: annotationsEnabled,
							onCheckedChange: onAnnotationsChange
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-white/50 select-none flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" }), "Annotate"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.label, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: cn("flex cursor-pointer items-center gap-2.5 rounded-full px-4 py-2 text-xs ring-1 backdrop-blur-sm transition-all", whiteboardActive ? "bg-primary/15 ring-primary/30 hover:bg-primary/20 hover:ring-primary/40" : "bg-white/[0.03] ring-white/[0.06] hover:bg-white/[0.06] hover:ring-white/[0.12]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: whiteboardActive,
							onCheckedChange: onWhiteboardChange
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("select-none flex items-center gap-1.5", whiteboardActive ? "text-primary/80" : "text-white/50"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-3 w-3" }), "Whiteboard"]
						})]
					})
				]
			})
		]
	});
}
function RecordingResultPanel({ result, onReset, onEdit }) {
	const [saveState, setSaveState] = (0, import_react.useState)("idle");
	const handleSave = async () => {
		setSaveState("saving");
		const suggestedName = `screencapture-pro_${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19)}.webm`;
		const picker = window.showSaveFilePicker;
		if (typeof picker === "function") try {
			const writable = await (await picker({
				suggestedName,
				types: [{
					description: "WebM Video",
					accept: { "video/webm": [".webm"] }
				}]
			})).createWritable();
			await writable.write(result.blob);
			await writable.close();
			setSaveState("done");
			return;
		} catch (err) {
			if (err.name === "AbortError") {
				setSaveState("idle");
				return;
			}
		}
		const a = document.createElement("a");
		a.href = URL.createObjectURL(result.blob);
		a.download = suggestedName;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setSaveState("done");
	};
	const stats = [
		{
			icon: Clock,
			label: "Duration",
			value: formatTimer(result.durationSeconds)
		},
		{
			icon: MonitorPlay,
			label: "Resolution",
			value: formatResolution(result.width, result.height)
		},
		{
			icon: HardDrive,
			label: "Size",
			value: formatBytes(result.sizeBytes)
		},
		{
			icon: Calendar,
			label: "Recorded",
			value: result.createdAt.toLocaleString(void 0, {
				dateStyle: "medium",
				timeStyle: "short"
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 20
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "glass-deep rounded-2xl p-6 shadow-elegant",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-400" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold text-white",
						children: "Recording ready"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/40 ring-1 ring-white/[0.06]",
					children: "WEBM · High quality"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 lg:grid-cols-4 mb-5",
				children: stats.map(({ icon: Icon, label, value }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-xl p-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-white/30 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest",
							children: label
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm font-semibold text-white/80",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "hero",
						size: "lg",
						onClick: handleSave,
						disabled: saveState === "saving",
						className: "group",
						children: [saveState === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), saveState === "done" ? "Saved" : saveState === "saving" ? "Saving…" : "Save Recording"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "glass",
						size: "lg",
						onClick: onEdit,
						className: "group gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-4 w-4" }), "Edit Video"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "glass",
						size: "lg",
						onClick: onReset,
						className: "group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "New Recording"]
					})
				]
			})
		]
	});
}
var TRUST_CARDS = [
	{
		value: "Zero",
		label: "Installs",
		sub: "Runs entirely in your browser",
		icon: Zap,
		gradient: "from-cyan-400 to-blue-500",
		iconBg: "from-cyan-500 to-blue-600",
		glowColor: "oklch(0.74 0.15 222 / 0.4)",
		hoverBg: "from-cyan-500/[0.07] to-blue-500/[0.04]",
		ring: "group-hover:ring-cyan-500/30"
	},
	{
		value: "100%",
		label: "Private",
		sub: "Nothing ever leaves your device",
		icon: ShieldCheck,
		gradient: "from-emerald-400 to-teal-500",
		iconBg: "from-emerald-500 to-teal-600",
		glowColor: "oklch(0.72 0.16 160 / 0.4)",
		hoverBg: "from-emerald-500/[0.07] to-teal-500/[0.04]",
		ring: "group-hover:ring-emerald-500/30"
	},
	{
		value: "No",
		label: "Watermark",
		sub: "Clean output — yours to keep",
		icon: Lock,
		gradient: "from-violet-400 to-purple-500",
		iconBg: "from-violet-500 to-purple-600",
		glowColor: "oklch(0.65 0.2 295 / 0.4)",
		hoverBg: "from-violet-500/[0.07] to-purple-500/[0.04]",
		ring: "group-hover:ring-violet-500/30"
	},
	{
		value: "4K",
		label: "Quality",
		sub: "Up to 3840 × 2160 resolution",
		icon: Sparkles,
		gradient: "from-amber-400 to-orange-500",
		iconBg: "from-amber-500 to-orange-600",
		glowColor: "oklch(0.75 0.18 60 / 0.4)",
		hoverBg: "from-amber-500/[0.07] to-orange-500/[0.04]",
		ring: "group-hover:ring-amber-500/30"
	}
];
function TrustMetrics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 30
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: 1,
			duration: .7
		},
		className: "mt-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 mb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.07]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-mono uppercase tracking-[0.25em] text-white/25",
						children: "Why ScreenFlow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.07]" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
				children: TRUST_CARDS.map(({ value, label, sub, icon: Icon, gradient, iconBg, glowColor, hoverBg, ring }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 24,
						scale: .93
					},
					animate: {
						opacity: 1,
						y: 0,
						scale: 1
					},
					transition: {
						delay: 1.1 + i * .1,
						duration: .55,
						ease: [
							.25,
							.1,
							.25,
							1
						]
					},
					whileHover: {
						y: -4,
						transition: {
							duration: .2,
							ease: "easeOut"
						}
					},
					className: cn("group relative overflow-hidden rounded-2xl p-5 ring-1 ring-white/[0.07] bg-white/[0.025] backdrop-blur-sm cursor-default transition-all duration-300", ring),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br rounded-2xl", hoverBg) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 flex flex-col gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								whileHover: {
									rotate: [
										0,
										-8,
										8,
										0
									],
									transition: { duration: .4 }
								},
								className: cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg transition-all duration-300", iconBg),
								style: { boxShadow: `0 0 0 1px white/10, 0 6px 24px ${glowColor}` },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "h-[18px] w-[18px] text-white",
									strokeWidth: 2
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-baseline gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("font-display text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent leading-none", gradient),
										children: value
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-white/75 mt-0.5",
									children: label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-white/30 mt-1.5 leading-snug",
									children: sub
								})
							] })]
						})
					]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" })
		]
	});
}
function Index() {
	const [source, setSource] = (0, import_react.useState)("monitor");
	const [whiteboardActive, setWhiteboardActive] = (0, import_react.useState)(false);
	const [spotlightActive, setSpotlightActive] = (0, import_react.useState)(false);
	const [spotlightMode, setSpotlightMode] = (0, import_react.useState)("spotlight");
	const [editorBlob, setEditorBlob] = (0, import_react.useState)(null);
	const [showHistory, setShowHistory] = (0, import_react.useState)(false);
	const [showShortcuts, setShowShortcuts] = (0, import_react.useState)(false);
	const [teleprompterActive, setTeleprompterActive] = (0, import_react.useState)(false);
	const [showAdvanced, setShowAdvanced] = (0, import_react.useState)(false);
	const [scheduledTime, setScheduledTime] = (0, import_react.useState)("");
	const [scheduleActive, setScheduleActive] = (0, import_react.useState)(false);
	const scheduleTimerRef = (0, import_react.useRef)(null);
	const { isAuthenticated, user, logout } = useAuth();
	const { status, elapsed, countdown, stream, result, error, cropRect, multiStreams, includeAudio, setIncludeAudio, includeCamera, setIncludeCamera, cameraStream, cameraPosition, setCameraPosition, cameraSettings, setCameraSettings, quality, setQuality, fps, setFps, noiseSuppressionEnabled, setNoiseSuppressionEnabled, autoStopMinutes, setAutoStopMinutes, startRecording, cancelCountdown, confirmCrop, cancelCrop, addMonitorStream, startMultiRecording, cancelMultiSetup, pauseRecording, resumeRecording, stopRecording, reset, annotationsEnabled, setAnnotationsEnabled, annotationCanvasRef, setupAnnotationCanvas, clearAnnotationCanvas } = useScreenRecorder();
	const isIdle = status === "idle";
	const isLiveStatus = status === "recording" || status === "paused";
	const showClickFX = status === "recording" || whiteboardActive;
	const showCursorFX = status === "recording" || whiteboardActive;
	(0, import_react.useEffect)(() => {
		if (result) saveToHistory(result);
	}, [result]);
	(0, import_react.useEffect)(() => {
		const handleKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable) return;
			if (e.altKey) {
				switch (e.key.toLowerCase()) {
					case "r":
						e.preventDefault();
						if (status === "idle" && !result) startRecording(source);
						break;
					case "n":
						e.preventDefault();
						if (result || status !== "idle") reset();
						break;
					case "h":
						e.preventDefault();
						setShowHistory((v) => !v);
						break;
					case "k":
						e.preventDefault();
						setShowShortcuts((v) => !v);
						break;
					case "e":
						e.preventDefault();
						if (result) setEditorBlob(result.blob);
						break;
					case "t":
						e.preventDefault();
						setTeleprompterActive((v) => !v);
						break;
					case "w":
						e.preventDefault();
						setWhiteboardActive((v) => !v);
						break;
					case "a":
						e.preventDefault();
						setAnnotationsEnabled((v) => !v);
						if (!annotationsEnabled) setupAnnotationCanvas(1920, 1080);
						break;
					case "s":
						e.preventDefault();
						setSpotlightActive((v) => {
							if (!v) setSpotlightMode("spotlight");
							return !v;
						});
						break;
					case "z":
						e.preventDefault();
						setSpotlightActive((v) => {
							if (!v) setSpotlightMode("zoom");
							return !v;
						});
						break;
				}
				return;
			}
			if (e.key === " ") {
				e.preventDefault();
				if (status === "recording") pauseRecording();
				else if (status === "paused") resumeRecording();
			}
			if (e.key === "Escape") {
				if (status === "recording" || status === "paused") stopRecording();
				else if (spotlightActive) setSpotlightActive(false);
				else if (showHistory) setShowHistory(false);
				else if (showShortcuts) setShowShortcuts(false);
				else if (teleprompterActive) setTeleprompterActive(false);
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [
		status,
		result,
		source,
		showHistory,
		showShortcuts,
		teleprompterActive,
		annotationsEnabled,
		spotlightActive,
		startRecording,
		pauseRecording,
		resumeRecording,
		stopRecording,
		reset,
		setAnnotationsEnabled,
		setupAnnotationCanvas
	]);
	const handleSchedule = (0, import_react.useCallback)(() => {
		if (!scheduledTime) return;
		const delay = new Date(scheduledTime).getTime() - Date.now();
		if (delay <= 0) return;
		setScheduleActive(true);
		scheduleTimerRef.current = setTimeout(() => {
			startRecording(source);
			setScheduleActive(false);
		}, delay);
	}, [
		scheduledTime,
		source,
		startRecording
	]);
	const cancelSchedule = (0, import_react.useCallback)(() => {
		if (scheduleTimerRef.current) clearTimeout(scheduleTimerRef.current);
		setScheduleActive(false);
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			if (scheduleTimerRef.current) clearTimeout(scheduleTimerRef.current);
		};
	}, []);
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: .08,
				delayChildren: .1
			}
		}
	};
	const fadeUp = {
		hidden: {
			opacity: 0,
			y: 24
		},
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: .6,
				ease: [
					.25,
					.1,
					.25,
					1
				]
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-screen overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 -z-10 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,oklch(0.74_0.15_222/0.22),transparent)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_85%,oklch(0.72_0.16_200/0.14),transparent)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_85%,oklch(0.65_0.2_295/0.12),transparent)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_55%,oklch(0.7_0.14_250/0.08),transparent)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-[180px] bg-gradient-to-b from-cyan-500/[0.06] via-blue-500/[0.04] to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-[40px] left-[-10%] right-[-10%] h-[90px] bg-gradient-to-r from-transparent via-violet-500/[0.18] to-transparent blur-[32px] animate-aurora-sweep" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[image:radial-gradient(oklch(1_0_0/0.04)_1px,transparent_1px)] bg-[size:24px_24px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-500/[0.14] to-blue-600/[0.08] blur-[130px] animate-float-1 animate-blob-pulse will-change-transform" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -bottom-64 -right-48 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-violet-500/[0.13] to-purple-600/[0.08] blur-[110px] animate-float-2 animate-blob-pulse will-change-transform",
						style: { animationDelay: "-3s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-teal-500/[0.1] to-cyan-500/[0.07] blur-[110px] animate-float-3 animate-blob-pulse will-change-transform",
						style: { animationDelay: "-6s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-1/4 -right-32 w-[380px] h-[380px] rounded-full bg-gradient-to-bl from-violet-500/[0.1] to-pink-500/[0.06] blur-[100px] animate-drift animate-blob-pulse will-change-transform",
						style: { animationDelay: "-2s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-1/4 -left-32 w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-emerald-500/[0.09] to-teal-500/[0.05] blur-[90px] animate-drift animate-blob-pulse will-change-transform",
						style: { animationDelay: "-5s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-[60%] left-[60%] w-[280px] h-[280px] rounded-full bg-gradient-to-tl from-amber-500/[0.08] to-orange-500/[0.05] blur-[80px] animate-float-1 will-change-transform",
						style: { animationDelay: "-9s" }
					}),
					PARTICLES.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute rounded-full bg-white/[0.12] animate-twinkle",
						style: {
							left: p.left,
							top: p.top,
							width: `${p.size}px`,
							height: `${p.size}px`,
							animationDelay: p.delay,
							animationDuration: p.duration
						}
					}, i))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 pointer-events-none z-50 opacity-[0.025]",
				style: {
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
					backgroundSize: "180px 180px",
					backgroundRepeat: "repeat"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClickFX, { active: showClickFX }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CursorFX, {
				active: showCursorFX,
				whiteboardActive,
				brushSize: 4,
				brushColor: "#ffffff",
				toolName: "Pen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhiteboardMode, {
				active: whiteboardActive,
				onClose: () => setWhiteboardActive(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountdownOverlay, {
				countdown,
				onCancel: cancelCountdown,
				status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOverlay, {
				cameraStream,
				position: cameraPosition,
				onPositionChange: setCameraPosition,
				settings: cameraSettings,
				onSettingsChange: setCameraSettings,
				active: includeCamera && (status === "idle" || status === "countdown")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotlightOverlay, {
				active: isLiveStatus,
				spotlightActive,
				onSpotlightActiveChange: setSpotlightActive,
				mode: spotlightMode,
				onModeChange: setSpotlightMode
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingMiniBar, {
				status,
				elapsed,
				onPause: pauseRecording,
				onResume: resumeRecording,
				onStop: stopRecording
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeleprompterOverlay, {
				active: teleprompterActive,
				onClose: () => setTeleprompterActive(false),
				isRecording: status === "recording"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordingHistory, {
				open: showHistory,
				onClose: () => setShowHistory(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyboardShortcutsPanel, {
				open: showShortcuts,
				onClose: () => setShowShortcuts(false)
			}),
			status === "crop" && stream && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CropOverlay, {
				stream,
				onConfirm: confirmCrop,
				onCancel: cancelCrop
			}),
			status === "multi-setup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiMonitorSetup, {
				streams: multiStreams,
				onAddMonitor: addMonitorStream,
				onStart: startMultiRecording,
				onCancel: cancelMultiSetup
			}),
			(status === "recording" || status === "paused") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawingOverlay, {
				enabled: annotationsEnabled,
				annotationCanvasRef,
				recordingWidth: stream?.getVideoTracks()[0]?.getSettings().width ?? 1920,
				recordingHeight: stream?.getVideoTracks()[0]?.getSettings().height ?? 1080,
				onClear: clearAnnotationCanvas
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				variants: container,
				initial: "hidden",
				animate: "show",
				className: "mx-auto max-w-5xl px-4 py-6 md:py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: fadeUp,
						className: "flex items-center justify-between mb-8 md:mb-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-[0_0_20px_-4px_oklch(0.74_0.15_222/0.3)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base font-bold tracking-tight text-white/80",
								children: "ScreenFlow"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowHistory(true),
									title: "Recording History (Alt+H)",
									className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/70 hover:ring-white/[0.12]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowShortcuts(true),
									title: "Keyboard Shortcuts (Alt+K)",
									className: "flex h-8 w-8 items-center justify-center rounded-lg text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/70 hover:ring-white/[0.12]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setTeleprompterActive((v) => !v),
									title: "Teleprompter (Alt+T)",
									className: cn("flex h-8 w-8 items-center justify-center rounded-lg ring-1 transition-all", teleprompterActive ? "bg-primary/15 text-primary/80 ring-primary/25" : "text-white/30 ring-white/[0.06] hover:bg-white/[0.06] hover:text-white/70 hover:ring-white/[0.12]"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAlignStart, { className: "h-4 w-4" })
								}),
								isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 ring-1 ring-white/[0.06] backdrop-blur-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }), user?.name?.split(" ")[0]]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: logout,
										className: "rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/30 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/60",
										children: "Sign out"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "rounded-lg bg-white/[0.03] px-3 py-1.5 text-xs text-white/40 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.06] hover:text-white/70",
									children: "Sign in"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: fadeUp,
						className: "text-center mb-8 md:mb-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
								className: "font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight text-white leading-[1.05] mb-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative inline-block mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -inset-x-20 -inset-y-10 bg-gradient-to-r from-cyan-500/8 via-blue-500/10 to-violet-500/8 blur-[90px] pointer-events-none" }), "Record your screen".split(" ").map((word, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
											initial: {
												opacity: 0,
												y: 40,
												filter: "blur(12px)"
											},
											animate: {
												opacity: 1,
												y: 0,
												filter: "blur(0px)"
											},
											transition: {
												delay: .2 + i * .14,
												duration: .75,
												ease: [
													.16,
													1,
													.3,
													1
												]
											},
											className: "inline-block mr-[0.28em] last:mr-0",
											children: word
										}, i))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
										initial: {
											opacity: 0,
											y: 20
										},
										animate: {
											opacity: 1,
											y: 0
										},
										transition: {
											delay: .62,
											duration: .7,
											ease: [
												.16,
												1,
												.3,
												1
											]
										},
										className: "inline-block pb-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 opacity-70 blur-[2px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gradient bg-[length:250%_auto] hero-animate-gradient",
												children: "in stunning quality"
											})]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
								initial: {
									opacity: 0,
									y: 16
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									delay: .65,
									duration: .6
								},
								className: "text-sm sm:text-base text-white/45 max-w-xl mx-auto leading-relaxed mb-7",
								children: [
									"Capture your display in HD, Full HD or 4K directly from the browser.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden sm:block" }),
									"No installs, no watermarks, no data leaving your machine."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									opacity: 0,
									y: 16
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									delay: .65,
									duration: .6
								},
								className: "flex items-center justify-center gap-2.5 flex-wrap",
								children: HERO_BADGES.map(({ icon: Icon, label, color, bg, ring, glow }, fi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
									initial: {
										opacity: 0,
										scale: .75,
										y: 12
									},
									animate: {
										opacity: 1,
										scale: 1,
										y: 0
									},
									transition: {
										delay: .7 + fi * .1,
										duration: .5,
										type: "spring",
										stiffness: 280,
										damping: 22
									},
									whileHover: {
										y: -2,
										scale: 1.05,
										transition: { duration: .18 }
									},
									className: cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ring-1 backdrop-blur-sm cursor-default", bg, ring),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("flex h-5 w-5 items-center justify-center rounded-full bg-black/20", glow),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-3 w-3", color) })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: color,
										children: label
									})]
								}, label))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								height: 0
							},
							animate: {
								opacity: 1,
								height: "auto"
							},
							exit: {
								opacity: 0,
								height: 0
							},
							className: "mb-4 flex items-start gap-2.5 rounded-xl bg-red-500/10 p-3.5 text-sm ring-1 ring-red-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-red-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-red-300",
								children: error
							})]
						}, "error")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: fadeUp,
						className: "mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-white/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorPlay, { className: "h-3 w-3" }), "Output Preview"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordingPreview, {
							stream,
							status,
							elapsed,
							result
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: isIdle && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 16
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								y: -16
							},
							transition: { duration: .4 },
							className: "mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceCards, {
								value: source,
								onChange: setSource,
								disabled: !isIdle
							})
						}, "sources")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isIdle && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: -8
						},
						transition: { duration: .35 },
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowAdvanced((v) => !v),
							className: "flex w-full items-center justify-between rounded-xl bg-white/[0.025] px-4 py-3 ring-1 ring-white/[0.06] transition-all hover:bg-white/[0.04] hover:ring-white/[0.1]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4 text-white/30" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-white/45",
										children: "Advanced Settings"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [
											fps !== 60 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-mono text-primary/70",
												children: [fps, "fps"]
											}),
											noiseSuppressionEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-400/70",
												children: "Noise filter"
											}),
											autoStopMinutes > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-400/70",
												children: [
													"Auto-stop ",
													autoStopMinutes,
													"m"
												]
											}),
											scheduleActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-400/70 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "relative flex h-1.5 w-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" })]
												}), "Scheduled"]
											})
										]
									})
								]
							}), showAdvanced ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 text-white/20" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-white/20" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showAdvanced && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								height: 0
							},
							animate: {
								opacity: 1,
								height: "auto"
							},
							exit: {
								opacity: 0,
								height: 0
							},
							transition: { duration: .3 },
							className: "overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 rounded-xl bg-white/[0.02] p-5 ring-1 ring-white/[0.05]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] flex flex-col gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-3.5 w-3.5 text-primary/60" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold text-white/60 uppercase tracking-wider",
														children: "Frame Rate"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex gap-2",
													children: [30, 60].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => setFps(f),
														className: cn("flex-1 rounded-lg py-2.5 text-sm font-bold ring-1 transition-all", fps === f ? "bg-primary/20 text-primary ring-primary/40 shadow-[0_0_12px_oklch(0.74_0.15_222/0.2)]" : "bg-white/[0.03] text-white/40 ring-white/[0.08] hover:bg-white/[0.07] hover:text-white/65"),
														children: [f, " FPS"]
													}, f))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-white/25 leading-snug",
													children: "Higher FPS = smoother video, larger file size"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] flex flex-col gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: cn("flex h-7 w-7 items-center justify-center rounded-lg ring-1 transition-all", noiseSuppressionEnabled ? "bg-emerald-500/15 ring-emerald-500/30" : "bg-white/[0.04] ring-white/[0.06]"),
														children: noiseSuppressionEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-3.5 w-3.5 text-white/35" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold text-white/60 uppercase tracking-wider",
														children: "AI Noise Filter"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-3 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-medium text-white/60",
														children: "Noise Suppression"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-white/30 mt-0.5 leading-snug",
														children: "Removes background noise from mic"
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
														checked: noiseSuppressionEnabled,
														onCheckedChange: setNoiseSuppressionEnabled
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: cn("text-[11px] leading-snug transition-colors", noiseSuppressionEnabled ? "text-emerald-400/50" : "text-white/20"),
													children: noiseSuppressionEnabled ? "Active — mic noise filtered" : "Uses browser audio processing"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] flex flex-col gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3.5 w-3.5 text-amber-400/70" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-semibold text-white/60 uppercase tracking-wider",
															children: "Auto-Stop"
														})]
													}), autoStopMinutes > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-amber-400/80 ring-1 ring-amber-500/25",
														children: [autoStopMinutes, " min"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid grid-cols-3 gap-2",
													children: [
														0,
														5,
														10,
														15,
														30,
														60
													].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setAutoStopMinutes(m),
														className: cn("rounded-lg py-2 text-xs font-semibold ring-1 transition-all", autoStopMinutes === m ? "bg-amber-500/20 text-amber-400 ring-amber-500/40 shadow-[0_0_10px_oklch(0.75_0.18_60/0.15)]" : "bg-white/[0.03] text-white/35 ring-white/[0.07] hover:bg-white/[0.06] hover:text-white/55"),
														children: m === 0 ? "Off" : `${m}m`
													}, m))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-white/25 leading-snug",
													children: "Recording stops automatically after this duration"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl bg-white/[0.025] p-4 ring-1 ring-white/[0.06] flex flex-col gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: cn("flex h-7 w-7 items-center justify-center rounded-lg ring-1 transition-all", scheduleActive ? "bg-violet-500/15 ring-violet-500/30" : "bg-white/[0.04] ring-white/[0.06]"),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: cn("h-3.5 w-3.5", scheduleActive ? "text-violet-400" : "text-white/35") })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs font-semibold text-white/60 uppercase tracking-wider",
															children: "Schedule"
														}),
														scheduleActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "ml-auto flex items-center gap-1.5 text-[11px] text-violet-400/70",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "relative flex h-1.5 w-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" })]
															}), "Armed"]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "datetime-local",
													value: scheduledTime,
													onChange: (e) => setScheduledTime(e.target.value),
													disabled: scheduleActive,
													className: "w-full rounded-lg bg-white/[0.04] px-3 py-2.5 text-xs text-white/60 ring-1 ring-white/[0.08] outline-none transition-all focus:ring-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
												}),
												scheduleActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: cancelSchedule,
													className: "w-full rounded-lg bg-red-500/12 py-2.5 text-xs font-semibold text-red-400/80 ring-1 ring-red-500/25 transition-all hover:bg-red-500/20 hover:text-red-300",
													children: "Cancel Schedule"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: handleSchedule,
													disabled: !scheduledTime,
													className: "w-full rounded-lg bg-violet-500/12 py-2.5 text-xs font-semibold text-violet-400/80 ring-1 ring-violet-500/25 transition-all hover:bg-violet-500/20 hover:text-violet-300 disabled:opacity-30 disabled:cursor-not-allowed",
													children: "Set Schedule"
												}),
												scheduleActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-violet-400/50 leading-snug",
													children: [
														"Starts at",
														" ",
														new Date(scheduledTime).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit"
														})
													]
												})
											]
										})
									]
								})
							})
						}) })]
					}, "advanced-settings") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants: fadeUp,
						className: "glass rounded-2xl p-5 shadow-elegant",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlBar, {
							status,
							includeAudio,
							onIncludeAudioChange: setIncludeAudio,
							includeCamera,
							onIncludeCameraChange: setIncludeCamera,
							onStart: () => startRecording(source),
							onPause: pauseRecording,
							onResume: resumeRecording,
							onStop: stopRecording,
							source,
							quality,
							onQualityChange: setQuality,
							annotationsEnabled,
							onAnnotationsChange: (v) => {
								setAnnotationsEnabled(v);
								if (v) setupAnnotationCanvas(1920, 1080);
							},
							whiteboardActive,
							onWhiteboardChange: setWhiteboardActive
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							y: 20
						},
						transition: { duration: .5 },
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordingResultPanel, {
							result,
							onReset: reset,
							onEdit: () => setEditorBlob(result.blob)
						})
					}, "result") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustMetrics, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: fadeUp,
						className: "flex items-center justify-center gap-2 mt-8 text-xs text-white/15",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-white/10" }), "Recordings never leave your device — everything is processed locally."]
					})
				]
			}),
			editorBlob && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoEditor, {
				blob: editorBlob,
				onClose: () => setEditorBlob(null)
			})
		]
	});
}
//#endregion
export { Index as component };
