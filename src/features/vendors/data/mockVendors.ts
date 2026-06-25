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

const industries = ["IT & Software", "Construction", "Logistics", "Marketing", "Healthcare", "Manufacturing"];
const locations = ["New York, NY", "San Francisco, CA", "Austin, TX", "London, UK", "Berlin, DE", "Toronto, ON", "Sydney, AU", "Singapore"];
const statuses: VerificationStatus[] = ["Approved", "Pending", "Approved", "Approved", "Disapproved", "Pending"];
const names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"];

const generateMockVendors = (): VendorProfile[] => {
  const vendors: VendorProfile[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const industry = industries[i % industries.length];
    const location = locations[i % locations.length];
    const status = statuses[i % statuses.length];
    const firstName = firstNames[i % firstNames.length];
    const lastName = names[i % names.length];
    
    const suffixes = ["Solutions", "Tech", "Global", "Group", "Enterprises", "Consulting", "Partners", "Innovations"];
    const prefix = names[(i * 3) % names.length];
    const suffix = suffixes[i % suffixes.length];
    const companyName = `${prefix} ${suffix}`;
    
    vendors.push({
      id: `vnd_${1000 + i}`,
      companyName,
      industry,
      location,
      contactPerson: `${firstName} ${lastName}`,
      email: `contact@${companyName.replace(/\s+/g, '').toLowerCase()}.com`,
      website: `https://www.${companyName.replace(/\s+/g, '').toLowerCase()}.com`,
      verificationStatus: status,
      avatarUrl: `https://i.pravatar.cc/150?u=${i}`,
      documents: { gst: true, pan: true, turnover: true },
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }
  
  if (vendors.length > 0) {
    vendors[0].companyName = "Apex Construction Services";
    vendors[0].industry = "Construction";
    vendors[0].location = "New York, NY";
    vendors[0].verificationStatus = "Approved";
    
    vendors[1].companyName = "CloudNova Tech";
    vendors[1].industry = "IT & Software";
    vendors[1].verificationStatus = "Approved";
    
    vendors[2].companyName = "Swift Logistics Hub";
    vendors[2].industry = "Logistics";
    vendors[2].verificationStatus = "Pending";
  }

  return vendors;
};

export const mockVendors: VendorProfile[] = generateMockVendors();
