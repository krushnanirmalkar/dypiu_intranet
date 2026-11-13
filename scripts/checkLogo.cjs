const fs = require('fs');
const html = fs.readFileSync('template_extracted.html', 'utf8');
const logoMatch = html.match(/<a href="#" aria-label="UniOne home"[\s\S]*?<\/a>/);
console.log('Original template logo:');
console.log(logoMatch ? logoMatch[0] : 'Not found');
