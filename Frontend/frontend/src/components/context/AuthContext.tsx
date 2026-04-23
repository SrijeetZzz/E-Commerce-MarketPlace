"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "@/services/api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshRes = await api.post("/auth/refresh");
        setAccessToken(refreshRes.data.accessToken);

        const userRes = await api.get("/auth/me");
        setUser(userRes.data);
        await fetchCartCount();
      } catch (err) {
        setUser(null);
        setCartCount(0); // important
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);
  useEffect(() => {
    console.log("🔥 AUTH PROVIDER MOUNTED");
  }, []);

  const login = async (data: any) => {
    try {
      setAccessToken(data.accessToken);

      // 🔥 ALWAYS fetch fresh user
      const userRes = await api.get("/auth/me");
      setUser(userRes.data);
      await fetchCartCount();
    } catch (err) {
      console.error("Login sync failed", err);
      setUser(null);
    }
  };
  const fetchCartCount = async () => {
    try {
      const cartRes = await api.get("/cart");
      const items = cartRes.data?.data?.items || [];

      const count = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
      setCartCount(count);
    } catch (err) {
      setCartCount(0);
    }
  };
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API failed", err);
    }
    setUser(null);
    setAccessToken(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, cartCount, setCartCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
