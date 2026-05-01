// "use client";

// import { useAuth } from "@/components/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;

//     if (!user) {
//       router.replace("/login");
//     }
//   }, [loading, user]);

//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) return null;

//   return <>{children}</>;
// };

// export default ProtectedRoute;


"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[]; // 🔥 NEW
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // ❌ Not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // ❌ Logged in but wrong role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/"); // or "/403"
    }
  }, [loading, user, allowedRoles, router]);

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // ❌ Block render if not logged in
  if (!user) return null;

  // ❌ Block render if wrong role (prevents flicker)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;