import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useReplyToQuery } from '../hooks/useQueries';
import { Send } from 'lucide-react';

const replySchema = z.object({
  content: z.string().min(1, 'Reply cannot be empty').max(2000, 'Reply is too long'),
});

type ReplyFormData = z.infer<typeof replySchema>;

interface QueryReplyFormProps {
  queryId: string;
}

export function QueryReplyForm({ queryId }: QueryReplyFormProps) {
  const { mutate: reply, isPending } = useReplyToQuery();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: ReplyFormData) => {
    reply(
      { queryId, content: data.content },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-4 border-t pt-4">
      <Textarea
        placeholder="Type your reply here..."
        rows={3}
        error={errors.content?.message}
        {...register('content')}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="flex items-center gap-2">
          {isPending ? 'Sending...' : (
            <>
              Send Reply
              <Send className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
