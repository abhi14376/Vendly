import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";
import { applyOpportunitySchema, ApplyOpportunityFormData } from "../schemas/applySchema";
import { useApplyToOpportunity } from "../hooks/useApplyToOpportunity";

interface ApplyModalProps {
  opportunityId: string;
  opportunityTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyModal({
  opportunityId,
  opportunityTitle,
  isOpen,
  onOpenChange,
}: ApplyModalProps) {
  const { mutateAsync: apply, isPending } = useApplyToOpportunity();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyOpportunityFormData>({
    resolver: zodResolver(applyOpportunitySchema),
    defaultValues: {
      proposal: "",
      estimatedTimeline: "",
      costEstimate: 0,
    },
  });

  const onSubmit = async (data: ApplyOpportunityFormData) => {
    try {
      await apply({ opportunityId, formData: data });
      reset();
      onOpenChange(false);
    } catch {
      // Error is handled by the mutation hook via toast
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-[500px]">
        <ModalHeader>
          <ModalTitle>Apply to Opportunity</ModalTitle>
          <ModalDescription>
            You are applying for: <strong>{opportunityTitle}</strong>. Please provide your proposal details below.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="proposal" className="text-sm font-medium">
              Proposal Message
            </label>
            <Textarea
              id="proposal"
              placeholder="Explain why you are the best fit for this opportunity..."
              className="min-h-[120px]"
              {...register("proposal")}
            />
            {errors.proposal && (
              <p className="text-sm text-red-500">{errors.proposal.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="estimatedTimeline" className="text-sm font-medium">
              Estimated Timeline
            </label>
            <Input
              id="estimatedTimeline"
              placeholder="e.g., 2 weeks, 3 months"
              {...register("estimatedTimeline")}
            />
            {errors.estimatedTimeline && (
              <p className="text-sm text-red-500">{errors.estimatedTimeline.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="costEstimate" className="text-sm font-medium">
              Cost Estimate ($)
            </label>
            <Input
              id="costEstimate"
              type="number"
              placeholder="0.00"
              {...register("costEstimate")}
            />
            {errors.costEstimate && (
              <p className="text-sm text-red-500">{errors.costEstimate.message}</p>
            )}
          </div>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
