"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "@/services/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 🔥 ALWAYS refresh first
        const refreshRes = await api.post("/auth/refresh");
        setAccessToken(refreshRes.data.accessToken);
        const userRes = await api.get("/auth/me");
        setUser(userRes.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);
  useEffect(() => {
    console.log("🔥 AUTH PROVIDER MOUNTED");
  }, []);

  const login = (data: any) => {
    setAccessToken(data.accessToken);
    console.log(data.user);
    setUser(data.user);
  };

  const logout = async () => {
  try {
    await api.post("/auth/logout"); 
  } catch (err) {
    console.error("Logout API failed", err);
  }

  setUser(null);
  setAccessToken(null);
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
