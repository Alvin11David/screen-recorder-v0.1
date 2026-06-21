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
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "sc-auth-user";

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

  const login = useCallback(async (email: string, _password: string): Promise<string | null> => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 800));
    const user: User = { email, name: email.split("@")[0] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    return null;
  }, []);

  const register = useCallback(
    async (name: string, email: string, _password: string): Promise<string | null> => {
      setState((s) => ({ ...s, isLoading: true }));
      await new Promise((r) => setTimeout(r, 800));
      const user: User = { email, name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      return null;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const loginWithOAuth = useCallback(
    async (_provider: "google" | "github" | "microsoft"): Promise<string | null> => {
      setState((s) => ({ ...s, isLoading: true }));
      await new Promise((r) => setTimeout(r, 1200));
      const user: User = { email: "user@example.com", name: "User" };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      return null;
    },
    [],
  );

  const sendResetLink = useCallback(async (_email: string): Promise<string | null> => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 1000));
    setState((s) => ({ ...s, isLoading: false }));
    return null;
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
