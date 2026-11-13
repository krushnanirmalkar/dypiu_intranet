const fs = require('fs');
let content = fs.readFileSync('src/components/MainApp.tsx', 'utf8');

// 1. Add communication modal state
const stateInsertTarget = 'const [openPolicyCreateModal, setOpenPolicyCreateModal] = useState(false);';
const stateAddition = 'const [openPolicyCreateModal, setOpenPolicyCreateModal] = useState(false);\r\n  const [isCommModalOpen, setIsCommModalOpen] = useState(false);';

if (content.includes(stateInsertTarget)) {
  content = content.replace(stateInsertTarget, stateAddition);
  console.log('Added isCommModalOpen state');
}

// 2. Replace dashboard content in MainApp.tsx
const oldStart = "{currentNav === 'dashboard' && (";
const oldEnd = "              <MainSection\r\n                notices={notices}\r\n                onViewAllNotices={() => handleNavigate('notices')}\r\n              />\r\n            </>\r\n          )}";
const oldEndLF = "              <MainSection\n                notices={notices}\n                onViewAllNotices={() => handleNavigate('notices')}\n              />\n            </>\n          )}";

const newDashboard = `{currentNav === 'dashboard' && (
            <div className="space-y-4 sm:space-y-5">
              {/* Top Row: Welcome Hero & Birthday Celebrating Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
                <div className="lg:col-span-8">
                  <WelcomeHero user={currentUser} />
                </div>
                <div className="lg:col-span-4">
                  <BirthdaySection />
                </div>
              </div>

              {/* Priority Feature 1: University Applications (6-8 apps, fixed & prominent) */}
              <UniversityApplicationsSection
                onOpenApp={(app) => {
                  if (app.url.startsWith('http')) {
                    window.open(app.url, '_blank', 'noopener,noreferrer');
                  } else {
                    handleNavigate(app.id);
                  }
                }}
                onViewAll={() => handleNavigate('applications')}
              />

              {/* Priority Features 2 & 3: Notice Board & Upcoming Events (Top 3 records + Show all) */}
              <NoticeBoardAndEventsSection
                notices={notices}
                onViewAllNotices={() => handleNavigate('notices')}
                onViewAllEvents={() => handleNavigate('events')}
              />
            </div>
          )}`;

const startIndex = content.indexOf(oldStart);
if (startIndex !== -1) {
  let endIndex = content.indexOf(oldEnd, startIndex);
  let len = oldEnd.length;
  if (endIndex === -1) {
    endIndex = content.indexOf(oldEndLF, startIndex);
    len = oldEndLF.length;
  }
  if (endIndex !== -1) {
    content = content.slice(0, startIndex) + newDashboard.replace(/\n/g, '\r\n') + content.slice(endIndex + len);
    console.log('Successfully replaced dashboard block');
  } else {
    console.log('Found start but not end');
  }
} else {
  console.log('Could not find start of dashboard block');
}

// 3. Add Communication modal and floating trigger
const footerTarget = '<IntranetFooter onNavigate={handleNavigate} />';
const footerReplacement = `<CommunicationFloatingButton onClick={() => setIsCommModalOpen(true)} unreadCount={2} />\r\n        <CommunicationModal isOpen={isCommModalOpen} onClose={() => setIsCommModalOpen(false)} />\r\n        <IntranetFooter onNavigate={handleNavigate} />`;

if (content.includes(footerTarget)) {
  content = content.replace(footerTarget, footerReplacement);
  console.log('Added Communication Floating Button & Modal');
}

fs.writeFileSync('src/components/MainApp.tsx', content, 'utf8');
