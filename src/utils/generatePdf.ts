import { Opportunity } from '@/types/Opportunity';

export const generatePdf = (opportunity: Opportunity) => {
  // @ts-ignore
  if (!window.html2pdf) {
    alert("PDF engine is loading, please wait a few seconds...");
    return;
  }

  const isTender = opportunity.industryType === 'Tender' || !opportunity.industryType;
  const authorityLabel = isTender ? 'Tendering Authority' : 'Work Subletting Authority';
  const locationLabel = isTender ? 'State Name' : 'Location Name';

  const htmlContent = `
    <div style="padding: 40px; font-family: sans-serif; color: #1e293b;">
      <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 24px; margin-bottom: 32px;">
        <h4 style="color: #4f46e5; font-weight: bold; text-transform: uppercase; font-size: 14px; margin-bottom: 4px;">${opportunity.industryType || 'VendorMatch'} Opportunity Report</h4>
        <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin: 0;">${opportunity.title || 'Untitled'}</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Generated: ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; text-transform: uppercase;">1. Detailed Summary</h2>
        <p style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #f1f5f9; line-height: 1.6;">${opportunity.summary || opportunity.description || 'No summary provided.'}</p>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; text-transform: uppercase;">2. Project Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">${authorityLabel}</div>
            <div style="font-weight: 600; color: #4f46e5;">${opportunity.authorityName || 'N/A'}</div>
          </div>
          <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">${locationLabel}</div>
            <div style="font-weight: 600;">${opportunity.stateLocationName || opportunity.location || 'N/A'}</div>
          </div>
          <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Total Value</div>
            <div style="font-weight: 600;">₹ ${opportunity.budget ? opportunity.budget.toLocaleString('en-IN') : 'N/A'}</div>
          </div>
          <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Last Date of Submission</div>
            <div style="font-weight: 600;">${opportunity.deadline || 'N/A'}</div>
          </div>

          ${isTender ? `
            <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
              <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">EMD Required</div>
              <div style="font-weight: 600;">${opportunity.emdRequired ? 'Yes' : 'No'}</div>
            </div>
            ${opportunity.emdRequired ? `
              <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
                <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">EMD Amount</div>
                <div style="font-weight: 600;">₹ ${opportunity.emdAmount?.toLocaleString('en-IN') || 0}</div>
              </div>
            ` : ''}
          ` : `
            <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
              <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Royalty Required</div>
              <div style="font-weight: 600;">${opportunity.royaltyRequired ? `Yes (${opportunity.royaltyPercentage}%)` : 'No'}</div>
            </div>
            <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
              <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px;">Won Rate Status</div>
              <div style="font-weight: 600;">${opportunity.wonRateStatus || 'N/A'} (${opportunity.wonRatePercentage || 0}%)</div>
            </div>
          `}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
        <div>
            <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; text-transform: uppercase;">3. Key Work Components</h2>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${(opportunity.keyWorkComponents || []).map(i => `<li>${i}</li>`).join('')}
            </ul>
        </div>
        <div>
            <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; text-transform: uppercase;">4. Eligibility Criteria</h2>
            <ul style="padding-left: 20px; line-height: 1.6;">
              ${(opportunity.eligibilityCriteria || []).map(i => `<li>${i}</li>`).join('')}
            </ul>
        </div>
      </div>

      ${opportunity.additionalInput ? `
      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; text-transform: uppercase; color: #4f46e5;">Additional Requirements</h2>
        <div style="background-color: #eef2ff; padding: 20px; border-radius: 8px; border: 1px solid #e0e7ff; color: #312e81; white-space: pre-wrap; line-height: 1.6;">
            ${opportunity.additionalInput}
        </div>
      </div>
      ` : ''}

      <div style="margin-bottom: 32px;">
        <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; text-transform: uppercase; color: #d97706;">Key Actions for Vendor</h2>
        <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border: 1px solid #fef3c7; color: #78350f;">
            <ul style="padding-left: 20px; line-height: 1.6; margin: 0;">
              ${(opportunity.keyActions || []).map(i => `<li>${i}</li>`).join('')}
            </ul>
        </div>
      </div>

      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
        Generated via VendorMatch Pro AI Engine
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  
  const filename = `${opportunity.title ? opportunity.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'vendor_report'}.pdf`;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  // @ts-ignore
  window.html2pdf().set(opt).from(element).save();
};
