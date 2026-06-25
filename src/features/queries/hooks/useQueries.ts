import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryService } from '../services/queryService';
import { CreateQueryDto } from '../types';
import { toast } from 'sonner';

export const queryKeys = {
  all: ['queries'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params?: { search?: string; page?: number; limit?: number }) => [...queryKeys.lists(), params] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
  messages: (id: string) => [...queryKeys.detail(id), 'messages'] as const,
};

export function useQueries(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.list(params),
    queryFn: () => queryService.getQueries(params),
  });
}

export function useQueryDetails(id: string | null) {
  return useQuery({
    queryKey: queryKeys.detail(id as string),
    queryFn: () => queryService.getQueryDetails(id as string),
    enabled: !!id,
  });
}

export function useQueryMessages(id: string | null) {
  return useQuery({
    queryKey: queryKeys.messages(id as string),
    queryFn: () => queryService.getQueryMessages(id as string),
    enabled: !!id,
  });
}

export function useCreateQuery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateQueryDto) => queryService.createQuery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast.success('Query submitted successfully');
    },
    onError: () => {
      toast.error('Failed to submit query');
    },
  });
}

export function useReplyToQuery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ queryId, content }: { queryId: string; content: string }) => 
      queryService.replyToQuery(queryId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(variables.queryId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
      toast.success('Reply sent');
    },
    onError: () => {
      toast.error('Failed to send reply');
    },
  });
}
