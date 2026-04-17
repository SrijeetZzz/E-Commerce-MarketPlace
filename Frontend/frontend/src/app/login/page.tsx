"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/services/api";
import { AuthResponse } from "@/types/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Login = () => {
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
      console.log("data",res.user);
      localStorage.setItem("token", res.token);
      window.location.href = "/";
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
        </CardHeader>

        <CardContent>
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
              <Input type="password" name="password" onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>

            {/* 🔥 Divider */}
            <div className="flex items-center gap-2">
              <div className="h-px bg-muted flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px bg-muted flex-1" />
            </div>

            {/* 🔥 Google Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-4 h-4"
              >
                <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.5 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* 🔥 Link */}
            <p className="text-sm text-center text-muted-foreground">
              Don’t have an account?{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => (window.location.href = "/register")}
              >
                Register
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
