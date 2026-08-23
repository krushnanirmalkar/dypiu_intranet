# DYPIU Campus Intranet & Unified SSO

## Master Implementation Roadmap

### Project Goal

Build a secure university campus intranet that provides a unified entry point to campus applications while using Keycloak as the central SSO/OIDC identity broker.

Target architecture:

```text
User
  ↓
HTTPS
  ↓
NGINX
  ↓
Application
  ↓ OIDC
Keycloak
  ↓
Google Workspace

Keycloak
  ↕
SIS / HR / ERP
```

Core principle:

* NGINX handles TLS and routing.
* Keycloak handles SSO and identity brokering.
* Google Workspace handles institutional authentication.
* SIS/HR/ERP provides authoritative university identity and roles.
* Each application manages its own session.
* Each application's backend enforces authorization.

---

# PHASE 0 — Understand & Freeze the Architecture

## Objective

Before writing code, understand exactly what is being built and freeze the architecture.

## Tasks

* [x] Understand OIDC and OAuth 2.0 basics.
* [x] Understand Keycloak's role.
* [x] Understand Google → Keycloak authentication.
* [x] Understand Authorization Code Flow + PKCE.
* [x] Understand access token vs ID token.
* [x] Understand server-side sessions.
* [x] Understand NGINX reverse proxying.
* [x] Understand role-based authorization.
* [x] Finalize domain structure.

Suggested domains:

```text
intranet.dypiu.ac.in
auth.dypiu.ac.in
udms.dypiu.ac.in
lms.dypiu.ac.in
ems.dypiu.ac.in
```

## Deliverable

A finalized architecture diagram and domain plan.

---

# PHASE 1 — Prepare the In-House Server

## Objective

Prepare the university server so everything can eventually run on-premises.

## Tasks

* [x] Prepare Ubuntu Server.
* [x] Configure static/internal networking.
* [x] Configure firewall.
* [x] Install Docker.
* [x] Install Docker Compose.
* [x] Install NGINX.
* [ ] Configure DNS.
* [ ] Configure HTTPS certificates.
* [ ] Create project directory structure.
* [ ] Establish backup strategy.

Suggested structure:

```text
/opt/dypiu/
│
├── keycloak/
├── postgres/
├── nginx/
├── intranet/
├── udms/
├── lms/
└── ems/
```

## Deliverable

A clean server capable of running the entire development environment.

---

# PHASE 2 — Deploy Keycloak

## Objective

Make Keycloak the central identity broker.

## Tasks

* [x] Deploy Keycloak.
* [x] Configure PostgreSQL for Keycloak.
* [x] Create DYPIU realm.
* [x] Configure administrator access.
* [ ] Configure HTTPS.
* [x] Configure realm settings.
* [x] Understand users, groups, roles and clients.
* [x] Configure session settings.
* [ ] Configure logout behaviour.
* [ ] Configure security settings.

Architecture:

```text
                Keycloak
                   │
          ┌────────┴────────┐
          │                 │
       Clients            Roles
          │                 │
      Applications       University
                         permissions
```

## Deliverable

Working Keycloak instance accessible through the approved internal/public hostname.

---

# PHASE 3 — Integrate Google Workspace

## Objective

Allow DYPIU users to authenticate using their institutional Google accounts.

## Tasks

* [x] Configure Google Workspace identity provider.
* [x] Configure Google OAuth/OIDC credentials.
* [x] Restrict authentication to the DYPIU domain.
* [x] Configure redirect URLs.
* [x] Verify Google issuer.
* [x] Verify signed token.
* [x] Verify audience.
* [x] Verify expiry.
* [x] Verify institutional domain claim.
* [x] Test MFA behaviour.

Expected flow:

```text
User
 ↓
Keycloak
 ↓
Google Workspace
 ↓
Google authentication
 ↓
Keycloak validates response
 ↓
User authenticated
```

The architecture requires the `dypiu.ac.in` domain to be validated from the signed Google token rather than simply trusting the login request.

## Deliverable

A DYPIU Google account can successfully authenticate through Keycloak.

---

# PHASE 4 — Build the SSO Proof of Concept

## Objective

Before building the actual intranet, prove that SSO works with one simple application.

Create:

```text
demo.dypiu.ac.in
```

## Technology

```text
React
+
Node.js / Express
+
OIDC
+
Keycloak
```

## Tasks

* [x] Create application.
* [x] Register it as a Keycloak OIDC client.
* [x] Configure exact redirect URI.
* [x] Configure post-logout URI.
* [x] Implement Authorization Code + PKCE.
* [x] Implement state.
* [x] Implement nonce.
* [x] Implement callback.
* [x] Exchange authorization code on backend.
* [x] Validate returned tokens.
* [x] Create server-side session.
* [x] Create secure cookie.
* [ ] Implement logout.
* [ ] Test expired sessions.

Expected flow:

```text
Browser
   ↓
Demo App
   ↓
No session
   ↓
Keycloak
   ↓
Google
   ↓
Keycloak
   ↓
Authorization Code
   ↓
Demo Backend
   ↓
Token validation
   ↓
Server-side session
   ↓
Dashboard
```

Tokens must remain server-side rather than being stored in browser localStorage.

## Deliverable

A working application where:

```text
Google Login
     ↓
Keycloak
     ↓
Demo Application
     ↓
Logged-in dashboard
```

---

# PHASE 5 — Build the Intranet Portal

## Objective

Turn the proof of concept into the actual DYPIU campus intranet.

## Frontend

```text
React
```

## Backend

```text
Node.js
Express
OIDC
Session management
Authorization
```

## Features

* [ ] Login
* [ ] Dashboard
* [ ] User profile
* [ ] Application launcher
* [ ] Search applications
* [ ] Role-based application visibility
* [ ] Logout
* [ ] Global logout
* [ ] Session expiry handling

Example:

```text
DYPIU CAMPUS INTRANET

Welcome, Krushna

Applications

┌────────────┐ ┌────────────┐ ┌────────────┐
│    UDMS    │ │    LMS     │ │    EMS     │
│ Documents  │ │ Learning   │ │ Examinations│
└────────────┘ └────────────┘ └────────────┘

┌────────────┐ ┌────────────┐
│  Research  │ │  Library   │
│   Scopus   │ │  Services  │
└────────────┘ └────────────┘
```

## Deliverable

A functional intranet dashboard.

---

# PHASE 6 — Implement University Identity & Roles

## Objective

Separate authentication from university identity.

Google answers:

> Who controls this account?

SIS/HR/ERP answers:

> Who is this person within the university?

## Initially

Use a mock identity service.

Example:

```json
{
  "user_id": "google-sub-123",
  "prn": "DYPIU12345",
  "status": "active",
  "type": "student",
  "roles": [
    "student"
  ]
}
```

## Later

Replace the mock service with the real:

```text
SIS
HR
ERP
```

## Roles

Initially define:

```text
student
faculty
staff
admin
```

Then expand into application-specific permissions.

## Tasks

* [ ] Create university user model.
* [ ] Map Google subject → university user.
* [ ] Store PRN.
* [ ] Store account status.
* [ ] Store university role.
* [ ] Define application roles.
* [ ] Handle disabled users.
* [ ] Handle expired users.
* [ ] Handle missing identity records.

The specification requires SIS/HR/ERP to be the authoritative source for student, faculty, staff and administrator status.

## Deliverable

Authenticated users receive the correct university identity and permissions.

---

# PHASE 7 — Implement Proper Authorization

## Objective

Make every application enforce permissions on its backend.

Never rely only on frontend visibility.

Bad:

```text
Frontend hides Admin button
```

Good:

```text
Request
   ↓
Backend
   ↓
Is session valid?
   ↓
Is user active?
   ↓
Does user have required role?
   ↓
Allow / Deny
```

## Tasks

* [ ] Implement middleware.
* [ ] Implement role checks.
* [ ] Implement permission checks.
* [ ] Protect every API.
* [ ] Protect every sensitive action.
* [ ] Test direct API access.
* [ ] Test role bypass.
* [ ] Test disabled accounts.

For example:

```text
GET /api/marks
       ↓
Authenticated?
       ↓
Faculty/Admin?
       ↓
YES → allow
NO  → 403
```

The architecture explicitly requires authorization on every protected page, API and action.

## Deliverable

Users cannot access functionality simply by manipulating the frontend.

---

# PHASE 8 — Integrate Existing Campus Applications

## Objective

Connect the real university applications.

Start with one application.

Recommended order:

```text
1. Demo App
2. Intranet
3. UDMS
4. LMS
5. EMS
6. Other systems
```

For every application:

* [ ] Register separate Keycloak client.
* [ ] Configure exact redirect URI.
* [ ] Configure exact logout URI.
* [ ] Configure scopes.
* [ ] Configure audience.
* [ ] Configure roles.
* [ ] Implement OIDC.
* [ ] Implement local session.
* [ ] Implement backend authorization.
* [ ] Test logout.
* [ ] Test session expiry.

Each application must have its own Keycloak client.

---

# PHASE 9 — NGINX & Network Hardening

## Objective

Put the applications behind the production network layer.

Expected structure:

```text
Internet / Campus
       ↓
     NGINX
       ↓
 ┌─────┼─────┐
 ↓     ↓     ↓
UDMS  LMS   EMS
```

## NGINX responsibilities

* [ ] TLS termination.
* [ ] Fixed domain routing.
* [ ] TLS re-encryption where required.
* [ ] Fixed upstream configuration.
* [ ] Remove untrusted forwarding headers.
* [ ] Restrict direct backend access.
* [ ] Allow only approved internal connections.

NGINX should remain a routing/TLS layer rather than becoming an authentication or authorization layer.

## Deliverable

Applications cannot simply be bypassed through their backend ports.

---

# PHASE 10 — Session & Cookie Security

## Objective

Secure application sessions.

Every application gets its own session.

Example:

```text
UDMS
__Host-udms-session

LMS
__Host-lms-session

EMS
__Host-ems-session
```

## Required properties

* [ ] Host-only cookie.
* [ ] Secure.
* [ ] HttpOnly.
* [ ] SameSite=Lax.
* [ ] Opaque session ID.
* [ ] Server-side session storage.
* [ ] Idle timeout.
* [ ] Absolute timeout.
* [ ] Session invalidation.
* [ ] Session rotation where appropriate.

The architecture explicitly prohibits a shared `.dypiu.ac.in` session cookie.

## Deliverable

Secure independent application sessions.

---

# PHASE 11 — Logout & Failure Scenarios

## Objective

Make failure behaviour predictable and secure.

Test:

* [ ] Normal logout.
* [ ] Global logout.
* [ ] Session expiry.
* [ ] Invalid token.
* [ ] Expired token.
* [ ] Invalid audience.
* [ ] Invalid issuer.
* [ ] Disabled account.
* [ ] Missing university record.
* [ ] Google unavailable.
* [ ] Keycloak unavailable.
* [ ] Application unavailable.
* [ ] Direct backend access.
* [ ] Fake browser headers.

Expected principle:

```text
Invalid identity
     ↓
DENY

Invalid role
     ↓
DENY

Invalid session
     ↓
REAUTHENTICATE

Backend bypass attempt
     ↓
DENY
```

The specification defines these scenarios and expected behaviour.

---

# PHASE 12 — Security Hardening

## Objective

Prepare for actual university deployment.

Implement:

* [ ] MFA.
* [ ] Phishing-resistant MFA for privileged administrators.
* [ ] CSRF protection.
* [ ] CORS policy.
* [ ] Content Security Policy.
* [ ] Clickjacking protection.
* [ ] Open-redirect protection.
* [ ] Rate limiting.
* [ ] Secure headers.
* [ ] Audit logging.
* [ ] Admin account separation.
* [ ] Secret rotation.
* [ ] Key rotation.
* [ ] Backup.
* [ ] Restore testing.

The production security requirements are explicitly listed in the specification.

---

# PHASE 13 — Audit & Monitoring

## Objective

Know what is happening in the system.

Log:

```text
Login success
Login failure
Logout
Role change
Account disabled
Privileged action
Authorization failure
Token validation failure
```

Create an administration/audit view:

```text
Timestamp
User
Application
Action
Result
IP / request metadata
```

Protect audit logs from unauthorized modification.

## Deliverable

The IT team can investigate security and authentication events.

---

# PHASE 14 — Testing

## Functional Testing

* [ ] Student login.
* [ ] Faculty login.
* [ ] Staff login.
* [ ] Admin login.
* [ ] Multiple applications.
* [ ] SSO behaviour.
* [ ] Logout.
* [ ] Session expiry.
* [ ] Role restrictions.

## Security Testing

* [ ] Token manipulation.
* [ ] Invalid issuer.
* [ ] Invalid audience.
* [ ] Expired token.
* [ ] Fake headers.
* [ ] Direct backend access.
* [ ] CSRF.
* [ ] CORS.
* [ ] Open redirects.
* [ ] Privilege escalation.
* [ ] Session fixation.
* [ ] Session theft scenarios.

## Deliverable

Security and functional test report.

---

# PHASE 15 — Production Deployment

Only after everything above works.

## Deployment

```text
                         DYPIU USERS
                             │
                           HTTPS
                             │
                       ┌───────────┐
                       │   NGINX   │
                       └─────┬─────┘
                             │
          ┌──────────────────┼──────────────────┐
          ↓                  ↓                  ↓
       Intranet             UDMS               LMS
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ↓
                         Keycloak
                             │
                     ┌───────┴───────┐
                     ↓               ↓
                  Google          SIS/HR/ERP
```

## Final checks

* [ ] HTTPS everywhere.
* [ ] Backups configured.
* [ ] Monitoring configured.
* [ ] Logs centralized.
* [ ] Secrets protected.
* [ ] Recovery tested.
* [ ] Security testing completed.
* [ ] Documentation completed.
* [ ] Admin runbook completed.
* [ ] IT team handover completed.

---

# Recommended Development Order

Do NOT jump around.

Follow this order:

```text
PHASE 0
Architecture
   ↓
PHASE 1
Server Infrastructure
   ↓
PHASE 2
Keycloak
   ↓
PHASE 3
Google Workspace
   ↓
PHASE 4
Demo OIDC Application
   ↓
PHASE 5
Intranet
   ↓
PHASE 6
University Identity / Roles
   ↓
PHASE 7
Authorization
   ↓
PHASE 8
UDMS / LMS / EMS Integration
   ↓
PHASE 9
NGINX + Network Security
   ↓
PHASE 10
Session Security
   ↓
PHASE 11
Failure + Logout
   ↓
PHASE 12
Security Hardening
   ↓
PHASE 13
Audit + Monitoring
   ↓
PHASE 14
Testing
   ↓
PHASE 15
Production
```

# Most Important Rule

**Don't start building the UI first.**

The technically risky part is:

```text
Google
   ↓
Keycloak
   ↓
OIDC
   ↓
Application
   ↓
Session
   ↓
University identity
   ↓
Authorization
```

Get that working with **one tiny demo application**.

Once that works, the intranet UI and additional applications become much easier.

# Your First Milestone

Your first real milestone should be:

```text
DYPIU Google Account
        ↓
     Keycloak
        ↓
   Demo Application
        ↓
"Welcome, <user>"
```

If you can demonstrate that reliably, you've completed the most important proof-of-concept portion of the entire system.
