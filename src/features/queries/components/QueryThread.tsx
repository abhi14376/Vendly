import { useQueryDetails, useQueryMessages } from '../hooks/useQueries';
import { QueryStatusBadge } from './QueryStatusBadge';
import { QueryReplyForm } from './QueryReplyForm';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/formatDate';

interface QueryThreadProps {
  queryId: string;
}

export function QueryThread({ queryId }: QueryThreadProps) {
  const { data: query, isLoading: isLoadingQuery } = useQueryDetails(queryId);
  const { data: messages, isLoading: isLoadingMessages } = useQueryMessages(queryId);

  if (isLoadingQuery) {
    return (
      <div className="flex flex-col h-full p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="space-y-4 flex-1">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-5/6 rounded-lg ml-auto" />
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <p>Query not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-6 bg-white shrink-0">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-slate-900">{query.title}</h2>
          <QueryStatusBadge status={query.status} />
        </div>
        <div className="flex items-center text-sm text-slate-500 space-x-4">
          <span>ID: {query.id}</span>
          <span>&bull;</span>
          <span>Category: {query.category}</span>
          <span>&bull;</span>
          <span>Created: {formatDate(query.createdAt)}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {isLoadingMessages ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-5/6 rounded-lg ml-auto" />
          </div>
        ) : (
          messages?.map((message) => {
            // For mock purposes, 'user-current' or admin are treated differently for alignment
            const isCurrentUser = message.senderId === 'user-current' || message.senderRole === 'lead';
            return (
              <div
                key={message.id}
                className={`flex gap-4 max-w-[85%] ${
                  isCurrentUser ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <Avatar fallback={message.senderName} />
                <div
                  className={`flex flex-col ${
                    isCurrentUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="font-medium text-sm text-slate-900">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`p-4 rounded-lg shadow-sm text-sm ${
                      isCurrentUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white border text-slate-800 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Form */}
      <div className="p-6 bg-white border-t shrink-0">
        {query.status === 'closed' ? (
          <div className="text-center p-4 bg-slate-50 text-slate-600 rounded-lg border border-slate-200">
            This query has been closed. You cannot reply to it.
          </div>
        ) : (
          <QueryReplyForm queryId={query.id} />
        )}
      </div>
    </div>
  );
}
