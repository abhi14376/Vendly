const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '..', 'src'),
  path.join(__dirname, '..', 'public'),
];

const targetFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'package.json'),
  path.join(__dirname, '..', 'README.md')
];

function processFile(filePath) {
  if (filePath.endsWith('.svg') || filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.html') || filePath.endsWith('.json') || filePath.endsWith('.md')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Vendly -> BidTracker
    let modified = content.replace(/Vendly/g, 'BidTracker');
    // Replace vendly -> bidtracker (e.g. for URLs or lowercase mentions)
    modified = modified.replace(/vendly/g, 'bidtracker');
    
    if (content !== modified) {
      fs.writeFileSync(filePath, modified, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

targetDirs.forEach(walkDir);
targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    processFile(file);
  }
});
