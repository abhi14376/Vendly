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

import { getLocalOpportunities } from './localOpportunityStore';
import { Opportunity } from '@/types/Opportunity';

// Fallback in-memory store in case database tables are not ready or connection fails
let localTenders: Tender[] = [];
let localMatches: TenderMatch[] = [];
let localAlerts: TenderAlert[] = [];
let localCorrigenda: TenderCorrigendum[] = [];
let localAwards: TenderAward[] = [];

// Seed some initial high quality mock data in memory so the app is loaded on first visit
const initialMockTenders: Tender[] = [];
// Initialize local store
localTenders = [...initialMockTenders];

// Generate local mock matches
const generateInitialMockMatches = () => [];
localMatches = [];
// Seed awards
localAwards = [];
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
  calculateMatchScore(tender: Tender, vendor: any | any): {
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
    const vendorStateFallback = vendor.location?.split(',')[1]?.trim();
    const vendorStates = vendor.operating_states || (vendorStateFallback ? [vendorStateFallback] : []);
    const stateMatch = vendorStates.some((s: string) => s && (s.toLowerCase() === tenderState.toLowerCase() || s.toLowerCase() === tender.stateCode?.toLowerCase()));

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
