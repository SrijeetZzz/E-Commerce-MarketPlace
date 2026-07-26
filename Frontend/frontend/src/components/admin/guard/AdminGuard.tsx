"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

export default function AdminGuard({ children }: any) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/login");
      }
    }
  }, [user, loading]);

  // 🚨 prevent flicker + wrong render
  if (loading || !user) {
    return <div>Checking access...</div>;
  }

  if (user.role !== "ADMIN") {
    return null;
  }

  return children;
}