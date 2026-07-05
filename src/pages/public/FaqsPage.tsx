import { useState } from "react";
import { ChevronDown, ChevronUp, Search, CircleHelp } from "lucide-react";
import { Input } from "@/components/ui/Input";

export function FaqsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "General",
      question: "What is BidTracker?",
      answer: "BidTracker is a verification-first B2B marketplace that connects companies looking to award project subcontracts or tenders (Leads) with qualified, vetted service providers (Vendors)."
    },
    {
      category: "Verification",
      question: "How does the verification process work?",
      answer: "All profiles registered on BidTracker are manually verified by platform administrators. Leads must upload corporate documentation (like GSTIN certificates) and verify their company domains, while Vendors submit certifications, company profiles, and experience files to ensure maximum safety and trust."
    },
    {
      category: "Opportunities",
      question: "What is the difference between a 'Tender' and a 'Back-to-Back' project?",
      answer: "Tenders are formal opportunities with strict deadlines, structured Bill of Quantities (BOQ), and standardized RFPs. Back-to-Back projects are subcontracts awarded directly to vendors, often structured around specific win percentages, subcontract royalty rates, and custom delivery timelines."
    },
    {
      category: "Opportunities",
      question: "Who can publish opportunities on BidTracker?",
      answer: "Only verified Leads and platform Administrators are allowed to publish projects. This guarantees that all active opportunities on BidTracker are legitimate, funded, and ready for execution."
    },
    {
      category: "Security & Privacy",
      question: "Are our uploaded documents safe?",
      answer: "Yes. BidTracker utilizes Supabase storage bucket policies and Row Level Security (RLS). This ensures that only authorized administrators and the respective bidders can see submitted opportunity documents and proposals."
    },
    {
      category: "Bidding & Communication",
      question: "How do I communicate with vendors regarding a project?",
      answer: "BidTracker provides a central Query system. Leads can view questions submitted by vendors for specific opportunities, reply publicly or privately within threaded boards, and resolve queries without leaving the platform."
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
          <CircleHelp className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400">
          Got questions? We have got answers. Search below or browse categories to learn more about how BidTracker works.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Input
          id="faq-search"
          type="text"
          placeholder="Search questions, keywords, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4 pt-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-950"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 transition-colors hover:bg-slate-50 dark:text-white dark:hover:bg-slate-900/50"
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 text-sm text-slate-600 leading-relaxed dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500">
            No FAQs found matching &quot;{searchQuery}&quot;. Please try a different query.
          </div>
        )}
      </div>
    </div>
  );
}
