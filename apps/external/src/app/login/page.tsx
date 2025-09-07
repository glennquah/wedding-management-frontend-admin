"use client";

import { useState } from "react";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import { useHandleSession } from "../hooks/useHandleSession";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleSignIn } = useHandleSession();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
        <ResponsiveMenubar />
      <div className="w-full max-w-lg bg-white p-8 mt-[72px] rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Login to your account</h2>
        <form onSubmit={e => handleSignIn(e, { username, password }, setLoading)} className="space-y-4">
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="username">Username</Label>
            <Input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="your username"
            />
          </div>
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/get-started" className="text-brand-600 font-medium">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
