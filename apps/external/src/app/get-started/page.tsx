"use client";

import ResponsiveMenubar from "@shared/components/responsive-menubar";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/form/input";
import { Label } from "@shared/components/ui/form/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function GetStartedPage() {
  const NEXTAUTH_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'couple' | 'vendor' | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const register_res = await fetch(NEXTAUTH_URL + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password  }),
      });
      if (!register_res.ok) {
        const errorData = await register_res.json();
        throw new Error(errorData.message || "Unknown error");
      }
      toast.success("Signup Successful.")

      const signin_res = await signIn("credentials", {
        username: email, 
        password,
        redirect: false,
      });
      if (!register_res.ok) {
        const errorData = await register_res.json();
        throw new Error(errorData.message || "Unknown error");
      }
      toast.success("Signup Successful.")

      if (signin_res?.error) {
        toast.error("Login failed after signup: " + signin_res.error);
      } else {
        router.push("/user");
      }
    } catch (err) {
      console.log(err)
      toast.error(`Signup Failed. ${err instanceof Error && err.message}.`);
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
            <Label htmlFor="name">Name</Label>
            <Input
              type="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="your name"
            />
          </div>
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
