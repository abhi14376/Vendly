import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, 
  Settings, Edit3, Save, 
  X, Loader2, Download, FileDown, Copy, ArrowLeft, Check, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { opportunityService } from '@/services/opportunityService';
import { geminiService } from '@/services/geminiService';
import { Opportunity } from '@/types/Opportunity';

const SYSTEM_PROMPT = `Role: You are an expert Construction Project Manager and Procurement Analyst. Your task is to analyze uploaded tender documents, Technical Specifications, and Bill of Quantities (BOQ) files.

Objective: Generate a comprehensive, highly structured work summary designed to give prospective vendors a complete, unambiguous understanding of the project scope, financial scale, and mandatory deliverables.

Output Structure & Requirements:
Organize your response using the following exact Markdown headings and extract the corresponding data:

### 1. Project Overview
Extract the exact project name, reference number, client name, and location.

### 2. Financial & Commercial Details
Extract the estimated cost, EMD, tender fees, and performance guarantees.

### 3. Critical Dates & Timelines
Extract submission deadlines, pre-bid meetings, and the total execution period.

### 4. Eligibility & Pre-Qualification
Extract financial turnover requirements, past experience criteria, and mandatory certifications.

### 5. Scope of Work
Provide a concise breakdown of the main deliverables and operational requirements.

### 6. Special Conditions
Extract penalty clauses, warranty periods, and joint venture rules.

Strict Constraints:
- Zero Hallucination: Rely only on the provided text. If a piece of information (like a budget or specific equipment capacity) is not in the text, state "Not specified in the provided documents."
- Precision: Extract exact monetary values, dimensions, and technical capacities. Do not round or summarize numbers.
- Formatting: Use clean Markdown with bullet points for maximum scannability. Avoid dense, unbroken paragraphs.`;

const parseItalicText = (text: string) => {
  if (!text) return "";
  const italicParts = text.split(/\*([\s\S]*?)\*/g);
  return italicParts.map((part, index) => {
    if (index % 2 === 1) {
      return <em key={`i-${index}`} className="italic text-slate-800 dark:text-slate-200">{part}</em>;
    }
    return part;
  });
};

const parseMarkdownText = (text: string) => {
  if (!text) return "";
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  return parts.flatMap((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={`b-${index}`} className="font-bold text-slate-900 dark:text-slate-100">
          {parseItalicText(part)}
        </strong>
      );
    }
    return parseItalicText(part);
  });
};

const renderMarkdownSummary = (text: string) => {
  if (!text) return null;
  return (
    <div className="space-y-6">
      {text.split('\n\n').map((paragraph, idx) => {
        if (paragraph.startsWith('### ')) {
          const lines = paragraph.split('\n');
          const heading = lines[0].replace('### ', '');
          const contentLines = lines.slice(1).filter(line => line.trim() !== "");
          return (
            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">{heading}</h3>
              {contentLines.length > 0 && (
                <ul className="list-disc pl-5 space-y-1.5">
                  {contentLines.map((line, lIdx) => {
                    let cleanLine = line.trim();
                    while (cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || cleanLine.startsWith('• ')) {
                      cleanLine = cleanLine.substring(2).trim();
                    }
                    return (
                      <li key={lIdx} className="text-sm md:text-base text-slate-700 dark:text-slate-300">
                        {parseMarkdownText(cleanLine)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        }
        return (
          <p key={idx} className="text-sm md:text-base text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-300">
            {parseMarkdownText(paragraph)}
          </p>
        );
      })}
    </div>
  );
};

export function CreateOpportunityPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('UPLOAD'); 
  
  const [files, setFiles] = useState<File[]>([]);
  const [industryType, setIndustryType] = useState('Tender');
  
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Handle File Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let uploadedFiles: File[] = [];
    if ('dataTransfer' in e) {
      uploadedFiles = Array.from(e.dataTransfer?.files || []);
    } else {
      uploadedFiles = Array.from(e.target.files || []);
    }
    
    if (uploadedFiles.length > 0) {
      setFiles((prev) => [...prev, ...uploadedFiles]);
    }
  };

  const handleSubmitUploads = async () => {
    if (files.length === 0) {
      alert("Please upload at least one document.");
      return;
    }
    setStep('PROCESSING');
    
    try {
      const summaryText = await geminiService.extractOpportunityDetails(files, SYSTEM_PROMPT);
      
      const cleanTitle = files[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
      
      // Parse out basic details from the text if possible (rudimentary parsing)
      const extractField = (regex: RegExp) => {
        const match = summaryText.match(regex);
        return match ? match[1].trim() : "";
      };

      const cleanMarkdownValue = (val: string) => {
        return val.replace(/\*\*/g, '').replace(/^[-\*\s•:]+/, '').trim();
      };

      // Let's search line-by-line for robust matches
      const lines = summaryText.split('\n');
      let clientName = "";
      let location = "";
      let budgetStr = "";
      let deadlineStr = "";
      let emdAmountStr = "";
      let emdRequiredVal = false;

      for (const line of lines) {
        const trimmed = line.trim();
        // Client Name Match
        if (!clientName && /client name|authority|tendering authority|client/i.test(trimmed)) {
          const match = trimmed.match(/(?:client name|authority|tendering authority|client)[\s*:]+(.*)/i);
          if (match) clientName = cleanMarkdownValue(match[1]);
        }
        // Location Match
        if (!location && /location|state/i.test(trimmed)) {
          const match = trimmed.match(/(?:location|state)[\s*:]+(.*)/i);
          if (match) location = cleanMarkdownValue(match[1]);
        }
        // Budget Match (excluding EMD, Turnover)
        if (!budgetStr && /estimated cost|tender cost|tender value|budget|value|cost/i.test(trimmed) && !/emd|turnover|fee/i.test(trimmed)) {
          const match = trimmed.match(/(?:estimated cost|tender cost|tender value|budget|value|cost)[\s*:]+(.*)/i);
          if (match) budgetStr = cleanMarkdownValue(match[1]);
        }
        // Deadline Match
        if (!deadlineStr && /submission deadline|deadline|last date|due date|closing date/i.test(trimmed)) {
          const match = trimmed.match(/(?:submission deadline|deadline|last date|due date|closing date)[\s*:]+(.*)/i);
          if (match) deadlineStr = cleanMarkdownValue(match[1]);
        }
        // EMD Match
        if (!emdAmountStr && /emd|earnest money/i.test(trimmed) && !/required|fee/i.test(trimmed)) {
          const match = trimmed.match(/(?:emd|earnest money|deposit)[\s*:]+(.*)/i);
          if (match) emdAmountStr = cleanMarkdownValue(match[1]);
        }
      }

      // Fallback to regex if line-by-line didn't capture it (using correct single-backslash patterns)
      if (!clientName) clientName = extractField(/client name[\*:]+(.*?)(?:\n|$)/i);
      if (!location) location = extractField(/location[\*:]+(.*?)(?:\n|$)/i);
      if (!budgetStr) budgetStr = extractField(/cost[\*:]+.*?₹?([\d,]+)/i);
      if (!deadlineStr) deadlineStr = extractField(/submission deadline[\*:]+(.*?)(?:\n|$)/i);
      if (!emdAmountStr) emdAmountStr = extractField(/emd[\*:]+.*?₹?([\d,]+)/i);

      // Clean values
      clientName = cleanMarkdownValue(clientName);
      location = cleanMarkdownValue(location);
      deadlineStr = cleanMarkdownValue(deadlineStr);
      budgetStr = cleanMarkdownValue(budgetStr);
      emdAmountStr = cleanMarkdownValue(emdAmountStr);

      // Parse numeric budget
      let parsedBudget = 0;
      if (budgetStr) {
        // Remove currency symbols, commas, spaces
        const numOnly = budgetStr.replace(/[^\d.]/g, '');
        parsedBudget = Number(numOnly) || 0;
        
        // Handle Crore/Lakh scaling
        if (/crore/i.test(budgetStr)) {
          parsedBudget *= 10000000;
        } else if (/lakh/i.test(budgetStr)) {
          parsedBudget *= 100000;
        }
      }

      // Parse EMD Amount
      let parsedEmdAmount = 0;
      if (emdAmountStr) {
        const numOnly = emdAmountStr.replace(/[^\d.]/g, '');
        parsedEmdAmount = Number(numOnly) || 0;
        if (/crore/i.test(emdAmountStr)) {
          parsedEmdAmount *= 10000000;
        } else if (/lakh/i.test(emdAmountStr)) {
          parsedEmdAmount *= 100000;
        }
        
        if (parsedEmdAmount > 0) {
          emdRequiredVal = true;
        }
      }

      // Check if EMD is mentioned as required in general text
      if (!emdRequiredVal) {
        const emdLower = summaryText.toLowerCase();
        if (emdLower.includes('emd') && 
            !emdLower.includes('no emd') && 
            !emdLower.includes('emd not required') && 
            !emdLower.includes('emd: not specified') && 
            !emdLower.includes('emd: na')) {
          emdRequiredVal = true;
        }
      }

      // Date parsing helper to convert standard/Indian/relative date formats to YYYY-MM-DD
      let parsedDeadline = "";
      if (deadlineStr) {
        // Try parsing directly
        const dateObj = new Date(deadlineStr);
        if (!isNaN(dateObj.getTime())) {
          parsedDeadline = dateObj.toISOString().split('T')[0];
        } else {
          // Try matching dd-mm-yyyy or dd/mm/yyyy
          const dmyMatch = deadlineStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
          if (dmyMatch) {
            const day = dmyMatch[1].padStart(2, '0');
            const month = dmyMatch[2].padStart(2, '0');
            const year = dmyMatch[3];
            parsedDeadline = `${year}-${month}-${day}`;
          }
        }
      }
      if (!parsedDeadline) {
        parsedDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default: 30 days from now
      }

      // Extract lists using correct single backslash \n
      const scopeBlock = summaryText.split('### 5. Scope of Work')[1]?.split('###')[0] || '';
      const scopeItems = scopeBlock.split('\n')
        .map(l => l.trim())
        .filter(l => l.startsWith('-') || l.startsWith('*') || l.startsWith('•'))
        .map(l => l.replace(/^[-*•\s]+/, '').trim())
        .filter(Boolean);

      const eligibilityBlock = summaryText.split('### 4. Eligibility & Pre-Qualification')[1]?.split('###')[0] || '';
      const eligibilityItems = eligibilityBlock.split('\n')
        .map(l => l.trim())
        .filter(l => l.startsWith('-') || l.startsWith('*') || l.startsWith('•'))
        .map(l => l.replace(/^[-*•\s]+/, '').trim())
        .filter(Boolean);

      setExtractedData({
        title: `${industryType} Requirements: ${cleanTitle}`,
        summary: summaryText,
        authorityName: clientName || "Tendering Authority",
        stateLocationName: location || "Location Not Found",
        budget: parsedBudget,
        keyWorkComponents: scopeItems.length > 0 ? scopeItems : ["Not successfully parsed from text"],
        eligibilityCriteria: eligibilityItems.length > 0 ? eligibilityItems : ["Not successfully parsed from text"],
        deadline: parsedDeadline,
        emdRequired: emdRequiredVal,
        emdAmount: parsedEmdAmount,
        royaltyRequired: false,
        royaltyPercentage: 0,
        wonRateStatus: "Below",
        wonRatePercentage: 0,
        additionalInput: "",
        keyActions: ["Review technical drawings", "Prepare financial bid", "Submit documents"]
      });
      
      setStep('REPORT');
    } catch (error: any) {
      console.error(error);
      alert(`AI Extraction Failed: ${error.message}\n\nYou can still proceed to enter the opportunity details manually.`);
      
      const cleanTitle = files[0]?.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') || "New Opportunity";
      
      setExtractedData({
        title: `${industryType} Requirements: ${cleanTitle}`,
        summary: "No summary extracted. Please enter the description and details manually.",
        authorityName: "",
        stateLocationName: "",
        budget: 0,
        keyWorkComponents: [""],
        eligibilityCriteria: [""],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        emdRequired: false,
        emdAmount: 0,
        royaltyRequired: false,
        royaltyPercentage: 0,
        wonRateStatus: "Below",
        wonRatePercentage: 0,
        additionalInput: "",
        keyActions: ["Review technical drawings", "Prepare financial bid", "Submit documents"]
      });
      setIsEditing(true);
      setStep('REPORT');
    }
  };

  const handleListChange = (field: string, value: string) => {
    setExtractedData({ ...extractedData, [field]: value.split('\n') });
  };

  const handleCreateOpportunity = async () => {
    if (!extractedData) return;
    setIsSaving(true);
    
    const newOpportunity: Partial<Opportunity> = {
      title: extractedData.title,
      summary: extractedData.summary,
      description: extractedData.summary,
      industryType,
      budget: Number(extractedData.budget) || 0,
      deadline: extractedData.deadline,
      
      authorityName: extractedData.authorityName,
      stateLocationName: extractedData.stateLocationName,
      keyWorkComponents: extractedData.keyWorkComponents,
      eligibilityCriteria: extractedData.eligibilityCriteria,
      
      emdRequired: industryType === 'Tender' ? extractedData.emdRequired : false,
      emdAmount: industryType === 'Tender' ? Number(extractedData.emdAmount) : 0,
      
      royaltyRequired: industryType === 'Back to Back' ? extractedData.royaltyRequired : false,
      royaltyPercentage: industryType === 'Back to Back' ? Number(extractedData.royaltyPercentage) : 0,
      wonRateStatus: industryType === 'Back to Back' ? extractedData.wonRateStatus : undefined,
      wonRatePercentage: industryType === 'Back to Back' ? Number(extractedData.wonRatePercentage) : undefined,
      
      additionalInput: extractedData.additionalInput,
      keyActions: extractedData.keyActions,
      status: "Published"
    };

    const { data: saved, error } = await opportunityService.createOpportunity(newOpportunity, files);
    
    setIsSaving(false);
    if (saved) {
      setIsSaved(true);
      setTimeout(() => navigate('/admin/opportunities'), 2000);
    } else {
      alert(`Failed to create opportunity. Error: ${error}`);
    }
  };

  // --- RENDERERS ---

  const renderUpload = () => (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-8">
         <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
           <ArrowLeft className="h-4 w-4 mr-2" /> Back
         </Button>
      </div>

      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">Create New Opportunity</h2>
      
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        
        {/* Step 1: Select Industry */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">1. Select Industry</label>
          <select 
            className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            value={industryType}
            onChange={(e) => setIndustryType(e.target.value)}
          >
            <option value="Tender">Tender</option>
            <option value="Back to Back">Back to Back</option>
          </select>
        </div>

        {/* Step 2: Upload Documents */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">2. Upload Documents</label>
          <div 
            className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-xl p-8 text-center bg-indigo-50/30 dark:bg-slate-800/30 hover:bg-indigo-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">Click to upload files</p>
            <p className="text-xs text-indigo-500/70 mt-1">or drag and drop them here</p>
            
            <input 
              id="file-upload" 
              type="file" 
              multiple
              className="hidden" 
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip" 
              onChange={handleDrop} 
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attached Files ({files.length})</h4>
              <ul className="space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                    {f.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between">
           <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
           >
              <Plus className="w-4 h-4 mr-2" /> Add More
           </Button>
           <Button
              onClick={handleSubmitUploads}
              disabled={files.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
           >
              Submit & Extract
           </Button>
        </div>

      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="max-w-xl mx-auto mt-24 text-center px-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 break-all">Analyzing {files[0]?.name || 'Documents'}...</h3>
      <p className="text-slate-500 dark:text-slate-400">Extracting requirements for {industryType} and structuring data.</p>
      
      <div className="mt-8 space-y-3 text-left bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center text-green-600 dark:text-green-400"><CheckCircle className="w-5 h-5 mr-3" /> Reading all files...</div>
        <div className="flex items-center text-green-600 dark:text-green-400"><CheckCircle className="w-5 h-5 mr-3" /> Extracting {industryType} variables...</div>
        <div className="flex items-center text-indigo-600 dark:text-indigo-400 animate-pulse"><Settings className="w-5 h-5 mr-3" /> Building review report...</div>
      </div>
    </div>
  );

  const ReportContent = () => (
    <div id="report-content" className="bg-white dark:bg-slate-900 p-6 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200">
      <div className="border-b-2 border-indigo-600 pb-6 mb-8">
        <h4 className="text-indigo-600 font-bold uppercase tracking-wider text-xs md:text-sm mb-1">{industryType} Opportunity Report</h4>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">{extractedData.title}</h1>
      </div>

      {/* Basic Summary */}
      <div className="mb-8">
        <h2 className="text-md md:text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 uppercase text-slate-700 dark:text-slate-300">Detailed Work Summary</h2>
        {renderMarkdownSummary(extractedData.summary)}
      </div>

      {/* Specific Data Grid */}
      <div className="mb-8">
        <h2 className="text-md md:text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 uppercase text-slate-700 dark:text-slate-300">Project Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">{industryType === 'Tender' ? 'Tendering Authority' : 'Work Subletting Authority'}</div>
            <div className="font-semibold text-indigo-700 dark:text-indigo-400">{extractedData.authorityName}</div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">{industryType === 'Tender' ? 'State Name' : 'Location Name'}</div>
            <div className="font-semibold">{extractedData.stateLocationName}</div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total {industryType === 'Tender' ? 'Tender' : 'Work'} Value</div>
            <div className="font-semibold">{extractedData.budget ? `₹ ${extractedData.budget.toLocaleString('en-IN')}` : 'NA'}</div>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Last Date of Submission</div>
            <div className="font-semibold">{extractedData.deadline}</div>
          </div>

          {industryType === 'Tender' && (
            <>
              <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">EMD Required</div>
                <div className="font-semibold">{extractedData.emdRequired ? 'Yes' : 'No'}</div>
              </div>
              {extractedData.emdRequired && (
                <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">EMD Amount (INR)</div>
                  <div className="font-semibold">₹ {extractedData.emdAmount?.toLocaleString('en-IN') || 0}</div>
                </div>
              )}
            </>
          )}

          {industryType === 'Back to Back' && (
            <>
              <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Royalty Required</div>
                <div className="font-semibold">{extractedData.royaltyRequired ? `Yes (${extractedData.royaltyPercentage}%)` : 'No'}</div>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-white dark:bg-slate-900">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Won Rate Status</div>
                <div className="font-semibold">{extractedData.wonRateStatus} ({extractedData.wonRatePercentage}%)</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <h2 className="text-md md:text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 uppercase text-slate-700 dark:text-slate-300">Key Work Components</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300">
              {extractedData.keyWorkComponents.map((i: string, idx: number) => i.trim() && <li key={idx}>{i}</li>)}
            </ul>
        </div>
        <div>
            <h2 className="text-md md:text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 uppercase text-slate-700 dark:text-slate-300">Eligibility Criteria</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-300">
              {extractedData.eligibilityCriteria.map((i: string, idx: number) => i.trim() && <li key={idx}>{i}</li>)}
            </ul>
        </div>
      </div>

      {extractedData.additionalInput && (
        <div className="mb-8">
          <h2 className="text-md md:text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 uppercase text-indigo-600 flex items-center">
             Additional Requirements
          </h2>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 md:p-5 rounded-lg border border-indigo-100 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 whitespace-pre-wrap">
              {extractedData.additionalInput}
          </div>
        </div>
      )}

      {/* Third Section: Key Actions */}
      <div className="mb-8">
        <h2 className="text-md md:text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 uppercase text-amber-600 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2"/> Key Actions for Vendor
        </h2>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 md:p-5 rounded-lg border border-amber-100 dark:border-amber-800 text-amber-900 dark:text-amber-200">
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
              {extractedData.keyActions.map((i: string, idx: number) => i.trim() && <li key={idx}>{i}</li>)}
            </ul>
        </div>
      </div>

    </div>
  );

  const renderReport = () => (
    <div className="max-w-4xl mx-auto mt-6 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-slate-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-400 flex-shrink-0"/> Extracted Information
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex-1 md:flex-none border-none text-sm font-medium ${isEditing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
          >
            {isEditing ? <><Save className="w-4 h-4 mr-2"/> Save Edits</> : <><Edit3 className="w-4 h-4 mr-2"/> Edit Content</>}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg text-indigo-800 dark:text-indigo-300 text-sm mb-6 flex items-start">
            <Edit3 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" /> 
            <span>You are in edit mode. Make adjustments to the AI extracted data below.</span>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
            <input className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.title} onChange={e => setExtractedData({...extractedData, title: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Summary</label>
            <textarea className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg h-32" value={extractedData.summary} onChange={e => setExtractedData({...extractedData, summary: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{industryType === 'Tender' ? 'Tendering Authority' : 'Work Subletting Authority'}</label>
              <input className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.authorityName} onChange={e => setExtractedData({...extractedData, authorityName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{industryType === 'Tender' ? 'State Name' : 'Location Name'}</label>
              <input className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.stateLocationName} onChange={e => setExtractedData({...extractedData, stateLocationName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Value (Budget)</label>
              <input type="number" className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.budget} onChange={e => setExtractedData({...extractedData, budget: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Date of Submission</label>
              <input type="date" className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.deadline} onChange={e => setExtractedData({...extractedData, deadline: e.target.value})} />
            </div>
          </div>

          {industryType === 'Tender' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">EMD Required?</label>
                  <select className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.emdRequired ? "Yes" : "No"} onChange={e => setExtractedData({...extractedData, emdRequired: e.target.value === "Yes"})}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
               </div>
               {extractedData.emdRequired && (
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">EMD Amount (INR)</label>
                    <input type="number" className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.emdAmount} onChange={e => setExtractedData({...extractedData, emdAmount: e.target.value})} />
                 </div>
               )}
            </div>
          )}

          {industryType === 'Back to Back' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Royalty Required?</label>
                   <select className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.royaltyRequired ? "Yes" : "No"} onChange={e => setExtractedData({...extractedData, royaltyRequired: e.target.value === "Yes"})}>
                     <option value="Yes">Yes</option>
                     <option value="No">No</option>
                   </select>
                </div>
                {extractedData.royaltyRequired && (
                  <div>
                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Royalty %</label>
                     <input type="number" className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.royaltyPercentage} onChange={e => setExtractedData({...extractedData, royaltyPercentage: e.target.value})} />
                  </div>
                )}
                <div>
                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Won Rate Status</label>
                   <select className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.wonRateStatus} onChange={e => setExtractedData({...extractedData, wonRateStatus: e.target.value})}>
                     <option value="Below">Below</option>
                     <option value="Above">Above</option>
                     <option value="At Par">At Par</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Won Rate %</label>
                   <input type="number" className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg" value={extractedData.wonRatePercentage} onChange={e => setExtractedData({...extractedData, wonRatePercentage: e.target.value})} />
                </div>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Work Components (One per line)</label>
              <textarea className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg h-32" value={extractedData.keyWorkComponents.join('\n')} onChange={e => handleListChange('keyWorkComponents', e.target.value)} />
            </div>
             <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Eligibility Criteria (One per line)</label>
              <textarea className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg h-32" value={extractedData.eligibilityCriteria.join('\n')} onChange={e => handleListChange('eligibilityCriteria', e.target.value)} />
            </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Additional Input</label>
             <textarea className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 rounded-lg h-24" placeholder="Any additional requirements for better clarity..." value={extractedData.additionalInput} onChange={e => setExtractedData({...extractedData, additionalInput: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-700 dark:text-amber-500 mb-1">Key Actions (One per line)</label>
            <textarea className="w-full p-3 border border-amber-300 dark:border-amber-700/50 rounded-lg h-32 bg-amber-50 dark:bg-amber-900/20" value={extractedData.keyActions.join('\n')} onChange={e => handleListChange('keyActions', e.target.value)} />
          </div>
          
        </div>
      ) : (
        <ReportContent />
      )}

      {/* FINAL PUBLISH SECTION */}
      {!isEditing && (
        <div className="mt-8 flex justify-end">
           <Button
              size="lg"
              onClick={handleCreateOpportunity}
              disabled={isSaving || isSaved}
              className={`${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white font-bold w-full md:w-auto shadow-xl`}
           >
              {isSaving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing...</> 
                : isSaved ? <><Check className="w-5 h-5 mr-2"/> Published!</> 
                : <><CheckCircle className="w-5 h-5 mr-2" /> Publish this Opportunity</>}
           </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {step === 'UPLOAD' && renderUpload()}
      {step === 'PROCESSING' && renderProcessing()}
      {step === 'REPORT' && renderReport()}
    </div>
  );
}
