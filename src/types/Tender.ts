export interface TenderState {
  id: string;
  name: string;
  code: string;
}

export interface TenderCategory {
  id: string;
  name: string;
  slug: string;
}

export interface TenderDepartment {
  id: string;
  name: string;
  sector: string;
}

export type TenderStatus = 'new' | 'active' | 'closing_soon' | 'corrigendum' | 'awarded';

export interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  description: string;
  departmentId?: string;
  departmentName?: string;
  sector?: string;
  stateId?: string;
  stateName?: string;
  stateCode?: string;
  categoryId?: string;
  categoryName?: string;
  estimatedValue: number;
  emd: number;
  tenderFee: number;
  performanceSecurity?: string;
  bidValidity?: string;
  publishDate?: string;
  preBidDate?: string;
  submissionDeadline: string;
  openingDate?: string;
  authority?: string;
  location?: string;
  district?: string;
  status: TenderStatus;
  createdAt: string;
  updatedAt: string;
  documents?: TenderDocument[];
  aiSummary?: TenderAiSummary;
  eligibility?: TenderEligibility;
  awards?: TenderAward;
  corrigenda?: TenderCorrigendum[];
}

export interface TenderDocument {
  id: string;
  tenderId: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  fileSize?: string;
  createdAt: string;
}

export interface TenderAiSummary {
  id: string;
  tenderId: string;
  natureOfWork?: string;
  scope?: string;
  projectCategory?: string;
  attractivenessScore: number;
  easeOfQualificationScore: number;
  competitionRiskScore: number;
  executiveBrief?: string;
  keyRisks?: string[];
  recommendedVendorType?: string;
  createdAt: string;
}

export interface TenderEligibility {
  id: string;
  tenderId: string;
  turnoverRequirement?: number;
  netWorthRequirement?: number;
  similarExperienceYears?: number;
  similarExperienceDescription?: string;
  oemRequirements?: string;
  jvAllowed: boolean;
  consortiumAllowed: boolean;
  eligibilitySummary?: string;
  createdAt: string;
}

export interface TenderAlert {
  id: string;
  tenderId: string;
  tenderNumber: string;
  tenderTitle: string;
  profileId: string;
  alertType: '7_days_left' | '3_days_left' | '24_hours_left';
  isRead: boolean;
  createdAt: string;
}

export interface TenderMatch {
  id: string;
  tenderId: string;
  tenderNumber: string;
  tenderTitle: string;
  vendorId: string;
  vendorName: string;
  matchScore: number;
  categoryMatch: boolean;
  stateMatch: boolean;
  turnoverMatch: boolean;
  experienceMatch: boolean;
  createdAt: string;
}

export interface TenderAward {
  id: string;
  tenderId: string;
  awardedTo: string;
  awardValue: number;
  awardDate: string;
  createdAt: string;
}

export interface TenderCorrigendum {
  id: string;
  tenderId: string;
  title: string;
  details?: string;
  publishDate?: string;
  documentUrl?: string;
  createdAt: string;
}
