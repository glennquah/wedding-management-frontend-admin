import { AuthService, CreateVendorDto, CreateAdminDto, UserRole, WeddingService, WeddingStyle, WeddingType, BudgetBucket, GuestCountBucket } from "@shared/api";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useHandleSession() {
  const router = useRouter();
  const NEXTAUTH_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

  const handleSignUpAdmin = async (
        {
        email,
        password,
        name,
        weddingType,
        budgetBucket,
        guestCountBucket,
        preferredStyle,
        preferredServices,
        }: {
        email: string;
        password: string;
        name: string;
        weddingType: WeddingType;
        budgetBucket: BudgetBucket;
        guestCountBucket: GuestCountBucket;
        preferredStyle: WeddingStyle;
        preferredServices: WeddingService[];
        },
        setLoading: (loading: boolean) => void
    ) => {
        setLoading(true);
        try {
            if (!weddingType || !budgetBucket || !guestCountBucket || !preferredStyle || !preferredServices) {
                throw new Error(`Missing field.`);
            }
            await AuthService.authControllerRegisterAdmin({
                email,
                password,
                name,
                role: UserRole.ADMIN,
                isCouple: true,
                onboardedDate: new Date().toISOString(),
                weddingType,
                budgetBucket,
                guestCountBucket,
                preferredStyle,
                preferredServices,
            } satisfies CreateAdminDto);

            toast.success("Signup Successful.");
            const signin_res = await signIn("credentials", {
                username: email,
                password,
                redirect: false,
        });
        if (signin_res?.error) {
            toast.error("Login failed after signup: " + signin_res.error);
        } else {
            router.push("/user"); // why is this routing to /user not /admin?
        }
        } catch (err) {
            console.log(err);
            let errorMessage = "An unknown error occurred";

            try {
                if (err instanceof Error) {
                    const bodyStart = err.message.indexOf("{");
                    if (bodyStart !== -1) {
                        const bodyString = err.message.slice(bodyStart);
                        const body = JSON.parse(bodyString);
                        if (body.message) {
                        errorMessage = body.message;
                        }
                    }
                } else if (typeof err == "string") {
                    errorMessage = err;
                }
            } catch {
                // fallback to full message if parsing fails
                errorMessage = errorMessage;
            }

            toast.error(`Signup Failed. ${errorMessage}`);
        } finally {
            setLoading(false);
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
                router.push("/user"); // same for this - why is this routing to /user not /vendor?
            }
        } catch (err) {
            console.log(err);
            let errorMessage = "An unknown error occurred";

            try {
                if (err instanceof Error) {
                    const bodyStart = err.message.indexOf("{");
                    if (bodyStart !== -1) {
                        const bodyString = err.message.slice(bodyStart);
                        const body = JSON.parse(bodyString);
                        if (body.message) {
                        errorMessage = body.message;
                        }
                    }
                } else if (typeof err == "string") {
                    errorMessage = err;
                }
            } catch {
                // fallback to full message if parsing fails
                errorMessage = errorMessage;
            }

            toast.error(`Signup Failed. ${errorMessage}`);
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