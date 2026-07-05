export type VerificationStatus = "Approved" | "Pending" | "Disapproved";

export interface VendorDocuments {
  gst: boolean;   // GST Certificate uploaded
  pan: boolean;   // PAN Card uploaded
  turnover: boolean; // 3-year Turnover Certificates uploaded
}

export interface VendorProfile {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  contactPerson: string;
  email: string;
  website: string;
  verificationStatus: VerificationStatus;
  avatarUrl?: string;
  documents?: VendorDocuments; // which compliance docs were uploaded
  createdAt?: string;          // ISO timestamp
  rejectionReason?: string;    // filled by Admin when rejecting
}
