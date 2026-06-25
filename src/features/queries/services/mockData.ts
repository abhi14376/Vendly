import { Query, QueryMessage } from '../types';

export const mockQueries: Query[] = [
  {
    id: 'q-1',
    title: 'Question regarding recent application requirements',
    category: 'Applications',
    status: 'in_review',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    authorId: 'user-1',
    authorName: 'Sarah Jenkins',
    authorRole: 'lead',
    opportunityId: 'tnd_2',
    opportunityTitle: '15MW Grid Connected Rooftop Solar Power Plant Commissioning'
  },
  {
    id: 'q-2',
    title: 'Discrepancy in project timeline',
    category: 'Opportunities',
    status: 'open',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    authorId: 'user-2',
    authorName: 'Michael Chen',
    authorRole: 'vendor',
    opportunityId: 'tnd_1',
    opportunityTitle: 'Four-Laning of Jhansi-Khajuraho Section of NH-75'
  },
  {
    id: 'q-3',
    title: 'Platform billing issue',
    category: 'Billing',
    status: 'answered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    authorId: 'user-1',
    authorName: 'Sarah Jenkins',
    authorRole: 'lead'
  },
  {
    id: 'q-4',
    title: 'How to update vendor profile?',
    category: 'General',
    status: 'closed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    authorId: 'user-3',
    authorName: 'Alex Mercer',
    authorRole: 'vendor'
  },
];

export const mockMessages: QueryMessage[] = [
  // Thread for q-1
  {
    id: 'm-1',
    queryId: 'q-1',
    content: 'Hi, I noticed the recent application requirements have changed. Can you clarify the compliance section?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    senderId: 'user-1',
    senderName: 'Sarah Jenkins',
    senderRole: 'lead',
  },
  {
    id: 'm-2',
    queryId: 'q-1',
    content: 'Sure! Let me check with our legal team to get you the exact details.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    senderId: 'admin-1',
    senderName: 'System Admin',
    senderRole: 'admin',
  },
  {
    id: 'm-3',
    queryId: 'q-1',
    content: 'Any updates on this? We need to submit our application soon.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    senderId: 'user-1',
    senderName: 'Sarah Jenkins',
    senderRole: 'lead',
  },
  // Thread for q-2
  {
    id: 'm-4',
    queryId: 'q-2',
    content: 'The timeline for Opportunity #1042 seems to conflict with standard delivery schedules. Can this be adjusted?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    senderId: 'user-2',
    senderName: 'Michael Chen',
    senderRole: 'vendor',
  },
];
