// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import api, { setAccessToken } from "@/services/api";

// const AuthContext = createContext<any>(null);

// export const AuthProvider = ({ children }: any) => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         const refreshRes = await api.post("/auth/refresh");
//         setAccessToken(refreshRes.data.accessToken);

//         const userRes = await api.get("/auth/me");
//         setUser(userRes.data);
//         await fetchCartCount();
//       } catch (err) {
//         setUser(null);
//         setCartCount(0); // important
//       } finally {
//         setLoading(false);
//       }
//     };

//     initAuth();
//   }, []);

//   useEffect(() => {
//     console.log("🔥 AUTH PROVIDER MOUNTED");
//   }, []);

//   const login = async (data: any) => {
//     try {
//       setAccessToken(data.accessToken);

//       // 🔥 ALWAYS fetch fresh user
//       const userRes = await api.get("/auth/me");
//       setUser(userRes.data);
//       await fetchCartCount();
//     } catch (err) {
//       console.error("Login sync failed", err);
//       setUser(null);
//     }
//   };
//   const fetchCartCount = async () => {
//     try {
//       const cartRes = await api.get("/cart");
//       const items = cartRes.data?.data?.items || [];

//       const count = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
//       setCartCount(count);
//     } catch (err) {
//       setCartCount(0);
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (err) {
//       console.error("Logout API failed", err);
//     }
//     setUser(null);
//     setAccessToken(null);
//     setCartCount(0);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, logout, cartCount, setCartCount }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "@/services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  cartCount: number;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // 🔥 Normalize user shape (CRITICAL)
  const normalizeUser = (data: any): User => {
    const u = data?.user || data; // handles both {user: {}} and {}
    return {
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      isVerified: u.isVerified,
      isActive: u.isActive,
    };
  };

  // 🚀 INIT AUTH (runs once)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshRes = await api.post("/auth/refresh");
        setAccessToken(refreshRes.data.accessToken);

        const userRes = await api.get("/auth/me");

        setUser(normalizeUser(userRes.data));

        await fetchCartCount();
      } catch (err) {
        setUser(null);
        setCartCount(0);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🚀 LOGIN
  const login = async (data: any) => {
    try {
      setAccessToken(data.accessToken);

      // use login response directly (no extra API call needed)
      setUser(normalizeUser(data));

      await fetchCartCount();
    } catch (err) {
      console.error("Login failed", err);
      setUser(null);
    }
  };

  // 🚀 LOGOUT
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

  // 🚀 SAFE USER UPDATE (avatar, profile, etc.)
  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
  };

  // 🚀 CART COUNT
  const fetchCartCount = async () => {
    try {
      const cartRes = await api.get("/cart");
      const items = cartRes.data?.data?.items || [];

      const count = items.reduce(
        (sum: number, i: any) => sum + i.quantity,
        0
      );

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        cartCount,
        updateUser,
        setCartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};