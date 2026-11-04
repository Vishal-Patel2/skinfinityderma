(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);
  const regex = /\["([0-9]+-[^"]+)"/g;
  let match;
  const folders = new Set();
  while ((match = regex.exec(html)) !== null) {
    folders.add(match[1]);
  }
  console.log('Found folders count:', folders.size);
  console.log('Sample folders:', Array.from(folders).slice(0, 15));
})();
