const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const STORE_PATH = path.join(__dirname, "store.json");
const TMP_STORE_PATH = path.join(__dirname, "store.json.tmp");

let cache = null;

const initialAccessRules = [
  {
    id: "rule-superadmin",
    name: "Super Admin Full Access",
    targetType: "role",
    targetValue: "super_admin",
    services: ["notices", "policies", "applications", "audit"],
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
    services: ["notices", "policies", "applications", "audit"],
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
  } catch (err) {
    console.error("Error loading store.json:", err);
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
        if (fs.existsSync(TMP_STORE_PATH)) {
          try { fs.unlinkSync(TMP_STORE_PATH); } catch {}
        }
      }
    } catch {
      fs.writeFileSync(STORE_PATH, content, "utf8");
    }
    cache = data;
  } catch (err) {
    console.error("Error saving store.json:", err);
    throw new Error("Failed to persist data.");
  }
}

function generateId(prefix = "id") {
  return `${prefix}-${crypto.randomBytes(6).toString("hex")}`;
}

// -------------------------
// Audit Log Helper
// -------------------------

function recordAuditEvent(req, action, resourceType, resourceId, summary, extraMeta = {}) {
  const store = loadStore();
  const actorSub = req?.session?.user?.sub || "system";
  const actorEmail = req?.session?.user?.email || "system@dypiu.ac.in";

  const event = {
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
    actorSub,
    actorEmail,
    action,
    resourceType,
    resourceId,
    summary,
    metadata: {
      ip: req?.ip || null,
      method: req?.method || null,
      path: req?.path || null,
      ...extraMeta
    }
  };

  store.auditLogs.unshift(event);
  // Limit max audit logs in json file to 1000 for performance
  if (store.auditLogs.length > 1000) {
    store.auditLogs = store.auditLogs.slice(0, 1000);
  }
  saveStore(store);
  return event;
}

function getAuditLogs() {
  const store = loadStore();
  return store.auditLogs || [];
}

// -------------------------
// Application CRUD
// -------------------------

function getApplications(includeDisabled = false) {
  const store = loadStore();
  if (includeDisabled) {
    return store.applications;
  }
  return store.applications.filter((app) => app.enabled !== false);
}

function getApplicationById(id) {
  const store = loadStore();
  return store.applications.find((app) => app.id === id) || null;
}

function createApplication(appData, req) {
  const store = loadStore();
  const newApp = {
    id: appData.id || generateId("app"),
    name: appData.name,
    shortName: appData.shortName || appData.name,
    description: appData.description || "",
    url: appData.url,
    icon: appData.icon || "LayoutDashboard",
    category: appData.category || "Productivity",
    roles: Array.isArray(appData.roles) && appData.roles.length > 0 ? appData.roles : ["student", "staff", "admin"],
    enabled: appData.enabled !== false,
    displayOrder: Number(appData.displayOrder) || store.applications.length + 1,
    ssoEnabled: appData.ssoEnabled !== false,
    highlightColor: appData.highlightColor || undefined
  };

  store.applications.push(newApp);
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "application.created", "application", newApp.id, `Created application '${newApp.name}'`);
  }

  return newApp;
}

function updateApplication(id, updates, req) {
  const store = loadStore();
  const index = store.applications.findIndex((app) => app.id === id);
  if (index === -1) return null;

  const existing = store.applications[index];
  const updatedApp = {
    ...existing,
    ...updates,
    id // keep original ID
  };

  store.applications[index] = updatedApp;
  saveStore(store);

  if (req) {
    const action = updates.enabled !== undefined && updates.enabled !== existing.enabled
      ? (updates.enabled ? "application.enabled" : "application.disabled")
      : "application.updated";
    recordAuditEvent(req, action, "application", id, `Updated application '${updatedApp.name}'`);
  }

  return updatedApp;
}

function deleteApplication(id, req) {
  const store = loadStore();
  const index = store.applications.findIndex((app) => app.id === id);
  if (index === -1) return false;

  const removed = store.applications[index];
  store.applications.splice(index, 1);
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "application.deleted", "application", id, `Deleted application '${removed.name}'`);
  }

  return true;
}

// -------------------------
// Notice CRUD
// -------------------------

function getNotices(filter = {}) {
  const store = loadStore();
  let result = [...store.notices];

  if (filter.status) {
    result = result.filter((n) => n.status === filter.status);
  }

  if (filter.checkExpiry) {
    const now = Date.now();
    result = result.filter((n) => {
      if (!n.expiresAt) return true;
      const expTime = new Date(n.expiresAt).getTime();
      return isNaN(expTime) || expTime > now;
    });
  }

  if (filter.audience && filter.audience !== "All") {
    result = result.filter((n) => n.audience === "All" || n.audience === filter.audience);
  }

  if (filter.category) {
    result = result.filter((n) => n.category === filter.category);
  }

  return result;
}

function getNoticeById(id) {
  const store = loadStore();
  return store.notices.find((n) => n.id === id) || null;
}

function createNotice(noticeData, req) {
  const store = loadStore();
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "admin@dypiu.ac.in";

  const newNotice = {
    id: generateId("notice"),
    title: noticeData.title,
    content: noticeData.content,
    category: noticeData.category || "Academic",
    audience: noticeData.audience || "All",
    priority: noticeData.priority || "Medium",
    status: noticeData.status || "published",
    author: noticeData.author || "University Administration",
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

  store.notices.unshift(newNotice);
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "notice.created", "notice", newNotice.id, `Created notice '${newNotice.title}'`);
    if (newNotice.status === "published") {
      recordAuditEvent(req, "notice.published", "notice", newNotice.id, `Published notice '${newNotice.title}'`);
    }
  }

  return newNotice;
}

function updateNotice(id, updates, req) {
  const store = loadStore();
  const index = store.notices.findIndex((n) => n.id === id);
  if (index === -1) return null;

  const existing = store.notices[index];
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || existing.updatedBy;

  const updatedNotice = {
    ...existing,
    ...updates,
    id,
    updatedAt: now,
    updatedBy: actorEmail
  };

  store.notices[index] = updatedNotice;
  saveStore(store);

  if (req) {
    let action = "notice.updated";
    if (updates.status && updates.status !== existing.status) {
      if (updates.status === "published") action = "notice.published";
      else if (updates.status === "draft" || updates.status === "unpublished") action = "notice.unpublished";
      else if (updates.status === "archived") action = "notice.archived";
    }
    recordAuditEvent(req, action, "notice", id, `Updated notice '${updatedNotice.title}'`);
  }

  return updatedNotice;
}

function deleteNotice(id, req) {
  const store = loadStore();
  const index = store.notices.findIndex((n) => n.id === id);
  if (index === -1) return false;

  const removed = store.notices[index];
  store.notices.splice(index, 1);
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "notice.deleted", "notice", id, `Deleted notice '${removed.title}'`);
  }

  return true;
}

// -------------------------
// Policy CRUD
// -------------------------

function getPolicies(filter = {}) {
  const store = loadStore();
  let result = [...store.policies];

  if (filter.status) {
    result = result.filter((p) => p.status === filter.status);
  }

  if (filter.category) {
    result = result.filter((p) => p.category === filter.category);
  }

  return result;
}

function getPolicyById(id) {
  const store = loadStore();
  return store.policies.find((p) => p.id === id) || null;
}

function createPolicy(policyData, req) {
  const store = loadStore();
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "admin@dypiu.ac.in";

  const newPolicy = {
    id: generateId("pol"),
    title: policyData.title,
    category: policyData.category || "Administrative",
    summary: policyData.summary || "",
    content: policyData.content || "",
    version: policyData.version || "1.0",
    status: policyData.status || "published",
    effectiveDate: policyData.effectiveDate || new Date().toISOString().split("T")[0],
    publishedAt: policyData.status === "published" ? now : null,
    createdAt: now,
    updatedAt: now,
    createdBy: actorEmail,
    updatedBy: actorEmail
  };

  store.policies.unshift(newPolicy);
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "policy.created", "policy", newPolicy.id, `Created policy '${newPolicy.title}'`);
    if (newPolicy.status === "published") {
      recordAuditEvent(req, "policy.published", "policy", newPolicy.id, `Published policy '${newPolicy.title}'`);
    }
  }

  return newPolicy;
}

function updatePolicy(id, updates, req) {
  const store = loadStore();
  const index = store.policies.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = store.policies[index];
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || existing.updatedBy;

  const updatedPolicy = {
    ...existing,
    ...updates,
    id,
    updatedAt: now,
    updatedBy: actorEmail,
    publishedAt: updates.status === "published" && existing.status !== "published" ? now : existing.publishedAt
  };

  store.policies[index] = updatedPolicy;
  saveStore(store);

  if (req) {
    let action = "policy.updated";
    if (updates.status && updates.status !== existing.status) {
      if (updates.status === "published") action = "policy.published";
      else if (updates.status === "draft" || updates.status === "unpublished") action = "policy.unpublished";
      else if (updates.status === "archived") action = "policy.archived";
    }
    recordAuditEvent(req, action, "policy", id, `Updated policy '${updatedPolicy.title}'`);
  }

  return updatedPolicy;
}

function deletePolicy(id, req) {
  const store = loadStore();
  const index = store.policies.findIndex((p) => p.id === id);
  if (index === -1) return false;

  const removed = store.policies[index];
  store.policies.splice(index, 1);
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "policy.archived", "policy", id, `Deleted/Archived policy '${removed.title}'`);
  }

  return true;
}

function getAccessRules(filters = {}) {
  const store = loadStore();
  let rules = [...(store.accessRules || [])];

  if (filters.targetType) {
    rules = rules.filter((r) => r.targetType === filters.targetType);
  }
  if (filters.status) {
    rules = rules.filter((r) => r.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    rules = rules.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.targetValue.toLowerCase().includes(q)
    );
  }

  return rules;
}

function getAccessRuleById(id) {
  const store = loadStore();
  return (store.accessRules || []).find((r) => r.id === id) || null;
}

function createAccessRule(ruleData, req) {
  const store = loadStore();
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  const newRule = {
    id: generateId("rule"),
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

  if (!store.accessRules) store.accessRules = [];
  store.accessRules.unshift(newRule);
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "access_rule.created", "access_rule", newRule.id, `Created access rule '${newRule.name}' for ${newRule.targetType}:${newRule.targetValue}`);
  }

  return newRule;
}

function updateAccessRule(id, updates, req) {
  const store = loadStore();
  if (!store.accessRules) store.accessRules = [];
  const index = store.accessRules.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const existing = store.accessRules[index];
  const now = new Date().toISOString();
  const actorEmail = req?.session?.user?.email || "system";

  const updatedRule = {
    ...existing,
    ...updates,
    id,
    updatedAt: now,
    updatedBy: actorEmail
  };

  store.accessRules[index] = updatedRule;
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "access_rule.updated", "access_rule", id, `Updated access rule '${updatedRule.name}'`);
  }

  return updatedRule;
}

function deleteAccessRule(id, req) {
  const store = loadStore();
  if (!store.accessRules) store.accessRules = [];
  const index = store.accessRules.findIndex((r) => r.id === id);
  if (index === -1) return false;

  const removed = store.accessRules[index];
  store.accessRules.splice(index, 1);
  saveStore(store);

  if (req) {
    recordAuditEvent(req, "access_rule.deleted", "access_rule", id, `Deleted access rule '${removed.name}'`);
  }

  return true;
}

function evaluateUserAccess(email, roles = []) {
  const store = loadStore();
  const activeRules = (store.accessRules || []).filter((r) => r.status === "active");

  const allowedServices = new Set();
  let maxAccessLevel = "read";

  const userRoles = Array.isArray(roles) ? roles : [];
  const normEmail = (email || "").trim().toLowerCase();

  for (const rule of activeRules) {
    let matches = false;

    if (rule.targetType === "email") {
      if (rule.targetValue.toLowerCase() === normEmail) {
        matches = true;
      }
    } else if (rule.targetType === "role") {
      if (userRoles.includes(rule.targetValue)) {
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
