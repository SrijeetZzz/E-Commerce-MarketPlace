"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/services/api";
import { AuthResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

type Props = {
  onSuccess?: () => void;
};

const LoginForm = ({ onSuccess }: Props) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      const resData = response.data as AuthResponse;

      if (resData.token) {
        localStorage.setItem("token", resData.token);
        localStorage.setItem("user", JSON.stringify(resData.user));
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      // Replace alert with a toast if you have one
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
          Email Address
        </Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            className="pl-11 rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-slate-200 transition-all font-medium"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-500">
            Password
          </Label>
          <button type="button" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-tighter">
            Forgot?
          </button>
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="pl-11 pr-11 rounded-2xl h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-slate-200 transition-all font-medium"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-2xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200 transition-all active:scale-[0.98] group"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex items-center justify-center gap-2">
            Sign In
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-px bg-slate-100 flex-1" />
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Social Login</span>
        <div className="h-px bg-slate-100 flex-1" />
      </div>

      {/* Google Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 rounded-2xl border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 font-bold text-slate-700 shadow-sm transition-all"
      >
        <img 
          src="https://www.svgrepo.com/show/355037/google.svg" 
          className="w-5 h-5 mr-3" 
          alt="Google" 
        />
        Continue with Google
      </Button>
    </form>
  );
};

export default LoginForm;