import { create } from "zustand";
import { getSupabaseClient } from "@/lib/supabase";

export interface NotificationPreview {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  // Admin notifications
  latestNotifications: NotificationPreview[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (notificationId: string) => void;
  setLatestNotifications: (notifications: NotificationPreview[]) => void;

  // Lead notifications
  leadNotifications: NotificationPreview[];
  leadUnreadCount: number;
  markLeadRead: (id: string) => void;
  markAllLeadRead: () => void;
  setLeadNotifications: (notifications: NotificationPreview[]) => void;

  // Common initialization
  initialize: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  // ── Admin ──────────────────────────────────────────────────────────────────
  latestNotifications: [],
  unreadCount: 0,

  markAllRead: async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
    }
    set((state) => ({
      latestNotifications: state.latestNotifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
      leadNotifications: state.leadNotifications.map((n) => ({ ...n, isRead: true })),
      leadUnreadCount: 0,
    }));
  },

  markRead: async (notificationId) => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    }
    set((state) => {
      const updatedLatest = state.latestNotifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      );
      const updatedLead = state.leadNotifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      );
      return {
        latestNotifications: updatedLatest,
        unreadCount: updatedLatest.filter((n) => !n.isRead).length,
        leadNotifications: updatedLead,
        leadUnreadCount: updatedLead.filter((n) => !n.isRead).length,
      };
    });
  },

  setLatestNotifications: (notifications) =>
    set({
      latestNotifications: notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  // ── Lead ───────────────────────────────────────────────────────────────────
  leadNotifications: [],
  leadUnreadCount: 0,

  markLeadRead: (id) => get().markRead(id),
  markAllLeadRead: () => get().markAllRead(),

  setLeadNotifications: (notifications) =>
    set({
      leadNotifications: notifications,
      leadUnreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  // ── Init ───────────────────────────────────────────────────────────────────
  initialize: async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (notifications) {
      const mapped: NotificationPreview[] = notifications.map(n => ({
        id: n.id,
        title: n.title,
        body: n.message,
        type: n.type,
        isRead: n.is_read,
        createdAt: n.created_at,
      }));
      set({
        latestNotifications: mapped,
        unreadCount: mapped.filter(n => !n.isRead).length,
        leadNotifications: mapped,
        leadUnreadCount: mapped.filter(n => !n.isRead).length,
      });
    }
  }
}));
