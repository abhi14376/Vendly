export type QueryStatus = 'open' | 'in_review' | 'answered' | 'closed';

export interface Query {
  id: string;
  title: string;
  category: string;
  status: QueryStatus;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  authorId: string;
  authorName: string;
  authorRole?: 'lead' | 'vendor' | 'admin';
  opportunityId?: string;
  opportunityTitle?: string;
}

export interface QueryMessage {
  id: string;
  queryId: string;
  content: string;
  createdAt: string;
  senderId: string;
  senderName: string;
  senderRole: 'lead' | 'vendor' | 'admin';
  attachments?: { id: string; name: string; url: string }[];
}

export interface CreateQueryDto {
  title: string;
  category: string;
  initialMessage: string;
  opportunityId?: string;
  opportunityTitle?: string;
}
