import { AuthService, CreateVendorDto, UserRole, WeddingService, WeddingStyle, WeddingType } from "@shared/api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useHandleSession() {
  const router = useRouter();
  const NEXTAUTH_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

  const handleSignUpAdmin = async (
        e: React.FormEvent,
        {
        email,
        password,
        role,
        name,
        }: {
        email: string;
        password: string;
        role: string | null;
        name: string;
        },
        setLoading: (loading: boolean) => void
    ) => {
        e.preventDefault();
        setLoading(true);
        try {
        } catch (err) {
            console.log(err)
        }
    };

  const handleSignUpVendor = async (
        e: React.FormEvent,
        {
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
        }: {
        email: string;
        password: string;
        role: UserRole | undefined;
        name: string;
        serviceOffered: WeddingService | undefined;
        styleOffered: WeddingStyle | undefined;
        weddingTypes: WeddingType[] | undefined;
        vendorWebsite: string;
        uenNumber: string;
        bio: string;
        },
        setLoading: (loading: boolean) => void
    ) => {
        e.preventDefault();
        setLoading(true);
        try {
        if (!role || !serviceOffered || !styleOffered || !weddingTypes) {
            throw new Error(`Missing field.`);
        }
        await AuthService.authControllerRegisterVendor({
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
            onboardedDate: new Date().toISOString(),
        } satisfies CreateVendorDto)

        toast.success("Signup Successful.");
        const signin_res = await signIn("credentials", {
            username: email,
            password,
            redirect: false,
        });
        if (signin_res?.error) {
            toast.error("Login failed after signup: " + signin_res.error);
        } else {
            router.push("/user");
        }
        } catch (err) {
        console.log(err);
        toast.error(`Signup Failed. ${err instanceof Error && err.message}.`);
        } finally {
        setLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent, { username, password }: { username: string; password: string; }, setLoading: (loading: boolean) => void) => {
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


  return { handleSignUpAdmin, handleSignUpVendor, handleSignIn };
}