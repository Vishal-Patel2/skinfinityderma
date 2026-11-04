const fs = require('fs');

(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Find where the main table ends
  const idx = html.indexOf('50-double-chin-reduction');
  // Look for script tags after this
  const afterIdx = html.indexOf('</script>', idx);
  console.log('Script tag after folder 50:', afterIdx);
  // Search for AF_initDataCallback or data callbacks in html
  const callbacks = [...html.matchAll(/AF_initDataCallback\s*\(\s*\{([^}]+)\}/g)].map(m => m[1]);
  console.log('AF_initDataCallbacks found:', callbacks.length);
  callbacks.forEach(c => console.log('Callback key:', c.slice(0, 100)));
})();
