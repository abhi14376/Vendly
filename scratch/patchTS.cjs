const fs = require('fs');
const path = require('path');

// Fix LeadMatchedVendors.tsx
const lmvPath = path.join(__dirname, '..', 'src', 'features', 'dashboard', 'components', 'LeadMatchedVendors.tsx');
let lmvContent = fs.readFileSync(lmvPath, 'utf8');
lmvContent = lmvContent.replace(/variant="outline"/g, 'variant="secondary"');
fs.writeFileSync(lmvPath, lmvContent);

// Fix ShareOpportunityModal.tsx
const somPath = path.join(__dirname, '..', 'src', 'features', 'opportunities', 'components', 'ShareOpportunityModal.tsx');
let somContent = fs.readFileSync(somPath, 'utf8');
somContent = somContent.replace('const { shareOpportunity } = useShareStore();', 'const { shareOpportunity } = useShareStore();\n  const vendors = useVendorStore(state => state.vendors);');
fs.writeFileSync(somPath, somContent);

console.log("TS errors patched.");
