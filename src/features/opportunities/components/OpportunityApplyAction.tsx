import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ApplyModal } from "./ApplyModal";
import { useApplicationStore } from "../store/useApplicationStore";

interface OpportunityApplyActionProps {
  opportunityId: string;
  opportunityTitle: string;
  className?: string;
}

export function OpportunityApplyAction({
  opportunityId,
  opportunityTitle,
  className,
}: OpportunityApplyActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasApplied = useApplicationStore((state) => state.hasApplied(opportunityId));

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={hasApplied}
        className={className}
        variant={hasApplied ? "secondary" : "default"}
      >
        {hasApplied ? "Applied" : "Apply Now"}
      </Button>

      <ApplyModal
        opportunityId={opportunityId}
        opportunityTitle={opportunityTitle}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
