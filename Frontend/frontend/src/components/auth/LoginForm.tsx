"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/services/api";
import { AuthResponse } from "@/types/auth";
import { useAuth } from "@/components/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  onSuccess?: () => void;
};

const LoginForm = ({ onSuccess }: Props) => {
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", form);
      const resData = response.data as AuthResponse;

      await login(resData);
      toast.success("Welcome back! 👋");

      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        
        {/* EMAIL ADDRESS */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            Email Address
          </Label>
          <div className="relative group">
            <Mail 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" 
              size={18} 
            />
            <Input
              name="email"
              type="email"
              required
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              className="h-12 pl-11 pr-4 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Password
            </Label>
            <a href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">
              Forgot?
            </a>
          </div>
          <div className="relative group">
            <Lock 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" 
              size={18} 
            />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="h-12 pl-11 pr-11 rounded-xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm focus:ring-2 focus:ring-slate-900/5"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Sign In
            <ArrowRight size={18} />
          </>
        )}
      </Button>

      {/* SOCIAL DIVIDER */}
      <div className="flex items-center gap-4 my-2">
        <div className="h-1px bg-slate-100 flex-1" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">OR</span>
        <div className="h-1px bg-slate-100 flex-1" />
      </div>

      {/* GOOGLE LOGIN */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-all flex items-center justify-center gap-3"
      >
        <img 
          src="https://www.svgrepo.com/show/355037/google.svg" 
          className="w-5 h-5" 
          alt="Google" 
        />
        Continue with Google
      </Button>
    </form>
  );
};

export default LoginForm;