import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApplyOpportunityFormData } from "../schemas/applySchema";
import { useApplicationStore } from "../store/useApplicationStore";

import { getSupabaseClient } from "@/lib/supabase";

const submitApplication = async (data: {
  opportunityId: string;
  formData: ApplyOpportunityFormData;
}) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase client not initialized.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to apply.");
  }

  // Find the vendor associated with this user
  const { data: vendorData, error: vendorError } = await supabase
    .from('vendors')
    .select('id')
    .eq('profile_id', user.id)
    .single();

  if (vendorError || !vendorData) {
    throw new Error("You must be a registered Vendor to apply to opportunities.");
  }

  const { error: insertError } = await supabase.from('applications').insert({
    opportunity_id: data.opportunityId,
    vendor_id: vendorData.id,
    status: 'Pending',
    cover_letter: data.formData.proposal,
    price_bid: data.formData.costEstimate.toString(),
  });

  if (insertError) {
    throw new Error(insertError.message);
  }
};

export function useApplyToOpportunity() {
  const applyToOpportunity = useApplicationStore((state) => state.applyToOpportunity);

  return useMutation({
    mutationFn: submitApplication,
    onSuccess: (_, variables) => {
      applyToOpportunity(variables.opportunityId);
      toast.success("Application submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "An unexpected error occurred.");
    },
  });
}
