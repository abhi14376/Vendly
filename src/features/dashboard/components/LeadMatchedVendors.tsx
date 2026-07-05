import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from '@/components/ui/Modal';
import { getLeadMatchedVendors } from '@/services/leadMatchedVendorsStore';
import { opportunityService } from '@/services/opportunityService';
import { TenderMatch } from '@/types/Tender';
import { Building2, TrendingUp, CheckCircle, FileText, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LeadMatchedVendors() {
  const [matchedVendors, setMatchedVendors] = useState<TenderMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<TenderMatch | null>(null);
  const [summaryDetails, setSummaryDetails] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Basic polling to pick up changes made from Admin Dashboard without complex state sharing
    const interval = setInterval(() => {
      setMatchedVendors(getLeadMatchedVendors());
    }, 2000);
    setMatchedVendors(getLeadMatchedVendors());
    return () => clearInterval(interval);
  }, []);

  const handleViewSummary = async (match: TenderMatch) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
    setIsSummaryLoading(true);
    setSummaryDetails(null);
    try {
      const opp = await opportunityService.getOpportunityById(match.tenderId);
      setSummaryDetails(opp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
            Matched Vendors (From Admin)
          </CardTitle>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200">
            {matchedVendors.length} New
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {matchedVendors.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            No matched vendors assigned to you yet.
          </div>
        ) : (
          <div className="space-y-4">
            {matchedVendors.map((match) => (
              <div key={match.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/40 hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0 mt-1">
                    <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                      <span className="text-slate-500 font-normal mr-1">Eligible Vendor:</span>
                      {match.vendorName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      Tender: {match.tenderTitle} ({match.tenderNumber})
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {match.categoryMatch && <Badge variant="outline" className="text-[10px] py-0 h-4">Category</Badge>}
                      {match.stateMatch && <Badge variant="outline" className="text-[10px] py-0 h-4">State</Badge>}
                      {match.turnoverMatch && <Badge variant="outline" className="text-[10px] py-0 h-4">Turnover</Badge>}
                      {match.experienceMatch && <Badge variant="outline" className="text-[10px] py-0 h-4">Experience</Badge>}
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-3">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {match.matchScore}% Match
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">ID: {match.vendorId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8"
                      onClick={() => handleViewSummary(match)}
                    >
                      <FileText className="w-3 h-3 mr-1" /> Summary
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => toast.success(`Work shared successfully with ${match.vendorName}!`)}
                    >
                      <Share2 className="w-3 h-3 mr-1" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <ModalContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="text-xl">Work Report Summary</ModalTitle>
          <ModalDescription>
            {selectedMatch?.tenderTitle}
          </ModalDescription>
        </ModalHeader>
        
        <div className="mt-4 space-y-4">
          {isSummaryLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-500 text-sm">Fetching detailed summary...</p>
            </div>
          ) : summaryDetails ? (
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Description</h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                  {summaryDetails.description || summaryDetails.summary || "No description provided."}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Budget</div>
                  <div className="font-medium">₹{summaryDetails.budget?.toLocaleString('en-IN') || '0'}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">Deadline</div>
                  <div className="font-medium">{summaryDetails.deadline || 'N/A'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>Summary report not found for this work.</p>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  </>
  );
}
