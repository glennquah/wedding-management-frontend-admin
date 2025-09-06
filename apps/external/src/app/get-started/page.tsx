"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@shared/components/ui/button";
import { Label } from "@shared/components/ui/label";
import ResponsiveMenubar from "@shared/components/responsive-menubar";
import FormField from "@shared/components/FormField";
import { useOpenAICall } from "@shared/hooks/useOpenAICall";
import { useHandleSession } from "../hooks/useHandleSession";
import { Wand2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@shared/components/ui/dropdown-menu";
import {
  UserRole,
  WeddingTypes,
  WeddingService,
  WeddingStyle,
} from "@shared/types/enums";

export default function GetStartedPage() {
  const router = useRouter();
  // User Specific Fields
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  
  // Admin / Couple specific fields
  /// ... useState for couple fields
  // const { handleSignUpCouple } = useHandleSession();

  // Vendor specific fields
  const [vendorWebsite, setVendorWebsite] = useState<string>("");
  const [uenNumber, setUenNumber] = useState<string>("");
  const [serviceOffered, setServiceOffered] = useState<WeddingService | null>(null);
  const [styleOffered, setStyleOffered] = useState<WeddingStyle | null>(null);
  const [weddingTypes, setweddingTypes] = useState<WeddingTypes[] | null>(null);
  const [bio, setBio] = useState<string>("");
  const [wandHover, setWandHover] = useState(false);
  const { handleSignUpVendor } = useHandleSession();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-brand-200 to-brand-25 px-6">
      <ResponsiveMenubar />
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl my-[100px] shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Create an account</h2>
        <form onSubmit={e => handleSignUpVendor(e, {
          email,
          password,
          role,
          name,
          serviceOffered,
          styleOffered,
          weddingTypes,
          vendorWebsite,
          uenNumber,
          bio,
        }, setLoading)} className="space-y-4">
          <FormField
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="your name"
          />
          <FormField
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <FormField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          {/* Role selection */}
          <div className="flex flex-col gap-2 mt-4">
            <Label>Role*</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={role === 'admin' ? 'default' : 'secondary'}
                onClick={() => setRole(UserRole.admin)}
                className={role === 'admin' ? 'flex-1 bg-secondary hover:bg-secondary-hover' : 'flex-1 border-secondary text-secondary hover:bg-secondary/10'}
              >
                Couple
              </Button>
              <Button
                type="button"
                variant={role === 'vendor' ? 'default' : 'secondary'}
                onClick={() => setRole(UserRole.vendor)}
                className={role === 'vendor' ? 'flex-1 bg-secondary hover:bg-secondary-hover' : 'flex-1 border-secondary text-secondary hover:bg-secondary/10'}
              >
                Vendor
              </Button>
            </div>
          </div>
          {/* Vendor fields */}
          {role === "vendor" && (
            <VendorFields
              weddingTypes={weddingTypes}
              setweddingTypes={setweddingTypes}
              serviceOffered={serviceOffered}
              setServiceOffered={setServiceOffered}
              styleOffered={styleOffered}
              setStyleOffered={setStyleOffered}
              bio={bio}
              setBio={setBio}
              wandHover={wandHover}
              setWandHover={setWandHover}
              vendorWebsite={vendorWebsite}
              setVendorWebsite={setVendorWebsite}
              uenNumber={uenNumber}
              setUenNumber={setUenNumber}
            />
          )}
          <Button
            type={role === 'admin' ? "button" : "submit"}
            className="w-full mt-4"
            disabled={loading}
            onClick={() => {
              if (role === 'admin') router.push("/get-started/couple");
            }}
          >
            {role === 'admin' ? "Next" : loading ? "Creating..." : "Sign Up"}
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


import { Dispatch, SetStateAction } from "react";

function VendorFields({
  weddingTypes,
  setweddingTypes,
  serviceOffered,
  setServiceOffered,
  styleOffered,
  setStyleOffered,
  bio,
  setBio,
  wandHover,
  setWandHover,
  vendorWebsite,
  setVendorWebsite,
  uenNumber,
  setUenNumber,
}: {
  weddingTypes: WeddingTypes[] | null;
  setweddingTypes: Dispatch<SetStateAction<WeddingTypes[] | null>>;
  serviceOffered: WeddingService | null;
  setServiceOffered: Dispatch<SetStateAction<WeddingService | null>>;
  styleOffered: WeddingStyle | null;
  setStyleOffered: Dispatch<SetStateAction<WeddingStyle | null>>;
  bio: string;
  setBio: Dispatch<SetStateAction<string>>;
  wandHover: boolean;
  setWandHover: Dispatch<SetStateAction<boolean>>;
  vendorWebsite: string;
  setVendorWebsite: Dispatch<SetStateAction<string>>;
  uenNumber: string;
  setUenNumber: Dispatch<SetStateAction<string>>;
}) {
  const { result, loading: llmLoading, error, callLLM } = useOpenAICall();
  const handleRefineBio = async () => {
    const message = `Create or refine a vendor bio for a wedding platform.
    ${weddingTypes ? ` Wedding type: ${weddingTypes}.` : ""}${serviceOffered ? ` Services: ${serviceOffered}.` : ""}
    ${styleOffered ? ` Style: ${styleOffered}.` : ""}${bio ? ` Existing bio: "${bio}".` : ""} 
    Keep it concise and professional. Max 50 words. DO not wrape the response in quotes.`;
    await callLLM(message);
    if (result) setBio(result);
  };
  return (
    <>
      {/* Wedding Type (multi select) */}
      <div className="mt-4 gap-2 flex flex-col">
        <Label>Wedding Type*</Label>
        <DropdownMenu>
          <DropdownMenuTrigger className="relative border rounded-lg p-3 w-full text-left bg-white shadow flex items-center justify-between">
            {(weddingTypes?.length ?? 0) > 0
              ? (weddingTypes ?? []).map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(", ")
              : "Select wedding types"}
            <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {Object.values(WeddingTypes).map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={e => {
                  e.preventDefault(); // Prevent menu from closing
                  setweddingTypes(prev => {
                    const current = prev ?? [];
                    return current.includes(type)
                      ? current.filter(t => t !== type)
                      : [...current, type];
                  });
                }}
                className={(weddingTypes ?? []).includes(type) ? "bg-primary text-white" : ""}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Services Offered (single-select) */}
      <div className="mt-4 gap-2 flex flex-col">
        <Label>Service Offered*</Label>
        <DropdownMenu>
          <DropdownMenuTrigger className="relative border rounded-lg p-3 w-full text-left bg-white shadow flex items-center justify-between">
            {serviceOffered ? serviceOffered.charAt(0).toUpperCase() + serviceOffered.slice(1) : "Select service"}
            <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {Object.values(WeddingService).map((service) => (
              <DropdownMenuItem
                key={service}
                onClick={() => setServiceOffered(service)}
                className={serviceOffered === service ? "bg-primary text-white" : ""}
              >
                {service.charAt(0).toUpperCase() + service.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Style Offered (single select) */}
      <div className="mt-4 gap-2 flex flex-col">
        <Label>Style Offered*</Label>
        <DropdownMenu>
          <DropdownMenuTrigger className="relative border rounded-lg p-3 w-full text-left bg-white shadow flex items-center justify-between">
            {styleOffered ? styleOffered.charAt(0).toUpperCase() + styleOffered.slice(1) : "Select style"}
            <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {Object.values(WeddingStyle).map((style) => (
              <DropdownMenuItem
                key={style}
                onClick={() => setStyleOffered(style)}
                className={styleOffered === style ? "bg-primary text-white" : ""}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Short Bio Field */}
      <div className="mt-4 gap-2 flex flex-col relative">
        <Label htmlFor="bio">Short Bio</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Tell us about your company..."
          className={`border rounded-lg p-3 resize-none ${llmLoading && "text-gray-100"} `}
        />
        <button
          type="button"
          onClick={handleRefineBio}
          disabled={llmLoading}
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
            Write your Bio
          </span>
        </button>
        {llmLoading && (
          <span className="absolute bottom-2 left-2 text-xs text-gray-800">Generating...</span>
        )}
        {error && (
          <span className="absolute bottom-2 left-2 text-xs text-red-500">{error}</span>
        )}
      </div>
      {/* Vendor Website Field */}
      <FormField
        label="Vendor Website"
        id="vendorWebsite"
        type="url"
        value={vendorWebsite}
        onChange={(e) => setVendorWebsite(e.target.value)}
        placeholder="Enter your website"
      />
      {/* UEN Number Field */}
      <FormField
        label="UEN Number"
        id="uenNumber"
        type="text"
        value={uenNumber}
        onChange={(e) => setUenNumber(e.target.value)}
        placeholder="Enter your UEN number"
      />
    </>
  );
}
