const fs = require('fs');
const path = require('path');

// Fix LeadMatchedVendors.tsx
const lmvPath = path.join(__dirname, '..', 'src', 'features', 'dashboard', 'components', 'LeadMatchedVendors.tsx');
let lmvContent = fs.readFileSync(lmvPath, 'utf8');
lmvContent = lmvContent.replace(/variant="secondary"/g, 'variant="default"');
fs.writeFileSync(lmvPath, lmvContent);

console.log("TS errors patched again.");
