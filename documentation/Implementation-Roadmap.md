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

* [ ] Understand OIDC and OAuth 2.0 basics.
* [ ] Understand Keycloak's role.
* [ ] Understand Google → Keycloak authentication.
* [ ] Understand Authorization Code Flow + PKCE.
* [ ] Understand access token vs ID token.
* [ ] Understand server-side sessions.
* [ ] Understand NGINX reverse proxying.
* [ ] Understand role-based authorization.
* [ ] Finalize domain structure.

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

* [ ] Prepare Ubuntu Server.
* [ ] Configure static/internal networking.
* [ ] Configure firewall.
* [ ] Install Docker.
* [ ] Install Docker Compose.
* [ ] Install NGINX.
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

* [ ] Deploy Keycloak.
* [ ] Configure PostgreSQL for Keycloak.
* [ ] Create DYPIU realm.
* [ ] Configure administrator access.
* [ ] Configure HTTPS.
* [ ] Configure realm settings.
* [ ] Understand users, groups, roles and clients.
* [ ] Configure session settings.
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

* [ ] Configure Google Workspace identity provider.
* [ ] Configure Google OAuth/OIDC credentials.
* [ ] Restrict authentication to the DYPIU domain.
* [ ] Configure redirect URLs.
* [ ] Verify Google issuer.
* [ ] Verify signed token.
* [ ] Verify audience.
* [ ] Verify expiry.
* [ ] Verify institutional domain claim.
* [ ] Test MFA behaviour.

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

* [ ] Create application.
* [ ] Register it as a Keycloak OIDC client.
* [ ] Configure exact redirect URI.
* [ ] Configure post-logout URI.
* [ ] Implement Authorization Code + PKCE.
* [ ] Implement state.
* [ ] Implement nonce.
* [ ] Implement callback.
* [ ] Exchange authorization code on backend.
* [ ] Validate returned tokens.
* [ ] Create server-side session.
* [ ] Create secure cookie.
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

## Phase 11 Verification Status

Evidence collected during implementation and controlled testing:

* Normal logout — tested with an authenticated synthetic Redis session. Local session was destroyed, the session cookie was cleared, and the browser was redirected to the Keycloak logout endpoint.
* Global logout — implementation verified. The logout request includes the fixed `client_id`, fixed `post_logout_redirect_uri`, and `id_token_hint` when available. Full browser SSO invalidation remains pending a controlled authenticated-user test.
* Session expiry — tested for the absolute session timeout path using an authenticated synthetic Redis session older than the configured maximum age. The session was destroyed, the cookie was cleared, and the request was redirected to `/signed-out`.
* Invalid token — tested. Rejected authorization-code exchange and invalid-signature validation are denied.
* Expired token — tested at the JOSE validation layer and classified as an authentication failure.
* Invalid audience — tested at the JOSE validation layer and classified as an authentication failure.
* Invalid issuer — tested at the JOSE validation layer and classified as an authentication failure.
* Disabled account — fail-closed implementation verified. Suspended or otherwise role-less directory identities cannot receive a valid `student` or `staff` role. Full end-to-end testing remains pending a controlled disabled test account.
* Missing university record — tested. The directory role service returns a controlled `404`, and the REQUIRED Keycloak authenticator rejects non-success responses.
* Google unavailable — pending a safe dependency-outage or controlled test-environment scenario. Production Google Workspace availability was not intentionally disrupted.
* Keycloak unavailable — dependency-failure classification tested safely using an unreachable JWKS endpoint. Full production Keycloak outage testing was not performed.
* Application unavailable — deferred with Phase 8 application integration because the current portal exposes role-filtered external application links rather than integrated application sessions.
* Direct backend access — tested. Protected backend endpoints deny unauthenticated direct requests.
* Fake browser headers — tested. Spoofed identity and role headers do not bypass backend authentication.

Pending scenarios are intentionally retained for later controlled end-to-end or production-readiness testing rather than simulating disruptive outages in the live environment.

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
* [x] CORS policy.
* [x] Content Security Policy.
* [x] Clickjacking protection.
* [x] Open-redirect protection.
* [x] Rate limiting.
* [x] Secure headers.
* [x] Audit logging.
* [ ] Admin account separation.
* [ ] Secret rotation.
* [ ] Key rotation.
* [x] Backup.
* [x] Restore testing.

Verification notes:

* MFA — an isolated post-broker MFA flow was created with the existing
  `DYPIU Directory Base Role` authenticator followed by a REQUIRED Keycloak
  OTP Form. Controlled testing with `20240802084@dypiu.ac.in` verified TOTP
  enrollment, creation of an `otp` credential, automatic removal of the
  `CONFIGURE_TOTP` required action, and presentation of an OTP challenge on a
  subsequent Google login. The post-broker flow then failed to complete with
  Keycloak event `IDENTITY_PROVIDER_POST_LOGIN_ERROR` / `Failed to verify
  login action`. Google was immediately rebound to the stable
  `DYPIU Post Broker Login` flow. MFA remains intentionally deferred and the
  isolated MFA flow remains unbound for future diagnosis.
* Phishing-resistant MFA — WebAuthn capability exists in Keycloak, but no
  privileged administrator account is currently provisioned and no
  phishing-resistant MFA policy has been activated. This remains deferred.
* CORS — cross-origin requests and preflight responses expose no permissive
  `Access-Control-Allow-*` policy; the application remains same-origin.
* CSP/clickjacking/secure headers — production responses verified with CSP,
  `X-Frame-Options`, HSTS, `X-Content-Type-Options`, and Referrer Policy.
* Open redirects — authentication/logout redirect targets are server-controlled.
* Rate limiting — `/login` is limited by NGINX per client IP; controlled burst
  testing verified HTTP 429 responses after the configured burst allowance.
* Audit logging — structured security events are written to journald without
  tokens or session identifiers. Rejected-login and logout paths were verified
  in production. Successful-login logging is implemented but was not exercised
  with a real university account during this phase. Authorization-denial
  logging is implemented but no current live route uses `requireRole()`.
* CSRF — no authenticated data-mutating POST/PUT/PATCH/DELETE routes currently
  exist. SameSite=Lax is enabled on the session cookie. Logout intentionally
  remains a GET endpoint, so full CSRF hardening is not marked complete.
* Admin account separation — the `dypiu` realm has a dedicated `admin` role,
  separate from `student` and `staff`. No current realm user is assigned to
  `admin`. A controlled process for creating/assigning named administrator
  accounts is still outstanding, so this item remains incomplete.
* Secret/key rotation — storage and permissions were reviewed, but existing
  secrets and Keycloak signing keys were intentionally left unchanged.
* Backup — a PostgreSQL custom-format logical backup of the production Keycloak
  database was created with restrictive file permissions and validated with
  PostgreSQL 18 `pg_restore`.
* Restore — the Keycloak backup was restored successfully into an isolated
  temporary PostgreSQL 18 container. The restored database contained 100
  application tables and expected core Keycloak tables. The temporary restore
  environment was removed afterward; production data was not modified.
* Keycloak production mode — migration from `start-dev` to optimized production
  startup was attempted but the existing image contained incompatible persisted
  build-time options. The change was rolled back. OIDC discovery was verified
  HTTP 200 both directly and through the public endpoint after recovery.
  Production-mode image hardening remains outstanding.

Phase 12 is closed for the current implementation scope. Remaining unchecked
items are explicitly deferred or intentionally incomplete and must not be
treated as implemented: MFA, phishing-resistant MFA for privileged
administrators, full CSRF protection while logout remains GET, operational
admin account provisioning/separation, secret rotation, key rotation, and
Keycloak optimized production-mode startup.

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

## Implementation Status

Current audit event coverage:

* [x] Login success — `login_success`.
* [x] Login failure — `login_rejected`.
* [x] Logout — `logout_success`.
* [ ] Role change — no application role-change operation currently exists; defer until an administrative role-management path is introduced.
* [ ] Account disabled — account disabling currently occurs upstream in the university directory/Keycloak path; no backend account-disable operation currently exists.
* [ ] Privileged action — no privileged administrative mutation endpoint currently exists; add audit events when such operations are introduced.
* [x] Authorization failure — `authorization_denied`.
* [x] Token validation failure — `token_validation_failure`.

Administration/audit access:

* [x] Read-only `/api/admin/audit` endpoint implemented.
* [x] Endpoint restricted to the `admin` realm role using `requireRole("admin")`.
* [x] Anonymous access verified to return HTTP 401.
* [x] Audit records expose timestamp, user, application, action, result, and request metadata.
* [x] Request metadata records client IP, HTTP method, and request path only.
* [x] Sensitive authentication material such as tokens, cookies, session IDs, state, nonce values, query strings, and authorization headers is not included in audit metadata.
* [x] Live request-metadata logging verified using a controlled logout event.

Audit-log protection:

* [x] Structured `security_audit` records are retained by persistent systemd journald storage.
* [x] Audit records are stored outside the application repository and application-controlled files.
* [x] The audit API is read-only and provides no audit-log mutation operation.
* [x] No additional sudo, sudoers, or journal permission changes were introduced for the audit API.
* [x] Journal access uses `execFile` with fixed `journalctl` arguments and no shell interpolation.

The successful admin HTTP 200 path remains pending until an operational administrator account is formally provisioned. No administrator account or role assignment is created solely for testing.

Administration/audit UI:

* [x] Admin-only Security Audit Logs page implemented in the existing frontend navigation model.
* [x] Audit page consumes `/api/admin/audit` and displays timestamp, user, application, action, result, and request metadata.
* [x] Audit navigation and rendering are restricted in the frontend to the `admin` role; backend `requireRole("admin")` remains the authoritative authorization boundary.
* [x] Loading, empty, authorization-error, and request-error states implemented.
* [x] Production frontend build and deployment verified at commit `37ff4ba`.
* [x] Public frontend and signed-out routes verified HTTP 200 after deployment.
* [ ] Live audit-page rendering with an authenticated administrator remains pending until an operational administrator account is formally provisioned.

Phase 13 is closed for the current implementation scope. Role-change, account-disabled, and privileged administrative mutation audit events remain deferred until corresponding administrative operations exist. Live administrator UI verification remains pending formal administrator provisioning and must not be treated as completed.

## Deliverable

The IT team can investigate security and authentication events.

---

# PHASE 14 — Testing

## Functional Testing

* [x] Student login.
* [ ] Faculty login.
* [x] Staff login.
* [ ] Admin login.
* [ ] Multiple applications.
* [ ] SSO behaviour.
* [x] Logout.
* [x] Session expiry.
* [x] Role restrictions.

## Security Testing

* [x] Token manipulation.
* [x] Invalid issuer.
* [x] Invalid audience.
* [x] Expired token.
* [x] Fake headers.
* [x] Direct backend access.
* [ ] CSRF.
* [x] CORS.
* [x] Open redirects.
* [x] Privilege escalation.
* [x] Session fixation.
* [ ] Session theft scenarios.

## Phase 14 Verification Notes

The detailed verification record is maintained in `documentation/phase14-testing.md`.

Items intentionally left incomplete:

* Faculty login — controlled faculty regression validation pending.
* Admin login — no operational administrator account provisioned.
* Multiple applications — downstream application integrations remain deferred with Phase 8.
* SSO behaviour — intranet SSO verified; cross-application SSO remains pending downstream integrations.
* CSRF — logout remains a state-changing GET endpoint.
* Session theft scenarios — cookie/session protections verified; active stolen-session replay not performed.

Phase 14 is substantially complete for the current implementation scope. Final validation must be repeated on the combined final `dev` revision after parallel frontend work is merged, before promotion to `main`.

## Phase 15 Completion Notes

Production deployment has been verified for the current implementation.

Completed verification:

* [x] Backend service managed by systemd and configured for automatic restart.
* [x] Frontend deployed successfully.
* [x] HTTPS enabled with security headers.
* [x] Redis session store operational.
* [x] Keycloak and supporting services operational.
* [x] Google Workspace authentication verified.
* [x] Role-based authorization verified.
* [x] Security audit logging verified.
* [x] Deployment runbook created (`documentation/production-runbook.md`).

Operational notes:

* Backend health endpoint is available locally at `http://127.0.0.1:3001/health`.
* No public `/health` endpoint is exposed through NGINX by design.
* Future production changes should follow the documented deployment and rollback procedures.

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
