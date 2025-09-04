"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Toast } from "@shared/components/ui/use-toast";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import { useOpenAICall } from "@shared/hooks/useOpenAICall";
import { Wand2 } from "lucide-react";

export default function GetStartedPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'guest' | 'vendor' | null>(null);
  const [vendorWebsite, setVendorWebsite] = useState("");
  const [uenNumber, setUenNumber] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [wandHover, setWandHover] = useState(false);

  const { result, loading: llmLoading, error, callLLM } = useOpenAICall();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
          name,
          vendorWebsite: role === "vendor" ? vendorWebsite : undefined,
          uenNumber: role === "vendor" ? uenNumber : undefined,
          shortBio: role === "vendor" ? shortBio : undefined,
        }),
      });

      if (!res.ok) throw new Error("Signup failed");
      Toast({ title: "Account created!" });
      router.push("/login");
    } catch (err) {
      Toast({ title: "Error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRefineBio = async () => {
    const message = `Please help polish and refine this vendor bio for a wedding platform: "${shortBio}"`;
    await callLLM(message);
    if (result) setShortBio(result);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
      <ResponsiveMenubar />
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl my-[100px] shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Create an account</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="name">Name*</Label>
            <Input
              type="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="email">Email*</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mt-4 gap-2 flex flex-col">
            <Label htmlFor="password">Password*</Label>
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
            <Label>Role*</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={role === 'guest' ? 'default' : 'secondary'}
                onClick={() => setRole('guest')}
                className={role === 'guest' ? 'flex-1 bg-secondary hover:bg-secondary-hover' : 'flex-1 border-secondary text-secondary hover:bg-secondary/10'}
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
          {/* Vendor fields */}
          {role === "vendor" && (
            <>
            {/* Short Bio Field */}
              <div className="mt-4 gap-2 flex flex-col relative">
                <Label htmlFor="shortBio">Short Bio</Label>
                <textarea
                  id="shortBio"
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your company..."
                  className="border rounded-lg p-3 resize-none"
                />
                <button
                  type="button"
                  onClick={handleRefineBio}
                  disabled={llmLoading || !shortBio}
                  onMouseEnter={() => setWandHover(true)}
                  onMouseLeave={() => setWandHover(false)}
                  className={`absolute bottom-2 right-2 flex items-center justify-center bg-primary text-white px-2 py-2 rounded-full shadow transition-all duration-300 ${wandHover && "cursor-pointer shadow-lg"} ${llmLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-hover"}`}
                >
                  <Wand2 className="w-5 h-5" />
                  <span
                    className={` 
                      transition-all 
                      duration-300 
                      ease-in-out 
                      whitespace-nowrap 
                      overflow-hidden 
                      ${wandHover ? "max-w-xs opacity-100 mx-2" : "w-0 opacity-0"}
                    `}
                  >
                    Refine Bio
                  </span>
                </button>
                {llmLoading && (
                  <span className="absolute bottom-2 left-2 text-xs text-gray-400">Refining...</span>
                )}
                {error && (
                  <span className="absolute bottom-2 left-2 text-xs text-red-500">{error}</span>
                )}
              </div>
              <div className="mt-4 gap-2 flex flex-col">
                <Label htmlFor="vendorWebsite">Vendor Website</Label>
                <Input
                  type="url"
                  id="vendorWebsite"
                  value={vendorWebsite}
                  onChange={(e) => setVendorWebsite(e.target.value)}
                  placeholder="Enter your website"
                />
              </div>
              <div className="mt-4 gap-2 flex flex-col">
                <Label htmlFor="uenNumber">UEN Number</Label>
                <Input
                  type="text"
                  id="uenNumber"
                  value={uenNumber}
                  onChange={(e) => setUenNumber(e.target.value)}
                  placeholder="Enter your UEN number"
                />
              </div>
            </>
          )}
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