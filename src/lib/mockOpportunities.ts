import { Opportunity } from "@/types/Opportunity";

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp_1",
    title: "AI Chatbot Integration",
    description: "Looking for an agency to integrate an advanced AI chatbot into our e-commerce platform. The ideal partner will have experience with NLP and seamless integrations with Shopify. The project includes understanding our customer service workflow, designing conversational paths, building the bot, and setting up analytics.",
    status: "Open",
    budget: 15000,
    deadline: "2026-07-15T00:00:00Z",
    applicationsCount: 12,
    createdAt: "2026-06-10T09:00:00Z",
    category: "Software Development",
    location: "Remote",
    projectType: "Fixed Price",
    awardDate: "2026-07-20T00:00:00Z",
    documents: [
      { name: "Project_Requirements_v1.pdf", url: "#", size: "2.4 MB" },
      { name: "Brand_Guidelines.pdf", url: "#", size: "5.1 MB" }
    ]
  },
  {
    id: "opp_2",
    title: "Office Furniture Supply",
    description: "Bulk supply of ergonomic chairs and standing desks for our new HQ. We are outfitting a space for 200 employees and require durable, modern designs. Vendors must provide installation services and a minimum 3-year warranty.",
    status: "In Progress",
    budget: 45000,
    deadline: "2026-08-01T00:00:00Z",
    applicationsCount: 4,
    createdAt: "2026-06-05T14:30:00Z",
    category: "Procurement",
    location: "New York, NY",
    projectType: "Contract",
    documents: [
      { name: "Floor_Plan_HQ.pdf", url: "#", size: "12.5 MB" },
      { name: "Furniture_Specs.xlsx", url: "#", size: "1.1 MB" }
    ]
  },
  {
    id: "opp_3",
    title: "Cloud Infrastructure Audit",
    description: "Comprehensive security and performance audit of our AWS infrastructure. The auditor will review IAM policies, VPC configurations, RDS instances, and provide a detailed report with actionable recommendations for cost optimization and security hardening.",
    status: "Review",
    budget: 8500,
    deadline: "2026-06-25T00:00:00Z",
    applicationsCount: 8,
    createdAt: "2026-05-20T10:15:00Z",
    category: "IT Consulting",
    location: "Remote",
    projectType: "Hourly",
    awardDate: "2026-07-01T00:00:00Z",
    documents: [
      { name: "NDA_Template.pdf", url: "#", size: "120 KB" }
    ]
  },
  {
    id: "opp_4",
    title: "Marketing Campaign Q3",
    description: "Full-service digital marketing campaign for our upcoming product launch. Seeking an agency to handle social media management, influencer outreach, and paid ad placements across Google and Meta networks.",
    status: "Closed",
    budget: 120000,
    deadline: "2026-06-01T00:00:00Z",
    applicationsCount: 25,
    createdAt: "2026-04-10T08:45:00Z",
    category: "Marketing",
    location: "San Francisco, CA",
    projectType: "Retainer",
    royaltyPercentage: 2,
    documents: [
      { name: "Q3_Goals.pdf", url: "#", size: "3.2 MB" },
      { name: "Target_Audience_Personas.pdf", url: "#", size: "4.8 MB" }
    ]
  },
  {
    id: "opp_5",
    title: "Mobile App Redesign",
    description: "UX/UI overhaul for our consumer-facing iOS and Android applications. We want to modernize the look and feel, improve accessibility, and increase conversion rates. The deliverable is a complete set of Figma files and an interactive prototype.",
    status: "Open",
    budget: 35000,
    deadline: "2026-08-30T00:00:00Z",
    applicationsCount: 18,
    createdAt: "2026-06-15T11:20:00Z",
    category: "Design",
    location: "Remote",
    projectType: "Fixed Price",
    awardDate: "2026-09-10T00:00:00Z",
    documents: [
      { name: "Current_App_Screenshots.zip", url: "#", size: "25 MB" },
      { name: "Competitor_Analysis.pdf", url: "#", size: "2.1 MB" }
    ]
  },
  {
    id: "opp_6",
    title: "Annual Legal Retainer",
    description: "Seeking a law firm for general corporate legal counsel on a retainer basis. Services include contract review, compliance advice, and IP registration. Firms with experience in the SaaS industry are preferred.",
    status: "Open",
    budget: 60000,
    deadline: "2026-07-01T00:00:00Z",
    applicationsCount: 3,
    createdAt: "2026-06-17T16:00:00Z",
    category: "Legal",
    location: "Chicago, IL",
    projectType: "Retainer",
    awardDate: "2026-07-10T00:00:00Z",
    documents: [
      { name: "Company_Profile.pdf", url: "#", size: "1.5 MB" }
    ]
  }
];
