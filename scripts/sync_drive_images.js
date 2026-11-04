const fs = require('fs');
const path = require('path');
const mysql = require('../backend/node_modules/mysql2/promise');

const ROOT_FOLDER_URLS = [
  'https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc',
  'https://drive.google.com/drive/folders/12QgueGsUoY-heeR_SEGi_ELFETIGNjvc?sort=14&direction=d'
];

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  return res.text();
}

async function downloadFile(fileId, destPath) {
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const res = await fetch(downloadUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  if (!res.ok) {
    throw new Error(`Failed to download ${fileId}: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

async function main() {
  console.log('--- STARTING GOOGLE DRIVE TREATMENT IMAGE SYNC ---');

  // 1. Connect to Railway MySQL
  const conn = await mysql.createConnection('mysql://root:SOZfHmKNxIuKxkNljWGqNMAlDCXMZyrx@sakura.proxy.rlwy.net:58637/railway');
  console.log('Connected to Railway MySQL.');

  // Fetch all 58 treatments ordered by ID
  const [dbTreatments] = await conn.execute('SELECT id, slug, name FROM sid_treatments ORDER BY id ASC');
  console.log(`Fetched ${dbTreatments.length} treatments from sid_treatments.`);

  // 2. Discover all 58 folder IDs from Google Drive
  console.log('Discovering folder IDs from Google Drive root folder...');
  const driveFoldersMap = new Map();
  const folderRegex = /aria-label="([^"]+?)\s+(?:Shared\s+)?folder"[^>]*?ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]{25,})-0-16'/gi;

  for (const url of ROOT_FOLDER_URLS) {
    const html = await fetchHtml(url);
    let m;
    while ((m = folderRegex.exec(html)) !== null) {
      const name = m[1].replace(/\\u0026/g, '&').replace(/&amp;/g, '&').trim();
      const id = m[2];
      const numMatch = name.match(/^(\d+)/);
      if (numMatch) {
        const folderNum = parseInt(numMatch[1], 10);
        if (!driveFoldersMap.has(folderNum)) {
          driveFoldersMap.set(folderNum, { name, id, folderNum });
        }
      }
    }
  }
  console.log(`Discovered ${driveFoldersMap.size} treatment folders on Google Drive.`);

  // Verify all 1-58 numbers exist
  for (let i = 1; i <= 58; i++) {
    if (!driveFoldersMap.has(i)) {
      console.warn(`WARNING: Missing folder number ${i} on Drive!`);
    }
  }

  // 3. Process each treatment
  const frontendDir = path.resolve(__dirname, '../frontend/public/uploads/treatments');
  const backendDir = path.resolve(__dirname, '../backend/uploads/treatments');

  let processedCount = 0;
  let errorCount = 0;

  for (let idx = 0; idx < dbTreatments.length; idx++) {
    const treatment = dbTreatments[idx];
    const folderNum = idx + 1; // 1-indexed matches treatments 1 to 58
    const driveFolder = driveFoldersMap.get(folderNum);

    if (!driveFolder) {
      console.error(`[${folderNum}/58] No Drive folder found for DB treatment: ${treatment.slug}`);
      continue;
    }

    console.log(`\n[${folderNum}/58] Processing: "${treatment.name}" (${treatment.slug})`);
    console.log(`      Drive Folder: "${driveFolder.name}" (ID: ${driveFolder.id})`);

    try {
      // Fetch folder contents
      const folderUrl = `https://drive.google.com/drive/folders/${driveFolder.id}`;
      const folderHtml = await fetchHtml(folderUrl);

      // Extract image files
      const fileRegex = /aria-label="([^"]+?\.(?:png|jpg|jpeg|webp))\s+Image\s+Shared"[^>]*?ssk='[^:]+:[^:]+:([a-zA-Z0-9_-]{25,})-0-16'/gi;
      let fm;
      const filesMap = {};
      while ((fm = fileRegex.exec(folderHtml)) !== null) {
        filesMap[fm[1]] = fm[2];
      }

      console.log(`      Found ${Object.keys(filesMap).length} files:`, Object.keys(filesMap).join(', '));

      const expectedFiles = [
        { key: '01-problem.png', col: 'banner_image', caption: 'Clinical Assessment' },
        { key: '02-consultation.png', col: 'sub_image_1', caption: 'Doctor Consultation' },
        { key: '03-procedure.png', col: 'sub_image_2', caption: 'US-FDA Approved Procedure' },
        { key: '04-result.png', col: 'sub_image_3', caption: 'Clinical Result' }
      ];

      const slugDir = treatment.slug;
      const downloadedFiles = [];

      for (const item of expectedFiles) {
        // Find matching key or fallback to any file starting with 01, 02, etc.
        let matchedFileName = Object.keys(filesMap).find(f => f.toLowerCase().includes(item.key.slice(0, 2)));
        if (!matchedFileName && Object.keys(filesMap).length > 0) {
          // If only 1 or 2 files exist, take what's available
          matchedFileName = Object.keys(filesMap)[0];
        }

        if (matchedFileName && filesMap[matchedFileName]) {
          const fileId = filesMap[matchedFileName];
          const frontDest = path.join(frontendDir, slugDir, item.key);
          const backDest = path.join(backendDir, slugDir, item.key);

          // Download if not already present
          if (!fs.existsSync(frontDest) || fs.statSync(frontDest).size < 1000) {
            process.stdout.write(`      Downloading ${item.key}... `);
            const size = await downloadFile(fileId, frontDest);
            fs.mkdirSync(path.dirname(backDest), { recursive: true });
            fs.copyFileSync(frontDest, backDest);
            console.log(`OK (${(size / 1024).toFixed(1)} KB)`);
          } else {
            // Ensure copy in backend too
            if (!fs.existsSync(backDest)) {
              fs.mkdirSync(path.dirname(backDest), { recursive: true });
              fs.copyFileSync(frontDest, backDest);
            }
            console.log(`      Cached ${item.key} (${(fs.statSync(frontDest).size / 1024).toFixed(1)} KB)`);
          }

          downloadedFiles.push({
            col: item.col,
            url: `/uploads/treatments/${slugDir}/${item.key}`,
            caption: item.caption
          });
        }
      }

      // Update ONLY image columns in sid_treatments
      if (downloadedFiles.length > 0) {
        const bannerImg = downloadedFiles.find(d => d.col === 'banner_image')?.url || downloadedFiles[0].url;
        const sub1 = downloadedFiles.find(d => d.col === 'sub_image_1')?.url || null;
        const sub2 = downloadedFiles.find(d => d.col === 'sub_image_2')?.url || null;
        const sub3 = downloadedFiles.find(d => d.col === 'sub_image_3')?.url || null;
        const gallery = JSON.stringify(downloadedFiles.map(d => ({ src: d.url, caption: d.caption })));

        await conn.execute(
          `UPDATE sid_treatments SET 
            banner_image = ?, 
            sub_image_1 = ?, 
            sub_image_2 = ?, 
            sub_image_3 = ?, 
            gallery_images = ? 
          WHERE id = ?`,
          [bannerImg, sub1, sub2, sub3, gallery, treatment.id]
        );
        console.log(`      ✓ DB images updated for ${treatment.slug} (ID: ${treatment.id})`);
        processedCount++;
      } else {
        console.warn(`      ⚠ No files could be downloaded for ${treatment.slug}`);
      }

    } catch (err) {
      console.error(`      ✗ Error processing ${treatment.slug}:`, err.message);
      errorCount++;
    }
  }

  await conn.end();
  console.log(`\n--- SYNC COMPLETE: ${processedCount} treatments updated, ${errorCount} errors ---`);
}

main().catch(err => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});
