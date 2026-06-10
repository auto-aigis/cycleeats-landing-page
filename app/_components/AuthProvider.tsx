"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/app/_lib/api";
import type { User } from "@/app/_lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return default values when called outside AuthProvider (during SSR)
    return {
      user: null,
      loading: true,
      refresh: async () => {},
      logout: async () => {},
    };
  }
  return context;
}
