export type OpportunityStatus = "Open" | "Published" | "In Progress" | "Review" | "Closed";

export interface OpportunityDocument {
  name: string;
  url: string;
  size: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  status: OpportunityStatus;
  budget: number;
  deadline: string;
  applicationsCount: number;
  createdAt: string;
  category: string;
  location?: string;
  projectType?: string;
  awardDate?: string;
  royaltyPercentage?: number;
  documents?: OpportunityDocument[];
  recommendedSize?: string;
  minYearsExp?: number;
  financialStrength?: string;
  coreExpertise?: string[];
  techKnowHow?: string[];
  redFlags?: string[];
  questionsForVendor?: string[];
  summary?: string;
  industryType?: string;
  authorityName?: string;
  stateLocationName?: string;
  keyWorkComponents?: string[];
  eligibilityCriteria?: string[];
  emdRequired?: boolean;
  emdAmount?: number;
  royaltyRequired?: boolean;
  wonRateStatus?: string;
  wonRatePercentage?: number;
  additionalInput?: string;
  keyActions?: string[];
  tenderFee?: number;
  performanceSecurity?: string;
  publishDate?: string;
  preBidDate?: string;
  openingDate?: string;
  bidValidity?: string;
  turnoverRequirement?: number;
  netWorthRequirement?: number;
  oemRequirements?: string;
  jvAllowed?: boolean;
  consortiumAllowed?: boolean;
}
