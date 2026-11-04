(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  for (let i = 51; i <= 65; i++) {
    const idx = html.indexOf(i + '-');
    const idxSpace = html.indexOf(i + ' -');
    console.log(`Folder ${i}: idx=${idx}, idxSpace=${idxSpace}`);
  }
})();
