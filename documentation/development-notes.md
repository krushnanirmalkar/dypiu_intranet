# DYPIU Campus Intranet

## Development Notes

This document records implementation decisions, commands, issues, experiments and changes made during development.

It should be updated throughout the project.

---

# 1. Current Phase

```text
Phase:
Status:
Started:
Completed:
```

---

# 2. Current Objective

```text
What am I trying to complete right now?

Example:

Get Keycloak running locally and create the DYPIU realm.
```

---

# 3. Environment

## Development

```text
OS:
Node.js:
Docker:
Docker Compose:
NGINX:
Keycloak:
Database:
```

## Production

```text
Server:
OS:
Network:
DNS:
Domain:
```

---

# 4. Important Configuration

Do not store actual secrets here.

Record configuration such as:

```text
Keycloak Realm:
OIDC Issuer:
Application Client Name:
Redirect URI:
Logout URI:
Application Domain:
```

Never record:

```text
Client Secret
Passwords
Private Keys
API Secrets
```

---

# 5. Decisions Log

Record important technical decisions.

Example:

```text
Date:
Decision:
Reason:
Alternative considered:
```

Example:

```text
Decision:
Use Keycloak as the central OIDC identity broker.

Reason:
Matches the approved DYPIU SSO architecture.
```

---

# 6. Problems & Solutions

```text
Problem:

What happened?

Cause:

Why did it happen?

Solution:

How was it fixed?

Prevention:

How can it be avoided later?
```

---

# 7. Testing Notes

Record successful and failed tests.

Example:

```text
Test:
Google login

Expected:
User authenticates through Google and returns to application.

Result:
PASS

Notes:
```

---

# 8. Security Findings

Record security issues discovered during development.

```text
Issue:
Severity:
Affected component:
Cause:
Fix:
Verification:
```

Do not store exploitable production credentials in this file.

---

# 9. Deployment Notes

Record:

* Deployment commands.
* Service restart procedures.
* Configuration changes.
* Migration procedures.
* Rollback procedures.

Example:

```text
Deployment:

1. Pull latest version.
2. Build application.
3. Run tests.
4. Deploy.
5. Restart service.
6. Check logs.
7. Test login.
```

---

# 10. Open Questions

Keep unresolved decisions here.

```text
- What is the final production domain?
- Which SIS/ERP API will provide university identity?
- Where will Keycloak be hosted?
- What is the approved MFA policy?
- What are the final student/faculty/admin roles?
```

Remove questions once they are resolved and record the decision in the architecture documentation.

---

# 11. Change History

```text
Date | Change | Author
-----|--------|-------
     |        |
     |        |
```

---

# 12. Rule

Do not let this document become the main architecture document.

Use:

```text
01-implementation-roadmap.md
→ What to build

02-architecture.md
→ How the system is structured

03-oidc-sso-flow.md
→ How authentication works

04-security.md
→ How the system is secured

05-deployment.md
→ How the system is deployed

06-development-notes.md
→ What happened during development
```
