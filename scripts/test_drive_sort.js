(async () => {
  const urlVariants = [
    'https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc?sort=13&direction=d',
    'https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc?sort=14&direction=d',
    'https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc?sort=name&direction=desc',
    'https://drive.google.com/drive/u/0/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc?direction=d&sort=13'
  ];

  for (const url of urlVariants) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    const has58 = html.includes('58-') || html.includes('58 -') || html.includes('silver-package');
    const has51 = html.includes('51-') || html.includes('51 -') || html.includes('hifu');
    console.log(url, 'has 58?', has58, 'has 51?', has51);
  }
})();
