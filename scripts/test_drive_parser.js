(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Find all pairs of aria-label="<NAME> Shared folder" and ssk='5:...:<ID>-0-16'
  // Or match in the JavaScript initialization data
  const regex = /aria-label="([0-9]+-[^"]+?)\s+(?:Shared\s+)?folder"[^>]*?ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]{25,})/g;
  let m;
  const list = [];
  while ((m = regex.exec(html)) !== null) {
    list.push({ name: m[1].replace(/\\u0026/g, '&'), id: m[2] });
  }
  console.log('Matched folder count:', list.length);
  console.log('First 5:', list.slice(0, 5));
})();
