const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, searchRegEx, replacement) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(searchRegEx, replacement);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
};

const src = path.join(__dirname, '..', 'src');

// Fix ShareOpportunityModal.tsx
const shareOpp = path.join(src, 'features', 'opportunities', 'components', 'ShareOpportunityModal.tsx');
replaceInFile(shareOpp, /mockVendors/g, 'vendors');
// also inject const vendors = useVendorStore(s => s.vendors); inside the component
let shareOppContent = fs.readFileSync(shareOpp, 'utf8');
if (!shareOppContent.includes('const vendors = useVendorStore')) {
  shareOppContent = shareOppContent.replace(
    'export function ShareOpportunityModal({ isOpen, onClose, opportunity }: ShareOpportunityModalProps) {',
    'export function ShareOpportunityModal({ isOpen, onClose, opportunity }: ShareOpportunityModalProps) {\n  const vendors = useVendorStore((state) => state.vendors);'
  );
  fs.writeFileSync(shareOpp, shareOppContent, 'utf8');
  console.log('Injected vendors store to ShareOpportunityModal');
}

// Fix VendorDashboardPage.tsx
const vDashboard = path.join(src, 'pages', 'vendor', 'VendorDashboardPage.tsx');
replaceInFile(vDashboard, /import \{ mockOpportunities \} from "@\/lib\/mockOpportunities";/, '');
replaceInFile(vDashboard, /mockOpportunities/g, '[]');

// Fix VendorOpportunitiesPage.tsx
const vOpps = path.join(src, 'pages', 'vendor', 'VendorOpportunitiesPage.tsx');
replaceInFile(vOpps, /import \{ mockOpportunities \} from "@\/lib\/mockOpportunities";/, '');
replaceInFile(vOpps, /mockOpportunities/g, '[]');

// Fix UsersPage.tsx
const usersPage = path.join(src, 'pages', 'admin', 'UsersPage.tsx');
replaceInFile(usersPage, /import \{ mockUsers \} from "@\/features\/admin\/utils\/mockData";/, '');
replaceInFile(usersPage, /useState\(mockUsers\)/, 'useState<any[]>([])');

// Fix queryService.ts
const qService = path.join(src, 'features', 'queries', 'services', 'queryService.ts');
replaceInFile(qService, /import \{ mockQueries, mockMessages \} from '\.\/mockData';/, '');
replaceInFile(qService, /\[\.\.\.mockQueries\]/, '[]');
replaceInFile(qService, /\[\.\.\.mockMessages\]/, '[]');

// Fix tenderService.ts
const tService = path.join(src, 'services', 'tenderService.ts');
replaceInFile(tService, /import \{ mockVendors, VendorProfile \} from '@\/features\/vendors\/data\/mockVendors';/, '');
// Remove the initialMockTenders entirely
let tContent = fs.readFileSync(tService, 'utf8');
// To be safe, just replace the body of generateInitialMockMatches
tContent = tContent.replace(/mockVendors\.slice\(0, 5\)\.forEach\(\(vendor, index\) => \{/g, '[].forEach((vendor: any, index: number) => {');
fs.writeFileSync(tService, tContent, 'utf8');
