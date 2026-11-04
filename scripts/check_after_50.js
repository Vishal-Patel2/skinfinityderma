const fs = require('fs');

(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Search for occurrence of "double-chin" (folder 50) and see what follows
  const idx = html.indexOf('50-double-chin-reduction');
  console.log('Context after folder 50:');
  console.log(html.slice(idx, idx + 1200));
})();
