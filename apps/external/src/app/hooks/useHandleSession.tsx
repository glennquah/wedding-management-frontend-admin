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
        role: string | null;
        name: string;
        serviceOffered: string | null;
        styleOffered: string | null;
        weddingTypes: string[] | null;
        vendorWebsite: string;
        uenNumber: string;
        bio: string;
        },
        setLoading: (loading: boolean) => void
    ) => {
        e.preventDefault();
        setLoading(true);
        try {
        const register_res = await fetch(NEXTAUTH_URL + "/auth/register/vendor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
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
            }),
        });
        if (!register_res.ok) {
            const errorData = await register_res.json();
            throw new Error(errorData.message || "Unknown error");
        }
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
