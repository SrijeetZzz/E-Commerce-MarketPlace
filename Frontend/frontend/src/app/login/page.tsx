"use client";

import LoginForm from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const LoginPage = () => {
   const router = useRouter();
  return (
    /* PROFESSIONAL BACKGROUND: A subtle gradient blend for a premium feel */
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 py-12">
      {/* MESH GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-slate-200/40 rounded-full blur-[120px]" />
      </div>

      {/* MAIN CARD: Width increased to 550px, vertical padding reduced */}
      <Card className="relative w-full max-w-137.5 border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] bg-white/90 backdrop-blur-md z-10">
        <CardHeader className="space-y-2 text-center pt-10 pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Login to your account to continue shopping
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 pb-10 px-8 md:px-12">
          <LoginForm onSuccess={() => router.push("/")} />
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account yet?{" "}
              <a 
                href="/register" 
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Create an account
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* MINIMAL FOOTER */}
      <footer className="mt-8 flex gap-6 text-[11px] font-medium text-slate-400 uppercase tracking-wider z-10">
        <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
        <span className="text-slate-200">•</span>
        <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
        <span className="text-slate-200">•</span>
        <a href="#" className="hover:text-slate-600 transition-colors">Help</a>
      </footer>
    </div>
  );
};

export default LoginPage;