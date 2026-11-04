const fs = require('fs');

(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Look for any string that starts with "driveweb;" or "b5wqU" or "aZljm"
  const m = html.match(/\["driveweb;[^\"]+\"/g);
  console.log('driveweb matches:', m);
})();
