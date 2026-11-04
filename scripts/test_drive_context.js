const fs = require('fs');

(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Search for occurrence of "viscoderm" or "Acne" with surrounding context
  const idx = html.indexOf('viscoderm');
  console.log('Context around viscoderm:');
  console.log(html.slice(Math.max(0, idx - 200), idx + 200));
})();
