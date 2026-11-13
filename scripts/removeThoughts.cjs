const fs = require('fs');
let code = fs.readFileSync('src/components/UniOneDashboardPage.tsx', 'utf8');

// Target the thoughts cell block inside hero section
const targetThoughtsBlock = `              <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '440px', background: '#FFFFFF', color: '#14213D', borderRadius: '20px', padding: '18px 22px', boxShadow: '0 8px 24px rgba(0,0,0,.18)' }}>
                <p style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '14px', color: '#0B6FB0' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"></path>
                  </svg>
                  A little something for today
                </p>
                <p style={{ margin: 0, fontSize: '17px', lineHeight: 1.5, fontStyle: 'italic', fontWeight: 600 }}>
                  “Learn continuously. There is always ‘one more thing’ to learn.”
                </p>
              </div>`;

if (code.includes(targetThoughtsBlock)) {
  code = code.replace(targetThoughtsBlock, '');
  console.log('Removed targetThoughtsBlock directly!');
} else {
  console.log('Direct match failed, trying regex...');
  code = code.replace(
    /<div style=\{\{\s*position:\s*'relative',\s*flex:\s*'1 1 300px'[\s\S]*?A little something for today[\s\S]*?<\/div>/,
    ''
  );
}

// Ensure the hero greeting fills the width cleanly without the right card
code = code.replace(
  `<div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '640px' }}>`,
  `<div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '100%' }}>`
);

fs.writeFileSync('src/components/UniOneDashboardPage.tsx', code, 'utf8');
console.log('UniOneDashboardPage.tsx updated without thoughts cell!');
