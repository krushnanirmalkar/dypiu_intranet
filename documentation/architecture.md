# DYPIU Campus Intranet

## System Architecture

## 1. Overview

The DYPIU Campus Intranet provides a central dashboard and unified sign-on experience for campus-developed applications.

The system uses:

* NGINX for TLS termination and fixed routing.
* Keycloak as the central SSO and OIDC identity broker.
* Google Workspace for institutional authentication.
* SIS / HR / ERP as the authoritative source for university identity and roles.
* Individual application sessions and backend authorization.

The architecture uses **direct OIDC integration** between applications and Keycloak.

There is no separate authentication proxy.

---

# 2. High-Level Architecture

```text
                         CAMPUS USER
                              │
                              │ HTTPS
                              ▼
                       ┌─────────────┐
                       │    NGINX    │
                       │ TLS + Route │
                       └──────┬──────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       ┌───────────┐    ┌───────────┐    ┌───────────┐
       │ INTRANET  │    │   UDMS    │    │    LMS    │
       │   APP     │    │   APP     │    │   APP     │
       └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
             │                │                │
             └────────────────┼────────────────┘
                              │
                             OIDC
                              │
                              ▼
                       ┌─────────────┐
                       │  KEYCLOAK   │
                       │ SSO + OIDC  │
                       │   Broker    │
                       └──────┬──────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
        Google Workspace             SIS / HR / ERP
        Authentication               University Data
```

---

# 3. Component Responsibilities

## NGINX

NGINX is responsible for:

* TLS termination.
* TLS re-encryption where required.
* Fixed domain routing.
* Routing requests to approved upstream applications.
* Network-level restrictions.

NGINX does **not** make authentication or authorization decisions.

---

## Keycloak

Keycloak is responsible for:

* Central SSO.
* OIDC identity brokering.
* Maintaining the central SSO session.
* Connecting applications through OIDC.
* Brokering authentication to Google Workspace.
* Providing application-specific identity and authorization claims.

---

## Google Workspace

Google Workspace provides institutional authentication.

It proves control of the user's university Google account and applies the university authentication and MFA policies.

Google authentication alone does not establish the user's PRN or university role.

---

## SIS / HR / ERP

These systems provide authoritative university identity information.

Depending on the user, this can include:

* PRN.
* Student / faculty / staff status.
* Account status.
* University roles.

Applications should not treat the browser or email address as the authoritative source for these values.

---

## Campus Applications

Each application:

* Registers independently with Keycloak.
* Uses OIDC for authentication.
* Maintains its own local session.
* Validates OIDC responses.
* Enforces authorization on its backend.
* Uses its own host-only session cookie.

---

# 4. Application Registration

Every campus application is registered as a separate Keycloak OIDC client.

Example:

```text
Keycloak
│
├── intranet-client
├── udms-client
├── lms-client
└── ems-client
```

Each client has:

* Exact redirect URI.
* Exact post-logout URI.
* Application-specific audience.
* Application-specific scopes.
* Application-specific roles.

Wildcard redirect URLs are not permitted.

---

# 5. Domain Structure

Proposed structure:

```text
auth.dypiu.ac.in
intranet.dypiu.ac.in
udms.dypiu.ac.in
lms.dypiu.ac.in
ems.dypiu.ac.in
```

The final domain structure must be approved by the university IT/infrastructure team before production deployment.

---

# 6. Trust Boundaries

The system has several important trust boundaries:

```text
Browser
   │
   │ HTTPS
   ▼
NGINX
   │
   │ controlled upstream connection
   ▼
Application
   │
   │ OIDC
   ▼
Keycloak
   │
   ├── Google Workspace
   │
   └── SIS / HR / ERP
```

The browser is never trusted as an authority for:

* User identity.
* PRN.
* Role.
* Permissions.
* Authentication state.

---

# 7. Core Security Principle

Identity is accepted only through a validated OIDC transaction.

Applications must not trust:

```text
X-User
X-Role
X-PRN
X-Forwarded-User
```

or similar browser/proxy-supplied identity headers.

---

# 8. Application Session Model

Keycloak maintains the central SSO session.

Each application separately maintains its own local session.

```text
Keycloak SSO Session
        │
        ├── Intranet Session
        ├── UDMS Session
        ├── LMS Session
        └── EMS Session
```

A shared cookie across all applications is prohibited.

---

# 9. Authorization Model

Authentication:

> Who are you?

Authorization:

> What are you allowed to do?

The application backend must perform authorization checks for protected:

* Pages.
* APIs.
* Actions.
* Sensitive operations.

UI visibility is not authorization.

---

# 10. Design Principle

Keep each component responsible for one major function:

```text
NGINX
→ Network + TLS + Routing

Keycloak
→ SSO + OIDC + Identity Brokering

Google
→ Institutional Authentication

SIS / HR / ERP
→ University Identity + Roles

Application
→ Business Logic + Local Session + Authorization
```

This separation should be preserved throughout implementation.
