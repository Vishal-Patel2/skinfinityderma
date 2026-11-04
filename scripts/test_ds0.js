const fs = require('fs');

(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Find AF_initDataCallback for ds:0
  const m = html.match(/AF_initDataCallback\(\{key: 'ds:0'[^\n]+data:(\[[\s\S]*?\])\}\);/);
  if (m) {
    try {
      const data = JSON.parse(m[1]);
      console.log('ds:0 data parsed successfully!');
      console.log('ds:0 structure:', Array.isArray(data), data.length);
      fs.writeFileSync('scripts/ds0.json', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Parse error:', e.message);
      fs.writeFileSync('scripts/ds0_raw.txt', m[1].slice(0, 5000));
    }
  } else {
    console.log('No ds:0 match');
  }
})();
