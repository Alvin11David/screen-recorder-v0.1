import { o as __toESM } from "../_runtime.mjs";
import { i as require_react, r as require_jsx_runtime } from "../_libs/@paper-design/shaders-react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-DJQ4K-sd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
var STORAGE_KEY = "sc-auth-user";
var TOKEN_KEY = "sc-auth-token";
var API_BASE = "http://localhost:8080";
function apiUrl(path) {
	return `${API_BASE}${path}`;
}
function loadUser() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function AuthProvider({ children }) {
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [state, setState] = (0, import_react.useState)({
		user: null,
		isAuthenticated: false,
		isLoading: false
	});
	(0, import_react.useEffect)(() => {
		const user = loadUser();
		setState({
			user,
			isAuthenticated: user !== null,
			isLoading: false
		});
		setHydrated(true);
	}, []);
	const setUser = (user, token) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
		localStorage.setItem(TOKEN_KEY, token);
		setState({
			user,
			isAuthenticated: true,
			isLoading: false
		});
	};
	const login = (0, import_react.useCallback)(async (email, password) => {
		setState((s) => ({
			...s,
			isLoading: true
		}));
		try {
			const res = await fetch(apiUrl("/api/auth/login"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password
				})
			});
			const data = await res.json();
			if (!res.ok) return data.error || "Login failed";
			setUser({
				email: data.email,
				name: data.name,
				avatar: data.avatar
			}, data.token);
			return null;
		} catch {
			return "Network error — is the backend running?";
		}
	}, []);
	const register = (0, import_react.useCallback)(async (name, email, password) => {
		setState((s) => ({
			...s,
			isLoading: true
		}));
		try {
			const res = await fetch(apiUrl("/api/auth/register"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					password
				})
			});
			const data = await res.json();
			if (!res.ok) return data.error || "Registration failed";
			setUser({
				email: data.email,
				name: data.name,
				avatar: data.avatar
			}, data.token);
			return null;
		} catch {
			return "Network error — is the backend running?";
		}
	}, []);
	const logout = (0, import_react.useCallback)(() => {
		localStorage.removeItem(STORAGE_KEY);
		localStorage.removeItem(TOKEN_KEY);
		setState({
			user: null,
			isAuthenticated: false,
			isLoading: false
		});
	}, []);
	const loginWithOAuth = (0, import_react.useCallback)(async (_provider) => {
		return null;
	}, []);
	const sendResetLink = (0, import_react.useCallback)(async (email) => {
		setState((s) => ({
			...s,
			isLoading: true
		}));
		try {
			const res = await fetch(apiUrl("/api/auth/forgot-password"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email })
			});
			if (!res.ok) return (await res.json()).error || "Failed to send reset link";
			return null;
		} catch {
			return "Network error — is the backend running?";
		} finally {
			setState((s) => ({
				...s,
				isLoading: false
			}));
		}
	}, []);
	const verifyResetCode = (0, import_react.useCallback)(async (email, code) => {
		setState((s) => ({
			...s,
			isLoading: true
		}));
		try {
			const res = await fetch(apiUrl("/api/auth/verify-reset-code"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					code
				})
			});
			if (!res.ok) return (await res.json()).error || "Invalid code";
			return null;
		} catch {
			return "Network error — is the backend running?";
		} finally {
			setState((s) => ({
				...s,
				isLoading: false
			}));
		}
	}, []);
	const resetPassword = (0, import_react.useCallback)(async (email, code, newPassword) => {
		setState((s) => ({
			...s,
			isLoading: true
		}));
		try {
			const res = await fetch(apiUrl("/api/auth/reset-password"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					code,
					newPassword
				})
			});
			if (!res.ok) return (await res.json()).error || "Failed to reset password";
			return null;
		} catch {
			return "Network error — is the backend running?";
		} finally {
			setState((s) => ({
				...s,
				isLoading: false
			}));
		}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			...state,
			login,
			register,
			logout,
			loginWithOAuth,
			sendResetLink,
			verifyResetCode,
			resetPassword
		},
		children: hydrated ? children : null
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
