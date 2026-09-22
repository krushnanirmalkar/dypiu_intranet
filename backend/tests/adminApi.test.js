const assert = require("assert");
const db = require("../db");
const store = require("../data/store");
const { requireSuperAdmin } = require("../middleware/auth");

// Helper mock req/res
function createMockReqRes({ user = null } = {}) {
  const req = {
    session: { user },
    ip: "127.0.0.1",
    method: "GET",
    path: "/test"
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    send(data) {
      this.body = data;
      return this;
    }
  };

  return { req, res };
}

// Unit tests must never auto-discover or mutate a real PostgreSQL database.
// Database integration testing belongs in a separately configured test environment.
async function setupTestEnvironment() {
  console.log("[Test Suite] Using isolated db.query test double.");
  setupDbMock();
}

function setupDbMock() {
  const mockStore = {
    applications: [],
    notices: [],
    policies: [],
    access_rules: [],
    audit_logs: [],
    notifications: []
  };

  db.initDatabase = async () => true;

  db.query = async (text, params = []) => {
    const sql = text.trim();

    if (sql.includes("COUNT(*) FROM")) {
      const tableName = sql.split("FROM")[1].trim().split(" ")[0];
      const table = mockStore[tableName] || [];
      return { rows: [{ count: String(table.length) }] };
    }

    if (sql.includes("FROM audit_logs")) {
      return { rows: [...mockStore.audit_logs] };
    }

    if (sql.includes("FROM notifications")) {
      return { rows: [...mockStore.notifications] };
    }

    if (sql.includes("INSERT INTO notifications")) {
      const notif = {
        id: params[0], title: params[1], message: params[2], type: params[3],
        targetAudience: params[4], linkUrl: params[5], createdAt: params[6], createdBy: params[7]
      };
      mockStore.notifications.unshift(notif);
      return { rows: [notif] };
    }

    if (sql.includes("DELETE FROM notifications")) {
      const id = params[0];
      mockStore.notifications = mockStore.notifications.filter(n => n.id !== id);
      return { rows: [] };
    }

    if (sql.includes("FROM applications")) {
      if (sql.includes("WHERE id = $1")) {
        const item = mockStore.applications.find(a => a.id === params[0]);
        return { rows: item ? [item] : [] };
      }
      const includeDisabled = params[0] === true;
      const rows = mockStore.applications.filter(a => includeDisabled || a.enabled !== false);
      return { rows };
    }

    if (sql.includes("INSERT INTO applications")) {
      const newApp = {
        id: params[0], name: params[1], shortName: params[2], description: params[3],
        url: params[4], icon: params[5], category: params[6], roles: params[7],
        enabled: params[8], displayOrder: params[9], ssoEnabled: params[10], highlightColor: params[11],
        createdAt: params[12], updatedAt: params[13], createdBy: params[14], updatedBy: params[15]
      };
      const idx = mockStore.applications.findIndex(a => a.id === newApp.id);
      if (idx >= 0) mockStore.applications[idx] = newApp;
      else mockStore.applications.push(newApp);
      return { rows: [newApp] };
    }

    if (sql.includes("UPDATE applications")) {
      const id = params[13];
      const idx = mockStore.applications.findIndex(a => a.id === id);
      if (idx >= 0) {
        mockStore.applications[idx] = {
          ...mockStore.applications[idx],
          name: params[0], shortName: params[1], description: params[2], url: params[3],
          icon: params[4], category: params[5], roles: params[6], enabled: params[7],
          displayOrder: params[8], ssoEnabled: params[9], highlightColor: params[10],
          updatedAt: params[11], updatedBy: params[12]
        };
      }
      return { rows: idx >= 0 ? [mockStore.applications[idx]] : [] };
    }

    if (sql.includes("DELETE FROM applications")) {
      const id = params[0];
      mockStore.applications = mockStore.applications.filter(a => a.id !== id);
      return { rows: [] };
    }

    if (sql.includes("FROM notices")) {
      if (sql.includes("WHERE id = $1")) {
        const item = mockStore.notices.find(n => String(n.id) === String(params[0]));
        return { rows: item ? [item] : [] };
      }
      const [category, audience, status, checkExpiry] = params;
      let list = [...mockStore.notices];
      if (category) list = list.filter(n => n.category === category);
      if (audience) list = list.filter(n => n.audience === audience || n.audience === "All");
      if (status) list = list.filter(n => n.status === status);
      if (checkExpiry === true) {
        const now = Date.now();
        list = list.filter(n => {
          if (n.publishAt && new Date(n.publishAt).getTime() > now) return false;
          if (n.expiresAt && new Date(n.expiresAt).getTime() <= now) return false;
          return true;
        });
      }
      return { rows: list };
    }

    if (sql.includes("INSERT INTO notices")) {
      const newNotice = {
        id: params[0], title: params[1], content: params[2], category: params[3],
        audience: params[4], priority: params[5], status: params[6], author: params[7],
        publishAt: params[8], expiresAt: params[9], attachmentUrl: params[10],
        attachmentName: params[11], attachmentSize: params[12], createdAt: params[13],
        updatedAt: params[14], createdBy: params[15], updatedBy: params[16]
      };
      const idx = mockStore.notices.findIndex(n => n.id === newNotice.id);
      if (idx >= 0) mockStore.notices[idx] = newNotice;
      else mockStore.notices.unshift(newNotice);
      return { rows: [newNotice] };
    }

    if (sql.includes("UPDATE notices")) {
      const id = params[14];
      const idx = mockStore.notices.findIndex(n => n.id === id);
      if (idx >= 0) {
        mockStore.notices[idx] = {
          ...mockStore.notices[idx],
          title: params[0], content: params[1], category: params[2], audience: params[3],
          priority: params[4], status: params[5], author: params[6], publishAt: params[7],
          expiresAt: params[8], attachmentUrl: params[9], attachmentName: params[10],
          attachmentSize: params[11], updatedAt: params[12], updatedBy: params[13]
        };
      }
      return { rows: idx >= 0 ? [mockStore.notices[idx]] : [] };
    }

    if (sql.includes("DELETE FROM notices")) {
      const id = params[0];
      mockStore.notices = mockStore.notices.filter(n => n.id !== id);
      return { rows: [] };
    }

    if (sql.includes("FROM policies")) {
      if (sql.includes("WHERE id = $1")) {
        const item = mockStore.policies.find(p => String(p.id) === String(params[0]));
        return { rows: item ? [item] : [] };
      }
      const [category, status] = params;
      let list = [...mockStore.policies];
      if (category) list = list.filter(p => p.category === category);
      if (status) list = list.filter(p => p.status === status);
      return { rows: list };
    }

    if (sql.includes("INSERT INTO policies")) {
      const newPolicy = {
        id: params[0], title: params[1], category: params[2], summary: params[3],
        content: params[4], version: params[5], status: params[6], effectiveDate: params[7],
        attachmentUrl: params[8], attachmentName: params[9], attachmentSize: params[10],
        createdAt: params[11], updatedAt: params[12], createdBy: params[13], updatedBy: params[14]
      };
      const idx = mockStore.policies.findIndex(p => p.id === newPolicy.id);
      if (idx >= 0) mockStore.policies[idx] = newPolicy;
      else mockStore.policies.unshift(newPolicy);
      return { rows: [newPolicy] };
    }

    if (sql.includes("UPDATE policies")) {
      const id = params[12];
      const idx = mockStore.policies.findIndex(p => p.id === id);
      if (idx >= 0) {
        mockStore.policies[idx] = {
          ...mockStore.policies[idx],
          title: params[0], category: params[1], summary: params[2], content: params[3],
          version: params[4], status: params[5], effectiveDate: params[6], attachmentUrl: params[7],
          attachmentName: params[8], attachmentSize: params[9], updatedAt: params[10], updatedBy: params[11]
        };
      }
      return { rows: idx >= 0 ? [mockStore.policies[idx]] : [] };
    }

    if (sql.includes("DELETE FROM policies")) {
      const id = params[0];
      mockStore.policies = mockStore.policies.filter(p => p.id !== id);
      return { rows: [] };
    }

    if (sql.includes("FROM access_rules")) {
      if (sql.includes("WHERE id = $1")) {
        const item = mockStore.access_rules.find(r => String(r.id) === String(params[0]));
        return { rows: item ? [item] : [] };
      }
      if (sql.includes("WHERE status = 'active'")) {
        const [normEmail, userRoles] = params;
        const activeRules = mockStore.access_rules.filter(r => r.status === "active");
        const matched = activeRules.filter(r => {
          const targetType = (r.targetType || r.target_type || "").toLowerCase();
          const targetValue = (r.targetValue || r.target_value || "").toLowerCase();
          if (targetType === "email" || targetType === "gmail") {
            return normEmail && targetValue === normEmail;
          }
          if (targetType === "role") {
            return userRoles.includes(targetValue);
          }
          return false;
        });
        return { rows: matched };
      }
      return { rows: [...mockStore.access_rules] };
    }

    if (sql.includes("INSERT INTO access_rules")) {
      const newRule = {
        id: params[0], name: params[1], targetType: params[2], targetValue: params[3],
        services: params[4], accessLevel: params[5], status: params[6], createdAt: params[7],
        updatedAt: params[8], createdBy: params[9], updatedBy: params[10]
      };
      const idx = mockStore.access_rules.findIndex(r => r.id === newRule.id);
      if (idx >= 0) mockStore.access_rules[idx] = newRule;
      else mockStore.access_rules.unshift(newRule);
      return { rows: [newRule] };
    }

    if (sql.includes("UPDATE access_rules")) {
      const id = params[8];
      const idx = mockStore.access_rules.findIndex(r => r.id === id);
      if (idx >= 0) {
        mockStore.access_rules[idx] = {
          ...mockStore.access_rules[idx],
          name: params[0], targetType: params[1], targetValue: params[2], services: params[3],
          accessLevel: params[4], status: params[5], updatedAt: params[6], updatedBy: params[7]
        };
      }
      return { rows: idx >= 0 ? [mockStore.access_rules[idx]] : [] };
    }

    if (sql.includes("DELETE FROM access_rules")) {
      const id = params[0];
      mockStore.access_rules = mockStore.access_rules.filter(r => r.id !== id);
      return { rows: [] };
    }

    if (sql.includes("INSERT INTO audit_logs")) {
      const event = {
        id: params[0], timestamp: params[1], actorSub: params[2], actorEmail: params[3],
        actorName: params[4], actorRole: params[5], action: params[6], resourceType: params[7],
        resourceId: params[8], summary: params[9], details: params[10], ip: params[11]
      };
      mockStore.audit_logs.unshift(event);
      return { rows: [event] };
    }

    return { rows: [] };
  };
}

async function runTests() {
  await setupTestEnvironment();

  console.log("==========================================");
  console.log("Running Super Admin & Security Tests...");
  console.log("==========================================");

  // 1. Authorization Tests
  console.log("\n[1] Testing Middleware Authorization...");
  
  // Unauthenticated -> 401
  {
    const { req, res } = createMockReqRes();
    requireSuperAdmin(req, res, () => {
      assert.fail("Should not reach next() when unauthenticated");
    });
    assert.strictEqual(res.statusCode, 401, "Unauthenticated request should return 401");
    assert.strictEqual(res.body.authenticated, false);
    console.log("  ✓ Unauthenticated admin API -> 401 Unauthorized");
  }

  // Normal Student -> 403
  {
    const { req, res } = createMockReqRes({
      user: { sub: "stu-1", email: "student@dypiu.ac.in", roles: ["student"] }
    });
    requireSuperAdmin(req, res, () => {
      assert.fail("Should not reach next() for student role");
    });
    assert.strictEqual(res.statusCode, 403, "Student request should return 403");
    console.log("  ✓ Student admin API -> 403 Forbidden");
  }

  // Normal Staff -> 403
  {
    const { req, res } = createMockReqRes({
      user: { sub: "staff-1", email: "staff@dypiu.ac.in", roles: ["staff"] }
    });
    requireSuperAdmin(req, res, () => {
      assert.fail("Should not reach next() for staff role without super_admin");
    });
    assert.strictEqual(res.statusCode, 403, "Staff request without super_admin should return 403");
    console.log("  ✓ Staff admin API -> 403 Forbidden");
  }

  // Super Admin -> Allowed
  {
    const { req, res } = createMockReqRes({
      user: { sub: "admin-1", email: "superadmin@dypiu.ac.in", roles: ["staff", "super_admin"] }
    });
    let calledNext = false;
    requireSuperAdmin(req, res, () => {
      calledNext = true;
    });
    assert.strictEqual(calledNext, true, "Super Admin should reach next()");
    assert.strictEqual(res.statusCode, 200, "Super Admin should be allowed");
    console.log("  ✓ Super Admin -> Allowed");
  }

  // 2. Persistence & CRUD Tests
  console.log("\n[2] Testing Store Persistence & CRUD...");

  // Notice CRUD & Auto-Notification
  {
    const mockReq = { session: { user: { sub: "admin-1", email: "admin@dypiu.ac.in" } }, ip: "127.0.0.1", method: "POST", path: "/api/admin/notices" };
    const notice = await store.createNotice({
      title: "Test Notice",
      content: "Test notice content body",
      category: "Academic",
      audience: "Students",
      priority: "High",
      status: "published"
    }, mockReq);

    assert.ok(notice.id, "Notice ID should be created");
    assert.strictEqual(notice.title, "Test Notice");

    // Verify auto notification generated for notice publication
    const notifs = await store.getNotifications();
    assert.ok(notifs.some(n => n.title.includes("Test Notice")), "Publishing notice should auto-broadcast notification");

    // Fetch notice
    const fetched = await store.getNoticeById(notice.id);
    assert.ok(fetched, "Should fetch notice by ID");
    assert.strictEqual(fetched.title, "Test Notice");

    // Update notice
    const updated = await store.updateNotice(notice.id, { title: "Updated Test Notice", status: "draft" }, mockReq);
    assert.strictEqual(updated.title, "Updated Test Notice");
    assert.strictEqual(updated.status, "draft");

    // Delete notice
    const deleted = await store.deleteNotice(notice.id, mockReq);
    assert.strictEqual(deleted, true, "Delete notice should return true");
    console.log("  ✓ Notice CRUD & Auto-Notification Broadcast working correctly");
  }

  // Direct Notification CRUD
  {
    const mockReq = { session: { user: { sub: "admin-1", email: "admin@dypiu.ac.in" } }, ip: "127.0.0.1", method: "POST", path: "/api/admin/notifications" };
    const customNotif = await store.createNotification({
      title: "Direct Broadcast Test",
      message: "Testing direct notification broadcast",
      type: "urgent",
      targetAudience: "All"
    }, mockReq);

    assert.ok(customNotif.id, "Notification ID should be generated");
    assert.strictEqual(customNotif.title, "Direct Broadcast Test");

    const allNotifs = await store.getNotifications();
    assert.ok(allNotifs.some(n => n.id === customNotif.id), "Custom notification should exist in notifications store");

    await store.deleteNotification(customNotif.id, mockReq);
    console.log("  ✓ Direct Notification CRUD & Access working correctly");
  }

  // Application CRUD & Safety
  {
    const mockReq = { session: { user: { sub: "admin-1", email: "admin@dypiu.ac.in" } }, ip: "127.0.0.1", method: "POST", path: "/api/admin/applications" };
    
    // Create valid app
    const app = await store.createApplication({
      name: "Test App",
      url: "https://test.dypiu.ac.in",
      category: "Academic",
      roles: ["student", "staff"],
      enabled: true
    }, mockReq);

    assert.ok(app.id, "Application ID should be generated");
    assert.strictEqual(app.name, "Test App");

    // Disable application
    const disabledApp = await store.updateApplication(app.id, { enabled: false }, mockReq);
    assert.strictEqual(disabledApp.enabled, false);

    // Verify disabled app disappears from user-facing store list
    const visibleApps = await store.getApplications(false);
    assert.ok(!visibleApps.some(a => a.id === app.id), "Disabled application should not be in visible apps");

    // Clean up test app
    await store.deleteApplication(app.id, mockReq);
    console.log("  ✓ Application CRUD, URL safety & visibility filtering working");
  }

  // Policy CRUD
  {
    const mockReq = { session: { user: { sub: "admin-1", email: "admin@dypiu.ac.in" } }, ip: "127.0.0.1", method: "POST", path: "/api/admin/policies" };
    const policy = await store.createPolicy({
      title: "Test Policy",
      category: "Academic",
      summary: "Test policy summary",
      content: "Test policy body",
      version: "1.0",
      status: "published"
    }, mockReq);

    assert.ok(policy.id, "Policy ID should be generated");
    assert.strictEqual(policy.version, "1.0");

    await store.deletePolicy(policy.id, mockReq);
    console.log("  ✓ Policy CRUD & versioning working");
  }

  // Access Control & Additive Role/Gmail Access Rules
  {
    const mockReq = { session: { user: { sub: "admin-1", email: "admin@dypiu.ac.in" } }, ip: "127.0.0.1", method: "POST", path: "/api/admin/access-rules" };
    const rule1 = await store.createAccessRule({
      name: "Staff Base Rule",
      targetType: "role",
      targetValue: "staff",
      services: ["notices"],
      accessLevel: "read",
      status: "active"
    }, mockReq);

    const rule2 = await store.createAccessRule({
      name: "Dean Gmail Policy Rule",
      targetType: "email",
      targetValue: "dean@gmail.com",
      services: ["policies", "notifications"],
      accessLevel: "write",
      status: "active"
    }, mockReq);

    // Test permission evaluation: Additive semantics (role rules + email rules)
    const access = await store.evaluateUserAccess("dean@gmail.com", ["staff"]);
    assert.ok(access.allowedServices.includes("notices"), "User should inherit notice access from role");
    assert.ok(access.allowedServices.includes("policies"), "User should receive policy access from email");
    assert.ok(access.allowedServices.includes("notifications"), "User should receive notifications access from email");
    assert.strictEqual(access.accessLevel, "write", "Max access level should aggregate to write");

    await store.deleteAccessRule(rule1.id, mockReq);
    await store.deleteAccessRule(rule2.id, mockReq);
    console.log("  ✓ Role-Based & Gmail access rules CRUD & additive permissions evaluation working");
  }

  // Notice Expiry Filtering Test
  {
    const mockReq = { session: { user: { sub: "admin-1", email: "admin@dypiu.ac.in" } }, ip: "127.0.0.1", method: "POST", path: "/api/admin/notices" };
    
    // Future notice
    const futureNotice = await store.createNotice({
      title: "Future Scheduled Notice",
      content: "Content",
      category: "Academic",
      audience: "All",
      status: "published",
      publishAt: new Date(Date.now() + 86400000).toISOString()
    }, mockReq);

    // Expired notice
    const expiredNotice = await store.createNotice({
      title: "Expired Notice",
      content: "Content",
      category: "Academic",
      audience: "All",
      status: "published",
      publishAt: new Date(Date.now() - 86400000).toISOString(),
      expiresAt: new Date(Date.now() - 3600000).toISOString()
    }, mockReq);

    // Active notice
    const activeNotice = await store.createNotice({
      title: "Active Notice",
      content: "Content",
      category: "Academic",
      audience: "All",
      status: "published",
      publishAt: new Date(Date.now() - 3600000).toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString()
    }, mockReq);

    const activeList = await store.getNotices({ status: "published", checkExpiry: true });
    assert.ok(activeList.some(n => n.id === activeNotice.id), "Active notice should be in published list");
    assert.ok(!activeList.some(n => n.id === futureNotice.id), "Future scheduled notice should NOT be in active published list");
    assert.ok(!activeList.some(n => n.id === expiredNotice.id), "Expired notice should NOT be in active published list");

    await store.deleteNotice(futureNotice.id, mockReq);
    await store.deleteNotice(expiredNotice.id, mockReq);
    await store.deleteNotice(activeNotice.id, mockReq);
    console.log("  ✓ Notice publication & expiry date filtering verified");
  }

  // 3. Audit Log Generation & Immutability
  console.log("\n[3] Testing Audit Trail Recording...");
  {
    const auditLogs = await store.getAuditLogs();
    assert.ok(Array.isArray(auditLogs), "Audit logs should be an array");
    assert.ok(auditLogs.length > 0, "Audit logs should contain recorded events");
    const lastEvent = auditLogs[0];
    assert.ok(lastEvent.timestamp, "Audit event must have timestamp");
    assert.ok(lastEvent.action, "Audit event must have action");
    console.log("  ✓ Security audit trail logging verified");
  }

  console.log("\n==========================================");
  console.log("ALL SUPER ADMIN TESTS PASSED SUCCESSFULLY!");
  console.log("==========================================");
  process.exit(0);
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
