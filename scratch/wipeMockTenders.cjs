const fs = require('fs');
const path = require('path');

const tsFile = path.join(__dirname, '..', 'src', 'services', 'tenderService.ts');
let content = fs.readFileSync(tsFile, 'utf8');

// Wipe initialMockTenders array
content = content.replace(/const initialMockTenders: Tender\[\] = \[\s*\{[\s\S]*?\}\s*\];\s*/, 'const initialMockTenders: Tender[] = [];\n');

// Wipe generateInitialMockMatches
content = content.replace(/const generateInitialMockMatches = \(\) => \{[\s\S]*?\};\s*localMatches = generateInitialMockMatches\(\);\s*/, 'const generateInitialMockMatches = () => [];\nlocalMatches = [];\n');

// Wipe localAwards
content = content.replace(/localAwards = \[\s*\{[\s\S]*?\}\s*\];\s*/, 'localAwards = [];\n');

fs.writeFileSync(tsFile, content);
console.log("Mock tenders, matches, and awards wiped successfully!");
