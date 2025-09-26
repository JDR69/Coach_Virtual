import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService, restoreTokensFromStorage, setAccessToken } from "../api/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restaurar sesión al cargar (desde localStorage + (opcional) ME)
  useEffect(() => {
    let mounted = true;
    const { accessToken } = restoreTokensFromStorage();
    if (accessToken) setAccessToken(accessToken);

    (async () => {
      try {
        const me = await authService.me();
        if (mounted) setUser(me || null);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setInitializing(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const signIn = async (email, password) => {
    const { user: u } = await authService.login(email, password);
    setUser(u || null);
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    initializing,
    signIn,
    signOut,
    setUser,
  }), [user, initializing]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
