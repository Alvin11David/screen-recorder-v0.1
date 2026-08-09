import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  setUser: (user: User, token: string) => void;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  loginWithOAuth: (provider: "google" | "github" | "microsoft") => Promise<string | null>;
  sendResetLink: (email: string) => Promise<string | null>;
  verifyResetCode: (email: string, code: string) => Promise<string | null>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "sc-auth-user";
const TOKEN_KEY = "sc-auth-token";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

console.info(`[auth] API_BASE = ${API_BASE}`);

function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

const NETWORK_ERROR = "Couldn't reach the server — please check your connection and try again.";

async function postJson(path: string, body: unknown, maxAttempts = 3) {
  const url = apiUrl(path);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.info(`[auth] POST ${url} (attempt ${attempt + 1}/${maxAttempts})`);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      console.info(`[auth] ${url} -> ${res.status}`, data);
      return { status: res.status, data };
    } catch (err) {
      console.error(`[auth] fetch failed (${url}, attempt ${attempt + 1}/${maxAttempts})`, err, {
        cause: (err as Error)?.cause,
      });
      if (attempt < maxAttempts - 1) {
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
        continue;
      }
      throw new Error(NETWORK_ERROR);
    }
  }
  throw new Error(NETWORK_ERROR);
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  useEffect(() => {
    const user = loadUser();
    setState({ user, isAuthenticated: user !== null, isLoading: false });
    setHydrated(true);
  }, []);

  const setUser = (user: User, token: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    setState({ user, isAuthenticated: true, isLoading: false });
  };

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const { status, data } = await postJson("/api/auth/login", { email, password });
      if (status >= 400) return (data?.error as string) || "Login failed";
      if (!data) return NETWORK_ERROR;
      setUser({ email: data.email, name: data.name, avatar: data.avatar }, data.token);
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : NETWORK_ERROR;
    } finally {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<string | null> => {
      setState((s) => ({ ...s, isLoading: true }));
      try {
        const { status, data } = await postJson("/api/auth/register", { name, email, password });
        if (status >= 400) return (data?.error as string) || "Registration failed";
        if (!data) return NETWORK_ERROR;
        setUser({ email: data.email, name: data.name, avatar: data.avatar }, data.token);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : NETWORK_ERROR;
      } finally {
        setState((s) => ({ ...s, isLoading: false }));
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const loginWithOAuth = useCallback(
    async (_provider: "google" | "github" | "microsoft"): Promise<string | null> => {
      return null;
    },
    [],
  );

  const sendResetLink = useCallback(async (email: string): Promise<string | null> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const { status, data } = await postJson("/api/auth/forgot-password", {
        email,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      if (status >= 400) return (data?.error as string) || "Failed to send reset link";
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : NETWORK_ERROR;
    } finally {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const verifyResetCode = useCallback(
    async (email: string, code: string): Promise<string | null> => {
      setState((s) => ({ ...s, isLoading: true }));
      try {
        const { status, data } = await postJson("/api/auth/verify-reset-code", { email, code });
        if (status >= 400) return (data?.error as string) || "Invalid code";
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : NETWORK_ERROR;
      } finally {
        setState((s) => ({ ...s, isLoading: false }));
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (email: string, code: string, newPassword: string): Promise<string | null> => {
      setState((s) => ({ ...s, isLoading: true }));
      try {
        const { status, data } = await postJson("/api/auth/reset-password", {
          email,
          code,
          newPassword,
        });
        if (status >= 400) return (data?.error as string) || "Failed to reset password";
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : NETWORK_ERROR;
      } finally {
        setState((s) => ({ ...s, isLoading: false }));
      }
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setUser,
        login,
        register,
        logout,
        loginWithOAuth,
        sendResetLink,
        verifyResetCode,
        resetPassword,
      }}
    >
      {hydrated ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
