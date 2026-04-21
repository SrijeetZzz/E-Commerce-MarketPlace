"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/services/api";
import { AuthResponse } from "@/types/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = (await api.post("/auth/register", form)) as AuthResponse;
      localStorage.setItem("token", res.token);
      window.location.href = "/";
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    /* PROFESSIONAL BACKGROUND: Matches Login Page Exactly */
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4 py-12">
      {/* MESH GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-slate-200/40 rounded-full blur-[120px]" />
      </div>

      {/* MAIN CARD: Replicated from Login Reference (max-w-[550px]) */}
      <Card className="relative w-full max-w-137.5 border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] bg-white/90 backdrop-blur-md z-10">
        <CardHeader className="space-y-2 text-center pt-10 pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Create account
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Start your journey with us and explore our collection
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 pb-10 px-8 md:px-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-medium ml-1">Name</Label>
              <Input
                name="name"
                placeholder="Your name"
                onChange={handleChange}
                className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11 bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-700 font-medium ml-1">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11 bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-700 font-medium ml-1">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11 bg-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all mt-2 shadow-lg shadow-slate-100"
            >
              Register
            </Button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                OR
              </span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            {/* GOOGLE BUTTON: Using the Professional multi-path SVG */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-medium text-slate-700 bg-white"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                className="w-5 h-5 mr-3"
                alt="Google"
              />
              Continue with Google
            </Button>
          </form>

          {/* FOOTER LINK */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* MINIMAL PAGE FOOTER */}
      <footer className="mt-8 flex gap-6 text-[11px] font-medium text-slate-400 uppercase tracking-wider z-10">
        <a href="#" className="hover:text-slate-600 transition-colors">
          Privacy
        </a>
        <span className="text-slate-200">•</span>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Terms
        </a>
        <span className="text-slate-200">•</span>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Help
        </a>
      </footer>
    </div>
  );
};

export default Register;
