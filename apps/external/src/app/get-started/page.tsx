"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Toast } from "@shared/components/ui/use-toast";
import ResponsiveMenubar from "@shared/components/responsive-menubar";

export default function GetStartedPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'couple' | 'vendor' | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Example: call your backend API for signup
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role  }),
      });

      if (!res.ok) throw new Error("Signup failed");
      Toast({ title: "Account created!"});
      router.push("/login");
    } catch {
      Toast({ title: "Error"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
        <ResponsiveMenubar />
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl mt-[72px] shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Create an account</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
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
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-brand-600 font-medium">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
