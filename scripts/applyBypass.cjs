const fs = require('fs');
let content = fs.readFileSync('src/components/MainApp.tsx', 'utf8');

content = content.replace(
  'const [authLoading, setAuthLoading] = useState(!isSignedOutPage && !isLoginPage && !isPreviewMode);',
  'const [authLoading, setAuthLoading] = useState(false);'
);
content = content.replace(
  'const [authenticated, setAuthenticated] = useState(isPreviewMode);',
  'const [authenticated, setAuthenticated] = useState(true);'
);
content = content.replace(
  'const [authenticatedUser, setAuthenticatedUser] = useState<SessionUser | null>(\r\n    isPreviewMode ? createPreviewSessionUser(DEV_PREVIEW_USER) : null,\r\n  );',
  'const [authenticatedUser, setAuthenticatedUser] = useState<SessionUser | null>(createPreviewSessionUser(DEV_PREVIEW_USER));'
);
content = content.replace(
  'const [currentRole, setCurrentRole] = useState<UserRole | null>(\r\n    isPreviewMode ? resolvePreviewRole(DEV_PREVIEW_USER) : null,\r\n  );',
  'const [currentRole, setCurrentRole] = useState<UserRole | null>(resolvePreviewRole(DEV_PREVIEW_USER));'
);
content = content.replace(
  'if (isSignedOutPage || isLoginPage || isPreviewMode) {',
  'if (true || isSignedOutPage || isLoginPage || isPreviewMode) {'
);

fs.writeFileSync('src/components/MainApp.tsx', content, 'utf8');
console.log('Login bypass applied successfully!');
