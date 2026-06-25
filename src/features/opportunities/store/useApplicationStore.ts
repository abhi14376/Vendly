import { create } from "zustand";
import { getSupabaseClient } from "@/lib/supabase";

interface ApplicationState {
  appliedOpportunityIds: string[];
  applyToOpportunity: (id: string) => void;
  hasApplied: (id: string) => boolean;
  initialize: () => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  appliedOpportunityIds: [],
  applyToOpportunity: (id) =>
    set((state) => ({
      appliedOpportunityIds: [...state.appliedOpportunityIds, id],
    })),
  hasApplied: (id) => get().appliedOpportunityIds.includes(id),
  initialize: async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: vendorData } = await supabase
      .from('vendors')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (vendorData) {
      const { data: applications } = await supabase
        .from('applications')
        .select('opportunity_id')
        .eq('vendor_id', vendorData.id);

      if (applications) {
        set({ appliedOpportunityIds: applications.map(a => a.opportunity_id) });
      }
    }
  }
}));
