const fs = require('fs');
const html = fs.readFileSync('UniOne Dashboard Redesign (1).html', 'utf8');

const tMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (tMatch) {
  const templateJson = JSON.parse(tMatch[1]);
  fs.writeFileSync('template_extracted.html', templateJson, 'utf8');
  console.log('Template extracted, length:', templateJson.length);
} else {
  console.log('Template tag not found');
}
