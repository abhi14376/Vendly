import { useParams } from "react-router";
import { OpportunityDetails } from "@/features/opportunities/components/OpportunityDetails";

export function LeadOpportunityDetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <OpportunityDetails id={id} />;
}
