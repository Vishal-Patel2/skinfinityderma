const fs = require('fs');

(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Find all occurrences of 25+ char alphanumeric IDs that are accompanied by a folder name like "3-", "4-", "5-"
  const lines = html.split('\n');
  const allFolderNames = new Set();
  const folderMap = new Map();

  const folderNameRegex = /"([0-9]{1,2}-[^"]+)"/g;
  let fm;
  while ((fm = folderNameRegex.exec(html)) !== null) {
    const rawName = fm[1].replace(/\\u0026/g, '&');
    allFolderNames.add(rawName);
  }
  console.log('Total folder names found anywhere in HTML:', allFolderNames.size);
  console.log('Folder names found:', Array.from(allFolderNames).sort((a,b) => parseInt(a) - parseInt(b)));
})();
