(async () => {
  const folderId = '1NPeE5taRMt2zV7tS-mNzTAD6tVeC_jwP';
  const res = await fetch(`https://drive.google.com/drive/folders/${folderId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Find aria-label="<FILENAME>" and ssk='5:...:<FILE_ID>-0-16'
  const regex = /aria-label="([^"]+\.(?:png|jpg|jpeg|webp))"[^>]*?ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]{25,})-0-16'/gi;
  let m;
  const map = {};
  while ((m = regex.exec(html)) !== null) {
    map[m[1]] = m[2];
  }
  console.log('Mapped files:', map);
})();
