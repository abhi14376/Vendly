import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { toast } from "sonner";
import { UploadCloud, FileText, CheckCircle, AlertCircle, Camera, X } from "lucide-react";
import { type VendorProfile } from "../data/vendorTypes";
import { useVendorStore } from "@/store/vendorStore";

const vendorSchema = z.object({
  companyName: z.string().min(3, "Company name must be at least 3 characters"),
  industry: z.string().min(1, "Please select an industry"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  contactPerson: z.string().min(3, "Contact person must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL (must start with http:// or https://)").or(z.literal("")),
});

type VendorFormData = z.infer<typeof vendorSchema>;

interface CreateVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVendorCreated: () => void;
}

export function CreateVendorModal({ isOpen, onClose, onVendorCreated }: CreateVendorModalProps) {
  const [isPending, setIsPending] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  
  // Document states
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [turnoverFile, setTurnoverFile] = useState<File | null>(null);
  
  // File error states
  const [fileErrors, setFileErrors] = useState<{ gst?: string; pan?: string; turnover?: string }>({});

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const gstInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);
  const turnoverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      location: "",
      contactPerson: "",
      email: "",
      website: "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    reset();
    setAvatarPreview("");
    setGstFile(null);
    setPanFile(null);
    setTurnoverFile(null);
    setFileErrors({});
  };

  const addVendor = useVendorStore((state) => state.addVendor);

  const onSubmit = async (data: VendorFormData) => {
    // Validate files
    const errors: { gst?: string; pan?: string; turnover?: string } = {};
    if (!gstFile) errors.gst = "GST Certificate is mandatory";
    if (!panFile) errors.pan = "PAN Card is mandatory";
    if (!turnoverFile) errors.turnover = "Last three years turnover certificates are mandatory";

    if (Object.keys(errors).length > 0) {
      setFileErrors(errors);
      toast.error("Please upload all mandatory documents");
      return;
    }

    setIsPending(true);

    const newVendor: VendorProfile = {
      id: `temp_${Date.now()}`,
      companyName: data.companyName,
      industry: data.industry,
      location: data.location,
      contactPerson: data.contactPerson,
      email: data.email,
      website: data.website || `https://www.${data.companyName.toLowerCase().replace(/\s+/g, "")}.com`,
      verificationStatus: "Pending",
      avatarUrl: avatarPreview || `https://i.pravatar.cc/150?u=${data.companyName}`,
      documents: {
        gst: !!gstFile,
        pan: !!panFile,
        turnover: !!turnoverFile,
      }
    };

    // Save to Supabase and update local state
    await addVendor(newVendor);

    setIsPending(false);
    toast.success("Vendor created! Awaiting Admin approval.");
    handleReset();
    onVendorCreated();
    onClose();
  };

  const renderFileUploadZone = (
    label: string,
    file: File | null,
    inputRef: React.RefObject<HTMLInputElement | null>,
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    error?: string
  ) => {
    return (
      <div className="space-y-1.5 flex-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
          {label} <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-3 cursor-pointer transition-all duration-200 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-900/10 dark:hover:bg-slate-950/20 ${
            file
              ? "border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10"
              : error
              ? "border-red-500/50"
              : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={onFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.zip"
            className="hidden"
          />
          {file ? (
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-6 w-6 text-emerald-500 mb-1" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                {file.name}
              </span>
              <span className="text-[10px] text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
              <span className="text-xs text-slate-500">Upload PDF or Image</span>
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <ModalContent className="max-w-3xl max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <ModalHeader className="pb-2 border-b dark:border-slate-800">
          <ModalTitle className="text-xl font-bold">Create New Vendor</ModalTitle>
          <ModalDescription>
            Register a verified vendor by filling their business, contact, and compliance documents.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* Section 1: Vendor Profile Photo */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <Avatar
                src={avatarPreview}
                fallback="V"
                className="w-16 h-16 ring-2 ring-primary-500/20 rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Vendor Logo / Avatar</h4>
              <p className="text-xs text-slate-400 mt-0.5">JPG or PNG formats under 2MB. Optional.</p>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {avatarPreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="sm:ml-auto text-rose-500"
                onClick={() => setAvatarPreview("")}
              >
                <X className="h-4 w-4 mr-1" /> Remove
              </Button>
            )}
          </div>

          {/* Section 2: General & Business Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Business Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                placeholder="e.g. Sterling Infrastructure"
                error={errors.companyName?.message}
                {...register("companyName")}
                required
              />
              <Select
                label="Industry"
                placeholder="Select Industry"
                options={[
                  { label: "IT & Software", value: "IT & Software" },
                  { label: "Construction", value: "Construction" },
                  { label: "Logistics", value: "Logistics" },
                  { label: "Marketing", value: "Marketing" },
                  { label: "Healthcare", value: "Healthcare" },
                  { label: "Manufacturing", value: "Manufacturing" },
                ]}
                error={errors.industry?.message}
                {...register("industry")}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                placeholder="e.g. Austin, TX"
                error={errors.location?.message}
                {...register("location")}
                required
              />
              <Input
                label="Website URL"
                placeholder="e.g. https://www.sterling.com"
                error={errors.website?.message}
                {...register("website")}
              />
            </div>
          </div>

          {/* Section 3: Contact Person Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Contact Representative
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Person Name"
                placeholder="e.g. Robert Miller"
                error={errors.contactPerson?.message}
                {...register("contactPerson")}
                required
              />
              <Input
                label="Contact Email"
                type="email"
                placeholder="e.g. robert@sterling.com"
                error={errors.email?.message}
                {...register("email")}
                required
              />
            </div>
          </div>

          {/* Section 4: Document Verification (Mandatory Files) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Compliance Verification
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {renderFileUploadZone(
                "GST Certificate",
                gstFile,
                gstInputRef,
                (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setGstFile(f);
                    setFileErrors((prev) => ({ ...prev, gst: undefined }));
                  }
                },
                fileErrors.gst
              )}

              {renderFileUploadZone(
                "PAN Card",
                panFile,
                panInputRef,
                (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setPanFile(f);
                    setFileErrors((prev) => ({ ...prev, pan: undefined }));
                  }
                },
                fileErrors.pan
              )}

              {renderFileUploadZone(
                "3 Years Turnover Certs",
                turnoverFile,
                turnoverInputRef,
                (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setTurnoverFile(f);
                    setFileErrors((prev) => ({ ...prev, turnover: undefined }));
                  }
                },
                fileErrors.turnover
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Create Vendor
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
