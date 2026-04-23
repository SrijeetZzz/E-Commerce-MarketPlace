"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import api, { setAccessToken } from "@/services/api";
import { AuthResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Loader2, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password is too short (min 6 characters)");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/register", form);
      const resData = response.data as AuthResponse;

      if (resData.accessToken) {
        setAccessToken(resData.accessToken);
        localStorage.setItem("user", JSON.stringify(resData.user));
      }

      toast.success("Welcome aboard! 🎉");
      setTimeout(() => { window.location.href = "/"; }, 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F8FAFC] px-4 py-12">
      {/* MESH BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]" />
      </div>

      <Card className="relative w-full max-w-120 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] bg-white/80 backdrop-blur-xl z-10 p-2">
        <CardHeader className="space-y-1 text-center pt-10 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Create account
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Join us to start your shopping journey
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 md:px-10 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</Label>
                <Input
                  name="name"
                  placeholder="John Doe"
                  className="h-12 px-4 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 px-4 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 px-4 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign Up <ArrowRight size={18} /></>}
            </Button>

            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">OR</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-all flex items-center justify-center gap-3"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
              Sign up with Google
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 font-bold hover:underline">
                Login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-[11px] text-slate-400 font-medium uppercase tracking-[0.15em]">
        Safe & Secure Checkout
      </p>
    </div>
  );
};

export default Register;