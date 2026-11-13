const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const importSearch = "@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');";
const importReplace = "@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,600&family=Caveat:wght@600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap');";

if (css.includes(importSearch)) {
  css = css.replace(importSearch, importReplace);
}

// Add design styles at the end
const additionalStyles = `
/* UniOne Dashboard Redesign Source of Truth Styles */
.font-fredoka {
  font-family: 'Fredoka', cursive, sans-serif;
}

.font-nunito {
  font-family: 'Nunito', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.app-card {
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.app-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 26px rgba(11,37,89,.14);
  border-color: #BFE3F7 !important;
}

.ghost-btn {
  transition: background .15s ease;
}
.ghost-btn:hover {
  background: #E8F3FB;
}

.row-item {
  transition: background .15s ease;
}
.row-item:hover {
  background: #F6F9FD;
}

@media (min-width: 1100px) {
  .page-root {
    zoom: 0.85;
  }
}

.ev-card:hover .ev-title {
  color: #F5A100;
}
.ev-card:focus-visible {
  outline-offset: 6px;
  border-radius: 16px;
}

.clamp2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chat-win {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: min(880px, calc(100vw - 40px));
  height: min(620px, calc(100vh - 40px));
  display: flex;
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(11,37,89,.35);
  z-index: 50;
  font-family: 'Nunito', system-ui, sans-serif;
  color: #14213D;
}
.chat-list {
  width: 340px;
  flex: 0 0 340px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #E3E9F3;
  min-height: 0;
}
.chat-pane {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #EAF1F9;
}
.chat-row {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-bottom: 1px solid #EEF2F8;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
}
.chat-row:hover {
  background: #F3F8FD !important;
}
.back-btn {
  display: none;
}

@media (max-width: 820px) {
  .hdr-search {
    order: 3;
    flex: 1 1 100% !important;
    max-width: none !important;
  }
}
@media (max-width: 560px) {
  .hide-sm {
    display: none !important;
  }
}
@media (max-width: 720px) {
  .chat-win {
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    border-radius: 0;
  }
  .chat-list {
    width: 100%;
    flex: 1 1 auto;
  }
  .chat-win.pane .chat-list {
    display: none;
  }
  .chat-win:not(.pane) .chat-pane {
    display: none;
  }
  .back-btn {
    display: flex;
  }
}
`;

if (!css.includes('.font-fredoka')) {
  css += '\n' + additionalStyles;
}

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('src/index.css updated!');
