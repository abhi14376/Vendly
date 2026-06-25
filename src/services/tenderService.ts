import { getSupabaseClient } from '@/lib/supabase';
import { 
  Tender, 
  TenderDocument, 
  TenderAiSummary, 
  TenderEligibility, 
  TenderMatch, 
  TenderAlert, 
  TenderCorrigendum, 
  TenderAward,
  TenderStatus
} from '@/types/Tender';
import { mockVendors, VendorProfile } from '@/features/vendors/data/mockVendors';
import { getLocalOpportunities } from './localOpportunityStore';
import { Opportunity } from '@/types/Opportunity';

// Fallback in-memory store in case database tables are not ready or connection fails
let localTenders: Tender[] = [];
let localMatches: TenderMatch[] = [];
let localAlerts: TenderAlert[] = [];
let localCorrigenda: TenderCorrigendum[] = [];
let localAwards: TenderAward[] = [];

// Seed some initial high quality mock data in memory so the app is loaded on first visit
const initialMockTenders: Tender[] = [
  {
    id: "tnd_1",
    tenderNumber: "UP-PWD-2026-8912",
    title: "Four-Laning of Jhansi-Khajuraho Section of NH-75",
    description: "Rehabilitation and Upgradation of Jhansi-Khajuraho section (Km 0.00 to Km 76.30) to four lane with paved shoulder on EPC mode under NHDP Phase-IV.",
    estimatedValue: 485000000, // 48.5 Cr
    emd: 9700000, // 2%
    tenderFee: 50000,
    performanceSecurity: "5% of contract value",
    bidValidity: "120 days",
    publishDate: "2026-06-15T10:00:00Z",
    preBidDate: "2026-06-25T11:00:00Z",
    submissionDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days left (Closing Soon)
    openingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    authority: "Public Works Department (PWD)",
    location: "Jhansi",
    district: "Jhansi",
    stateName: "Uttar Pradesh",
    stateCode: "UP",
    categoryName: "Roads & Highways",
    departmentName: "PWD",
    sector: "Roads & Infrastructure",
    status: "active",
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-15T10:00:00Z",
    documents: [
      { id: "doc_1_1", tenderId: "tnd_1", fileName: "Tender_Notice_8912.pdf", fileUrl: "#", createdAt: "2026-06-15T10:00:00Z" },
      { id: "doc_1_2", tenderId: "tnd_1", fileName: "RFP_Jhansi_Khajuraho.pdf", fileUrl: "#", createdAt: "2026-06-15T10:00:00Z" },
      { id: "doc_1_3", tenderId: "tnd_1", fileName: "BOQ_Roads.xlsx", fileUrl: "#", createdAt: "2026-06-15T10:00:00Z" }
    ],
    aiSummary: {
      id: "ai_1",
      tenderId: "tnd_1",
      natureOfWork: "EPC road construction, widening and paving.",
      scope: "Four-laning of 76.3 Km stretch including 4 major bridges, 12 minor bridges, culverts, and toll plazas.",
      projectCategory: "Roads & Highways",
      attractivenessScore: 88,
      easeOfQualificationScore: 72,
      competitionRiskScore: 65,
      executiveBrief: "The project involves widening the existing two-lane highway to a four-lane highway with paved shoulders from Jhansi to Khajuraho under NHDP Phase-IV. Execution is on an EPC (Engineering, Procurement, Construction) basis, meaning the contractor will bear full engineering and design responsibility. Major works include construction of bridges, culverts, toll booths, and passenger underpasses. Ideal for tier-1 civil contractors with heavy machinery availability and high turnover.",
      keyRisks: ["Land acquisition delays on a 5km stretch", "Utility shifting (power poles and water lines)", "Environmental clearance for forest buffer zone"],
      recommendedVendorType: "Tier-1 Civil Infrastructure Contractor",
      createdAt: "2026-06-15T11:00:00Z"
    },
    eligibility: {
      id: "elg_1",
      tenderId: "tnd_1",
      turnoverRequirement: 150000000, // 15 Cr average in last 3 years
      netWorthRequirement: 50000000, // 5 Cr
      similarExperienceYears: 5,
      similarExperienceDescription: "Completed at least one similar four-laning road construction project of minimum value 20 Cr, or two projects of value 12 Cr each in the last 5 years.",
      oemRequirements: "Breathe-analyzer, GPS and RFID tracking tools must be sourced from approved OEMs.",
      jvAllowed: true,
      consortiumAllowed: false,
      eligibilitySummary: "Min Turnover: 15 Cr. Net Worth: 5 Cr. 5+ years experience in road construction. JV allowed up to 2 partners.",
      createdAt: "2026-06-15T11:00:00Z"
    }
  },
  {
    id: "tnd_2",
    tenderNumber: "HR-HAREDA-2026-0155",
    title: "15MW Grid Connected Rooftop Solar Power Plant Commissioning",
    description: "Design, Manufacture, Supply, Installation, Testing, and Commissioning of 15MW Grid Connected Rooftop Solar Power Plants on various Government Buildings in Haryana.",
    estimatedValue: 240000000, // 24 Cr
    emd: 4800000,
    tenderFee: 15000,
    performanceSecurity: "10% of contract value",
    bidValidity: "90 days",
    publishDate: "2026-06-18T09:00:00Z",
    preBidDate: "2026-06-29T11:00:00Z",
    submissionDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days left (Closing Soon)
    openingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    authority: "Haryana Renewable Energy Development Agency (HAREDA)",
    location: "Gurugram & Faridabad",
    district: "Gurugram",
    stateName: "Haryana",
    stateCode: "HR",
    categoryName: "Solar EPC",
    departmentName: "HAREDA",
    sector: "Solar & Renewable",
    status: "active",
    createdAt: "2026-06-18T09:00:00Z",
    updatedAt: "2026-06-18T09:00:00Z",
    documents: [
      { id: "doc_2_1", tenderId: "tnd_2", fileName: "Solar_Rooftop_RFP.pdf", fileUrl: "#", createdAt: "2026-06-18T09:00:00Z" }
    ],
    aiSummary: {
      id: "ai_2",
      tenderId: "tnd_2",
      natureOfWork: "Rooftop solar installation, grid connectivity, metering, and 5-year O&M.",
      scope: "Installation on 250+ government buildings in Gurugram, Faridabad and Ambala. Includes structure reinforcement, grid tie-in, net metering configuration.",
      projectCategory: "Solar EPC",
      attractivenessScore: 92,
      easeOfQualificationScore: 80,
      competitionRiskScore: 40,
      executiveBrief: "This HAREDA tender is a premium solar installation project across Haryana's government structures. The scope includes site assessment, structural integrity verification, manufacture of modules, inverter setup, net-metering configuration with state DISCOMs, and complete operation & maintenance for 5 years. Excellent opportunity for mid-to-large scale solar developers. Low competition due to strict Class-A electrical contractor license requirements.",
      keyRisks: ["Roof structure leakage claims", "Local grid connection approvals and net metering integration delays", "Supply chain fluctuations in Tier-1 solar panel modules"],
      recommendedVendorType: "Solar EPC Developer / Electrical System Integrator",
      createdAt: "2026-06-18T10:00:00Z"
    },
    eligibility: {
      id: "elg_2",
      tenderId: "tnd_2",
      turnoverRequirement: 80000000, // 8 Cr
      netWorthRequirement: 20000000,
      similarExperienceYears: 3,
      similarExperienceDescription: "Commissioned at least 5MW cumulative capacity of rooftop solar, with at least one single site of 1MW capacity in the last 3 years.",
      oemRequirements: "Modules must be from ALMM approved list (domestic content requirement). Inverters must be IEC certified.",
      jvAllowed: false,
      consortiumAllowed: true,
      eligibilitySummary: "Turnover: 8 Cr. Min 5MW cumulative solar experience. ALMM panels only. Consortium allowed up to 3 members.",
      createdAt: "2026-06-18T10:00:00Z"
    }
  },
  {
    id: "tnd_3",
    tenderNumber: "MP-WRD-2026-4402",
    title: "Construction of Canal Network & Drip Irrigation System in Narmada Basin",
    description: "Design and Construction of pressurized pipeline canal network, micro irrigation, and automation systems for 5,000 hectares command area under Narmada Valley Project.",
    estimatedValue: 1250000000, // 125 Cr
    emd: 25000000,
    tenderFee: 100000,
    performanceSecurity: "5% of contract value",
    bidValidity: "180 days",
    publishDate: "2026-06-01T10:00:00Z",
    preBidDate: "2026-06-12T11:00:00Z",
    submissionDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Ended (Awarded Contract)
    openingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    authority: "Water Resources Department (WRD)",
    location: "Khandwa",
    district: "Khandwa",
    stateName: "Madhya Pradesh",
    stateCode: "MP",
    categoryName: "Water Supply",
    departmentName: "Water Resources Department",
    sector: "Water & Sewerage",
    status: "awarded",
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-23T18:00:00Z",
    documents: [
      { id: "doc_3_1", tenderId: "tnd_3", fileName: "Narmada_Irrigation_NIT.pdf", fileUrl: "#", createdAt: "2026-06-01T10:00:00Z" }
    ],
    aiSummary: {
      id: "ai_3",
      tenderId: "tnd_3",
      natureOfWork: "Water distribution network construction, pumping stations, and SCADA automation.",
      scope: "Laying 350 Km HDPE/MS pipes, construction of 3 intake pump stations, installation of smart valves and SCADA control system.",
      projectCategory: "Water Supply",
      attractivenessScore: 85,
      easeOfQualificationScore: 50,
      competitionRiskScore: 80,
      executiveBrief: "Large-scale irrigation canal and pipeline works in Madhya Pradesh. The contractor will manage the engineering, pipeline layout, pumping station installation, and integrate a digital flow-management SCADA framework. Highly lucrative but capital intensive. Strict qualifying criteria restrict this to major national conglomerates.",
      keyRisks: ["Right of way (RoW) acquisition through agricultural fields", "Monsoon disruption to pipe laying", "Rising steel and polymer piping prices"],
      recommendedVendorType: "Mega Infrastructure / Water Projects Conglomerate",
      createdAt: "2026-06-01T11:00:00Z"
    },
    eligibility: {
      id: "elg_3",
      tenderId: "tnd_3",
      turnoverRequirement: 400000000, // 40 Cr
      netWorthRequirement: 100000000,
      similarExperienceYears: 7,
      similarExperienceDescription: "Successfully laid micro-irrigation systems for at least 2,500 hectares in a single project, and built intake wells of minimum 10 MLD capacity.",
      oemRequirements: "SCADA systems must be procured from Siemens, ABB, or Honeywell only.",
      jvAllowed: true,
      consortiumAllowed: true,
      eligibilitySummary: "Turnover: 40 Cr. Min 7 years in water projects. SCADA OEM limits. JV/Consortium allowed.",
      createdAt: "2026-06-01T11:00:00Z"
    }
  },
  {
    id: "tnd_4",
    tenderNumber: "RJ-RECL-2026-5510",
    title: "Corrigendum-I: Solarization of Agricultural Pumps under PM-KUSUM",
    description: "Design, supply, installation, and commissioning of grid-connected solar power plants for solarization of 5,000 agricultural pumps under PM-KUSUM Component-C.",
    estimatedValue: 350000000, // 35 Cr
    emd: 7000000,
    tenderFee: 25000,
    performanceSecurity: "10% of contract value",
    bidValidity: "120 days",
    publishDate: "2026-06-10T10:00:00Z",
    preBidDate: "2026-06-20T11:00:00Z",
    submissionDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days left
    openingDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
    authority: "Rajasthan Renewable Energy Corporation Limited (RRECL)",
    location: "Jaipur",
    district: "Jaipur",
    stateName: "Rajasthan",
    stateCode: "RJ",
    categoryName: "Solar EPC",
    departmentName: "RRECL",
    sector: "Solar & Renewable",
    status: "corrigendum",
    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-24T09:00:00Z",
    documents: [
      { id: "doc_4_1", tenderId: "tnd_4", fileName: "KUSUM_C_RFP.pdf", fileUrl: "#", createdAt: "2026-06-10T10:00:00Z" },
      { id: "doc_4_2", tenderId: "tnd_4", fileName: "Corrigendum_I_Dates.pdf", fileUrl: "#", createdAt: "2026-06-24T09:00:00Z" }
    ],
    aiSummary: {
      id: "ai_4",
      tenderId: "tnd_4",
      natureOfWork: "Feeder level agricultural solarization, pump tie-in and net metering.",
      scope: "Establishing small solar plants (0.5MW to 2MW) near rural substations to power agricultural pump feeders.",
      projectCategory: "Solar EPC",
      attractivenessScore: 90,
      easeOfQualificationScore: 68,
      competitionRiskScore: 55,
      executiveBrief: "This tender is part of India's PM-KUSUM scheme for agriculture solarization. RRECL is setting up decentralized solar units to power farm pumps. Corrigendum-I was issued on June 24th to extend the submission deadline by 10 days and clarify structural warranty specifications for solar mounting tables. Excellent margins with central/state subsidies active.",
      keyRisks: ["High dispersion of project locations in rural Rajasthan", "Security of equipment (panel theft/vandalism risk in remote fields)", "Delayed subsidy disbursement schedules"],
      recommendedVendorType: "Experienced Solar Contractor / Decentralized EPC Specialist",
      createdAt: "2026-06-10T11:00:00Z"
    },
    eligibility: {
      id: "elg_4",
      tenderId: "tnd_4",
      turnoverRequirement: 100000000, // 10 Cr
      netWorthRequirement: 30000000,
      similarExperienceYears: 3,
      similarExperienceDescription: "Completed similar solar installations of cumulative 10MW capacity in the last 3 years, with government entities.",
      oemRequirements: "Solar modules must be listed in ALMM. Inverters and cables must hold BIS certifications.",
      jvAllowed: true,
      consortiumAllowed: true,
      eligibilitySummary: "Turnover: 10 Cr. Cumulative 10MW solar experience. ALMM panels. JV/Consortium allowed.",
      createdAt: "2026-06-10T11:00:00Z"
    }
  },
  {
    id: "tnd_5",
    tenderNumber: "MH-CIDCO-2026-0921",
    title: "Construction of Terminal Building & ATC Tower at Navi Mumbai Airport",
    description: "Design and Construction of Terminal Building 2, ATC Tower, and Cargo terminal on EPC basis for Navi Mumbai International Airport Project.",
    estimatedValue: 6500000000, // 650 Cr
    emd: 130000000,
    tenderFee: 500000,
    performanceSecurity: "10% of contract value",
    bidValidity: "180 days",
    publishDate: "2026-06-20T10:00:00Z",
    preBidDate: "2026-07-05T11:00:00Z",
    submissionDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days left
    openingDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000).toISOString(),
    authority: "City and Industrial Development Corporation (CIDCO)",
    location: "Navi Mumbai",
    district: "Navi Mumbai",
    stateName: "Maharashtra",
    stateCode: "MH",
    categoryName: "Airport Infrastructure",
    departmentName: "Development Authorities",
    sector: "Buildings & Civil",
    status: "new", // Newly Discovered
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documents: [
      { id: "doc_5_1", tenderId: "tnd_5", fileName: "NMIA_Terminal_RFP.pdf", fileUrl: "#", createdAt: new Date().toISOString() }
    ],
    aiSummary: {
      id: "ai_5",
      tenderId: "tnd_5",
      natureOfWork: "Aviation terminal design, structural steel roofing, ATC fit-out and HVAC.",
      scope: "Erecting terminal building shell, steel space frame roof structure, ATC tower cabin, advanced fire suppression systems, and baggage handling line.",
      projectCategory: "Airport Infrastructure",
      attractivenessScore: 95,
      easeOfQualificationScore: 30,
      competitionRiskScore: 90,
      executiveBrief: "High-value aviation infrastructure development in Navi Mumbai. This is a highly technical, multi-disciplinary construction project. Contractor must possess specialized structural steel expertise, international airport building credentials, and heavy machinery capacity. Bidding will be highly competitive, dominated by national conglomerates like L&T, Shapoorji, and Tata Projects.",
      keyRisks: ["Extreme coordination complexity with aviation control agencies", "Tight construction timeline matching NMIA flight commission date", "High structural steel procurement cost volatility"],
      recommendedVendorType: "Aviation Infrastructure Specialist / Tier-1 Building Conglomerate",
      createdAt: new Date().toISOString()
    },
    eligibility: {
      id: "elg_5",
      tenderId: "tnd_5",
      turnoverRequirement: 2500000000, // 250 Cr
      netWorthRequirement: 800000000,
      similarExperienceYears: 10,
      similarExperienceDescription: "Completed design and build of at least one airport passenger terminal or similar complex structural space frame building of minimum 100,000 sq ft footprint in the last 10 years.",
      oemRequirements: "Baggage handling and ATC electronics must be from pre-approved European/American aviation vendors.",
      jvAllowed: true,
      consortiumAllowed: true,
      eligibilitySummary: "Turnover: 250 Cr. Net Worth: 80 Cr. 10+ years airport or terminal infrastructure experience. JVs allowed.",
      createdAt: new Date().toISOString()
    }
  }
];

// Initialize local store
localTenders = [...initialMockTenders];

// Generate local mock matches
const generateInitialMockMatches = () => {
  const matches: TenderMatch[] = [];
  localTenders.forEach(tender => {
    mockVendors.slice(0, 5).forEach((vendor, index) => {
      // Calculate scores
      const score = Math.floor(50 + Math.random() * 45); // 50 to 95
      matches.push({
        id: `mtc_${tender.id}_${vendor.id}`,
        tenderId: tender.id,
        tenderNumber: tender.tenderNumber,
        tenderTitle: tender.title,
        vendorId: vendor.id,
        vendorName: vendor.companyName,
        matchScore: score,
        categoryMatch: tender.categoryName === "Solar EPC" && vendor.industry === "Construction" ? true : Math.random() > 0.3,
        stateMatch: Math.random() > 0.4,
        turnoverMatch: Math.random() > 0.2,
        experienceMatch: Math.random() > 0.3,
        createdAt: new Date().toISOString()
      });
    });
  });
  return matches;
};
localMatches = generateInitialMockMatches();

// Seed awards
localAwards = [
  {
    id: "awd_1",
    tenderId: "tnd_3",
    awardedTo: "Dilip Buildcon Limited",
    awardValue: 1215000000, // 121.5 Cr (slightly lower than estimate)
    awardDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

// Seed corrigendums
localCorrigenda = [
  {
    id: "crg_1",
    tenderId: "tnd_4",
    title: "Corrigendum-I: Date Extension & Specs Clarification",
    details: "Submission deadline has been extended from 2026-06-25 to 2026-07-06. Clarification regarding solar PV module structure wind velocity load resistance (updated to 150 km/h). Check attached document.",
    publishDate: new Date().toISOString(),
    documentUrl: "#",
    createdAt: new Date().toISOString()
  }
];

// Seed Alerts
localAlerts = [
  {
    id: "alt_1",
    tenderId: "tnd_1",
    tenderNumber: "UP-PWD-2026-8912",
    tenderTitle: "Four-Laning of Jhansi-Khajuraho Section of NH-75",
    profileId: "usr_2",
    alertType: "7_days_left",
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "alt_2",
    tenderId: "tnd_2",
    tenderNumber: "HR-HAREDA-2026-0155",
    tenderTitle: "15MW Grid Connected Rooftop Solar Power Plant Commissioning",
    profileId: "usr_2",
    alertType: "3_days_left",
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

function mapOpportunityToTender(opp: Opportunity): Tender {
  const statusLower = (opp.status || '').toLowerCase();
  let tenderStatus: TenderStatus = 'active';
  if (statusLower === 'closed' || statusLower === 'archived' || statusLower === 'closing_soon') {
    tenderStatus = 'closing_soon';
  } else if (statusLower === 'draft' || statusLower === 'new') {
    tenderStatus = 'new';
  } else {
    // 'open', 'published', 'active', or anything else → active
    tenderStatus = 'active';
  }

  const docs: TenderDocument[] = opp.documents ? opp.documents.map((d, index) => ({
    id: `doc_${opp.id}_${index}`,
    tenderId: opp.id,
    fileName: d.name,
    fileUrl: d.url,
    createdAt: opp.createdAt || new Date().toISOString()
  })) : [];

  return {
    id: opp.id,
    tenderNumber: opp.id.startsWith('opp_') ? `OPP-${opp.id.substring(4)}` : `OPP-${opp.id}`,
    title: opp.title,
    description: opp.description || opp.summary || '',
    estimatedValue: opp.budget || 0,
    emd: opp.emdAmount || 0,
    tenderFee: opp.tenderFee || 0,
    performanceSecurity: opp.performanceSecurity,
    bidValidity: opp.bidValidity,
    publishDate: opp.publishDate || opp.createdAt,
    preBidDate: opp.preBidDate,
    submissionDeadline: opp.deadline || new Date().toISOString(),
    openingDate: opp.openingDate,
    authority: opp.authorityName || 'Manual Authority',
    location: opp.location || opp.stateLocationName || 'Remote',
    status: tenderStatus,
    createdAt: opp.createdAt || new Date().toISOString(),
    updatedAt: opp.createdAt || new Date().toISOString(),
    documents: docs,
    categoryName: opp.category || opp.industryType || 'General',
    stateName: opp.stateLocationName || opp.location || 'General',
    aiSummary: {
      id: `ai_${opp.id}`,
      tenderId: opp.id,
      natureOfWork: opp.projectType || 'Manual Opportunity',
      scope: opp.keyWorkComponents?.join(', ') || '',
      projectCategory: opp.category || opp.industryType || 'General',
      attractivenessScore: 90,
      easeOfQualificationScore: 80,
      competitionRiskScore: 30,
      executiveBrief: opp.summary || opp.description || '',
      keyRisks: opp.redFlags || [],
      recommendedVendorType: opp.recommendedSize || 'General',
      createdAt: opp.createdAt || new Date().toISOString()
    },
    eligibility: {
      id: `elg_${opp.id}`,
      tenderId: opp.id,
      turnoverRequirement: opp.turnoverRequirement,
      netWorthRequirement: opp.netWorthRequirement,
      similarExperienceYears: opp.minYearsExp,
      similarExperienceDescription: opp.eligibilityCriteria?.join(', ') || '',
      oemRequirements: opp.oemRequirements,
      jvAllowed: opp.jvAllowed || false,
      consortiumAllowed: opp.consortiumAllowed || false,
      eligibilitySummary: opp.eligibilityCriteria?.join(', ') || '',
      createdAt: opp.createdAt || new Date().toISOString()
    }
  };
}

function mapDbOpportunityToTender(dbRecord: any): Tender {
  const uiStatus = (dbRecord.status || '').toLowerCase();
  let tenderStatus: TenderStatus = 'active'; // default
  if (uiStatus === 'archived' || uiStatus === 'closed' || uiStatus === 'closing_soon') {
    tenderStatus = 'closing_soon';
  } else if (uiStatus === 'draft' || uiStatus === 'new') {
    tenderStatus = 'new';
  } else {
    // 'published', 'open', 'active', 'Published', 'Open', '' → active
    tenderStatus = 'active';
  }

  let mappedDocuments: TenderDocument[] = [];
  if (dbRecord.opportunity_documents && Array.isArray(dbRecord.opportunity_documents)) {
    mappedDocuments = dbRecord.opportunity_documents.map((doc: any, index: number) => ({
      id: doc.id || `doc_${dbRecord.id}_${index}`,
      tenderId: dbRecord.id,
      fileName: doc.file_name,
      fileUrl: doc.file_url,
      createdAt: doc.created_at || dbRecord.created_at || new Date().toISOString()
    }));
  }

  return {
    id: dbRecord.id,
    tenderNumber: dbRecord.id.startsWith('opp_') ? `OPP-${dbRecord.id.substring(4)}` : `OPP-${dbRecord.id}`,
    title: dbRecord.title,
    description: dbRecord.description || dbRecord.summary || '',
    estimatedValue: dbRecord.amount || 0,
    emd: dbRecord.emd_amount || 0,
    tenderFee: dbRecord.tender_fee || 0,
    performanceSecurity: dbRecord.performance_security,
    bidValidity: dbRecord.bid_validity,
    publishDate: dbRecord.publish_date || dbRecord.created_at,
    preBidDate: dbRecord.pre_bid_date,
    submissionDeadline: dbRecord.submission_deadline || new Date().toISOString(),
    openingDate: dbRecord.opening_date,
    authority: dbRecord.authority_name || 'Manual Authority',
    location: dbRecord.state || 'Remote',
    status: tenderStatus,
    createdAt: dbRecord.created_at || new Date().toISOString(),
    updatedAt: dbRecord.created_at || new Date().toISOString(),
    documents: mappedDocuments,
    categoryName: dbRecord.category || dbRecord.industry_type || 'General',
    stateName: dbRecord.state_location_name || dbRecord.state || 'General',
    aiSummary: {
      id: `ai_${dbRecord.id}`,
      tenderId: dbRecord.id,
      natureOfWork: dbRecord.project_type || 'Manual Opportunity',
      scope: dbRecord.key_work_components ? (Array.isArray(dbRecord.key_work_components) ? dbRecord.key_work_components.join(', ') : dbRecord.key_work_components) : '',
      projectCategory: dbRecord.category || dbRecord.industry_type || 'General',
      attractivenessScore: 90,
      easeOfQualificationScore: 80,
      competitionRiskScore: 30,
      executiveBrief: dbRecord.summary || dbRecord.description || '',
      keyRisks: dbRecord.red_flags || [],
      recommendedVendorType: dbRecord.recommended_size || 'General',
      createdAt: dbRecord.created_at || new Date().toISOString()
    },
    eligibility: {
      id: `elg_${dbRecord.id}`,
      tenderId: dbRecord.id,
      turnoverRequirement: dbRecord.turnover_requirement,
      netWorthRequirement: dbRecord.net_worth_requirement,
      similarExperienceYears: dbRecord.min_years_exp,
      similarExperienceDescription: dbRecord.eligibility_criteria ? (Array.isArray(dbRecord.eligibility_criteria) ? dbRecord.eligibility_criteria.join(', ') : dbRecord.eligibility_criteria) : '',
      oemRequirements: dbRecord.oem_requirements,
      jvAllowed: dbRecord.jv_allowed || false,
      consortiumAllowed: dbRecord.consortium_allowed || false,
      eligibilitySummary: dbRecord.eligibility_criteria ? (Array.isArray(dbRecord.eligibility_criteria) ? dbRecord.eligibility_criteria.join(', ') : dbRecord.eligibility_criteria) : '',
      createdAt: dbRecord.created_at || new Date().toISOString()
    }
  };
}

export const tenderService = {
  // 1. Get all tenders (with fallback)
  async getTenders(status?: string, searchFilters?: any): Promise<Tender[]> {
    const supabase = getSupabaseClient();
    let dbTenders: Tender[] = [];
    let dbOpps: Tender[] = [];
    let succeeded = false;
    
    if (supabase) {
      try {
        let query = supabase
          .from('tenders')
          .select(`
            *,
            tender_departments(name, sector),
            tender_states(name, code),
            tender_categories(name, slug),
            tender_documents(*),
            tender_ai_summary(*),
            tender_eligibility(*)
          `);
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
          // Map database structure to UI Tender structure
          dbTenders = data.map((t: any) => ({
            id: t.id,
            tenderNumber: t.tender_number,
            title: t.title,
            description: t.description,
            departmentId: t.department_id,
            departmentName: t.tender_departments?.name,
            sector: t.tender_departments?.sector,
            stateId: t.state_id,
            stateName: t.tender_states?.name,
            stateCode: t.tender_states?.code,
            categoryId: t.category_id,
            categoryName: t.tender_categories?.name,
            estimatedValue: Number(t.estimated_value) || 0,
            emd: Number(t.emd) || 0,
            tenderFee: Number(t.tender_fee) || 0,
            performanceSecurity: t.performance_security,
            bidValidity: t.bid_validity,
            publishDate: t.publish_date,
            preBidDate: t.pre_bid_date,
            submissionDeadline: t.submission_deadline,
            openingDate: t.opening_date,
            authority: t.authority,
            location: t.location,
            district: t.district,
            status: t.status as TenderStatus,
            createdAt: t.created_at,
            updatedAt: t.updated_at,
            documents: t.tender_documents?.map((d: any) => ({
              id: d.id,
              tenderId: d.tender_id,
              fileName: d.file_name,
              fileUrl: d.file_url,
              mimeType: d.mime_type,
              fileSize: d.file_size,
              createdAt: d.created_at
            })),
            aiSummary: t.tender_ai_summary ? {
              id: t.tender_ai_summary.id,
              tenderId: t.tender_ai_summary.tender_id,
              natureOfWork: t.tender_ai_summary.nature_of_work,
              scope: t.tender_ai_summary.scope,
              projectCategory: t.tender_ai_summary.project_category,
              attractivenessScore: t.tender_ai_summary.attractiveness_score,
              easeOfQualificationScore: t.tender_ai_summary.ease_of_qualification_score,
              competitionRiskScore: t.tender_ai_summary.competition_risk_score,
              executiveBrief: t.tender_ai_summary.executive_brief,
              keyRisks: t.tender_ai_summary.key_risks || [],
              recommendedVendorType: t.tender_ai_summary.recommended_vendor_type,
              createdAt: t.tender_ai_summary.created_at
            } : undefined,
            eligibility: t.tender_eligibility ? {
              id: t.tender_eligibility.id,
              tenderId: t.tender_eligibility.tender_id,
              turnoverRequirement: Number(t.tender_eligibility.turnover_requirement) || 0,
              netWorthRequirement: Number(t.tender_eligibility.net_worth_requirement) || 0,
              similarExperienceYears: t.tender_eligibility.similar_experience_years,
              similarExperienceDescription: t.tender_eligibility.similar_experience_description,
              oemRequirements: t.tender_eligibility.oem_requirements,
              jvAllowed: t.tender_eligibility.jv_allowed,
              consortiumAllowed: t.tender_eligibility.consortium_allowed,
              eligibilitySummary: t.tender_eligibility.eligibility_summary,
              createdAt: t.tender_eligibility.created_at
            } : undefined
          }));
          
          localTenders = dbTenders;
          succeeded = true;
        }
      } catch (err) {
        console.warn("Could not query Supabase tables, falling back to local memory store:", err);
      }

      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select('*, opportunity_documents(*)');
        if (!error && data) {
          dbOpps = data.map(mapDbOpportunityToTender);
        }
      } catch (oppErr) {
        console.warn("Could not query opportunities in Supabase:", oppErr);
      }
    }

    const mappedLocalOpps = getLocalOpportunities().map(mapOpportunityToTender);

    // Always start with mock/db tenders. Include dbOpps (Supabase opportunities table)
    // regardless of whether the tenders table succeeded — they are separate tables.
    let allTenders: Tender[];
    if (succeeded) {
      allTenders = [...dbTenders, ...dbOpps];
    } else {
      // Supabase tenders table failed/empty — fall back to in-memory mocks + Supabase opportunities
      allTenders = [...localTenders, ...dbOpps];
    }

    // Merge in any opportunities that were created without Supabase (local-only session)
    const existingIds = new Set(allTenders.map(t => t.id));
    mappedLocalOpps.forEach(oppTender => {
      if (!existingIds.has(oppTender.id)) {
        allTenders.push(oppTender);
      }
    });

    let filtered = allTenders;
    if (status && status !== 'all') {
      filtered = filtered.filter(t => t.status === status);
    }
    if (searchFilters) {
      if (searchFilters.state && searchFilters.state !== 'All') {
        filtered = filtered.filter(t => t.stateName === searchFilters.state);
      }
      if (searchFilters.department && searchFilters.department !== 'All') {
        filtered = filtered.filter(t => t.departmentName === searchFilters.department);
      }
      if (searchFilters.category && searchFilters.category !== 'All') {
        filtered = filtered.filter(t => t.categoryName === searchFilters.category);
      }
      if (searchFilters.minBudget) {
        filtered = filtered.filter(t => t.estimatedValue >= searchFilters.minBudget);
      }
      if (searchFilters.maxBudget) {
        filtered = filtered.filter(t => t.estimatedValue <= searchFilters.maxBudget);
      }
      if (searchFilters.search) {
        const query = searchFilters.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(query) || 
          t.tenderNumber.toLowerCase().includes(query) || 
          (t.authority && t.authority.toLowerCase().includes(query)) ||
          (t.location && t.location.toLowerCase().includes(query))
        );
      }
    }
    
    return filtered;
  },

  // 2. Fetch specific tender by ID
  async getTenderById(id: string): Promise<Tender | null> {
    const tenders = await this.getTenders();
    const t = tenders.find(t => t.id === id);
    if (!t) return null;
    
    // Attach corrigenda
    t.corrigenda = localCorrigenda.filter(c => c.tenderId === id);
    
    // Attach awards
    t.awards = localAwards.find(a => a.tenderId === id);
    
    return t;
  },

  // 3. Fetch matched records
  async getTenderMatches(searchQuery?: string): Promise<TenderMatch[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tender_matches')
          .select(`
            *,
            tenders(title, tender_number),
            profiles(company_name)
          `);
        if (!error && data && data.length > 0) {
          localMatches = data.map((m: any) => ({
            id: m.id,
            tenderId: m.tender_id,
            tenderNumber: m.tenders?.tender_number,
            tenderTitle: m.tenders?.title,
            vendorId: m.vendor_id,
            vendorName: m.profiles?.company_name || 'Mock Vendor',
            matchScore: m.match_score,
            categoryMatch: m.category_match,
            stateMatch: m.state_match,
            turnoverMatch: m.turnover_match,
            experienceMatch: m.experience_match,
            createdAt: m.created_at
          }));
        }
      } catch (err) {
        console.warn("Could not query tender_matches in Supabase, using local memory:", err);
      }
    }

    let filtered = [...localMatches];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.tenderTitle.toLowerCase().includes(q) || 
        m.tenderNumber.toLowerCase().includes(q) || 
        m.vendorName.toLowerCase().includes(q)
      );
    }
    return filtered;
  },

  // 4. Fetch alerts
  async getTenderAlerts(): Promise<TenderAlert[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tender_alerts')
          .select(`
            *,
            tenders(title, tender_number)
          `);
        if (!error && data && data.length > 0) {
          localAlerts = data.map((a: any) => ({
            id: a.id,
            tenderId: a.tender_id,
            tenderNumber: a.tenders?.tender_number,
            tenderTitle: a.tenders?.title,
            profileId: a.profile_id,
            alertType: a.alert_type,
            isRead: a.is_read,
            createdAt: a.created_at
          }));
        }
      } catch (err) {
        console.warn("Could not query tender_alerts in Supabase, using local memory:", err);
      }
    }
    return localAlerts;
  },

  // 5. Fetch corrigendums
  async getCorrigendums(): Promise<TenderCorrigendum[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tender_corrigendum')
          .select('*');
        if (!error && data && data.length > 0) {
          localCorrigenda = data.map((c: any) => ({
            id: c.id,
            tenderId: c.tender_id,
            title: c.title,
            details: c.details,
            publishDate: c.publish_date,
            documentUrl: c.document_url,
            createdAt: c.created_at
          }));
        }
      } catch (err) {
        console.warn("Could not query corrigenda in Supabase, using local memory:", err);
      }
    }
    return localCorrigenda;
  },

  // 6. Fetch awarded contracts
  async getAwardedContracts(): Promise<TenderAward[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('tender_awards')
          .select('*');
        if (!error && data && data.length > 0) {
          localAwards = data.map((a: any) => ({
            id: a.id,
            tenderId: a.tender_id,
            awardedTo: a.awarded_to,
            awardValue: Number(a.award_value) || 0,
            awardDate: a.award_date,
            createdAt: a.created_at
          }));
        }
      } catch (err) {
        console.warn("Could not query awards in Supabase, using local memory:", err);
      }
    }
    return localAwards;
  },

  // 7. Get Department Analytics
  async getDepartmentAnalytics(): Promise<any[]> {
    const tenders = await this.getTenders();
    const map: { [dept: string]: { count: number; totalValue: number; sector: string } } = {};
    
    tenders.forEach(t => {
      const dept = t.departmentName || 'Others';
      const sector = t.sector || 'General';
      const val = t.estimatedValue || 0;
      if (!map[dept]) {
        map[dept] = { count: 0, totalValue: 0, sector };
      }
      map[dept].count += 1;
      map[dept].totalValue += val;
    });

    return Object.entries(map).map(([name, stats]) => ({
      name,
      count: stats.count,
      totalValue: stats.totalValue,
      sector: stats.sector
    })).sort((a, b) => b.totalValue - a.totalValue);
  },

  // 8. Get State Analytics
  async getStateAnalytics(): Promise<any[]> {
    const tenders = await this.getTenders();
    const map: { [state: string]: { count: number; totalValue: number } } = {};
    
    tenders.forEach(t => {
      const state = t.stateName || 'Others';
      const val = t.estimatedValue || 0;
      if (!map[state]) {
        map[state] = { count: 0, totalValue: 0 };
      }
      map[state].count += 1;
      map[state].totalValue += val;
    });

    return Object.entries(map).map(([name, stats]) => ({
      name,
      count: stats.count,
      totalValue: stats.totalValue
    })).sort((a, b) => b.totalValue - a.totalValue);
  },

  // 9. Vendor Matching Engine logic
  calculateMatchScore(tender: Tender, vendor: VendorProfile | any): {
    score: number;
    categoryMatch: boolean;
    stateMatch: boolean;
    turnoverMatch: boolean;
    experienceMatch: boolean;
  } {
    // 1. Category matching
    const tenderCategory = tender.categoryName || '';
    const vendorCategories = vendor.service_categories || [vendor.industry] || [];
    const categoryMatch = vendorCategories.some((c: string) => c.toLowerCase().includes(tenderCategory.toLowerCase()) || tenderCategory.toLowerCase().includes(c.toLowerCase()));

    // 2. State matching
    const tenderState = tender.stateName || '';
    // Map standard state abbreviations or locations
    const vendorStates = vendor.operating_states || [vendor.location.split(',')[1]?.trim()] || [];
    const stateMatch = vendorStates.some((s: string) => s.toLowerCase() === tenderState.toLowerCase() || s.toLowerCase() === tender.stateCode?.toLowerCase());

    // 3. Turnover matching
    const tenderTurnoverReq = tender.eligibility?.turnoverRequirement || 0;
    const vendorTurnover = vendor.annual_turnover || (vendor.industry === "Construction" ? 180000000 : 50000000); // mock turnover if empty
    let turnoverMatch = true;
    if (tenderTurnoverReq > 0) {
      turnoverMatch = vendorTurnover >= tenderTurnoverReq;
    }

    // 4. Experience matching
    const tenderExpReq = tender.eligibility?.similarExperienceYears || 0;
    const vendorExp = vendor.years_experience || (vendor.id.charCodeAt(5) % 8) + 2; // mock exp years if empty
    let experienceMatch = true;
    if (tenderExpReq > 0) {
      experienceMatch = vendorExp >= tenderExpReq;
    }

    // Scoring calculation (Weighted: Category: 30%, State: 20%, Turnover: 25%, Experience: 25%)
    let score = 0;
    if (categoryMatch) score += 30;
    if (stateMatch) score += 20;
    if (turnoverMatch) {
      score += 25;
    } else if (tenderTurnoverReq > 0) {
      // Proportional score for close match
      const ratio = vendorTurnover / tenderTurnoverReq;
      if (ratio >= 0.8) score += 15;
    }
    if (experienceMatch) {
      score += 25;
    } else if (tenderExpReq > 0) {
      const ratio = vendorExp / tenderExpReq;
      if (ratio >= 0.6) score += 10;
    }

    return {
      score: Math.min(100, score),
      categoryMatch,
      stateMatch,
      turnoverMatch,
      experienceMatch
    };
  },

  // 10. Crawler Simulator with ChatGPT extraction and Vendor Matching
  async triggerCrawlerRun(logCallback: (msg: string) => void): Promise<void> {
    const states = ['Uttar Pradesh', 'Haryana', 'Madhya Pradesh', 'Rajasthan', 'Jharkhand', 'Uttarakhand', 'Maharashtra', 'Goa', 'Bihar'];
    const codes = ['UP', 'HR', 'MP', 'RJ', 'JH', 'UT', 'MH', 'GA', 'BR'];
    
    const categories = ['Solar EPC', 'Roads & Highways', 'Water Supply', 'Civil Construction', 'Bridges', 'Sewerage', 'IT', 'Consultancy'];
    
    const rawTenderPool = [
      {
        title: "Installation of Rooftop Solar Panels on District Courts in MP",
        description: "Executing solar rooftop grid tie systems of capacity 8MW on district court buildings across Indore, Bhopal and Jabalpur. Scope includes construction of reinforced structural mounting, electrical panels integration.",
        estimatedValue: 135000000,
        turnoverReq: 50000000,
        expYears: 4,
        category: "Solar EPC",
        dept: "MPUVN",
        sector: "Solar & Renewable",
        authority: "Madhya Pradesh Urja Vikas Nigam (MPUVN)",
        stateIndex: 2
      },
      {
        title: "Construction of Drainage and Sewage Network in Ghaziabad Zone-2",
        description: "Designing, laying, testing and commission of concrete sewerage pipe framework, trenching works, and domestic pipeline linkage across Ghaziabad District. Includes 3-year initial maintenance.",
        estimatedValue: 180000000,
        turnoverReq: 60000000,
        expYears: 5,
        category: "Sewerage",
        dept: "Jal Nigam",
        sector: "Water & Sewerage",
        authority: "UP Jal Nigam",
        stateIndex: 0
      },
      {
        title: "Bridge Reconstruction over Yamuna Tributary in Faridabad",
        description: "Demolishing dilapidated brick structure bridge and executing design-and-build of prestressed concrete slab bridge including approach roads on both sides of the canal.",
        estimatedValue: 320000000,
        turnoverReq: 100000000,
        expYears: 6,
        category: "Bridges",
        dept: "Bridge Corporation",
        sector: "Roads & Infrastructure",
        authority: "Haryana State Bridge Corp",
        stateIndex: 1
      }
    ];

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    logCallback("[SYSTEM] Initializing crawler pipeline at scheduled time (crawler interval: 4 hours)...");
    await wait(800);
    logCallback("[CPPP-CONNECTOR] Connecting to Central Public Procurement Portal CPPP API endpoint...");
    await wait(800);
    logCallback("[GEM-CONNECTOR] Opening WebSocket channel to Government e-Marketplace GeM...");
    await wait(600);
    logCallback("[STATE-CONNECTOR] Scoping 9 active State e-Procurement Portals (UP, HR, MP, RJ, JH, UT, MH, GA, BR)...");
    await wait(1000);
    
    logCallback("[CRAWLER] Portals active. Fetching newly published RFPs, notices and tender notices...");
    await wait(1200);

    const randomTenderRaw = rawTenderPool[Math.floor(Math.random() * rawTenderPool.length)];
    const randNum = `GEM/2026/B/${Math.floor(100000 + Math.random() * 900000)}`;

    logCallback(`[CRAWLER] Found 1 matching active tender: "${randomTenderRaw.title}" (${randNum})`);
    await wait(800);
    logCallback(`[DOWNLOAD-ENGINE] Fetching tender PDF document and BOQ sheets...`);
    await wait(1000);
    logCallback(`[DOWNLOAD-ENGINE] Downloaded RFP_Specifications_${randNum}.pdf (4.8 MB) successfully.`);
    await wait(600);

    // Call Gemini API if Key is present
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    let briefJson: any = null;

    if (geminiKey) {
      logCallback(`[GEMINI-AI] Found VITE_GEMINI_API_KEY. Sending downloaded PDF data (mock text payload) to Gemini for summarization and eligibility modeling...`);
      try {
        const prompt = `
          Analyze the following government tender specifications and extract key details:
          Tender Number: ${randNum}
          Title: ${randomTenderRaw.title}
          Description: ${randomTenderRaw.description}
          Estimated Value: INR ${randomTenderRaw.estimatedValue}
          Turnover Requirement: INR ${randomTenderRaw.turnoverReq}
          Experience Requirement: ${randomTenderRaw.expYears} years
          Department: ${randomTenderRaw.authority}
          Category: ${randomTenderRaw.category}
          State: ${states[randomTenderRaw.stateIndex]}
          
          Respond ONLY with a valid JSON block containing:
          {
            "natureOfWork": "Brief 1 sentence description of the nature of work",
            "scope": "Summarized technical scope of the project",
            "projectCategory": "Classification category matching",
            "attractivenessScore": 85, // out of 100 based on value vs complexity
            "easeOfQualificationScore": 70, // out of 100
            "competitionRiskScore": 55, // out of 100
            "executiveBrief": "A detailed executive brief about 200-300 words containing Project Overview, Commercial Snapshot, Eligibility Snapshot, Key Risks, and Recommended Vendor Type",
            "keyRisks": ["Risk 1", "Risk 2", "Risk 3"],
            "recommendedVendorType": "General description of ideal vendor"
          }
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ]
          })
        });

        if (response.ok) {
          const resJson = await response.json();
          const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          // Clean JSON brackets in case markdown is returned
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            briefJson = JSON.parse(jsonMatch[0]);
            logCallback(`[GEMINI-AI] AI Analysis parsed successfully.`);
          }
        }
      } catch (err) {
        console.error("Gemini call in crawler failed:", err);
      }
    }

    if (!briefJson) {
      logCallback(`[GEMINI-AI] Running local NLP summarizer module (fallback mode)...`);
      await wait(1200);
      briefJson = {
        natureOfWork: `Design & engineering contract for ${randomTenderRaw.category} project.`,
        scope: `${randomTenderRaw.description} Complete supply and layout services.`,
        projectCategory: randomTenderRaw.category,
        attractivenessScore: Math.floor(75 + Math.random() * 20),
        easeOfQualificationScore: Math.floor(60 + Math.random() * 25),
        competitionRiskScore: Math.floor(40 + Math.random() * 45),
        executiveBrief: `Project Overview:\nThis project involves the execution of the ${randomTenderRaw.title} under the supervision of the ${randomTenderRaw.authority}. Works include setting up the technical framework, structural layout, installation, testing, and operation support.\n\nCommercial Snapshot:\nThe project has an estimated commercial footprint of INR ${(randomTenderRaw.estimatedValue / 10000000).toFixed(2)} Crores. EMD requirement is set at 2%.\n\nEligibility Snapshot:\nBidders require a minimum annual turnover of INR ${(randomTenderRaw.turnoverReq / 10000000).toFixed(2)} Crores and ${randomTenderRaw.expYears} years in similar works.\n\nKey Risks:\nPrimary risks stem from procurement supply-chains, local land permissions, and coordination with municipality electrical networks.\n\nRecommended Vendor Type:\nSuitable for a licensed contractor with regional operation centers.`,
        keyRisks: ["Delay in regional layout clearances", "Supply chain lead times for certified steel elements", "Local integration coordination"],
        recommendedVendorType: `Licensed Contractor in ${randomTenderRaw.category}`
      };
    }

    // 1. Duplicate detection check (Tender Number, Department, Title)
    logCallback(`[DUPLICATE-CHECKER] Querying database for Tender Number ${randNum}...`);
    await wait(600);
    
    // Check local duplicate
    const duplicateIndex = localTenders.findIndex(t => 
      t.tenderNumber === randNum || 
      (t.title === randomTenderRaw.title && t.authority === randomTenderRaw.authority)
    );

    const newTenderId = duplicateIndex >= 0 ? localTenders[duplicateIndex].id : `tnd_${Date.now()}`;
    
    const newTender: Tender = {
      id: newTenderId,
      tenderNumber: randNum,
      title: randomTenderRaw.title,
      description: randomTenderRaw.description,
      estimatedValue: randomTenderRaw.estimatedValue,
      emd: randomTenderRaw.estimatedValue * 0.02,
      tenderFee: 10000,
      performanceSecurity: "5% of contract value",
      bidValidity: "90 days",
      publishDate: new Date().toISOString(),
      preBidDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      submissionDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
      openingDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
      authority: randomTenderRaw.authority,
      location: "Local Site",
      district: "Capital District",
      stateName: states[randomTenderRaw.stateIndex],
      stateCode: codes[randomTenderRaw.stateIndex],
      categoryName: randomTenderRaw.category,
      departmentName: randomTenderRaw.dept,
      sector: randomTenderRaw.sector,
      status: "new", // starts as 'new' for admin review
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [
        { id: `doc_${Date.now()}_1`, tenderId: newTenderId, fileName: `Specifications_${randNum}.pdf`, fileUrl: "#", createdAt: new Date().toISOString() }
      ],
      aiSummary: {
        id: `ai_${Date.now()}`,
        tenderId: newTenderId,
        natureOfWork: briefJson.natureOfWork,
        scope: briefJson.scope,
        projectCategory: briefJson.projectCategory,
        attractivenessScore: briefJson.attractivenessScore,
        easeOfQualificationScore: briefJson.easeOfQualificationScore,
        competitionRiskScore: briefJson.competitionRiskScore,
        executiveBrief: briefJson.executiveBrief,
        keyRisks: briefJson.keyRisks,
        recommendedVendorType: briefJson.recommendedVendorType,
        createdAt: new Date().toISOString()
      },
      eligibility: {
        id: `elg_${Date.now()}`,
        tenderId: newTenderId,
        turnoverRequirement: randomTenderRaw.turnoverReq,
        netWorthRequirement: randomTenderRaw.turnoverReq * 0.3,
        similarExperienceYears: randomTenderRaw.expYears,
        similarExperienceDescription: `Execution of at least two ${randomTenderRaw.category} projects in the last 5 years.`,
        oemRequirements: "Standard ISO components required.",
        jvAllowed: true,
        consortiumAllowed: false,
        eligibilitySummary: `Turnover: ${(randomTenderRaw.turnoverReq / 10000000).toFixed(2)} Cr. Experience: ${randomTenderRaw.expYears} yrs. JV allowed.`,
        createdAt: new Date().toISOString()
      }
    };

    if (duplicateIndex >= 0) {
      logCallback(`[DUPLICATE-CHECKER] Duplicate found: "${randomTenderRaw.title}". Updating existing record in Database...`);
      localTenders[duplicateIndex] = newTender;
    } else {
      logCallback(`[DATABASE] Registering tender in 'tenders' table...`);
      localTenders.push(newTender);
    }
    await wait(600);

    // 2. Vendor Matching Engine run
    logCallback(`[MATCH-ENGINE] Executing matching engine against registered Vendor Profiles...`);
    await wait(800);
    
    // Clear old matches for this tender
    localMatches = localMatches.filter(m => m.tenderId !== newTenderId);
    
    // Match with database vendors or mockVendors
    const vendors = mockVendors;
    let matchCount = 0;
    
    vendors.forEach(vendor => {
      const matchResult = this.calculateMatchScore(newTender, vendor);
      
      // Store matches with score > 40%
      if (matchResult.score >= 40) {
        localMatches.push({
          id: `mtc_${newTenderId}_${vendor.id}`,
          tenderId: newTenderId,
          tenderNumber: newTender.tenderNumber,
          tenderTitle: newTender.title,
          vendorId: vendor.id,
          vendorName: vendor.companyName,
          matchScore: matchResult.score,
          categoryMatch: matchResult.categoryMatch,
          stateMatch: matchResult.stateMatch,
          turnoverMatch: matchResult.turnoverMatch,
          experienceMatch: matchResult.experienceMatch,
          createdAt: new Date().toISOString()
        });
        matchCount++;
      }
    });

    logCallback(`[MATCH-ENGINE] Successfully completed. Generated ${matchCount} matches against vendor capabilities list.`);
    await wait(600);

    // 3. Alerts Generation
    logCallback(`[ALERT-ENGINE] Scanning deadline intervals for active alerts...`);
    // Mock user profile to alert
    localAlerts.push({
      id: `alt_${Date.now()}`,
      tenderId: newTenderId,
      tenderNumber: newTender.tenderNumber,
      tenderTitle: newTender.title,
      profileId: "usr_2",
      alertType: "7_days_left",
      isRead: false,
      createdAt: new Date().toISOString()
    });
    await wait(600);
    logCallback(`[ALERT-ENGINE] Alert dispatch generated: relevant notifications scheduled for Admin & ${matchCount} matched vendors.`);

    // 4. Save to remote Supabase tables if reachable
    const supabase = getSupabaseClient();
    if (supabase) {
      logCallback(`[DATABASE] Synchronizing remote PostgreSQL database tables...`);
      try {
        // Fetch matching ids for state, department, and category
        const { data: sData } = await supabase.from('tender_states').select('id').eq('name', newTender.stateName).maybeSingle();
        const { data: cData } = await supabase.from('tender_categories').select('id').eq('name', newTender.categoryName).maybeSingle();
        const { data: dData } = await supabase.from('tender_departments').select('id').eq('name', newTender.departmentName).maybeSingle();

        const dbRecord = {
          tender_number: newTender.tenderNumber,
          title: newTender.title,
          description: newTender.description,
          department_id: dData?.id || null,
          state_id: sData?.id || null,
          category_id: cData?.id || null,
          estimated_value: newTender.estimatedValue,
          emd: newTender.emd,
          tender_fee: newTender.tenderFee,
          performance_security: newTender.performanceSecurity,
          bid_validity: newTender.bidValidity,
          publish_date: newTender.publishDate,
          pre_bid_date: newTender.preBidDate,
          submission_deadline: newTender.submissionDeadline,
          opening_date: newTender.openingDate,
          authority: newTender.authority,
          location: newTender.location,
          district: newTender.district,
          status: newTender.status
        };

        const { data: insertedTender, error: tErr } = await supabase
          .from('tenders')
          .upsert([dbRecord], { onConflict: 'tender_number' })
          .select('id')
          .single();

        if (!tErr && insertedTender) {
          const finalTndId = insertedTender.id;
          
          // Insert AI summary
          await supabase.from('tender_ai_summary').upsert([{
            tender_id: finalTndId,
            nature_of_work: newTender.aiSummary?.natureOfWork,
            scope: newTender.aiSummary?.scope,
            project_category: newTender.aiSummary?.projectCategory,
            attractiveness_score: newTender.aiSummary?.attractivenessScore,
            ease_of_qualification_score: newTender.aiSummary?.easeOfQualificationScore,
            competition_risk_score: newTender.aiSummary?.competitionRiskScore,
            executive_brief: newTender.aiSummary?.executiveBrief,
            key_risks: newTender.aiSummary?.keyRisks,
            recommended_vendor_type: newTender.aiSummary?.recommendedVendorType
          }], { onConflict: 'tender_id' });

          // Insert eligibility
          await supabase.from('tender_eligibility').upsert([{
            tender_id: finalTndId,
            turnover_requirement: newTender.eligibility?.turnoverRequirement,
            net_worth_requirement: newTender.eligibility?.netWorthRequirement,
            similar_experience_years: newTender.eligibility?.similarExperienceYears,
            similar_experience_description: newTender.eligibility?.similarExperienceDescription,
            oem_requirements: newTender.eligibility?.oemRequirements,
            jv_allowed: newTender.eligibility?.jvAllowed,
            consortium_allowed: newTender.eligibility?.consortiumAllowed,
            eligibility_summary: newTender.eligibility?.eligibilitySummary
          }], { onConflict: 'tender_id' });

          logCallback(`[DATABASE] Supabase tables synchronized successfully.`);
        }
      } catch (err) {
        logCallback(`[DATABASE] Sync notice: PostgreSQL tables write bypassed (locally cached in-memory instead).`);
      }
    }
    
    await wait(600);
    logCallback("[SYSTEM] Sync complete! Crawler pipeline sleeping. Next run in 4 hours.");
  },

  // 11. Admin helper to approve/reject a New Tender
  async updateTenderStatus(id: string, status: TenderStatus): Promise<boolean> {
    const tIdx = localTenders.findIndex(t => t.id === id);
    if (tIdx >= 0) {
      localTenders[tIdx].status = status;
      localTenders[tIdx].updatedAt = new Date().toISOString();
      
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase
            .from('tenders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id);
        } catch (err) {
          console.warn("Could not update remote tender status:", err);
        }
      }
      return true;
    }
    return false;
  }
};
