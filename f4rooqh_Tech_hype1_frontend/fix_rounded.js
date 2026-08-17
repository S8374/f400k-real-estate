const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
        const files = fs.readdirSync(filePath);
        for (const file of files) {
            processFile(path.join(filePath, file));
        }
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl with rounded
        let newContent = content.replace(/rounded-(md|lg|xl|2xl|3xl)/g, 'rounded');
        // Also manually replace rounded-full in badge.tsx if it's there
        if (filePath.endsWith('badge.tsx')) {
            newContent = newContent.replace(/rounded-full/g, 'rounded');
        }
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated:', filePath);
        }
    }
}

const pathsToProcess = [
    path.join(__dirname, 'src', 'app', '(WithDashboardLayout)'),
    path.join(__dirname, 'src', 'components')
];

for (const p of pathsToProcess) {
    processFile(p);
}
console.log('Done replacing rounded classes in all components.');
