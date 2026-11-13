const fs = require('fs');
let code = fs.readFileSync('src/components/UniOneDashboardPage.tsx', 'utf8');

// Replace the logo header section in UniOneDashboardPage.tsx
const oldHeaderLogo = `          {/* Official University Logo */}
          <img
            src="/dypiu-logo-unione.png"
            alt="D Y Patil International University. Think, Thrive, Transform"
            style={{ height: '56px', width: 'auto', display: 'block' }}
          />

          <span aria-hidden="true" style={{ width: '1px', height: '42px', background: '#D5DEEC' }}></span>

          {/* UniOne Word Art Logo - exact pixel matching from source of truth */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate?.('dashboard'); }}
            aria-label="UniOne home"
            style={{
              display: 'block',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              fontSize: '42px',
              lineHeight: 1.1,
              letterSpacing: '-0.5px',
              color: '#0B2559'
            }}
          >
            <span aria-hidden="true">U</span>
            <span aria-hidden="true" style={{ color: '#0B2559' }}>n</span>
            <span aria-hidden="true" style={{ position: 'relative', display: 'inline-block', width: '8px', height: '23px', margin: '0 3px 0 2px', borderRadius: '4px', background: '#0B2559' }}>
              <span style={{ position: 'absolute', left: 0, top: '-14px', width: '8px', height: '8px', borderRadius: '50%', background: '#FDB515' }}></span>
            </span>
            <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" style={{ verticalAlign: '-3px', margin: '0 1px' }}>
              <circle cx="16" cy="16" r="12" fill="none" stroke="#0AA0E6" strokeWidth="7"></circle>
              <circle cx="16" cy="16" r="12" fill="none" stroke="#FDB515" strokeWidth="7" strokeDasharray="30 75.4" transform="rotate(-70 16 16)"></circle>
            </svg>
            <span aria-hidden="true" style={{ color: '#0074B8' }}>ne</span>
          </a>`;

const newHeaderLogo = `          {/* University Branding & UniOne Word Art */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src="/dypiu-official-logo.png"
              onError={(e) => {
                // Fallback to dypiu-logo-unione if needed
                (e.currentTarget as HTMLImageElement).src = '/dypiu-logo-unione.png';
              }}
              alt="D Y Patil International University"
              style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain', cursor: 'pointer' }}
              onClick={() => onNavigate?.('dashboard')}
            />

            <span aria-hidden="true" style={{ width: '1px', height: '38px', background: '#D5DEEC', display: 'inline-block' }}></span>

            {/* UniOne Word Art Logo: Perfectly aligned baseline & geometry */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate?.('dashboard'); }}
              aria-label="UniOne home"
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: '38px',
                lineHeight: 1,
                letterSpacing: '-0.5px',
                color: '#0B2559',
                cursor: 'pointer'
              }}
            >
              <span aria-hidden="true">U</span>
              <span aria-hidden="true" style={{ color: '#0B2559' }}>n</span>
              {/* Lowercase 'i' with signature gold dot */}
              <span
                aria-hidden="true"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '7.5px',
                  height: '21px',
                  margin: '0 3px 0 2px',
                  borderRadius: '3.5px',
                  background: '#0B2559',
                  verticalAlign: 'baseline'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '-12px',
                    width: '7.5px',
                    height: '7.5px',
                    borderRadius: '50%',
                    background: '#FDB515'
                  }}
                ></span>
              </span>
              {/* Dual-tone 'O' ring (Sky Blue + Gold crescent arc) */}
              <svg
                aria-hidden="true"
                width="30"
                height="30"
                viewBox="0 0 32 32"
                style={{ verticalAlign: '-4px', margin: '0 2px' }}
              >
                <circle cx="16" cy="16" r="12" fill="none" stroke="#0AA0E6" strokeWidth="6.5"></circle>
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke="#FDB515"
                  strokeWidth="6.5"
                  strokeDasharray="30 75.4"
                  transform="rotate(-70 16 16)"
                ></circle>
              </svg>
              <span aria-hidden="true" style={{ color: '#0074B8' }}>ne</span>
            </a>
          </div>`;

if (code.includes(oldHeaderLogo)) {
  code = code.replace(oldHeaderLogo, newHeaderLogo);
  console.log('Replaced oldHeaderLogo directly!');
} else {
  console.log('Direct match failed, attempting regex replace...');
  code = code.replace(
    /\{\/\* Official University Logo \*\/\}[\s\S]*?\{\/\* UniOne Word Art Logo[\s\S]*?<\/a>/,
    newHeaderLogo
  );
}

fs.writeFileSync('src/components/UniOneDashboardPage.tsx', code, 'utf8');
console.log('UniOneDashboardPage.tsx logo updated!');
