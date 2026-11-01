const fs = require('fs');

const content = fs.readFileSync('backend/src/scripts/sheet_data.csv', 'utf8');
const lines = content.split('\n').filter(l => l.trim().length > 0);
console.log('Total non-empty lines:', lines.length);

let currentCat = '';
const items = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  // Simple CSV parser for lines with commas and possible quotes
  const parts = [];
  let cur = '';
  let inQuotes = false;
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      parts.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur.trim());

  let [cat, name, contentText, ytLink, images] = parts;
  if (cat && cat.length > 0) {
    currentCat = cat.replace(/"/g, '').trim();
    // Normalize wedding Packages -> Wedding Packages
    if (currentCat.toLowerCase() === 'wedding packages') {
      currentCat = 'Wedding Packages';
    }
  }
  if (!name || name.trim().length === 0) continue;

  name = name.replace(/^"|"$/g, '').trim();
  contentText = (contentText || name).replace(/^"|"$/g, '').trim();
  ytLink = (ytLink || '').replace(/^"|"$/g, '').trim();

  // Extract YouTube ID if link present
  let ytId = null;
  if (ytLink) {
    const m = ytLink.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
    if (m) ytId = m[1];
  }

  items.push({
    category: currentCat,
    name,
    content: contentText,
    ytLink,
    ytId
  });
}

console.log(`Parsed ${items.length} treatments across categories:`);
const catCounts = {};
items.forEach(it => {
  catCounts[it.category] = (catCounts[it.category] || 0) + 1;
});
console.log(catCounts);
console.log('Sample item:', items[0]);
