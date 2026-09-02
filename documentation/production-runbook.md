# DYPIU Intranet Production Runbook

## Overview

This document describes the production deployment, operational procedures, recovery process, and maintenance guidance for the DYPIU Intranet authentication platform.

---

# Production Environment

## Server

- Ubuntu Linux
- HTTPS via NGINX
- Backend:
  - Node.js
  - Express
  - systemd service
- Session Store:
  - Redis
- Identity Provider:
  - Keycloak
- User Source:
  - Google Workspace
  - Directory Role Service

---

# Service Inventory

| Component | Status |
|-----------|--------|
| NGINX | systemd |
| Backend | systemd |
| Redis | Docker |
| Keycloak | Docker |
| PostgreSQL | Docker |

---

# Deployment Layout

Repository

/opt/dypiu-intranet/repo

Backend

/opt/dypiu-intranet/backend

Frontend

/var/www/dypiu-intranet

Backups

/opt/dypiu-intranet/backups

---

# Frontend Deployment

1. Build production assets.
2. Synchronize `dist/` to `/var/www/dypiu-intranet`.
3. Record deployed commit in `.deployed-version`.
4. Verify public access.

---

# Backend Deployment

1. Deploy backend code.
2. Preserve `.env`.
3. Restart:

    sudo systemctl restart dypiu-intranet-backend

4. Verify:

    systemctl status dypiu-intranet-backend

---

# Rollback

Frontend

Restore previous deployment from backup.

Backend

Checkout previous Git revision.

Restart backend service.

---

# Operational Verification

Backend

http://127.0.0.1:3001/health

Redis

docker exec dypiu-redis redis-cli PING

Keycloak

docker ps

Frontend

https://intranet.dypiu.ac.in

---

# Backup Locations

Repository backups

/opt/dypiu-intranet/backups

Application configuration

Backend .env

---

# Security

- HTTPS enforced.
- Secure HttpOnly session cookies.
- Redis-backed sessions.
- Server-side tokens only.
- Structured audit logging.
- Role-based authorization.
- Keycloak OIDC authentication.

---

# Recovery

If backend fails:

1. Restore previous revision.
2. Restart backend.
3. Verify Redis.
4. Verify Keycloak.
5. Verify login.
6. Verify audit logs.

---

# Release Process

1. Complete testing on dev.
2. Merge dev into main.
3. Deploy production.
4. Verify services.
5. Verify authentication.
6. Verify audit logging.
7. Record deployed commit.

