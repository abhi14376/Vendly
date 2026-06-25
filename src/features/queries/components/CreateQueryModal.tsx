import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateQuery } from '../hooks/useQueries';
import { useEffect } from 'react';

const createQuerySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title is too long'),
  category: z.string().min(1, 'Please select a category'),
  initialMessage: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

type CreateQueryFormData = z.infer<typeof createQuerySchema>;

interface CreateQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<CreateQueryFormData> & {
    opportunityId?: string;
    opportunityTitle?: string;
  };
}

export function CreateQueryModal({ isOpen, onClose, defaultValues }: CreateQueryModalProps) {
  const { mutate: createQuery, isPending } = useCreateQuery();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQueryFormData>({
    resolver: zodResolver(createQuerySchema),
    defaultValues: {
      title: defaultValues?.title || '',
      category: defaultValues?.category || '',
      initialMessage: defaultValues?.initialMessage || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: defaultValues?.title || '',
        category: defaultValues?.category || '',
        initialMessage: defaultValues?.initialMessage || '',
      });
    } else {
      reset();
    }
  }, [isOpen, reset, defaultValues]);

  const onSubmit = (data: CreateQueryFormData) => {
    createQuery({
      ...data,
      opportunityId: defaultValues?.opportunityId,
      opportunityTitle: defaultValues?.opportunityTitle
    }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Submit a New Query</ModalTitle>
          <ModalDescription>
            Fill out the details below to open a new query with our support team.
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
        <Input
          label="Title"
          placeholder="Briefly describe your issue..."
          error={errors.title?.message}
          {...register('title')}
        />
        
        <Select
          label="Category"
          placeholder="Select a category"
          error={errors.category?.message}
          options={[
            { label: 'Applications', value: 'Applications' },
            { label: 'Opportunities', value: 'Opportunities' },
            { label: 'Billing', value: 'Billing' },
            { label: 'Account Settings', value: 'Account' },
            { label: 'General Inquiry', value: 'General' },
          ]}
          {...register('category')}
        />

        <Textarea
          label="Message"
          placeholder="Provide detailed information about your query..."
          rows={5}
          error={errors.initialMessage?.message}
          {...register('initialMessage')}
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Query'}
          </Button>
        </div>
      </form>
      </ModalContent>
    </Modal>
  );
}
