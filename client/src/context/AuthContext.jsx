
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = "authToken";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (stored) {
      setToken(stored);
    }
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    window.localStorage.setItem(AUTH_TOKEN_KEY, newToken);
  };

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const value = {
    isAuthenticated: Boolean(token),
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

