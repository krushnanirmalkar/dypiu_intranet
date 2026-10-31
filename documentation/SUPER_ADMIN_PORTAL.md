# DYPIU UniOne Super Admin Portal Documentation

## 1. Overview & Architecture

The **DYPIU UniOne Super Admin Portal** is an administrative control suite integrated into the DYPIU UniOne intranet platform. It provides university administrators with unified management of campus notices, digital applications, governance policies, and immutable security audit logs.

### Core Architecture Principles
- **Additive & Non-Disruptive**: Super Admin functionality builds on top of the existing student/staff intranet architecture without replacing or breaking standard user portals, Keycloak authentication, or session mechanics.
- **Trusted Server-Side Authorization**: Super Admin capability is determined strictly on the backend via trusted session state (`req.session.user.roles`). Frontend state or browser payload can never forge admin privilege.
- **Base Role + Capability Model**: A Super Admin possesses base role `staff` plus the capability role `super_admin` (`roles: ["staff", "super_admin"]`). Administrators retain full access to standard staff portal features.

---

## 2. Permission & Identity Model

### Backend Authorization Middleware
All administrative API routes under `/api/admin/*` are protected by `requireSuperAdmin` middleware (`backend/middleware/auth.js`):
1. **Unauthenticated Request**: Returns `401 Unauthorized`.
2. **Authenticated non-Super Admin**: Returns `403 Forbidden` and logs a security audit violation.
3. **Authorized Super Admin**: Access granted.

### Keycloak Role Configuration (Production Step)
To assign Super Admin privileges to a user in Keycloak:
1. Log into the Keycloak Administration Console (`https://intranet.dypiu.ac.in/keycloak/admin`).
2. Select the `dypiu` realm.
3. Go to **Realm Roles** → Click **Create Role**.
4. Set Role Name: `super_admin`, Description: `UniOne Super Administrator`. Click **Save**.
5. Go to **Users** → Search and select the target administrator user account.
6. Navigate to the **Role mapping** tab → Click **Assign role** → Select `super_admin`.
7. Next time the user logs in via Google Workspace OIDC, Keycloak will include `super_admin` in `realm_access.roles`, which `backend/server.js` parses into `req.session.user.roles`.

---

## 3. Data Persistence & Storage

### Storage Architecture
- **Database**: PostgreSQL (`dypiu_intranet`)
- **Data Access Module**: `backend/data/store.js`
- **Database Abstraction**: `backend/db/index.js`
- **Schema Collections**:
  - `applications`: Campus applications, role visibility, SSO configuration, and display order.
  - `notices`: Official campus notices with audience targeting (`All`, `Students`, `Staff`), categories (`Academic`, `Administrative`, `Campus`, `Urgent`), and lifecycle status (`draft`, `published`, `archived`).
  - `policies`: Governance policy documents with versioning, effective dates, and publication status.
  - `access_rules`: Role-based and email-based delegated service access control rules.
  - `audit_logs`: Append-only, immutable administrative audit events.

---

## 4. REST API Specification

### User-Facing Endpoints
- `GET /api/me`: Returns authenticated user profile including `isSuperAdmin: boolean`.
- `GET /api/applications`: Returns active applications (`enabled: true`) authorized for the current user's role.
- `GET /api/notices`: Returns published notices targeted to the user's role or `All`.
- `GET /api/policies`: Returns published university policy documents.

### Admin Portal Endpoints (Requires `requireSuperAdmin`)
- `GET /api/admin/dashboard`: Returns summary stats (active notices, published applications, active policies, recent actions count) and recent activity lists.
- `GET /api/admin/notices`: List notices (filterable by `category`, `audience`, `status`).
- `POST /api/admin/notices`: Create a notice (validates title, content length, category, audience, priority, status).
- `GET /api/admin/notices/:id`: Fetch single notice by ID.
- `PUT /api/admin/notices/:id`: Update notice details or publish/draft status.
- `DELETE /api/admin/notices/:id`: Archive/delete notice.
- `GET /api/admin/applications`: List all applications (including disabled).
- `POST /api/admin/applications`: Create an application (validates name and URL safety; blocks `javascript:`/`data:` URLs).
- `GET /api/admin/applications/:id`: Fetch single application.
- `PUT /api/admin/applications/:id`: Update application attributes or enable/disable toggle.
- `DELETE /api/admin/applications/:id`: Remove application.
- `GET /api/admin/policies`: List policies (filterable by `category`, `status`).
- `POST /api/admin/policies`: Create a policy.
- `GET /api/admin/policies/:id`: Fetch policy by ID.
- `PUT /api/admin/policies/:id`: Update policy text or version.
- `DELETE /api/admin/policies/:id`: Archive/delete policy.
- `GET /api/admin/audit`: Fetch security audit event log (filterable by `action`, `resourceType`, `search`).

---

## 5. Security & Safety Controls

1. **Input & URL Sanitization**:
   - Application URLs are validated on both frontend and backend using `isValidSafeUrl()`.
   - Protocol handlers `javascript:`, `data:`, and `vbscript:` are strictly rejected to prevent XSS.
2. **Immutable Audit Trail**:
   - Every administrative mutation automatically generates an audit event containing `timestamp`, `actorEmail`, `actorSub`, `action`, `resourceType`, `resourceId`, and HTTP request metadata (`ip`, `method`, `path`).
   - Tokens, passwords, client secrets, and sensitive session headers are **never** logged.
3. **No Direct Production Modifications**:
   - Production deployment requires standard git deployment pipelines and explicit Keycloak role assignment.

---

## 6. Environment Variables

| Variable | Description | Required | Default |
| --- | --- | --- | --- |
| `PORT` | Backend HTTP port | No | `3001` |
| `SESSION_SECRET` | Secret key for Express session signing | Yes | — |
| `KEYCLOAK_CLIENT_SECRET` | Keycloak OIDC client secret | Yes | — |
| `DIRECTORY_ROLE_SERVICE_URL` | Microservice URL for profile photos | No | — |
| `DIRECTORY_LOOKUP_TOKEN` | Bearer token for photo service | No | — |

---

## 7. Local Development & Testing

### Running Tests
To verify backend authorization, persistence, CRUD operations, URL safety, and audit logging:
```bash
node backend/tests/adminApi.test.js
```

### Running Type Check & Lint
```bash
npx tsc --noEmit
npm run lint
```

### Running Production Build
```bash
npm run build
```

---

## 8. Deployment & Rollback Steps

### Deployment Steps
1. Push committed changes on `dev` branch to remote repository.
2. Ensure standard backend dependencies (`express`, `connect-redis`, `jose`, `redis`) are installed on target server.
3. Configure Keycloak `super_admin` realm role as described in Section 2.
4. Restart backend service (`systemctl restart dypiu-intranet-backend.service`).
5. Verify `/health` endpoint and test admin login with an authorized account.

### Rollback Procedure
1. Revert to the prior git commit (`git checkout <previous-commit-hash>`).
2. Run `npm run build` and restart backend service.
3. The JSON store (`backend/data/store.json`) is backward-compatible and does not require destructive database rollbacks.
