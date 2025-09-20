import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export type Role = "admin" | "supervisor" | "field";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  login: (u: Omit<User, "id"> & { password: string }) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_KEY = "nivaranauth:v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  const login: AuthContextValue["login"] = async ({ name, email, role, password }) => {
    // Demo authentication. Replace with real auth later.
    if (!email || !password) throw new Error("Email and password are required");
    // Minimal password check to simulate security policy
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    const u: User = {
      id: crypto.randomUUID(),
      name: name || email.split("@")[0],
      email,
      role,
    };
    setUser(u);
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    navigate("/login");
  };

  const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);

  const value = useMemo<AuthContextValue>(() => ({ user, login, logout, hasRole }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function Protected({ roles, children }: { roles?: Role[]; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    // Render nothing; routing handles redirect
    return null;
  }
  if (roles && !roles.includes(user.role)) {
    return null;
  }
  return children;
}
