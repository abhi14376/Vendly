import { create } from "zustand";
import { type VendorProfile, type VerificationStatus } from "@/features/vendors/data/mockVendors";
import { getSupabaseClient } from "@/lib/supabase";
import { toast } from "sonner";

interface VendorState {
  vendors: VendorProfile[];
  isLoading: boolean;
  fetchVendors: () => Promise<void>;
  addVendor: (vendor: VendorProfile, profileId?: string) => Promise<void>;
  updateStatus: (id: string, status: VerificationStatus, rejectionReason?: string) => Promise<void>;
}

export const useVendorStore = create<VendorState>((set, get) => ({
  vendors: [],
  isLoading: false,

  fetchVendors: async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    set({ isLoading: true });
    
    // Select all vendors. In a real app, you'd filter by RLS or specific profile.
    const { data, error } = await supabase.from('vendors').select('*').order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to load vendors from database.");
    } else if (data) {
      // Map DB columns to camelCase frontend schema
      const mappedVendors: VendorProfile[] = data.map(v => ({
        id: v.id,
        companyName: v.company_name,
        industry: v.industry,
        location: v.location,
        contactPerson: v.contact_person,
        email: v.email,
        website: v.website || "",
        verificationStatus: v.verification_status,
        avatarUrl: v.avatar_url,
        documents: v.documents,
        createdAt: v.created_at,
        rejectionReason: v.rejection_reason
      }));
      set({ vendors: mappedVendors });
    }
    set({ isLoading: false });
  },

  addVendor: async (vendor, profileId) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Use current user's profile ID if none provided
    let pid = profileId;
    if (!pid) {
      const { data: { user } } = await supabase.auth.getUser();
      pid = user?.id;
    }
    
    if (!pid) {
      toast.error("You must be logged in to create a vendor.");
      return;
    }

    const dbVendor = {
      profile_id: pid,
      company_name: vendor.companyName,
      industry: vendor.industry,
      location: vendor.location,
      contact_person: vendor.contactPerson,
      email: vendor.email,
      website: vendor.website,
      verification_status: vendor.verificationStatus,
      avatar_url: vendor.avatarUrl,
      documents: vendor.documents
    };

    const { data, error } = await supabase.from('vendors').insert([dbVendor]).select().single();

    if (error) {
      console.error("Failed to insert vendor:", error);
      toast.error("Failed to create vendor in database.");
    } else if (data) {
      // Append to local state immediately
      const newVendor: VendorProfile = {
        ...vendor,
        id: data.id,
        createdAt: data.created_at
      };
      set((state) => ({ vendors: [newVendor, ...state.vendors] }));
    }
  },

  updateStatus: async (id, status, rejectionReason) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase
      .from('vendors')
      .update({
        verification_status: status,
        rejection_reason: status === 'Disapproved' ? rejectionReason : null
      })
      .eq('id', id);

    if (error) {
      console.error("Failed to update vendor status:", error);
      toast.error("Failed to update vendor status in database.");
    } else {
      set((state) => ({
        vendors: state.vendors.map((v) =>
          v.id === id
            ? {
                ...v,
                verificationStatus: status,
                rejectionReason: status === "Disapproved" ? rejectionReason : undefined,
              }
            : v
        ),
      }));
    }
  },
}));
