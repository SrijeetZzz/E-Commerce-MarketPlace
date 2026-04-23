// "use client";

// import { useAuth } from "@/components/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.replace("/login");
//     }
//   }, [loading, user]);

//   if (loading) {
//     return <div className="p-10">Loading...</div>;
//   }

//   if (!user) return null;

//   return <>{children}</>;
// };

// export default ProtectedRoute;

"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;