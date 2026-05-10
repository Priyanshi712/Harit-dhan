import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session on mount
  const [authError, setAuthError] = useState(null);

  // ── Check if user is already logged in (on app mount) ────────────────────
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include", // send httpOnly cookie
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // No active session — that's fine
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    setAuthError(null);
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!data.success) {
      setAuthError(data.message);
      throw new Error(data.message);
    }
    // Store access token for non-cookie clients (optional)
    if (data.accessToken) {
      sessionStorage.setItem("hd_token", data.accessToken);
    }
    setUser(data.user);
    return data.user;
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setAuthError(null);
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) {
      setAuthError(data.message);
      throw new Error(data.message);
    }
    if (data.accessToken) {
      sessionStorage.setItem("hd_token", data.accessToken);
    }
    setUser(data.user);
    return data.user;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("hd_token")}`,
        },
      });
    } catch {
      // Silently fail — still clear local state
    }
    sessionStorage.removeItem("hd_token");
    setUser(null);
  }, []);

  // ── Get auth header for API calls ─────────────────────────────────────────
  const getAuthHeaders = useCallback(() => {
    const token = sessionStorage.getItem("hd_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        getAuthHeaders,
        clearError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default AuthContext;
