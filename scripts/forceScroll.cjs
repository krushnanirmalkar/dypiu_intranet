const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const target = `html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f3f3f8;
  color: #1f1e42;
  -webkit-font-smoothing: antialiased;
}

#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}`;

const replacement = `html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  width: 100%;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  background-color: #F3F6FB !important;
  color: #14213D;
  -webkit-font-smoothing: antialiased;
}

#root {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden !important;
  overflow-y: visible !important;
}`;

if (css.includes(target)) {
  css = css.replace(target, replacement);
  console.log('Replaced target with LF/CRLF match');
} else {
  console.log('Searching via regex...');
  css = css.replace(/html,\s*body\s*\{[\s\S]*?#root\s*\{[\s\S]*?\}/, replacement);
}

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('src/index.css successfully updated!');
