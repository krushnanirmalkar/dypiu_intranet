# Phase 14 — Security and Functional Test Report

## Scope

This report records functional and security verification performed for the DYPIU intranet before production release.

Only tests supported by observed runtime evidence or previously recorded controlled verification are marked as passed. Deferred, partial, or unavailable scenarios are explicitly identified.

## Functional Testing

| Test | Result | Evidence / Notes |
|---|---|---|
| Student login | PASS | Controlled student authentication completed successfully through Google Workspace, Keycloak, and the intranet callback flow. |
| Faculty login | PENDING | Dedicated faculty regression testing remains deferred to avoid repeated dependency on faculty accounts. |
| Staff login | PASS | `devadmin@dypiu.ac.in` resolved from Google Directory OU `/Faculty` to base role `staff`, received the Keycloak `staff` realm role, and successfully logged into the intranet. |
| Admin login | PENDING | No operational administrator account has been formally provisioned. No admin account is created solely for testing. |
| Multiple applications | PARTIAL | Role-filtered application catalogue is implemented and verified. Downstream application SSO integrations remain deferred with Phase 8. |
| SSO behaviour | PARTIAL | Google Workspace → Keycloak → intranet SSO is verified for controlled accounts. Cross-application SSO remains pending downstream integrations. |
| Logout | PASS | Session destruction/logout behavior and `logout_success` security audit logging verified. |
| Session expiry | PASS | Absolute application-session expiry verified with a controlled synthetic session. Natural browser expiry remains separate from this verification. |
| Role restrictions | PASS | Authenticated `staff` user was denied access to admin-only `/api/admin/audit` with HTTP 403. Anonymous access returns HTTP 401. |

## Security Testing

| Test | Result | Evidence / Notes |
|---|---|---|
| Token manipulation | PASS | Manipulated/invalid token rejection verified. |
| Invalid issuer | PASS | JOSE issuer validation rejects an invalid issuer. |
| Invalid audience | PASS | JOSE audience validation rejects an invalid audience. |
| Expired token | PASS | Expired token validation failure verified. |
| Fake headers | PASS | Fake identity and role headers did not establish authentication or admin access; the protected backend returned HTTP 401. |
| Direct backend access | PASS | Direct request to `127.0.0.1:3001/api/admin/audit` without a valid session returned HTTP 401. |
| CSRF | INCOMPLETE | No authenticated mutation APIs are currently exposed except logout. Logout remains a state-changing GET endpoint and therefore full CSRF protection must not be claimed. |
| CORS | PASS | Foreign Origin `https://evil.example` received no `Access-Control-Allow-Origin` permission and the protected API returned HTTP 401. |
| Open redirects | PASS | Attacker-supplied `redirect=https://evil.example` was ignored. Login redirected to the configured Keycloak endpoint with the fixed intranet callback URI. |
| Privilege escalation | PASS | Valid authenticated `staff` session was denied access to admin-only `/api/admin/audit` with HTTP 403. |
| Session fixation | PASS | Runtime verification confirmed the pre-auth Redis session key was removed after authentication and replaced by a different authenticated-session key. Session identifiers were compared only using SHA-256 hashes. |
| Session theft scenarios | PARTIAL | Cookie protections and application session limits were verified. Active stolen-cookie replay was not performed. |

## Staff Authentication Verification

Controlled account:

- Email: `devadmin@dypiu.ac.in`
- Google Directory OU: `/Faculty`
- Directory base role: `staff`
- Directory account status: `active`
- Keycloak realm role: `staff`
- Keycloak account enabled: yes
- Browser login: successful

The account successfully reached the authenticated intranet dashboard.

## Authorization Boundary Verification

Observed behavior:

- Anonymous direct backend `/api/admin/audit` → HTTP 401.
- Anonymous public HTTPS `/api/admin/audit` → HTTP 401.
- Authenticated `staff` `/api/admin/audit` → HTTP 403.
- Successful admin HTTP 200 path remains pending formal administrator provisioning.

This provides runtime evidence that a normal staff session cannot elevate itself into an admin authorization context.

## Session Fixation Verification

A fresh private browser login created an isolated pre-authentication session.

Redis session keys were never printed or inspected directly. Each key was represented only by a SHA-256 hash.

Observed sequence:

1. Baseline Redis session count: 4.
2. Starting the fresh OIDC login created one additional pre-authentication session.
3. Pre-authentication session count: 5.
4. After successful authentication, the pre-authentication session hash disappeared.
5. A different session-key hash appeared.
6. Total session count remained 5.

This confirms at runtime that `req.session.regenerate()` replaced the pre-authentication session identifier when establishing the authenticated session.

## Session-Cookie Verification

Observed login cookie controls:

- Name: `__Host-dypiu-session`
- `Secure`
- `HttpOnly`
- `SameSite=Lax`
- `Path=/`
- Approximately 30-minute rolling expiry
- Five-hour absolute authenticated-session lifetime enforced by the application

These controls reduce session theft and cross-site session abuse risk. Active stolen-session replay was not performed.

## CORS Verification

A request to `/api/me` using `Origin: https://evil.example` returned HTTP 401 and did not return an `Access-Control-Allow-Origin` header granting that origin access.

## Open Redirect Verification

A request to `/login?redirect=https://evil.example` redirected to the configured Keycloak authorization endpoint.

The OIDC `redirect_uri` remained `https://intranet.dypiu.ac.in/auth/callback`. The attacker-controlled URL was not used as a redirect target.

## Audit API Deployment Routing Finding

During Phase 14 testing, `/api/admin/audit` initially returned the React SPA because NGINX had no explicit proxy location for the endpoint.

Production NGINX was updated with an exact `/api/admin/audit` proxy route to `127.0.0.1:3001` using the same forwarded headers as the existing backend API routes.

After reload:

- Anonymous public `/api/admin/audit` → HTTP 401.
- Authenticated staff `/api/admin/audit` → HTTP 403.

The repository currently contains no source-controlled NGINX configuration, so this routing requirement must also be documented as part of deployment operations.

## Outstanding Items

The following remain intentionally incomplete or deferred:

- Dedicated faculty login regression validation.
- Operational admin login and successful admin audit-page/API verification.
- Cross-application SSO testing until downstream integrations are implemented.
- Full multiple-application integration testing.
- Full CSRF protection while logout remains GET.
- Active stolen-session replay simulation.

These items must not be represented as completed.

## Phase 14 Status

Phase 14 testing is substantially complete for the current implementation scope.

Verified runtime evidence now covers staff authentication, authorization boundaries, privilege escalation prevention, session fixation protection, CORS behavior, direct-backend protection, fake-header resistance, open-redirect resistance, session-cookie protections, and previously verified token-validation scenarios.

Remaining gaps are explicit operational or deferred integration dependencies.

Final release validation must be repeated on the combined final `dev` revision after any parallel frontend changes are merged, before `dev` is promoted to `main`.
