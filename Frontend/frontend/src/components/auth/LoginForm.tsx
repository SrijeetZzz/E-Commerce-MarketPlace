"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/services/api";
import { AuthResponse } from "@/types/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  onSuccess?: () => void;
};

const LoginForm = ({ onSuccess }: Props) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = (await api.post("/auth/login", form)) as AuthResponse;

      localStorage.setItem("token", res.token);

      // 🔥 close modal instead of redirect
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          name="email"
          placeholder="you@example.com"
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="h-px bg-muted flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px bg-muted flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
      >
        Continue with Google
      </Button>

    </form>
  );
};

export default LoginForm;