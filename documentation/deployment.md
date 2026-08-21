# DYPIU Campus Intranet

## Deployment Plan

## 1. Deployment Model

The system is intended to run on DYPIU's in-house server infrastructure.

Primary components:

```text
Ubuntu Server
│
├── NGINX
├── Keycloak
├── PostgreSQL
├── Intranet
├── UDMS
├── LMS
└── EMS
```

Docker/Docker Compose can be used to simplify deployment and service management.

---

# 2. Server Structure

Suggested directory structure:

```text
/opt/dypiu/
│
├── nginx/
│   ├── conf/
│   └── certs/
│
├── keycloak/
│   └── docker-compose.yml
│
├── postgres/
│
├── intranet/
│
├── udms/
│
├── lms/
│
└── ems/
```

Production paths and permissions must be finalized with the university infrastructure team.

---

# 3. Network Architecture

```text
Users
  │
  │ HTTPS
  ▼
NGINX
  │
  ├── intranet.dypiu.ac.in
  ├── udms.dypiu.ac.in
  ├── lms.dypiu.ac.in
  └── ems.dypiu.ac.in
  │
  ▼
Application Containers
  │
  ▼
Keycloak / Internal Services
```

Backends should not be publicly exposed unnecessarily.

---

# 4. NGINX

NGINX provides:

* HTTPS termination.
* Fixed domain routing.
* Upstream routing.
* Network restrictions.
* TLS re-encryption where required.

Each application should have an explicit upstream configuration.

---

# 5. HTTPS

All production application traffic should use HTTPS.

Required:

```text
HTTP
 ↓
Redirect / reject
 ↓
HTTPS
```

Secure cookies depend on HTTPS.

---

# 6. Keycloak Deployment

Keycloak should run as an internal service behind the approved network layer.

Example:

```text
auth.dypiu.ac.in
       ↓
NGINX
       ↓
Keycloak
       ↓
PostgreSQL
```

The Keycloak database should not be directly exposed to users.

---

# 7. Application Deployment

Each application should have its own deployment.

Example:

```text
Intranet
   ↓
Build
   ↓
Deploy
   ↓
intranet.dypiu.ac.in

UDMS
   ↓
Build
   ↓
Deploy
   ↓
udms.dypiu.ac.in
```

---

# 8. Environment Variables

Sensitive configuration should be supplied through environment variables or secure secret management.

Example:

```text
OIDC_ISSUER
OIDC_CLIENT_ID
OIDC_CLIENT_SECRET
OIDC_REDIRECT_URI
SESSION_SECRET
DATABASE_URL
```

Never commit production secrets to Git.

---

# 9. Development Environment

Development can initially run locally:

```text
Developer PC
│
├── Keycloak
├── PostgreSQL
├── NGINX
└── Demo Application
```

Once the flow works:

```text
Local
 ↓
Development Server
 ↓
University In-House Server
```

---

# 10. Deployment Order

Deploy in this order:

```text
1. PostgreSQL
2. Keycloak
3. Google integration
4. NGINX
5. Demo application
6. Intranet
7. Identity integration
8. UDMS
9. LMS
10. EMS
11. Other applications
```

---

# 11. Backups

Backups should cover:

* Keycloak database.
* Keycloak configuration.
* Application databases.
* Important application configuration.
* Required audit information.

Backups should be stored separately from the primary service where possible.

---

# 12. Monitoring

Monitor:

* Server health.
* CPU.
* Memory.
* Disk.
* Network.
* Keycloak availability.
* Application availability.
* Authentication failures.
* HTTP errors.
* Database availability.

---

# 13. Production Checklist

* [ ] HTTPS configured.
* [ ] DNS configured.
* [ ] Firewall configured.
* [ ] Backend ports restricted.
* [ ] Keycloak secured.
* [ ] Google integration tested.
* [ ] OIDC clients configured.
* [ ] Application sessions secured.
* [ ] Authorization tested.
* [ ] Logging enabled.
* [ ] Monitoring enabled.
* [ ] Backups configured.
* [ ] Recovery tested.
* [ ] Security testing completed.
* [ ] Documentation completed.
* [ ] IT team approval obtained.

---

# 14. Rollback Strategy

Every production deployment should have a rollback plan.

Before deployment:

```text
Backup
 ↓
Deploy
 ↓
Health check
 ↓
Functional test
 ↓
Release
```

If the deployment fails:

```text
Failure
 ↓
Stop deployment
 ↓
Restore previous version
 ↓
Verify service
 ↓
Investigate
```

---

# 15. Final Production Architecture

```text
                         DYPIU USERS
                              │
                            HTTPS
                              │
                       ┌────────────┐
                       │   NGINX    │
                       └─────┬──────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
          Intranet          UDMS           LMS
              │              │              │
              └──────────────┼──────────────┘
                             │
                          OIDC
                             │
                             ▼
                       ┌───────────┐
                       │ Keycloak  │
                       └─────┬─────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
              Google                SIS / HR / ERP
             Workspace
```
