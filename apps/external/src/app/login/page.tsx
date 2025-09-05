"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { toast } from "sonner"
import ResponsiveMenubar from "@shared/components/responsive-menubar";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'couple' | 'vendor' | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {      
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });
      if (!res?.ok) throw new Error("Signin failed");
      toast("Successfully Login.")
      router.push("/user");
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
        <ResponsiveMenubar />
      <div className="w-full max-w-lg bg-white p-8 mt-[72px] rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Login to your account</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
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
          {/* Role selection */}
          <div className="flex flex-col gap-2 mt-4">
            <Label>Role</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={role === 'couple' ? 'default' : 'secondary'}
                onClick={() => setRole('couple')}
                className={role === 'couple' ? 'flex-1 bg-secondary hover:bg-secondary-hover' : 'flex-1 border-secondary text-secondary hover:bg-secondary/10'}
              >
                Couple
              </Button>
              <Button
                type="button"
                variant={role === 'vendor' ? 'default' : 'secondary'}
                onClick={() => setRole('vendor')}
                className={role === 'vendor' ? 'flex-1 bg-secondary hover:bg-secondary-hover' : 'flex-1 border-secondary text-secondary hover:bg-secondary/10'}
              >
                Vendor
              </Button>
            </div>
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
