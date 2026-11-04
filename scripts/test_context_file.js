(async () => {
  const folderId = '1NPeE5taRMt2zV7tS-mNzTAD6tVeC_jwP';
  const res = await fetch(`https://drive.google.com/drive/folders/${folderId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const idx = html.indexOf('01-problem.png');
  console.log(html.slice(Math.max(0, idx - 150), idx + 250));
})();
