import { createContext, useContext, useCallback, useState, type ReactNode } from "react";

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

function apiUrl(path: string) {
  return `${API_BASE}${path}`;
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
  const [state, setState] = useState<AuthState>({
    user: loadUser(),
    isAuthenticated: loadUser() !== null,
    isLoading: false,
  });

  const setUser = (user: User, token: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    setState({ user, isAuthenticated: true, isLoading: false });
  };

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "Login failed";
      setUser({ email: data.email, name: data.name, avatar: data.avatar }, data.token);
      return null;
    } catch {
      return "Network error — is the backend running?";
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "Registration failed";
      setUser({ email: data.email, name: data.name, avatar: data.avatar }, data.token);
      return null;
    } catch {
      return "Network error — is the backend running?";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const loginWithOAuth = useCallback(async (_provider: "google" | "github" | "microsoft"): Promise<string | null> => {
    return null;
  }, []);

  const sendResetLink = useCallback(async (email: string): Promise<string | null> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        return data.error || "Failed to send reset link";
      }
      return null;
    } catch {
      return "Network error — is the backend running?";
    } finally {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, loginWithOAuth, sendResetLink }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
