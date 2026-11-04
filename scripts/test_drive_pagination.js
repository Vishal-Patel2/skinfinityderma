(async () => {
  const res = await fetch('https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  
  // Look for nextPageToken or pagination token in the HTML
  const matches = html.match(/["']([a-zA-Z0-9_\-\.]{50,})["']/g);
  console.log('Long tokens found:', matches?.length);
  // Look for Drive batchexecute or rpc
  const rpcMatches = html.match(/\/_\/DriveUi\/data\/batchexecute[^"']*/g);
  console.log('RPC endpoint matches:', rpcMatches);

  // Look for folder items in embedded window['_initData'] or window['viewerData']
  const initDataMatch = html.match(/initData\s*=\s*({[\s\S]*?});/);
  console.log('initData found?', !!initDataMatch);
})();
