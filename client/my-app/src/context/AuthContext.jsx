// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [checking, setChecking] = useState(false);
  const isAuthed = Boolean(token);

  const setAuth = ({ token: t, user: u }) => {
    if (t) {
      localStorage.setItem("token", t);
      setToken(t);
    } else {
      localStorage.removeItem("token");
      setToken("");
    }

    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const logout = (redirect = true) => {
    setAuth({ token: "", user: null });
    if (redirect) navigate("/login", { replace: true });
  };

  // Optional: verify token once on load / token change
  useEffect(() => {
    const verify = async () => {
      if (!token) return;

      setChecking(true);
      try {
        const res = await api.get("/user/checkUser");
        if (res?.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch {
        logout(false);
      } finally {
        setChecking(false);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({ token, user, isAuthed, checking, setAuth, logout }),
    [token, user, isAuthed, checking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
