import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { useQueries } from '../hooks/useQueries';
import { QueryStatusBadge } from './QueryStatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/formatDate';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/Pagination';

interface QueryListProps {
  onSelectQuery: (id: string) => void;
  selectedQueryId: string | null;
  onCreateQuery: () => void;
}

export function QueryList({ onSelectQuery, selectedQueryId, onCreateQuery }: QueryListProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQueries({ search, page, limit: 10 });

  return (
    <div className="flex flex-col h-full bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b space-y-4 shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Queries</h2>
          <Button onClick={onCreateQuery} className="gap-2">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search queries..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page on search
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : !data || !data.data || data.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500 space-y-4">
            <MessageSquare className="w-12 h-12 text-slate-300" />
            <div>
              <p className="font-medium text-slate-900 mb-1">No queries found</p>
              <p className="text-sm">Try adjusting your search or create a new query.</p>
            </div>
            {search && (
              <Button variant="secondary" onClick={() => setSearch('')}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.data.map((query) => (
              <button
                key={query.id}
                onClick={() => onSelectQuery(query.id)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex flex-col gap-2 ${
                  selectedQueryId === query.id ? 'bg-blue-50/50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <span className="font-medium text-slate-900 line-clamp-1 flex-1">
                    {query.title}
                  </span>
                  <QueryStatusBadge status={query.status} />
                </div>
                <div className="flex justify-between items-center w-full text-sm text-slate-500">
                  <span className="truncate">{query.category}</span>
                  <span className="shrink-0">{formatDate(query.lastMessageAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="p-4 border-t bg-slate-50 shrink-0">
          <Pagination>
            <PaginationContent>
              {data.page > 1 && (
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} />
                </PaginationItem>
              )}
              <PaginationItem>
                <span className="text-sm mx-4">
                  Page {data.page} of {data.totalPages}
                </span>
              </PaginationItem>
              {data.page < data.totalPages && (
                <PaginationItem>
                  <PaginationNext onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
