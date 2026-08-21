# DYPIU Campus Intranet

## OIDC & SSO Authentication Flow

## 1. Purpose

This document describes how users authenticate into DYPIU campus applications using Keycloak, Google Workspace and OpenID Connect.

The same authentication pattern is used independently by every campus application.

---

# 2. Main Flow

```text
User
 │
 ▼
Campus Application
 │
 │ No valid local session
 ▼
Keycloak
 │
 ▼
Google Workspace
 │
 │ Authentication + MFA
 ▼
Keycloak
 │
 │ OIDC Authorization Code
 ▼
Application Backend
 │
 │ Token validation
 ▼
Application Session
 │
 ▼
User Dashboard
```

---

# 3. Step-by-Step Flow

## Step 1 — Application Entry

The user opens an approved campus application.

Example:

```text
https://udms.dypiu.ac.in
```

NGINX receives the HTTPS request and routes it to the configured application.

---

## Step 2 — Local Session Check

The application checks its own host-only session cookie.

If valid:

```text
Session valid
     ↓
Continue to application
```

If missing, invalid or expired:

```text
No valid session
     ↓
Start OIDC login
```

---

# 4. Step 3 — OIDC Authorization Request

The application redirects the browser to Keycloak.

The request uses:

* Authorization Code Flow.
* PKCE S256.
* Transaction-specific `state`.
* OIDC `nonce`.

Conceptually:

```text
Application
    ↓
Keycloak
    │
    ├── client_id
    ├── redirect_uri
    ├── state
    ├── nonce
    └── code_challenge
```

---

# 5. Step 4 — Google Authentication

Keycloak redirects the user to Google Workspace.

Google authenticates the institutional account and applies university authentication and MFA policies.

```text
Keycloak
    ↓
Google Workspace
    ↓
Authentication
    ↓
MFA / Security Policy
```

---

# 6. Step 5 — Google Response Validation

Keycloak validates the Google authentication response.

Validation includes:

* Issuer.
* Signature.
* Audience.
* Expiry.
* Hosted domain.

The university domain must be present in the signed token.

The application must never simply trust the email/domain supplied by the browser.

---

# 7. Step 6 — University Identity Mapping

Keycloak associates the Google account with a stable university user identity.

University information is obtained from authoritative systems:

```text
SIS / HR / ERP
```

Possible information:

```text
University User ID
PRN
Status
Student / Faculty / Staff
Roles
```

Google subject + issuer should be used for external account linking.

Email should not be used as the permanent identity identifier.

---

# 8. Step 7 — Authorization Code

After successful authentication, Keycloak redirects the browser back to the application's exact registered callback URL.

The authorization code is:

* Short-lived.
* Single-use.
* Bound to the registered redirect URI.

---

# 9. Step 8 — Code Exchange

The application backend exchanges the authorization code with Keycloak.

The backend validates the returned OIDC tokens.

Tokens remain server-side.

They are not stored in browser localStorage.

---

# 10. Step 9 — Application Session

After successful validation, the application creates its own local server-side session.

The browser receives an application-specific cookie.

Example:

```text
__Host-udms-session
```

The cookie should be:

```text
Secure
HttpOnly
SameSite=Lax
Host-only
```

---

# 11. Step 10 — Authorization

The application checks:

```text
Is the user authenticated?
        ↓
Is the university account active?
        ↓
Does the user have the required role?
        ↓
Allow / Deny
```

Authorization must happen on the backend.

---

# 12. Opening Another Application

Suppose the user is already logged into UDMS.

They open LMS.

```text
UDMS
 ↓
LMS
 ↓
LMS has no local session
 ↓
Keycloak
 ↓
Keycloak already has SSO session
 ↓
No Google login required
 ↓
LMS receives authorization code
 ↓
LMS creates its own local session
```

Therefore:

```text
One Keycloak SSO session
        ↓
Multiple independent application sessions
```

---

# 13. Application Logout

Logging out from one application invalidates that application's local session.

Example:

```text
Logout from UDMS
        ↓
UDMS session destroyed
        ↓
LMS session remains
```

---

# 14. Global Logout

For global logout:

```text
Application
    ↓
OIDC RP-Initiated Logout
    ↓
Keycloak
    ↓
Keycloak SSO session terminated
    ↓
Back-channel logout where supported
```

---

# 15. Session Expiry

If an application session expires:

```text
Application session expired
        ↓
New OIDC transaction
        ↓
Keycloak
        ↓
Existing Keycloak SSO session?
        │
       YES
        ↓
Immediate authentication
        ↓
New application session
```

The user may not need to enter Google credentials again.

---

# 16. Failure Behaviour

### Invalid token

```text
Token validation fails
        ↓
Reject authentication
```

### Invalid role

```text
Authentication succeeds
        ↓
Authorization fails
        ↓
403 / Access Denied
```

### Disabled university account

```text
Account disabled
        ↓
Access denied
        ↓
Relevant session invalidated
```

### Google unavailable

Existing valid application sessions may continue according to policy.

New authentication attempts fail safely.

---

# 17. Important Rules

Never:

* Store OIDC tokens in localStorage.
* Trust browser identity headers.
* Use email as the permanent university identifier.
* Use ID tokens as API access tokens.
* Use wildcard redirect URIs.
* Use a shared application session cookie.
* Rely on frontend visibility for authorization.

Always:

* Validate issuer.
* Validate signature.
* Validate audience.
* Validate expiry.
* Validate required scopes/roles.
* Use server-side sessions.
* Use application-specific clients.
* Use backend authorization.
