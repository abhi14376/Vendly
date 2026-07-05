import { Notification } from "../types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "opportunity",
    title: "New Opportunity Matched",
    message: "A new opportunity 'Cloud Infrastructure Upgrade' matches your profile.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    isRead: false,
    link: "/dashboard/opportunities"
  },
  {
    id: "notif-2",
    type: "application",
    title: "Application Accepted",
    message: "Your application for 'AI Chatbot Development' has been accepted.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
    link: "/dashboard/applied-projects"
  },
  {
    id: "notif-3",
    type: "query",
    title: "New Query Received",
    message: "You have a new query from vendor 'TechSolutions Inc'.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    link: "/dashboard/queries/q-1"
  },
  {
    id: "notif-4",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur on Saturday at 2:00 AM UTC.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
  },
  {
    id: "notif-5",
    type: "application",
    title: "Application Rejected",
    message: "Unfortunately, your application for 'ERP System Migration' was not selected.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    isRead: true,
  },
  {
    id: "notif-6",
    type: "opportunity",
    title: "Opportunity Deadline Approaching",
    message: "The deadline for 'Mobile App Redesign' is tomorrow.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    isRead: false,
  },
  {
    id: "notif-7",
    type: "query",
    title: "Query Answered",
    message: "The lead has replied to your query regarding 'Security Audit'.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    isRead: true,
  },
  {
    id: "notif-8",
    type: "system",
    title: "Welcome to BidTracker!",
    message: "Complete your profile to get started.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(), // 10 days ago
    isRead: true,
  },
  {
    id: "notif-9",
    type: "opportunity",
    title: "Opportunity Updated",
    message: "The requirements for 'Data Center Migration' have been updated.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(), // 15 hours ago
    isRead: false,
  },
  {
    id: "notif-10",
    type: "application",
    title: "Application Under Review",
    message: "Your application for 'Web Portal Enhancement' is now under review.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
    isRead: true,
  },
  {
    id: "notif-11",
    type: "query",
    title: "Follow-up Question",
    message: "Lead has asked a follow-up question on your query.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isRead: false,
  },
  {
    id: "notif-12",
    type: "system",
    title: "Password Changed",
    message: "Your account password was successfully updated.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    isRead: true,
  }
];
