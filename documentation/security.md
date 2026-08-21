# DYPIU Campus Intranet

## Security Requirements

## 1. Security Objective

The system must ensure that:

1. Only authenticated university users can access protected applications.
2. Authentication comes from a validated OIDC transaction.
3. University roles come from authoritative university systems.
4. Applications independently enforce authorization.
5. Application sessions are isolated.
6. Direct backend access cannot bypass authentication.
7. Sensitive operations receive stronger protection.

---

# 2. Identity Security

The system must never trust identity supplied directly by the browser.

Do not trust:

```text
X-User
X-Role
X-PRN
X-Forwarded-User
```

Identity must originate from a validated OIDC transaction.

---

# 3. Google Identity

Google authentication proves control of the institutional Google account.

It does not independently prove:

* PRN.
* University role.
* Student/faculty/staff status.

These must come from the authoritative university identity source.

---

# 4. Token Validation

Applications or APIs receiving OIDC/OAuth tokens must validate:

* Signing algorithm.
* Signature.
* Issuer.
* Audience.
* Expiry.
* Not-before time.
* Token type.
* Subject.
* Required scopes.
* Required roles.

APIs should accept audience-restricted access tokens rather than ID tokens.

---

# 5. Session Security

Every application maintains a separate session.

Example:

```text
UDMS
__Host-udms-session

LMS
__Host-lms-session

EMS
__Host-ems-session
```

Required properties:

```text
Host-only
Secure
HttpOnly
SameSite=Lax
Opaque session ID
Server-side session
```

A shared `.dypiu.ac.in` cookie must not be used.

---

# 6. Session Lifetime

Define:

* Idle timeout.
* Absolute timeout.
* Keycloak session lifetime.
* Application session lifetime.
* Access-token lifetime.
* Refresh-token policy.

Shorter lifetimes should be considered for privileged applications and sensitive operations.

---

# 7. Authorization

Every protected backend endpoint must verify authorization.

Example:

```text
Request
   ↓
Authentication check
   ↓
Account status
   ↓
Role / permission check
   ↓
Business operation
```

Frontend controls are only UX features.

They are never security boundaries.

---

# 8. Sensitive Operations

Sensitive operations may require stronger authorization and step-up MFA.

Examples include:

* Marks.
* Fees.
* Payroll.
* Role changes.
* Administrative actions.

---

# 9. NGINX Security

NGINX should:

* Terminate TLS.
* Route using fixed configuration.
* Re-encrypt traffic where required.
* Remove untrusted forwarding headers.
* Restrict backend network access.

NGINX should not become the application's authentication authority.

---

# 10. Network Security

Applications and Keycloak should accept network connections only from approved ingress or internal service addresses.

Direct backend access should be blocked.

Even if a backend is reached directly, it must still require a valid application session or access token.

---

# 11. Web Security

Applications should implement:

* CSRF protection.
* CORS restrictions.
* Content Security Policy.
* Clickjacking protection.
* Open-redirect protection.
* Rate limiting.
* Secure headers.

---

# 12. Administrative Security

Administrative access must use:

* Separate named administrator accounts.
* Restricted admin-console access.
* Strong MFA.
* Phishing-resistant MFA for privileged administrators where supported.
* Complete audit logging.

Shared administrator accounts should not be used.

---

# 13. Secrets

Protect:

* Keycloak client secrets.
* Database credentials.
* Signing keys.
* API credentials.
* Google credentials.

Secrets should not be committed to Git.

Use a managed secret store or appropriately secured server-side secret management.

Secrets should be rotated according to university policy.

---

# 14. Audit Logging

Log:

```text
Successful login
Failed login
Logout
Authorization failure
Role change
Account disablement
Privileged action
Token validation failure
```

Audit logs must be protected from unauthorized modification.

---

# 15. Key Rotation

Implement a process for:

* OIDC signing key rotation.
* Client secret rotation.
* API credential rotation.
* Backup encryption key management where applicable.

---

# 16. Backup & Recovery

Back up:

* Keycloak configuration.
* Keycloak database.
* Application configuration.
* Important application data.
* Audit logs where required.

Recovery must be tested rather than assuming backups are usable.

---

# 17. Security Testing

Before production:

* Test role bypass.
* Test token manipulation.
* Test invalid issuer.
* Test invalid audience.
* Test expired tokens.
* Test direct backend access.
* Test fake headers.
* Test CSRF.
* Test CORS.
* Test open redirects.
* Test privilege escalation.
* Test session fixation.
* Test session invalidation.

A threat model, configuration review and penetration test should be completed before production deployment.
