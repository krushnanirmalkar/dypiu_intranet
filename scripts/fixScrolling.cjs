const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Fix html and body overflow
css = css.replace(
  `html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f3f3f8;
  color: #1f1e42;
  -webkit-font-smoothing: antialiased;
}`,
  `html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #F3F6FB;
  color: #14213D;
  -webkit-font-smoothing: antialiased;
}`
);

// Fix #root overflow
css = css.replace(
  `#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}`,
  `#root {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}`
);

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('src/index.css overflow fixed for natural scrolling!');
