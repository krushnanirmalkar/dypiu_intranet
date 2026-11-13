const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const search = '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />';
const replace = '<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,600&family=Caveat:wght@600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />';
html = html.replace(search, replace);
fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated with Fredoka and Nunito fonts!');
