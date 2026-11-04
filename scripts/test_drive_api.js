(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  const apiKeyMatch = html.match(/(AIzaSy[a-zA-Z0-9_\-]{33})/);
  if (!apiKeyMatch) {
    console.log('No API key matched');
    return;
  }
  const apiKey = apiKeyMatch[1];
  console.log('Found API Key:', apiKey);

  const driveApiUrl = `https://www.googleapis.com/drive/v3/files?q='12QgueGsUoY-heeR_SEGi_ELFETIGNjvc'+in+parents+and+trashed=false&pageSize=100&fields=nextPageToken,files(id,name,mimeType)&key=${apiKey}`;
  const apiRes = await fetch(driveApiUrl);
  const data = await apiRes.json();
  console.log('API Response status:', apiRes.status);
  console.log('Files count from API:', data.files?.length);
  if (data.files) {
    const sorted = data.files.sort((a,b) => (parseInt(a.name) || 0) - (parseInt(b.name) || 0));
    console.log('Total files found:', sorted.length);
    console.log('Last 10:', sorted.slice(-10));
  } else {
    console.log('Data error:', data.error);
  }
})();
