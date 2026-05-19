import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchCurrentUser,
  loginRequest,
  registerRequest,
} from "../services/api.js";

const AUTH_STORAGE_KEY = "km-auth";
const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    return stored?.token && stored?.user ? stored : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const [isInitializing, setIsInitializing] = useState(() => Boolean(readStoredAuth()));

  const saveAuth = (nextAuth) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  };

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!auth?.token) {
        setIsInitializing(false);
        return;
      }

      try {
        const data = await fetchCurrentUser();
        if (active) {
          saveAuth({ token: auth.token, user: data.user });
        }
      } catch {
        if (active) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setAuth(null);
        }
      } finally {
        if (active) {
          setIsInitializing(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const nextAuth = await loginRequest(credentials);
    saveAuth(nextAuth);
    return nextAuth;
  };

  const register = async (payload) => {
    const nextAuth = await registerRequest(payload);
    saveAuth(nextAuth);
    return nextAuth;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
  };

  const updateUser = (user) => {
    if (!auth?.token) {
      return;
    }

    saveAuth({ token: auth.token, user });
  };

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      isInitializing,
      login,
      register,
      logout,
      updateUser,
    }),
    [auth, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
