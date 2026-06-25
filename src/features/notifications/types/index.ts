export type NotificationType = "opportunity" | "application" | "query" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string; // Optional link to navigate to when the notification is clicked
}

export type NotificationFilter = "all" | "unread" | NotificationType;
