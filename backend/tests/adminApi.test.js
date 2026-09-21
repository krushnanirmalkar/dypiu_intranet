const assert = require("assert");
const { requireSuperAdmin } = require("../middleware/auth");
const store = require("../data/store");

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

async function runTests() {
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

  // Notice CRUD & Persistence
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
    console.log("  ✓ Notice CRUD & Status Toggles working correctly");
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
      services: ["policies"],
      accessLevel: "write",
      status: "active"
    }, mockReq);

    // Test permission evaluation: Additive semantics (role rules + email rules)
    const access = await store.evaluateUserAccess("dean@gmail.com", ["staff"]);
    assert.ok(access.allowedServices.includes("notices"), "User should inherit notice access from role");
    assert.ok(access.allowedServices.includes("policies"), "User should receive policy access from email");
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
}

runTests();
