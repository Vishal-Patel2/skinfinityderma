(async () => {
  const folderId = '1NPeE5taRMt2zV7tS-mNzTAD6tVeC_jwP';
  const res = await fetch(`https://drive.google.com/drive/folders/${folderId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('Folder 2 HTML length:', html.length);
  // Match image filenames and IDs
  const regex = /\["([^"]+\.(?:png|jpg|jpeg|webp))"/gi;
  let m;
  const files = [];
  while ((m = regex.exec(html)) !== null) {
    files.push(m[1]);
  }
  console.log('Files found:', files);

  // Match file IDs
  const idRegex = /ssk='5:[^:]+:([a-zA-Z0-9_-]{25,})-0-16'/g;
  const ids = [];
  while ((m = idRegex.exec(html)) !== null) {
    ids.push(m[1]);
  }
  console.log('File IDs found:', ids);
})();
