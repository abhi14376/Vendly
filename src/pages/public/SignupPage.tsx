import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Building2, UserCircle2, ShieldCheck, RefreshCw, Mail, Phone, ArrowLeft } from "lucide-react";
import { signupSchema, type SignupFormValues } from "@/features/auth/schemas";
import { getSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthStore } from "@/store/authStore";

export function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") === "admin" ? "admin" : "lead";

  const [step, setStep] = useState<"signup" | "verification">("signup");
  const [pendingData, setPendingData] = useState<SignupFormValues | null>(null);
  
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [inputEmailOtp, setInputEmailOtp] = useState("");
  const [inputMobileOtp, setInputMobileOtp] = useState("");
  const [otpError, setOtpError] = useState<{ email?: string; mobile?: string }>({});
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (step === "verification" && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, resendTimer]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      role: roleParam as "admin" | "lead" | "vendor",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    // Generate mock codes and transition to verification step
    const genEmailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const genMobileOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    setEmailOtp(genEmailOtp);
    setMobileOtp(genMobileOtp);
    setPendingData(data);
    setStep("verification");
    setResendTimer(30);
    setInputEmailOtp("");
    setInputMobileOtp("");
    setOtpError({});
    
    toast.info(`Sandbox OTPs: Email [${genEmailOtp}] | Mobile [${genMobileOtp}]`, { duration: 10000 });
  };

  const handleVerifyOtp = async () => {
    if (!pendingData) return;

    let hasError = false;
    const errors: { email?: string; mobile?: string } = {};

    if (inputEmailOtp !== emailOtp) {
      errors.email = "Invalid email verification code.";
      hasError = true;
    }
    if (inputMobileOtp !== mobileOtp) {
      errors.mobile = "Invalid mobile verification code.";
      hasError = true;
    }

    if (hasError) {
      setOtpError(errors);
      toast.error("Verification failed. Please check the entered OTP codes.");
      return;
    }

    setIsLoading(true);
    const data = pendingData;
    
    // Helper to store registration locally as sandbox fallback
    const saveLocalUser = () => {
      try {
        const localUsers = JSON.parse(localStorage.getItem("vendly-local-users") || "[]");
        if (!localUsers.some((u: any) => u.email === data.email)) {
          localUsers.push({
            email: data.email,
            password: data.password,
            fullName: `${data.firstName} ${data.lastName}`,
            mobile: data.mobile,
            role: roleParam,
            verificationStatus: "pending",
          });
          localStorage.setItem("vendly-local-users", JSON.stringify(localUsers));
        }

        // Save verification request for Admin
        const leadVerifications = JSON.parse(localStorage.getItem("vendly-lead-verifications") || "[]");
        if (!leadVerifications.some((v: any) => v.email === data.email)) {
          leadVerifications.push({
            id: `lv-${Date.now()}`,
            companyName: `${data.firstName} Tech`,
            contactName: `${data.firstName} ${data.lastName}`,
            email: data.email,
            mobile: data.mobile,
            status: "pending",
            submittedAt: new Date().toISOString(),
          });
          localStorage.setItem("vendly-lead-verifications", JSON.stringify(leadVerifications));
        }
      } catch (e) {
        console.error("Failed to save local sandbox user", e);
      }
    };

    saveLocalUser(); // Write unconditionally for local admin portal synchronization

    const supabase = getSupabaseClient();
    
    if (!supabase) {
      setTimeout(() => {
        setIsLoading(false);
        login("demo-access-token", {
          id: `local-${data.email}`,
          email: data.email,
          fullName: `${data.firstName} ${data.lastName}`,
          role: roleParam,
          verificationStatus: "pending",
        });
        toast.success("Account created and verified successfully (Local Sandbox Mode)!");
        navigate("/dashboard", { replace: true });
      }, 1000);
      return;
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.warn("Supabase signup failed:", error.message);
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    if (authData.user) {
      // Create profile record
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: data.email,
        role: roleParam,
        first_name: data.firstName,
        last_name: data.lastName
      });

      if (profileError) {
        console.error("Failed to create profile:", profileError);
        toast.error("Account created but failed to save profile details.");
      } else {
        toast.success("Account created and verified successfully!");
      }
    }

    setIsLoading(false);
    navigate("/dashboard", { replace: true });
  };

  const handleResendOtp = () => {
    const genEmailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const genMobileOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    setEmailOtp(genEmailOtp);
    setMobileOtp(genMobileOtp);
    setResendTimer(30);
    setInputEmailOtp("");
    setInputMobileOtp("");
    setOtpError({});
    
    toast.info(`New Sandbox OTPs: Email [${genEmailOtp}] | Mobile [${genMobileOtp}]`, { duration: 10000 });
  };

  const handleBackToSignup = () => {
    setStep("signup");
    setPendingData(null);
    setInputEmailOtp("");
    setInputMobileOtp("");
    setOtpError({});
  };

  if (step === "verification" && pendingData) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400">
              <ShieldCheck className="size-6 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-bold">Two-Factor OTP Verification</CardTitle>
            <CardDescription>
              We've sent a 6-digit verification code to both your email and mobile number.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Developer Sandbox Assistant Banner */}
            <div className="rounded-xl border border-dashed border-primary-200 bg-primary-50/20 p-4 dark:border-primary-900/50 dark:bg-primary-950/10">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-primary-700 dark:text-primary-400">
                <span className="h-2 w-2 rounded-full bg-primary-600 animate-ping"></span>
                Developer Sandbox Environment Assistant
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border dark:border-slate-800 flex flex-col items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Email Code</span>
                  <span className="font-mono text-base font-bold tracking-widest text-slate-900 dark:text-slate-100">{emailOtp}</span>
                </div>
                <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border dark:border-slate-800 flex flex-col items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mobile Code</span>
                  <span className="font-mono text-base font-bold tracking-widest text-slate-900 dark:text-slate-100">{mobileOtp}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                id="emailOtp"
                type="text"
                maxLength={6}
                label="Email Verification Code"
                placeholder="Enter 6-digit code"
                icon={<Mail className="h-4 w-4 text-slate-400" />}
                value={inputEmailOtp}
                onChange={(e) => {
                  setInputEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError(prev => ({ ...prev, email: undefined }));
                }}
                error={otpError.email}
                required
              />

              <Input
                id="mobileOtp"
                type="text"
                maxLength={6}
                label="Mobile Verification Code"
                placeholder="Enter 6-digit code"
                icon={<Phone className="h-4 w-4 text-slate-400" />}
                value={inputMobileOtp}
                onChange={(e) => {
                  setInputMobileOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError(prev => ({ ...prev, mobile: undefined }));
                }}
                error={otpError.mobile}
                required
              />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button type="button" fullWidth loading={isLoading} onClick={handleVerifyOtp}>
                Verify Codes & Complete Signup
              </Button>
              
              <div className="flex items-center justify-between mt-2 text-sm">
                <button
                  type="button"
                  onClick={handleBackToSignup}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
                >
                  <ArrowLeft className="size-4" /> Back to details
                </button>

                {resendTimer > 0 ? (
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Resend OTP in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="flex items-center gap-1 text-primary-600 hover:text-primary-500 hover:underline transition-colors font-semibold"
                  >
                    <RefreshCw className="size-3.5" /> Resend OTPs
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Sign up as a <span className="capitalize text-primary-600">{roleParam}</span>
          </CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                id="firstName" 
                label="First Name"
                required
                {...register("firstName")} 
                error={errors.firstName?.message} 
              />
              <Input 
                id="lastName" 
                label="Last Name"
                required
                {...register("lastName")} 
                error={errors.lastName?.message} 
              />
            </div>
            
            <Input 
              id="email" 
              type="email" 
              label="Email"
              required
              placeholder="m@example.com" 
              {...register("email")} 
              error={errors.email?.message} 
            />

            <Input 
              id="mobile" 
              type="tel" 
              label="Mobile Number"
              required
              placeholder="e.g. +91 9876543210" 
              {...register("mobile")} 
              error={errors.mobile?.message} 
            />

            <Input 
              id="password" 
              type="password" 
              label="Password"
              {...register("password")} 
              error={errors.password?.message} 
            />

            <Input 
              id="confirmPassword" 
              type="password" 
              label="Confirm Password"
              {...register("confirmPassword")} 
              error={errors.confirmPassword?.message} 
            />

            <input type="hidden" {...register("role")} />

            <Button type="submit" fullWidth loading={isLoading} className="mt-2">
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <div>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
