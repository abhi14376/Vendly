import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "sonner";
import { Camera, Save, User, Building, Phone, Mail, CheckCircle2 } from "lucide-react";

// Strict validation schema
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  mobile: z
    .string()
    .min(10, "Mobile number is mandatory and must be at least 10 digits")
    .regex(/^[0-9+\s-]+$/, "Invalid mobile number format"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function LeadSettingsPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentUser?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  );
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: currentUser?.fullName || "",
      companyName: currentUser?.companyName || "",
      mobile: currentUser?.mobile || "",
      address: (currentUser as any)?.address || "123 Business Bay, Suite 500, Mumbai, India",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast.info("Profile picture uploaded successfully! Save changes to persist.");
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    setIsSaving(true);
    setTimeout(() => {
      if (currentUser) {
        refreshUser({
          ...currentUser,
          fullName: data.fullName,
          companyName: data.companyName,
          mobile: data.mobile,
          avatarUrl: avatarUrl,
          ...({ address: data.address } as any),
        });
      }
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account settings, profile information, and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar Settings */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm overflow-hidden">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Profile Photo</CardTitle>
              <CardDescription>Click to change your avatar image.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar
                  src={avatarUrl}
                  alt={currentUser?.fullName || "Lead Avatar"}
                  className="w-32 h-32 ring-4 ring-primary-500/20 group-hover:ring-primary-500/40 transition-all duration-300 rounded-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </Button>

              {currentUser?.verificationStatus === "approved" && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-950/30 px-3 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/50">
                  <CheckCircle2 className="size-4 fill-primary-500 text-white dark:fill-primary-400 dark:text-slate-950" />
                  Verified Partner
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Profile Info Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your contact person and business information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  icon={<User className="h-4 w-4 text-slate-400" />}
                  error={errors.fullName?.message}
                  {...register("fullName")}
                  required
                />
                
                <Input
                  label="Organization / Company Name"
                  placeholder="e.g. Acme Corp"
                  icon={<Building className="h-4 w-4 text-slate-400" />}
                  error={errors.companyName?.message}
                  {...register("companyName")}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  icon={<Mail className="h-4 w-4 text-slate-400" />}
                  className="bg-slate-50 dark:bg-slate-950 opacity-70 cursor-not-allowed"
                />

                <Input
                  label="Mobile Number"
                  placeholder="e.g. +91 9876543210"
                  icon={<Phone className="h-4 w-4 text-slate-400" />}
                  error={errors.mobile?.message}
                  {...register("mobile")}
                  required
                />
              </div>

              <Textarea
                label="Office Address"
                placeholder="e.g. 123 Business Street, Building A, Suite 101"
                error={errors.address?.message}
                {...register("address")}
                required
                rows={4}
              />

              <div className="flex justify-end pt-4 border-t dark:border-slate-800">
                <Button type="submit" loading={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
