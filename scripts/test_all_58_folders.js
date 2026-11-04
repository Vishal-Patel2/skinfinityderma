(async () => {
  const urls = [
    'https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc',
    'https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc?sort=14&direction=d'
  ];

  const allFolders = new Map();
  const regex = /aria-label="([^"]+?)\s+(?:Shared\s+)?folder"[^>]*?ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]{25,})-0-16'/gi;

  for (const url of urls) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    let m;
    while ((m = regex.exec(html)) !== null) {
      const name = m[1].replace(/\\u0026/g, '&').replace(/&amp;/g, '&').trim();
      const id = m[2];
      if (!allFolders.has(name)) {
        allFolders.set(name, id);
      }
    }
  }

  const sortedNames = Array.from(allFolders.keys()).sort((a,b) => (parseInt(a) || 0) - (parseInt(b) || 0));
  console.log('Combined unique folders found:', allFolders.size);
  console.log('List of all folders:');
  sortedNames.forEach((n, idx) => console.log(`${idx + 1}. ${n} (ID: ${allFolders.get(n)})`));
})();
