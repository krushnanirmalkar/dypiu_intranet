const fs = require('fs');
const html = fs.readFileSync('UniOne Dashboard Redesign (1).html', 'utf8');

const mMatch = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (mMatch) {
  const manifest = JSON.parse(mMatch[1]);
  for (const [uuid, entry] of Object.entries(manifest)) {
    console.log(uuid, entry.mime, entry.compressed ? 'compressed' : 'raw', entry.data.length);
    if (entry.mime.startsWith('image/')) {
      const ext = entry.mime.split('/')[1] || 'png';
      fs.writeFileSync(`public/asset_${uuid}.${ext}`, Buffer.from(entry.data, 'base64'));
      console.log(`Saved public/asset_${uuid}.${ext}`);
    }
  }
}
