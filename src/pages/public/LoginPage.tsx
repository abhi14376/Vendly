import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router";
import { toast } from "sonner";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { getSupabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthStore } from "@/store/authStore";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Autofill if admin role requested
  useEffect(() => {
    if (roleParam === "admin") {
      setValue("email", "admin@vendly.com");
      setValue("password", "admin123");
    }
  }, [roleParam, setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      setIsLoading(false);
      toast.error("Authentication is currently unavailable.");
      return;
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    if (authData.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
      const role = profile?.role || "lead";

      if (role === "vendor") {
        setIsLoading(false);
        toast.error("Vendors are not permitted to log in directly.");
        await supabase.auth.signOut();
        return;
      }
      
      setIsLoading(false);
      toast.success("Successfully logged in!");
      const redirectPath = role === "admin" ? "/admin" : "/dashboard";
      const from = location.state?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
    } else {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: "admin" | "lead") => {
    let redirectPath = "/dashboard";
    let email = "";
    let fullName = "";
    
    if (role === "admin") {
      redirectPath = "/admin";
      email = "admin@vendly.com";
      fullName = "Demo Admin";
    } else {
      redirectPath = "/dashboard";
      email = "lead@vendly.com";
      fullName = "Demo Lead";
    }

    login("demo-access-token", {
      id: `demo-${role}-id`,
      email,
      fullName,
      role,
      verificationStatus: "approved",
    });

    toast.success(`Successfully logged in as ${fullName}!`);
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {roleParam === "admin" ? "Admin Portal Login" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {roleParam === "admin" 
              ? "Sign in to access administrative functions and settings"
              : "Enter your email to sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="m@example.com"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>
            <div className="space-y-2 relative">
              <Link to="/forgot-password" className="absolute right-0 top-0 text-sm font-medium text-primary-600 hover:text-primary-500 hover:underline">
                Forgot password?
              </Link>
              <Input
                id="password"
                type="password"
                label="Password"
                {...register("password")}
                error={errors.password?.message}
              />
            </div>
            <Button type="submit" fullWidth loading={isLoading}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <div>
            Don&apos;t have an account?{" "}
            <Link to={`/signup${roleParam ? `?role=${roleParam}` : ''}`} className="font-semibold text-primary-600 hover:text-primary-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Developer Quick Bypass Sandbox Panel - Only visible in development */}
      {import.meta.env.DEV && (
        <Card className="w-full max-w-md border-dashed border-primary-200 bg-primary-50/10 dark:border-primary-900/50 dark:bg-primary-950/5">
          <CardHeader className="py-4 text-center">
            <CardTitle className="text-sm font-semibold text-primary-700 dark:text-primary-400">
              Developer Sandbox Quick-Login
            </CardTitle>
            <CardDescription className="text-xs">
              Test any portal immediately by bypassing external auth servers.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 pb-4">
            <Button size="sm" variant="outline" onClick={() => handleDemoLogin("admin")} className="text-xs border-primary-100 hover:bg-primary-50 dark:border-primary-900/50 dark:hover:bg-primary-950/20">
              Admin
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDemoLogin("lead")} className="text-xs border-primary-100 hover:bg-primary-50 dark:border-primary-900/50 dark:hover:bg-primary-950/20">
              Lead
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
