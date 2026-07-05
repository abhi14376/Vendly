import { getSupabaseClient } from '@/lib/supabase';
import { Opportunity, OpportunityDocument } from '@/types/Opportunity';
import { tenderService } from './tenderService';
import { getLocalOpportunities, addLocalOpportunity } from './localOpportunityStore';

export const opportunityService = {
  async getOpportunities(): Promise<Opportunity[]> {
    const supabase = getSupabaseClient();
    let standardOpps: Opportunity[] = [];
    
    if (supabase) {
      try {
        // Fetch opportunities and their associated documents
        const { data, error } = await supabase
          .from('opportunities')
          .select('*, opportunity_documents(*)')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          standardOpps = data.map(mapToOpportunity);
        }
      } catch (err) {
        console.warn("Could not query opportunities in Supabase:", err);
      }
    }
    
    // Fetch active/approved tenders from tenderService
    const activeTenders = await tenderService.getTenders('active');
    const mappedTenders = activeTenders.map(mapTenderToOpportunity);
    
    // Retrieve manual in-memory opportunities
    const localOpps = getLocalOpportunities();
    
    // Return merged lists sorted by created date
    return [...mappedTenders, ...standardOpps, ...localOpps].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    if (id && id.startsWith('tnd_')) {
      const tender = await tenderService.getTenderById(id);
      if (!tender) return null;
      return mapTenderToOpportunity(tender);
    }

    // Try finding in local store first
    const localOpp = getLocalOpportunities().find(o => o.id === id);
    if (localOpp) return localOpp;

    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('opportunities')
      .select('*, opportunity_documents(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching opportunity:', error);
      return null;
    }

    return mapToOpportunity(data);
  },

  async createOpportunity(opportunity: Partial<Opportunity>, files?: File[]): Promise<{ data: Opportunity | null, error: string | null }> {
    const supabase = getSupabaseClient();
    let userId: string | undefined;
    if (supabase) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        userId = userData.user?.id;
      } catch (err) {
        console.warn("Could not fetch user session.", err);
      }
    }

    if (!supabase || !userId) {
      if (supabase && !userId) {
        console.warn("No Supabase session found. Falling back to local memory storage for demo purposes.");
      }
      const newId = `opp_${Date.now()}`;
      
      const mappedDocs: OpportunityDocument[] = files ? files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      })) : [];

      const newOpp: Opportunity = {
        id: newId,
        title: opportunity.title || "Untitled Opportunity",
        description: opportunity.description || opportunity.summary || "",
        status: opportunity.status || "Published",
        budget: opportunity.budget || 0,
        deadline: opportunity.deadline || new Date().toISOString(),
        applicationsCount: opportunity.applicationsCount || 0,
        createdAt: new Date().toISOString(),
        category: opportunity.category || opportunity.industryType || 'General',
        location: opportunity.location || opportunity.stateLocationName || 'Remote',
        projectType: opportunity.projectType || 'tender',
        awardDate: opportunity.awardDate,
        royaltyPercentage: opportunity.royaltyPercentage,
        recommendedSize: opportunity.recommendedSize,
        minYearsExp: opportunity.minYearsExp,
        financialStrength: opportunity.financialStrength,
        coreExpertise: opportunity.coreExpertise || [],
        techKnowHow: opportunity.techKnowHow || [],
        redFlags: opportunity.redFlags || [],
        questionsForVendor: opportunity.questionsForVendor || [],
        summary: opportunity.summary || "",
        documents: mappedDocs,
        industryType: opportunity.industryType,
        authorityName: opportunity.authorityName || "",
        stateLocationName: opportunity.stateLocationName || "",
        keyWorkComponents: opportunity.keyWorkComponents || [],
        eligibilityCriteria: opportunity.eligibilityCriteria || [],
        emdRequired: opportunity.emdRequired || false,
        emdAmount: opportunity.emdAmount || 0,
        royaltyRequired: opportunity.royaltyRequired || false,
        wonRateStatus: opportunity.wonRateStatus,
        wonRatePercentage: opportunity.wonRatePercentage,
        additionalInput: opportunity.additionalInput,
        keyActions: opportunity.keyActions || [],
      };

      addLocalOpportunity(newOpp);
      return { data: newOpp, error: null };
    }

    if (supabase && userId) {
      // Ensure the user's profile exists to satisfy the foreign key constraint
      await supabase.from('profiles').upsert({ 
        id: userId, 
        role: 'lead' 
      }, { onConflict: 'id' });
    }

    const { data: oppData, error: oppError } = await supabase
      .from('opportunities')
      .insert([mapToDatabase(opportunity, userId as string)])
      .select()
      .single();

    if (oppError) {
      console.error('Error creating opportunity:', oppError);
      return { data: null, error: oppError.message || JSON.stringify(oppError) };
    }

    // 2. If there are files, upload them and link to the opportunity
    if (files && files.length > 0) {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${oppData.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          // Continue anyway since opportunity is created
        } else {
          // Get the public URL for the file
          const { data: publicUrlData } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

          // Insert into opportunity_documents
          await supabase
            .from('opportunity_documents')
            .insert([{
              opportunity_id: oppData.id,
              file_name: file.name,
              fileUrl: publicUrlData.publicUrl,
              mime_type: file.type
            }]);
        }
      }
    }

    // Fetch the newly created opportunity with its documents
    const { data: finalData, error: finalError } = await supabase
      .from('opportunities')
      .select('*, opportunity_documents(*)')
      .eq('id', oppData.id)
      .single();

    if (finalError) return { data: mapToOpportunity(oppData), error: null };
    
    return { data: mapToOpportunity(finalData), error: null };
  }
};

function mapToOpportunity(dbRecord: any): Opportunity {
  let uiStatus = dbRecord.status;
  if (uiStatus === 'Draft') uiStatus = 'Published'; // Mapping draft/open

  let mappedDocuments: OpportunityDocument[] = [];
  if (dbRecord.opportunity_documents && Array.isArray(dbRecord.opportunity_documents)) {
    mappedDocuments = dbRecord.opportunity_documents.map((doc: any) => ({
      name: doc.file_name,
      url: doc.file_url,
      size: "Uploaded File"
    }));
  }

  const reqs = dbRecord.requirements || {};

  return {
    id: dbRecord.id,
    title: dbRecord.title,
    description: dbRecord.description,
    status: uiStatus,
    budget: parseInt(dbRecord.budget || "0", 10) || 0,
    deadline: dbRecord.deadline || new Date().toISOString(),
    applicationsCount: reqs.applicationsCount || 0,
    createdAt: dbRecord.created_at,
    category: dbRecord.industry || 'General',
    location: dbRecord.location || 'Remote',
    projectType: dbRecord.work_type || 'tender',
    documents: mappedDocuments,
    industryType: dbRecord.industry,
    authorityName: dbRecord.publisher,
    ...reqs // spread the rest of the metadata stored in requirements
  };
}

function mapToDatabase(opp: Partial<Opportunity>, leadId: string): any {
  let dbStatus: string = opp.status || 'Draft';
  if (dbStatus === 'Published') dbStatus = 'Open';

  // Store all the extra fields in the JSONB requirements column
  const { title, description, summary, status, budget, deadline, category, industryType, location, stateLocationName, authorityName, projectType, documents, ...extraFields } = opp;

  return {
    title: title || 'Untitled',
    publisher: authorityName || 'Unknown',
    industry: industryType || category || 'General',
    location: location || stateLocationName || 'Remote',
    budget: (budget || 0).toString(),
    work_type: projectType || 'tender',
    status: dbStatus,
    description: description || summary || '',
    deadline: deadline || new Date().toISOString(),
    // Disabled to bypass missing profiles foreign key constraint
    // lead_id: leadId,
    requirements: extraFields,
  };
}

function mapTenderToOpportunity(t: any): Opportunity {
  return {
    id: t.id,
    title: t.title,
    description: t.description || t.aiSummary?.executiveBrief || '',
    status: 'Open',
    budget: t.estimatedValue || 0,
    deadline: t.submissionDeadline,
    applicationsCount: 0,
    createdAt: t.createdAt,
    category: t.categoryName || 'General',
    location: t.location || 'Remote',
    projectType: 'tender',
    awardDate: t.awards?.awardDate || t.openingDate || undefined,
    royaltyPercentage: undefined,
    recommendedSize: t.aiSummary?.recommendedVendorType,
    minYearsExp: t.eligibility?.similarExperienceYears,
    financialStrength: undefined,
    coreExpertise: t.aiSummary?.keyRisks || [],
    techKnowHow: [],
    redFlags: t.aiSummary?.keyRisks || [],
    questionsForVendor: [],
    summary: t.aiSummary?.executiveBrief,
    documents: t.documents?.map((d: any) => ({
      name: d.fileName,
      url: d.fileUrl,
      size: d.fileSize || '1.0 MB'
    })) || [],
    industryType: t.categoryName,
    authorityName: t.authority,
    stateLocationName: t.stateName,
    keyWorkComponents: t.aiSummary?.scope ? [t.aiSummary.scope] : [],
    eligibilityCriteria: t.eligibility?.eligibilitySummary ? [t.eligibility.eligibilitySummary] : [],
    emdRequired: t.emd > 0,
    emdAmount: t.emd,
    royaltyRequired: false,
    wonRateStatus: undefined,
    wonRatePercentage: undefined,
    additionalInput: undefined,
    keyActions: t.aiSummary?.keyRisks || [],
    tenderFee: t.tenderFee,
    performanceSecurity: t.performanceSecurity,
    publishDate: t.publishDate,
    preBidDate: t.preBidDate,
    openingDate: t.openingDate,
    bidValidity: t.bidValidity,
    turnoverRequirement: t.eligibility?.turnoverRequirement,
    netWorthRequirement: t.eligibility?.netWorthRequirement,
    oemRequirements: t.eligibility?.oemRequirements,
    jvAllowed: t.eligibility?.jvAllowed,
    consortiumAllowed: t.eligibility?.consortiumAllowed
  };
}
