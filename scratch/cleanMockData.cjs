const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

// 1. Delete the mock files
const mockFiles = [
  path.join(srcDir, 'features', 'vendors', 'data', 'mockVendors.ts'),
  path.join(srcDir, 'lib', 'mockOpportunities.ts'),
  path.join(srcDir, 'features', 'admin', 'utils', 'mockData.ts'),
  path.join(srcDir, 'features', 'queries', 'services', 'mockData.ts'),
];

mockFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted ${file}`);
  }
});

console.log("Mock files deleted.");
