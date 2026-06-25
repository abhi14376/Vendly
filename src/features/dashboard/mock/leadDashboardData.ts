export const leadDashboardData = {
  kpis: {
    totalOpportunities: 24,
    activeVendors: 142,
    pendingApplications: 38,
    newQueries: 12,
  },
  recentOpportunities: [
    {
      id: "opt-1",
      title: "UI/UX Redesign for Mobile App",
      status: "Active",
      applicants: 15,
      date: "2026-06-15",
    },
    {
      id: "opt-2",
      title: "Backend API Integration",
      status: "Active",
      applicants: 8,
      date: "2026-06-12",
    },
    {
      id: "opt-3",
      title: "Marketing Website Development",
      status: "Draft",
      applicants: 0,
      date: "2026-06-10",
    },
    {
      id: "opt-4",
      title: "Data Migration to Cloud",
      status: "Closed",
      applicants: 24,
      date: "2026-06-01",
    },
  ],
  notifications: [
    {
      id: "notif-1",
      type: "application",
      message: "Vendor 'TechSolutions' applied to 'UI/UX Redesign'",
      time: "2 hours ago",
    },
    {
      id: "notif-2",
      type: "query",
      message: "New query received on 'Backend API Integration'",
      time: "5 hours ago",
    },
    {
      id: "notif-3",
      type: "system",
      message: "Opportunity 'Data Migration to Cloud' has been closed",
      time: "1 day ago",
    },
    {
      id: "notif-4",
      type: "application",
      message: "Vendor 'DevStudio' applied to 'UI/UX Redesign'",
      time: "1 day ago",
    },
  ],
};
