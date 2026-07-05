import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShareMapping {
  vendorId: string;
  opportunityId: string;
}

interface ShareState {
  sharedOpportunities: ShareMapping[];
  shareOpportunity: (vendorId: string, opportunityId: string) => void;
  isOpportunityShared: (vendorId: string, opportunityId: string) => boolean;
  getSharedOpportunitiesForVendor: (vendorId: string) => string[];
}

export const useShareStore = create<ShareState>()(
  persist(
    (set, get) => ({
      sharedOpportunities: [],
      shareOpportunity: (vendorId, opportunityId) => {
        if (!get().isOpportunityShared(vendorId, opportunityId)) {
          set((state) => ({
            sharedOpportunities: [
              ...state.sharedOpportunities,
              { vendorId, opportunityId },
            ],
          }));
        }
      },
      isOpportunityShared: (vendorId, opportunityId) =>
        get().sharedOpportunities.some(
          (s) => s.vendorId === vendorId && s.opportunityId === opportunityId
        ),
      getSharedOpportunitiesForVendor: (vendorId) =>
        get()
          .sharedOpportunities.filter((s) => s.vendorId === vendorId)
          .map((s) => s.opportunityId),
    }),
    {
      name: "bidtracker-shares",
    }
  )
);
