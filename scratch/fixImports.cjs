const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, search, replace) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(search)) {
      content = content.replace(search, replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
};

const src = path.join(__dirname, '..', 'src');

replaceInFile(
  path.join(src, 'pages', 'lead', 'VendorsPage.tsx'),
  'from "@/features/vendors/data/mockVendors"',
  'from "@/features/vendors/data/vendorTypes"'
);

replaceInFile(
  path.join(src, 'pages', 'admin', 'VendorVerificationPage.tsx'),
  'from "@/features/vendors/data/mockVendors"',
  'from "@/features/vendors/data/vendorTypes"'
);

replaceInFile(
  path.join(src, 'features', 'vendors', 'components', 'CreateVendorModal.tsx'),
  'from "../data/mockVendors"',
  'from "../data/vendorTypes"'
);

replaceInFile(
  path.join(src, 'features', 'opportunities', 'components', 'ShareOpportunityModal.tsx'),
  'import { mockVendors } from "@/features/vendors/data/mockVendors";',
  'import { useVendorStore } from "@/store/vendorStore";\nimport { type VendorProfile } from "@/features/vendors/data/vendorTypes";'
);
