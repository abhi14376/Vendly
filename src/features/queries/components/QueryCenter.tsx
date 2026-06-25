import { useState } from 'react';
import { QueryList } from './QueryList';
import { QueryThread } from './QueryThread';
import { CreateQueryModal } from './CreateQueryModal';
import { MessageSquare } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/Drawer';

export function QueryCenter() {
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // We'll use a responsive approach: 
  // On large screens, we use a master-detail split view.
  // On small screens, we show the list, and if a query is selected, show it in a Drawer (or just over the list).
  // For simplicity and matching standard Vendly UI, let's use standard grid on lg, and maybe a Drawer on mobile.
  // Actually, a simpler responsive pattern:
  // Hide list on mobile if a query is selected, show back button.
  // We don't have a "back button" readily available in QueryThread, so Drawer is easier.

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] -m-6 sm:-m-8">
      {/* List Panel */}
      <div className="w-full lg:w-[400px] shrink-0 border-r bg-slate-50 flex flex-col h-full hidden lg:flex">
        <QueryList
          selectedQueryId={selectedQueryId}
          onSelectQuery={setSelectedQueryId}
          onCreateQuery={() => setIsCreateModalOpen(true)}
        />
      </div>
      
      {/* Mobile List Panel (Visible only when no query is selected or always visible on mobile, handling via Drawer) */}
      <div className="w-full lg:hidden shrink-0 bg-slate-50 flex flex-col h-full">
        <QueryList
          selectedQueryId={selectedQueryId}
          onSelectQuery={setSelectedQueryId}
          onCreateQuery={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Detail Panel (Desktop) */}
      <div className="hidden lg:flex flex-col flex-1 bg-white h-full relative">
        {selectedQueryId ? (
          <QueryThread queryId={selectedQueryId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-lg">Select a query to view the conversation</p>
          </div>
        )}
      </div>

      {/* Mobile Detail Drawer */}
      <Drawer
        open={!!selectedQueryId && window.innerWidth < 1024}
        onOpenChange={(open) => {
          if (!open) setSelectedQueryId(null);
        }}
      >
        <DrawerContent side="right">
          <DrawerHeader>
            <DrawerTitle>Query Conversation</DrawerTitle>
          </DrawerHeader>
          <div className="h-[calc(100%-4rem)] overflow-hidden">
            {selectedQueryId && <QueryThread queryId={selectedQueryId} />}
          </div>
        </DrawerContent>
      </Drawer>

      <CreateQueryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
