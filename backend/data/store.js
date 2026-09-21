const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const db = require("../db");

const STORE_PATH = path.join(__dirname, "store.json");
const TMP_STORE_PATH = path.join(__dirname, "store.json.tmp");

let cache = null;
let usePostgres = false;

// Check DB connection on startup
(async () => {
  try {
    const success = await db.initDatabase();
    if (success) {
      usePostgres = true;
    }
  } catch (err) {
    console.warn("Using JSON store fallback as PostgreSQL is not connected.");
  }
})();

const initialAccessRules = [
  {
    id: "rule-superadmin",
    name: "Super Admin Full Access",
    targetType: "role",
    targetValue: "super_admin",
    services: ["notices", "policies", "applications", "access", "audit"],
    accessLevel: "full",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    updatedBy: "system"
  },
  {
    id: "rule-admin",
    name: "University Admin Access",
    targetType: "role",
    targetValue: "admin",
    services: ["notices", "policies", "applications", "access", "audit"],
    accessLevel: "full",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    updatedBy: "system"
  },
  {
    id: "rule-staff-default",
    name: "Staff Notice & Policy Access",
    targetType: "role",
    targetValue: "staff",
    services: ["notices", "policies"],
    accessLevel: "read",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    updatedBy: "system"
  }
];

function loadStore() {
  if (cache) return cache;
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, "utf8");
      cache = JSON.parse(content);
      if (!Array.isArray(cache.accessRules)) {
        cache.accessRules = initialAccessRules;
        saveStore(cache);
      }
    } else {
      cache = {
        applications: [],
        notices: [],
        policies: [],
        auditLogs: [],
        accessRules: initialAccessRules
      };
      saveStore(cache);
    }
  } catch {
    cache = {
      applications: [],
      notices: [],
      policies: [],
      auditLogs: [],
      accessRules: initialAccessRules
    };
  }
  return cache;
}

function saveStore(data) {
  try {
    const content = JSON.stringify(data, null, 2);
    try {
      fs.writeFileSync(TMP_STORE_PATH, content, "utf8");
      try {
        fs.renameSync(TMP_STORE_PATH, STORE_PATH);
      } catch {
        fs.writeFileSync(STORE_PATH, content, "utf8");
      }
    } catch {
      fs.writeFileSync(STORE_PATH, content, "utf8");
    }
  } catch {}
  cache = data;
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
}

// -------------------------
// Audit Log Methods
// -------------------------

async function recordAuditEvent(req, action, resourceType, resourceId, summary, details = {}) {
  const user = req?.session?.user || {};
  const event = {
    id: generateId("log"),
    timestamp: new Date().toISOString(),
    actorSub: user.sub || null,
    actorEmail: user.email || "system",
    actorName: user.name || "System Process",
    actorRole: Array.isArray(user.roles) ? user.roles[0] || null : null,
    action,
    resourceType,
    resourceId: resourceId ? String(resourceId) : null,
    summary,
    details: details || {},
    ip: req?.ip || null
  };

  if (usePostgres) {
    try {
      await db.query(
        `INSERT INTO audit_logs (id, timestamp, actor_sub, actor_email, actor_name, actor_role, action, resource_type, resource_id, summary, details, ip)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [event.id, event.timestamp, event.actorSub, event.actorEmail, event.actorName, event.actorRole, event.action, event.resourceType, event.resourceId, event.summary, JSON.stringify(event.details), event.ip]
      );
      return event;
    } catch (err) {
      console.warn("PostgreSQL audit record fallback:", err.message);
    }
  }

  const storeData = loadStore();
  if (!storeData.auditLogs) storeData.auditLogs = [];
  storeData.auditLogs.unshift(event);
  if (storeData.auditLogs.length > 500) {
    storeData.auditLogs = storeData.auditLogs.slice(0, 500);
  }
  saveStore(storeData);
  return event;
}

async function getAuditLogs() {
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, timestamp, actor_sub AS "actorSub", actor_email AS "actorEmail", actor_name AS "actorName", actor_role AS "actorRole", action, resource_type AS "resourceType", resource_id AS "resourceId", summary, details, ip
         FROM audit_logs
         ORDER BY timestamp DESC
         LIMIT 200`
      );
      return res.rows;
    } catch (err) {
      console.warn("PostgreSQL getAuditLogs fallback:", err.message);
    }
  }
  const storeData = loadStore();
  return storeData.auditLogs || [];
}

// -------------------------
// Applications Methods
// -------------------------

async function getApplications(includeDisabled = false) {
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, name, short_name AS "shortName", description, url, icon, category, roles, enabled, display_order AS "displayOrder", sso_enabled AS "ssoEnabled", highlight_color AS "highlightColor", created_at AS "createdAt", updated_at AS "updatedAt", created_by AS "createdBy", updated_by AS "updatedBy"
         FROM applications
         WHERE ($1::boolean = true OR enabled = true)
         ORDER BY display_order ASC, created_at ASC`,
        [includeDisabled]
      );
      return res.rows;
    } catch (err) {
      console.warn("PostgreSQL getApplications fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const list = storeData.applications || [];
  if (includeDisabled) return list;
  return list.filter((app) => app.enabled !== false);
}

async function getApplicationById(id) {
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, name, short_name AS "shortName", description, url, icon, category, roles, enabled, display_order AS "displayOrder", sso_enabled AS "ssoEnabled", highlight_color AS "highlightColor", created_at AS "createdAt", updated_at AS "updatedAt", created_by AS "createdBy", updated_by AS "updatedBy"
         FROM applications
         WHERE id = $1`,
        [id]
      );
      return res.rows[0] || null;
    } catch (err) {
      console.warn("PostgreSQL getApplicationById fallback:", err.message);
    }
  }
  const storeData = loadStore();
  return (storeData.applications || []).find((app) => app.id === id) || null;
}

async function createApplication(appData, req) {
  const id = generateId("app");
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  const newApp = {
    id,
    name: appData.name.trim(),
    shortName: appData.shortName || appData.name.trim(),
    description: appData.description || "",
    url: appData.url.trim(),
    icon: appData.icon || "LayoutDashboard",
    category: appData.category || "Productivity",
    roles: Array.isArray(appData.roles) ? appData.roles : ["student", "staff", "admin"],
    enabled: appData.enabled !== false,
    displayOrder: Number(appData.displayOrder) || 1,
    ssoEnabled: appData.ssoEnabled !== false,
    highlightColor: appData.highlightColor || null,
    createdAt: now,
    updatedAt: now,
    createdBy: actorEmail,
    updatedBy: actorEmail
  };

  if (usePostgres) {
    try {
      await db.query(
        `INSERT INTO applications (id, name, short_name, description, url, icon, category, roles, enabled, display_order, sso_enabled, highlight_color, created_at, updated_at, created_by, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [newApp.id, newApp.name, newApp.shortName, newApp.description, newApp.url, newApp.icon, newApp.category, newApp.roles, newApp.enabled, newApp.displayOrder, newApp.ssoEnabled, newApp.highlightColor, newApp.createdAt, newApp.updatedAt, newApp.createdBy, newApp.updatedBy]
      );
      await recordAuditEvent(req, "application.created", "application", id, `Created application '${newApp.name}'`);
      return newApp;
    } catch (err) {
      console.warn("PostgreSQL createApplication fallback:", err.message);
    }
  }

  const storeData = loadStore();
  if (!storeData.applications) storeData.applications = [];
  storeData.applications.push(newApp);
  saveStore(storeData);
  await recordAuditEvent(req, "application.created", "application", id, `Created application '${newApp.name}'`);
  return newApp;
}

async function updateApplication(id, updates, req) {
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  if (usePostgres) {
    try {
      const existing = await getApplicationById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates, updatedAt: now, updatedBy: actorEmail };

      await db.query(
        `UPDATE applications
         SET name = $1, short_name = $2, description = $3, url = $4, icon = $5, category = $6, roles = $7, enabled = $8, display_order = $9, sso_enabled = $10, highlight_color = $11, updated_at = $12, updated_by = $13
         WHERE id = $14`,
        [updated.name, updated.shortName, updated.description, updated.url, updated.icon, updated.category, updated.roles, updated.enabled, updated.displayOrder, updated.ssoEnabled, updated.highlightColor, updated.updatedAt, updated.updatedBy, id]
      );
      await recordAuditEvent(req, "application.updated", "application", id, `Updated application '${updated.name}'`);
      return updated;
    } catch (err) {
      console.warn("PostgreSQL updateApplication fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const index = (storeData.applications || []).findIndex((app) => app.id === id);
  if (index === -1) return null;

  const updatedApp = { ...storeData.applications[index], ...updates, id, updatedAt: now, updatedBy: actorEmail };
  storeData.applications[index] = updatedApp;
  saveStore(storeData);
  await recordAuditEvent(req, "application.updated", "application", id, `Updated application '${updatedApp.name}'`);
  return updatedApp;
}

async function deleteApplication(id, req) {
  if (usePostgres) {
    try {
      const existing = await getApplicationById(id);
      if (!existing) return false;

      await db.query("DELETE FROM applications WHERE id = $1", [id]);
      await recordAuditEvent(req, "application.deleted", "application", id, `Deleted application '${existing.name}'`);
      return true;
    } catch (err) {
      console.warn("PostgreSQL deleteApplication fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const index = (storeData.applications || []).findIndex((app) => app.id === id);
  if (index === -1) return false;

  const removed = storeData.applications[index];
  storeData.applications.splice(index, 1);
  saveStore(storeData);
  await recordAuditEvent(req, "application.deleted", "application", id, `Deleted application '${removed.name}'`);
  return true;
}

// -------------------------
// Notices Methods
// -------------------------

async function getNotices(filters = {}) {
  const { category, audience, status } = filters;
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, title, content, category, audience, priority, status, author, publish_at AS "publishAt", expires_at AS "expiresAt", attachment_url AS "attachmentUrl", attachment_name AS "attachmentName", attachment_size AS "attachmentSize", created_at AS "createdAt", updated_at AS "updatedAt", created_by AS "createdBy", updated_by AS "updatedBy"
         FROM notices
         WHERE ($1::text IS NULL OR category = $1)
           AND ($2::text IS NULL OR audience = $2)
           AND ($3::text IS NULL OR status = $3)
         ORDER BY created_at DESC`,
        [category || null, audience || null, status || null]
      );
      return res.rows;
    } catch (err) {
      console.warn("PostgreSQL getNotices fallback:", err.message);
    }
  }

  const storeData = loadStore();
  let list = [...(storeData.notices || [])];
  if (category) list = list.filter((n) => n.category === category);
  if (audience) list = list.filter((n) => n.audience === audience || n.audience === "All");
  if (status) list = list.filter((n) => n.status === status);
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list;
}

async function getNoticeById(id) {
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, title, content, category, audience, priority, status, author, publish_at AS "publishAt", expires_at AS "expiresAt", attachment_url AS "attachmentUrl", attachment_name AS "attachmentName", attachment_size AS "attachmentSize", created_at AS "createdAt", updated_at AS "updatedAt", created_by AS "createdBy", updated_by AS "updatedBy"
         FROM notices
         WHERE id = $1`,
        [id]
      );
      return res.rows[0] || null;
    } catch (err) {
      console.warn("PostgreSQL getNoticeById fallback:", err.message);
    }
  }
  const storeData = loadStore();
  return (storeData.notices || []).find((n) => String(n.id) === String(id)) || null;
}

async function createNotice(noticeData, req) {
  const id = generateId("notice");
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  const newNotice = {
    id,
    title: noticeData.title.trim(),
    content: noticeData.content.trim(),
    category: noticeData.category || "Academic",
    audience: noticeData.audience || "All",
    priority: noticeData.priority || "Medium",
    status: noticeData.status || "published",
    author: noticeData.author || req?.session?.user?.name || "University Administration",
    publishAt: noticeData.publishAt || now,
    expiresAt: noticeData.expiresAt || null,
    attachmentUrl: noticeData.attachmentUrl || null,
    attachmentName: noticeData.attachmentName || null,
    attachmentSize: noticeData.attachmentSize || null,
    createdAt: now,
    updatedAt: now,
    createdBy: actorEmail,
    updatedBy: actorEmail
  };

  if (usePostgres) {
    try {
      await db.query(
        `INSERT INTO notices (id, title, content, category, audience, priority, status, author, publish_at, expires_at, attachment_url, attachment_name, attachment_size, created_at, updated_at, created_by, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [newNotice.id, newNotice.title, newNotice.content, newNotice.category, newNotice.audience, newNotice.priority, newNotice.status, newNotice.author, newNotice.publishAt, newNotice.expiresAt, newNotice.attachmentUrl, newNotice.attachmentName, newNotice.attachmentSize, newNotice.createdAt, newNotice.updatedAt, newNotice.createdBy, newNotice.updatedBy]
      );
      await recordAuditEvent(req, "notice.created", "notice", id, `Created notice '${newNotice.title}'`);
      return newNotice;
    } catch (err) {
      console.warn("PostgreSQL createNotice fallback:", err.message);
    }
  }

  const storeData = loadStore();
  if (!storeData.notices) storeData.notices = [];
  storeData.notices.unshift(newNotice);
  saveStore(storeData);
  await recordAuditEvent(req, "notice.created", "notice", id, `Created notice '${newNotice.title}'`);
  return newNotice;
}

async function updateNotice(id, updates, req) {
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  if (usePostgres) {
    try {
      const existing = await getNoticeById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates, updatedAt: now, updatedBy: actorEmail };

      await db.query(
        `UPDATE notices
         SET title = $1, content = $2, category = $3, audience = $4, priority = $5, status = $6, author = $7, publish_at = $8, expires_at = $9, attachment_url = $10, attachment_name = $11, attachment_size = $12, updated_at = $13, updated_by = $14
         WHERE id = $15`,
        [updated.title, updated.content, updated.category, updated.audience, updated.priority, updated.status, updated.author, updated.publishAt, updated.expiresAt, updated.attachmentUrl, updated.attachmentName, updated.attachmentSize, updated.updatedAt, updated.updatedBy, id]
      );
      await recordAuditEvent(req, "notice.updated", "notice", id, `Updated notice '${updated.title}'`);
      return updated;
    } catch (err) {
      console.warn("PostgreSQL updateNotice fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const index = (storeData.notices || []).findIndex((n) => String(n.id) === String(id));
  if (index === -1) return null;

  const updatedNotice = { ...storeData.notices[index], ...updates, id, updatedAt: now, updatedBy: actorEmail };
  storeData.notices[index] = updatedNotice;
  saveStore(storeData);
  await recordAuditEvent(req, "notice.updated", "notice", id, `Updated notice '${updatedNotice.title}'`);
  return updatedNotice;
}

async function deleteNotice(id, req) {
  if (usePostgres) {
    try {
      const existing = await getNoticeById(id);
      if (!existing) return false;

      await db.query("DELETE FROM notices WHERE id = $1", [id]);
      await recordAuditEvent(req, "notice.deleted", "notice", id, `Deleted notice '${existing.title}'`);
      return true;
    } catch (err) {
      console.warn("PostgreSQL deleteNotice fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const index = (storeData.notices || []).findIndex((n) => String(n.id) === String(id));
  if (index === -1) return false;

  const removed = storeData.notices[index];
  storeData.notices.splice(index, 1);
  saveStore(storeData);
  await recordAuditEvent(req, "notice.deleted", "notice", id, `Deleted notice '${removed.title}'`);
  return true;
}

// -------------------------
// Policies Methods
// -------------------------

async function getPolicies(filters = {}) {
  const { category, status } = filters;
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, title, category, summary, content, version, status, effective_date AS "effectiveDate", attachment_url AS "attachmentUrl", attachment_name AS "attachmentName", attachment_size AS "attachmentSize", created_at AS "createdAt", updated_at AS "updatedAt", created_by AS "createdBy", updated_by AS "updatedBy"
         FROM policies
         WHERE ($1::text IS NULL OR category = $1)
           AND ($2::text IS NULL OR status = $2)
         ORDER BY created_at DESC`,
        [category || null, status || null]
      );
      return res.rows;
    } catch (err) {
      console.warn("PostgreSQL getPolicies fallback:", err.message);
    }
  }

  const storeData = loadStore();
  let list = [...(storeData.policies || [])];
  if (category) list = list.filter((p) => p.category === category);
  if (status) list = list.filter((p) => p.status === status);
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list;
}

async function getPolicyById(id) {
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, title, category, summary, content, version, status, effective_date AS "effectiveDate", attachment_url AS "attachmentUrl", attachment_name AS "attachmentName", attachment_size AS "attachmentSize", created_at AS "createdAt", updated_at AS "updatedAt", created_by AS "createdBy", updated_by AS "updatedBy"
         FROM policies
         WHERE id = $1`,
        [id]
      );
      return res.rows[0] || null;
    } catch (err) {
      console.warn("PostgreSQL getPolicyById fallback:", err.message);
    }
  }
  const storeData = loadStore();
  return (storeData.policies || []).find((p) => String(p.id) === String(id)) || null;
}

async function createPolicy(policyData, req) {
  const id = generateId("pol");
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  const newPolicy = {
    id,
    title: policyData.title.trim(),
    category: policyData.category || "Administrative",
    summary: policyData.summary || "",
    content: policyData.content || "",
    version: policyData.version || "1.0",
    status: policyData.status || "published",
    effectiveDate: policyData.effectiveDate || new Date().toISOString().split("T")[0],
    attachmentUrl: policyData.attachmentUrl || null,
    attachmentName: policyData.attachmentName || null,
    attachmentSize: policyData.attachmentSize || null,
    createdAt: now,
    updatedAt: now,
    createdBy: actorEmail,
    updatedBy: actorEmail
  };

  if (usePostgres) {
    try {
      await db.query(
        `INSERT INTO policies (id, title, category, summary, content, version, status, effective_date, attachment_url, attachment_name, attachment_size, created_at, updated_at, created_by, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [newPolicy.id, newPolicy.title, newPolicy.category, newPolicy.summary, newPolicy.content, newPolicy.version, newPolicy.status, newPolicy.effectiveDate, newPolicy.attachmentUrl, newPolicy.attachmentName, newPolicy.attachmentSize, newPolicy.createdAt, newPolicy.updatedAt, newPolicy.createdBy, newPolicy.updatedBy]
      );
      await recordAuditEvent(req, "policy.created", "policy", id, `Created policy '${newPolicy.title}'`);
      return newPolicy;
    } catch (err) {
      console.warn("PostgreSQL createPolicy fallback:", err.message);
    }
  }

  const storeData = loadStore();
  if (!storeData.policies) storeData.policies = [];
  storeData.policies.unshift(newPolicy);
  saveStore(storeData);
  await recordAuditEvent(req, "policy.created", "policy", id, `Created policy '${newPolicy.title}'`);
  return newPolicy;
}

async function updatePolicy(id, updates, req) {
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  if (usePostgres) {
    try {
      const existing = await getPolicyById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates, updatedAt: now, updatedBy: actorEmail };

      await db.query(
        `UPDATE policies
         SET title = $1, category = $2, summary = $3, content = $4, version = $5, status = $6, effective_date = $7, attachment_url = $8, attachment_name = $9, attachment_size = $10, updated_at = $11, updated_by = $12
         WHERE id = $13`,
        [updated.title, updated.category, updated.summary, updated.content, updated.version, updated.status, updated.effectiveDate, updated.attachmentUrl, updated.attachmentName, updated.attachmentSize, updated.updatedAt, updated.updatedBy, id]
      );
      await recordAuditEvent(req, "policy.updated", "policy", id, `Updated policy '${updated.title}'`);
      return updated;
    } catch (err) {
      console.warn("PostgreSQL updatePolicy fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const index = (storeData.policies || []).findIndex((p) => String(p.id) === String(id));
  if (index === -1) return null;

  const updatedPolicy = { ...storeData.policies[index], ...updates, id, updatedAt: now, updatedBy: actorEmail };
  storeData.policies[index] = updatedPolicy;
  saveStore(storeData);
  await recordAuditEvent(req, "policy.updated", "policy", id, `Updated policy '${updatedPolicy.title}'`);
  return updatedPolicy;
}

async function deletePolicy(id, req) {
  if (usePostgres) {
    try {
      const existing = await getPolicyById(id);
      if (!existing) return false;

      await db.query("DELETE FROM policies WHERE id = $1", [id]);
      await recordAuditEvent(req, "policy.deleted", "policy", id, `Deleted policy '${existing.title}'`);
      return true;
    } catch (err) {
      console.warn("PostgreSQL deletePolicy fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const index = (storeData.policies || []).findIndex((p) => String(p.id) === String(id));
  if (index === -1) return false;

  const removed = storeData.policies[index];
  storeData.policies.splice(index, 1);
  saveStore(storeData);
  await recordAuditEvent(req, "policy.deleted", "policy", id, `Deleted policy '${removed.title}'`);
  return true;
}

// -------------------------
// Access Rules Methods
// -------------------------

async function getAccessRules(filters = {}) {
  const { targetType, status, search } = filters;
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, name, target_type AS "targetType", target_value AS "targetValue", services, access_level AS "accessLevel", status, created_at AS "createdAt", updated_at AS "updatedAt", created_by AS "createdBy", updated_by AS "updatedBy"
         FROM access_rules
         ORDER BY created_at DESC`
      );
      let rules = res.rows;
      if (targetType && targetType !== "ALL") {
        rules = rules.filter((r) => r.targetType.toLowerCase() === targetType.toLowerCase());
      }
      if (status && status !== "ALL") {
        rules = rules.filter((r) => r.status.toLowerCase() === status.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        rules = rules.filter((r) => r.name.toLowerCase().includes(q) || r.targetValue.toLowerCase().includes(q));
      }
      return rules;
    } catch (err) {
      console.warn("PostgreSQL getAccessRules fallback:", err.message);
    }
  }

  const storeData = loadStore();
  let rules = [...(storeData.accessRules || [])];
  if (targetType && targetType !== "ALL") {
    rules = rules.filter((r) => r.targetType.toLowerCase() === targetType.toLowerCase());
  }
  if (status && status !== "ALL") {
    rules = rules.filter((r) => r.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    rules = rules.filter((r) => r.name.toLowerCase().includes(q) || r.targetValue.toLowerCase().includes(q));
  }
  return rules;
}

async function getAccessRuleById(id) {
  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT id, name, target_type AS "targetType", target_value AS "targetValue", services, access_level AS "accessLevel", status, created_at AS "createdAt", updated_at AS "updatedAt", created_by AS "createdBy", updated_by AS "updatedBy"
         FROM access_rules
         WHERE id = $1`,
        [id]
      );
      return res.rows[0] || null;
    } catch (err) {
      console.warn("PostgreSQL getAccessRuleById fallback:", err.message);
    }
  }
  const storeData = loadStore();
  return (storeData.accessRules || []).find((r) => r.id === id) || null;
}

async function createAccessRule(ruleData, req) {
  const id = generateId("rule");
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  const newRule = {
    id,
    name: ruleData.name.trim(),
    targetType: ruleData.targetType || "email",
    targetValue: ruleData.targetValue.trim(),
    services: Array.isArray(ruleData.services) ? ruleData.services : ["notices"],
    accessLevel: ruleData.accessLevel || "read",
    status: ruleData.status || "active",
    createdAt: now,
    updatedAt: now,
    createdBy: actorEmail,
    updatedBy: actorEmail
  };

  if (usePostgres) {
    try {
      await db.query(
        `INSERT INTO access_rules (id, name, target_type, target_value, services, access_level, status, created_at, updated_at, created_by, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [newRule.id, newRule.name, newRule.targetType, newRule.targetValue, newRule.services, newRule.accessLevel, newRule.status, newRule.createdAt, newRule.updatedAt, newRule.createdBy, newRule.updatedBy]
      );
      await recordAuditEvent(req, "access_rule.created", "access_rule", newRule.id, `Created access rule '${newRule.name}' for ${newRule.targetType}:${newRule.targetValue}`);
      return newRule;
    } catch (err) {
      console.warn("PostgreSQL createAccessRule fallback:", err.message);
    }
  }

  const storeData = loadStore();
  if (!storeData.accessRules) storeData.accessRules = [];
  storeData.accessRules.unshift(newRule);
  saveStore(storeData);
  await recordAuditEvent(req, "access_rule.created", "access_rule", newRule.id, `Created access rule '${newRule.name}' for ${newRule.targetType}:${newRule.targetValue}`);
  return newRule;
}

async function updateAccessRule(id, updates, req) {
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  if (usePostgres) {
    try {
      const existing = await getAccessRuleById(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates, id, updatedAt: now, updatedBy: actorEmail };

      await db.query(
        `UPDATE access_rules
         SET name = $1, target_type = $2, target_value = $3, services = $4, access_level = $5, status = $6, updated_at = $7, updated_by = $8
         WHERE id = $9`,
        [updated.name, updated.targetType, updated.targetValue, updated.services, updated.accessLevel, updated.status, updated.updatedAt, updated.updatedBy, id]
      );
      await recordAuditEvent(req, "access_rule.updated", "access_rule", id, `Updated access rule '${updated.name}'`);
      return updated;
    } catch (err) {
      console.warn("PostgreSQL updateAccessRule fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const index = (storeData.accessRules || []).findIndex((r) => r.id === id);
  if (index === -1) return null;

  const updatedRule = { ...storeData.accessRules[index], ...updates, id, updatedAt: now, updatedBy: actorEmail };
  storeData.accessRules[index] = updatedRule;
  saveStore(storeData);
  await recordAuditEvent(req, "access_rule.updated", "access_rule", id, `Updated access rule '${updatedRule.name}'`);
  return updatedRule;
}

async function deleteAccessRule(id, req) {
  if (usePostgres) {
    try {
      const existing = await getAccessRuleById(id);
      if (!existing) return false;

      await db.query("DELETE FROM access_rules WHERE id = $1", [id]);
      await recordAuditEvent(req, "access_rule.deleted", "access_rule", id, `Deleted access rule '${existing.name}'`);
      return true;
    } catch (err) {
      console.warn("PostgreSQL deleteAccessRule fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const index = (storeData.accessRules || []).findIndex((r) => r.id === id);
  if (index === -1) return false;

  const removed = storeData.accessRules[index];
  storeData.accessRules.splice(index, 1);
  saveStore(storeData);
  await recordAuditEvent(req, "access_rule.deleted", "access_rule", id, `Deleted access rule '${removed.name}'`);
  return true;
}

async function evaluateUserAccess(email, roles = []) {
  const normEmail = (email || "").trim().toLowerCase();
  const userRoles = Array.isArray(roles) ? roles.map((r) => String(r).trim().toLowerCase()) : [];

  if (usePostgres) {
    try {
      const res = await db.query(
        `SELECT services, access_level AS "accessLevel"
         FROM access_rules
         WHERE status = 'active'
           AND (
             (LOWER(target_type) IN ('email', 'gmail') AND LOWER(TRIM(target_value)) = LOWER(TRIM($1)))
             OR
             (LOWER(target_type) = 'role' AND LOWER(TRIM(target_value)) = ANY($2::text[]))
           )`,
        [normEmail, userRoles]
      );

      const allowedServices = new Set();
      let maxAccessLevel = "read";

      for (const rule of res.rows) {
        for (const srv of rule.services || []) {
          allowedServices.add(srv);
        }
        if (rule.accessLevel === "full") maxAccessLevel = "full";
        else if (rule.accessLevel === "write" && maxAccessLevel !== "full") maxAccessLevel = "write";
      }

      return {
        email: normEmail,
        roles: userRoles,
        allowedServices: Array.from(allowedServices),
        accessLevel: maxAccessLevel
      };
    } catch (err) {
      console.warn("PostgreSQL evaluateUserAccess fallback:", err.message);
    }
  }

  const storeData = loadStore();
  const activeRules = (storeData.accessRules || []).filter((r) => r.status === "active");

  const allowedServices = new Set();
  let maxAccessLevel = "read";

  for (const rule of activeRules) {
    let matches = false;
    const ruleTargetType = (rule.targetType || "").trim().toLowerCase();
    const ruleTargetValue = (rule.targetValue || "").trim().toLowerCase();

    if (ruleTargetType === "email" || ruleTargetType === "gmail") {
      if (normEmail && ruleTargetValue === normEmail) {
        matches = true;
      }
    } else if (ruleTargetType === "role") {
      if (userRoles.includes(ruleTargetValue)) {
        matches = true;
      }
    }

    if (matches) {
      for (const service of rule.services || []) {
        allowedServices.add(service);
      }
      if (rule.accessLevel === "full") maxAccessLevel = "full";
      else if (rule.accessLevel === "write" && maxAccessLevel !== "full") maxAccessLevel = "write";
    }
  }

  return {
    email: normEmail,
    roles: userRoles,
    allowedServices: Array.from(allowedServices),
    accessLevel: maxAccessLevel
  };
}

module.exports = {
  recordAuditEvent,
  getAuditLogs,
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getAccessRules,
  getAccessRuleById,
  createAccessRule,
  updateAccessRule,
  deleteAccessRule,
  evaluateUserAccess
};
