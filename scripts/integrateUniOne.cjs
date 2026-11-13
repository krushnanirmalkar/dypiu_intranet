const fs = require('fs');
let code = fs.readFileSync('src/components/MainApp.tsx', 'utf8');

// 1. Add UniOneDashboardPage import
const importTarget = "import { CommunicationFloatingButton } from './CommunicationFloatingButton';";
const importWithUniOne = "import { CommunicationFloatingButton } from './CommunicationFloatingButton';\r\nimport { UniOneDashboardPage } from './UniOneDashboardPage';";

if (!code.includes("import { UniOneDashboardPage }")) {
  code = code.replace(importTarget, importWithUniOne);
}

// 2. Render UniOneDashboardPage directly when currentNav === 'dashboard'
// The user explicitly stated:
// "Implement the attached design (UniOne dashboard) on our existing page. Treat the attached file as the source of truth for layout, spacing, colors, fonts, and behavior. Match it pixel-for-pixel on desktop, tablet and mobile. Layout: Header: university logo + UniOne word art logo... Top row: welcome banner + apps grid (left), notice board + birthday card (right). Below: events section (dark panel). Footer: links and credits. Floating Messages button opens chat popup."

const returnTarget = "  // Unified Reference Layout for Portal\r\n  return (";
const returnTargetLF = "  // Unified Reference Layout for Portal\n  return (";

const dashboardCheck = `  // When on dashboard, render the source-of-truth UniOne Redesign layout pixel-for-pixel
  if (currentNav === 'dashboard' || currentNav === 'home') {
    return (
      <UniOneDashboardPage
        user={currentUser}
        onNavigate={handleNavigate}
        showBirthdayProp={true}
      />
    );
  }
`;

if (!code.includes("if (currentNav === 'dashboard' || currentNav === 'home')")) {
  if (code.includes(returnTarget)) {
    code = code.replace(returnTarget, dashboardCheck + '\r\n' + returnTarget);
    console.log('Added UniOneDashboardPage render block (CRLF)');
  } else if (code.includes(returnTargetLF)) {
    code = code.replace(returnTargetLF, dashboardCheck + '\n' + returnTargetLF);
    console.log('Added UniOneDashboardPage render block (LF)');
  } else {
    console.log('Return target not found');
  }
}

fs.writeFileSync('src/components/MainApp.tsx', code, 'utf8');
console.log('MainApp.tsx updated successfully!');
