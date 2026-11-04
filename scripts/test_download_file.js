const fs = require('fs');

(async () => {
  const fileId = '1ht9P1_Nt4ziOWzNUR2CDzT6jfx9APxrN';
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  const res = await fetch(downloadUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  console.log('Status:', res.status, 'Content-Type:', res.headers.get('content-type'));
  const buf = Buffer.from(await res.arrayBuffer());
  console.log('Downloaded bytes:', buf.length);
  // Verify PNG header
  console.log('Is PNG?', buf.slice(0, 4).toString('hex') === '89504e47');
})();
