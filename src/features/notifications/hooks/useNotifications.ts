import { useState, useEffect, useMemo, useCallback } from "react";
import { Notification, NotificationFilter } from "../types";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

const ITEMS_PER_PAGE = 5;

export function useNotifications() {
  const currentUser = useAuthStore((state) => state.currentUser);

  // Pull lead notifications from the shared store so the header badge stays in sync
  const { leadNotifications, markLeadRead, markAllLeadRead, setLeadNotifications } =
    useNotificationStore();

  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Map store shape → Notification shape
  const notifications: Notification[] = leadNotifications.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.body,
    type: n.type as Notification["type"],
    createdAt: n.createdAt,
    isRead: n.isRead,
  }));

  // Initial load — load only real notifications from localStorage (no mock data)
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));

      const localKey = currentUser ? `vendly-notifications-${currentUser.email}` : "";
      let localNotifs: Notification[] = [];
      if (localKey) {
        try {
          localNotifs = JSON.parse(localStorage.getItem(localKey) || "[]");
        } catch (e) {
          console.error("Failed to load local notifications:", e);
        }
      }

      setLeadNotifications(
        localNotifs.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.message,
          type: n.type,
          isRead: n.isRead,
          createdAt: n.createdAt,
        }))
      );

      setIsLoading(false);
    };

    fetchNotifications();
  }, [currentUser]);

  const markAsRead = useCallback((id: string) => {
    markLeadRead(id);
  }, [markLeadRead]);

  const markAllAsRead = useCallback(() => {
    markAllLeadRead();
  }, [markAllLeadRead]);

  // Filtering
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (filter === "all") return true;
      if (filter === "unread") return !notif.isRead;
      return notif.type === filter;
    });
  }, [notifications, filter]);

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNotifications, currentPage]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications: paginatedNotifications,
    isLoading,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    markAsRead,
    markAllAsRead,
    unreadCount,
    hasUnread: unreadCount > 0,
    totalCount: filteredNotifications.length,
  };
}
