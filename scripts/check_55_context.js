(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('Around 376035:');
  console.log(html.slice(375900, 376200));
  console.log('Around 233909:');
  console.log(html.slice(233800, 234100));
})();
