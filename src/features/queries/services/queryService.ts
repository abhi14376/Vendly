import { CreateQueryDto, Query, QueryMessage } from '../types';

import { useAuthStore } from '@/store/authStore';

// Simulated delay for realistic API behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class QueryService {
  private queries: any[] = [];
  private messages: any[] = [];

  async getQueries(params?: { search?: string; page?: number; limit?: number }) {
    await delay(600);
    let filtered = [...this.queries];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        query => query.title.toLowerCase().includes(q) || query.category.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getQueryDetails(queryId: string) {
    await delay(400);
    const query = this.queries.find(q => q.id === queryId);
    if (!query) throw new Error('Query not found');
    return query;
  }

  async getQueryMessages(queryId: string) {
    await delay(400);
    return this.messages
      .filter(m => m.queryId === queryId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createQuery(data: CreateQueryDto) {
    await delay(800);
    
    const currentUser = useAuthStore.getState().currentUser;
    const authorId = currentUser?.id || 'user-current';
    const authorName = currentUser?.fullName || 'Current User';
    const rawRole = currentUser?.role || (data.opportunityId ? 'lead' : 'vendor');
    const authorRole = rawRole === 'super_admin' ? 'admin' as const : (rawRole as 'lead' | 'vendor' | 'admin');

    const newQuery: Query = {
      id: `q-${Date.now()}`,
      title: data.title,
      category: data.category,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      authorId,
      authorName,
      authorRole,
      opportunityId: data.opportunityId,
      opportunityTitle: data.opportunityTitle
    };
    
    this.queries.unshift(newQuery);
    
    const newMessage: QueryMessage = {
      id: `m-${Date.now()}`,
      queryId: newQuery.id,
      content: data.initialMessage,
      createdAt: new Date().toISOString(),
      senderId: authorId,
      senderName: authorName,
      senderRole: authorRole,
    };
    
    this.messages.push(newMessage);
    
    return newQuery;
  }

  async replyToQuery(queryId: string, content: string, senderRole?: 'lead' | 'vendor' | 'admin') {
    await delay(600);
    
    const queryIndex = this.queries.findIndex(q => q.id === queryId);
    if (queryIndex === -1) throw new Error('Query not found');
    
    const currentUser = useAuthStore.getState().currentUser;
    const rawRole = senderRole || currentUser?.role || 'lead';
    const resolvedRole = rawRole === 'super_admin' ? 'admin' as const : (rawRole as 'lead' | 'vendor' | 'admin');
    
    const senderId = resolvedRole === 'admin' ? 'admin-current' : (currentUser?.id || 'user-current');
    const senderName = resolvedRole === 'admin' ? 'System Admin' : (currentUser?.fullName || 'Current User');

    const newMessage: QueryMessage = {
      id: `m-${Date.now()}`,
      queryId,
      content,
      createdAt: new Date().toISOString(),
      senderId,
      senderName,
      senderRole: resolvedRole as 'lead' | 'vendor' | 'admin',
    };
    
    this.messages.push(newMessage);
    
    // Update query's lastMessageAt and updatedAt
    const updatedQuery = {
      ...this.queries[queryIndex],
      updatedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      status: resolvedRole === 'admin' ? 'answered' as const : 'open' as const, 
    };
    
    this.queries[queryIndex] = updatedQuery;
    
    return newMessage;
  }
}

export const queryService = new QueryService();
