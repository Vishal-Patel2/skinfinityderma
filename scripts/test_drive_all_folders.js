(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Find all folder items with name and id
  // Let's test a broader regex that matches any aria-label="...folder"
  const regex = /aria-label="([^"]+?)\s+(?:Shared\s+)?folder"[^>]*?ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]{25,})-0-16'/gi;
  let m;
  const list = [];
  const seen = new Set();
  while ((m = regex.exec(html)) !== null) {
    const name = m[1].replace(/\\u0026/g, '&').replace(/&amp;/g, '&').trim();
    const id = m[2];
    if (!seen.has(name)) {
      seen.add(name);
      list.push({ name, id });
    }
  }
  list.sort((a,b) => {
    const na = parseInt(a.name) || 0;
    const nb = parseInt(b.name) || 0;
    return na - nb;
  });
  console.log('Total unique folders found:', list.length);
  console.log('Folders found:', list.map(f => f.name));
})();
