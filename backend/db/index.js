const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const connectionString =
  process.env.DATABASE_URL ||
  process.env.PG_URL ||
  "postgres://postgres:postgres@127.0.0.1:5432/dypiu_intranet";

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
});

const mockMemoryStore = {
  applications: [
    {
      id: "app-1",
      name: "DYPIU Juno ERP Engine",
      shortName: "Juno ERP",
      description: "University academic enterprise resource planning, course registration, and student grading portal.",
      url: "https://erp.dypiu.ac.in",
      icon: "GraduationCap",
      category: "Academic",
      roles: ["student", "staff", "admin"],
      enabled: true,
      displayOrder: 1,
      ssoEnabled: true,
      highlightColor: "from-indigo-500/20 to-blue-500/5 border-indigo-200 text-indigo-600"
    },
    {
      id: "app-2",
      name: "UniSync Collaboration Suite",
      shortName: "UniSync",
      description: "University communication, department announcements, and campus video meetings.",
      url: "https://unisync.dypiu.ac.in",
      icon: "Share2",
      category: "Productivity",
      roles: ["student", "staff", "admin"],
      enabled: true,
      displayOrder: 2,
      ssoEnabled: true,
      highlightColor: "from-emerald-500/20 to-green-500/5 border-emerald-200 text-emerald-600"
    },
    {
      id: "app-3",
      name: "UDMS Digital Document Management System",
      shortName: "UDMS",
      description: "Secure digital repository for official transcripts, migration certificates, and circulars.",
      url: "https://udms.dypiu.ac.in",
      icon: "FileText",
      category: "Administration",
      roles: ["student", "staff", "admin"],
      enabled: true,
      displayOrder: 3,
      ssoEnabled: true,
      highlightColor: "from-amber-500/20 to-orange-500/5 border-amber-200 text-amber-600"
    }
  ],
  notices: [
    {
      id: "n-1",
      title: "End Semester Exam Schedule Released for Spring 2026",
      content: "The official datesheet for May 2026 End-Semester Examinations has been published. All students are advised to check their respective course exam schedules, hall ticket eligibility status, and room allocations on the Examination Engine portal.",
      category: "Academic",
      audience: "All",
      priority: "High",
      status: "published",
      author: "Controller of Examinations"
    },
    {
      id: "n-2",
      title: "DYPIU Seed Research Grant Applications Open for AY 2026-27",
      content: "Applications are officially open for the DYPIU Seed Research Grant for AY 2026-27. Faculty members and postgraduate scholars are invited to submit interdisciplinary project proposals with funding up to ₹5,000,000.",
      category: "Administrative",
      audience: "Staff",
      priority: "Medium",
      status: "published",
      author: "Dean Research & Innovation"
    }
  ],
  policies: [
    {
      id: "pol-1",
      title: "DYPIU Campus Information Security Policy",
      category: "IT & Security",
      summary: "Guidelines for acceptable use of campus network, accounts, data protection, and cybersecurity compliance.",
      content: "All students, faculty, and administrative staff must adhere to strict password governance, multi-factor authentication, and data privacy regulations.",
      version: "1.2",
      status: "published"
    },
    {
      id: "pol-2",
      title: "Academic Integrity Framework",
      category: "Academic",
      summary: "Policy governing originality of submitted course assignments and examination conduct.",
      content: "DYPIU maintains zero tolerance towards academic dishonesty and uncredited generation in accordance with UGC guidelines.",
      version: "2.0",
      status: "published"
    }
  ],
  access_rules: [
    {
      id: "rule-1",
      name: "Super Administrator Grant",
      targetType: "role",
      targetValue: "super_admin",
      services: ["notices", "policies", "applications", "access", "audit"],
      accessLevel: "full",
      status: "active"
    },
    {
      id: "rule-2",
      name: "Administrator Role Grant",
      targetType: "role",
      targetValue: "admin",
      services: ["notices", "policies", "applications", "access", "audit"],
      accessLevel: "full",
      status: "active"
    },
    {
      id: "rule-3",
      name: "Student Account Notice Access",
      targetType: "email",
      targetValue: "20240802084@dypiu.ac.in",
      services: ["notices"],
      accessLevel: "write",
      status: "active"
    }
  ],
  audit_logs: []
};

function runMockQuery(text, params = []) {
  const sql = text.trim();

  // SELECT COUNT(*)
  if (sql.includes("COUNT(*) FROM")) {
    const tableName = sql.split("FROM")[1].trim().split(" ")[0];
    const table = mockMemoryStore[tableName] || [];
    return { rows: [{ count: String(table.length) }] };
  }

  // SELECT ... FROM audit_logs
  if (sql.includes("FROM audit_logs")) {
    return { rows: [...mockMemoryStore.audit_logs] };
  }

  // SELECT ... FROM applications
  if (sql.includes("FROM applications")) {
    if (sql.includes("WHERE id = $1")) {
      const item = mockMemoryStore.applications.find(a => a.id === params[0]);
      return { rows: item ? [item] : [] };
    }
    const includeDisabled = params[0] === true;
    const rows = mockMemoryStore.applications.filter(a => includeDisabled || a.enabled !== false);
    return { rows };
  }

  // INSERT INTO applications
  if (sql.includes("INSERT INTO applications")) {
    const newApp = {
      id: params[0], name: params[1], shortName: params[2], description: params[3],
      url: params[4], icon: params[5], category: params[6], roles: params[7],
      enabled: params[8], displayOrder: params[9], ssoEnabled: params[10], highlightColor: params[11],
      createdAt: params[12], updatedAt: params[13], createdBy: params[14], updatedBy: params[15]
    };
    const idx = mockMemoryStore.applications.findIndex(a => a.id === newApp.id);
    if (idx >= 0) mockMemoryStore.applications[idx] = newApp;
    else mockMemoryStore.applications.push(newApp);
    return { rows: [newApp] };
  }

  // UPDATE applications
  if (sql.includes("UPDATE applications")) {
    const id = params[13];
    const idx = mockMemoryStore.applications.findIndex(a => a.id === id);
    if (idx >= 0) {
      mockMemoryStore.applications[idx] = {
        ...mockMemoryStore.applications[idx],
        name: params[0], shortName: params[1], description: params[2], url: params[3],
        icon: params[4], category: params[5], roles: params[6], enabled: params[7],
        displayOrder: params[8], ssoEnabled: params[9], highlightColor: params[10],
        updatedAt: params[11], updatedBy: params[12]
      };
    }
    return { rows: idx >= 0 ? [mockMemoryStore.applications[idx]] : [] };
  }

  // DELETE FROM applications
  if (sql.includes("DELETE FROM applications")) {
    const id = params[0];
    mockMemoryStore.applications = mockMemoryStore.applications.filter(a => a.id !== id);
    return { rows: [] };
  }

  // SELECT ... FROM notices
  if (sql.includes("FROM notices")) {
    if (sql.includes("WHERE id = $1")) {
      const item = mockMemoryStore.notices.find(n => String(n.id) === String(params[0]));
      return { rows: item ? [item] : [] };
    }
    const [category, audience, status, checkExpiry] = params;
    let list = [...mockMemoryStore.notices];
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

  // INSERT INTO notices
  if (sql.includes("INSERT INTO notices")) {
    const newNotice = {
      id: params[0], title: params[1], content: params[2], category: params[3],
      audience: params[4], priority: params[5], status: params[6], author: params[7],
      publishAt: params[8], expiresAt: params[9], attachmentUrl: params[10],
      attachmentName: params[11], attachmentSize: params[12], createdAt: params[13],
      updatedAt: params[14], createdBy: params[15], updatedBy: params[16]
    };
    const idx = mockMemoryStore.notices.findIndex(n => n.id === newNotice.id);
    if (idx >= 0) mockMemoryStore.notices[idx] = newNotice;
    else mockMemoryStore.notices.unshift(newNotice);
    return { rows: [newNotice] };
  }

  // UPDATE notices
  if (sql.includes("UPDATE notices")) {
    const id = params[14];
    const idx = mockMemoryStore.notices.findIndex(n => n.id === id);
    if (idx >= 0) {
      mockMemoryStore.notices[idx] = {
        ...mockMemoryStore.notices[idx],
        title: params[0], content: params[1], category: params[2], audience: params[3],
        priority: params[4], status: params[5], author: params[6], publishAt: params[7],
        expiresAt: params[8], attachmentUrl: params[9], attachmentName: params[10],
        attachmentSize: params[11], updatedAt: params[12], updatedBy: params[13]
      };
    }
    return { rows: idx >= 0 ? [mockMemoryStore.notices[idx]] : [] };
  }

  // DELETE FROM notices
  if (sql.includes("DELETE FROM notices")) {
    const id = params[0];
    mockMemoryStore.notices = mockMemoryStore.notices.filter(n => n.id !== id);
    return { rows: [] };
  }

  // SELECT ... FROM policies
  if (sql.includes("FROM policies")) {
    if (sql.includes("WHERE id = $1")) {
      const item = mockMemoryStore.policies.find(p => String(p.id) === String(params[0]));
      return { rows: item ? [item] : [] };
    }
    const [category, status] = params;
    let list = [...mockMemoryStore.policies];
    if (category) list = list.filter(p => p.category === category);
    if (status) list = list.filter(p => p.status === status);
    return { rows: list };
  }

  // INSERT INTO policies
  if (sql.includes("INSERT INTO policies")) {
    const newPolicy = {
      id: params[0], title: params[1], category: params[2], summary: params[3],
      content: params[4], version: params[5], status: params[6], effectiveDate: params[7],
      attachmentUrl: params[8], attachmentName: params[9], attachmentSize: params[10],
      createdAt: params[11], updatedAt: params[12], createdBy: params[13], updatedBy: params[14]
    };
    const idx = mockMemoryStore.policies.findIndex(p => p.id === newPolicy.id);
    if (idx >= 0) mockMemoryStore.policies[idx] = newPolicy;
    else mockMemoryStore.policies.unshift(newPolicy);
    return { rows: [newPolicy] };
  }

  // UPDATE policies
  if (sql.includes("UPDATE policies")) {
    const id = params[12];
    const idx = mockMemoryStore.policies.findIndex(p => p.id === id);
    if (idx >= 0) {
      mockMemoryStore.policies[idx] = {
        ...mockMemoryStore.policies[idx],
        title: params[0], category: params[1], summary: params[2], content: params[3],
        version: params[4], status: params[5], effectiveDate: params[6], attachmentUrl: params[7],
        attachmentName: params[8], attachmentSize: params[9], updatedAt: params[10], updatedBy: params[11]
      };
    }
    return { rows: idx >= 0 ? [mockMemoryStore.policies[idx]] : [] };
  }

  // DELETE FROM policies
  if (sql.includes("DELETE FROM policies")) {
    const id = params[0];
    mockMemoryStore.policies = mockMemoryStore.policies.filter(p => p.id !== id);
    return { rows: [] };
  }

  // SELECT ... FROM access_rules
  if (sql.includes("FROM access_rules")) {
    if (sql.includes("WHERE id = $1")) {
      const item = mockMemoryStore.access_rules.find(r => String(r.id) === String(params[0]));
      return { rows: item ? [item] : [] };
    }
    if (sql.includes("WHERE status = 'active'")) {
      const [normEmail, userRoles] = params;
      const activeRules = mockMemoryStore.access_rules.filter(r => r.status === "active");
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
    return { rows: [...mockMemoryStore.access_rules] };
  }

  // INSERT INTO access_rules
  if (sql.includes("INSERT INTO access_rules")) {
    const newRule = {
      id: params[0], name: params[1], targetType: params[2], targetValue: params[3],
      services: params[4], accessLevel: params[5], status: params[6], createdAt: params[7],
      updatedAt: params[8], createdBy: params[9], updatedBy: params[10]
    };
    const idx = mockMemoryStore.access_rules.findIndex(r => r.id === newRule.id);
    if (idx >= 0) mockMemoryStore.access_rules[idx] = newRule;
    else mockMemoryStore.access_rules.unshift(newRule);
    return { rows: [newRule] };
  }

  // UPDATE access_rules
  if (sql.includes("UPDATE access_rules")) {
    const id = params[8];
    const idx = mockMemoryStore.access_rules.findIndex(r => r.id === id);
    if (idx >= 0) {
      mockMemoryStore.access_rules[idx] = {
        ...mockMemoryStore.access_rules[idx],
        name: params[0], targetType: params[1], targetValue: params[2], services: params[3],
        accessLevel: params[4], status: params[5], updatedAt: params[6], updatedBy: params[7]
      };
    }
    return { rows: idx >= 0 ? [mockMemoryStore.access_rules[idx]] : [] };
  }

  // DELETE FROM access_rules
  if (sql.includes("DELETE FROM access_rules")) {
    const id = params[0];
    mockMemoryStore.access_rules = mockMemoryStore.access_rules.filter(r => r.id !== id);
    return { rows: [] };
  }

  // INSERT INTO audit_logs
  if (sql.includes("INSERT INTO audit_logs")) {
    const event = {
      id: params[0], timestamp: params[1], actorSub: params[2], actorEmail: params[3],
      actorName: params[4], actorRole: params[5], action: params[6], resourceType: params[7],
      resourceId: params[8], summary: params[9], details: params[10], ip: params[11]
    };
    mockMemoryStore.audit_logs.unshift(event);
    return { rows: [event] };
  }

  return { rows: [] };
}

async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.message.includes("ECONNREFUSED") || err.message.includes("connect")) {
      return runMockQuery(text, params);
    }
    console.error("Database Query Error:", { text, error: err.message });
    throw err;
  }
}

let isInitialized = false;

async function initDatabase() {
  if (isInitialized) return true;
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schemaSql);

    // Seed default initial data if tables are empty
    await seedDefaultData();

    isInitialized = true;
    console.log("PostgreSQL Database Schema & Tables Initialized Successfully.");
    return true;
  } catch (err) {
    console.warn("PostgreSQL connection/initialization warning:", err.message);
    isInitialized = true;
    return true;
  }
}

async function seedDefaultData() {
  try {
    // 1. Seed Applications if empty
    const appRes = await pool.query("SELECT COUNT(*) FROM applications");
    if (parseInt(appRes.rows[0].count, 10) === 0) {
      const initialApps = [
        {
          id: "app-1",
          name: "DYPIU Juno ERP Engine",
          short_name: "Juno ERP",
          description: "University academic enterprise resource planning, course registration, and student grading portal.",
          url: "https://erp.dypiu.ac.in",
          icon: "GraduationCap",
          category: "Academic",
          roles: ["student", "staff", "admin"],
          enabled: true,
          display_order: 1,
          sso_enabled: true,
          highlight_color: "from-indigo-500/20 to-blue-500/5 border-indigo-200 text-indigo-600"
        },
        {
          id: "app-2",
          name: "UniSync Collaboration Suite",
          short_name: "UniSync",
          description: "University communication, department announcements, and campus video meetings.",
          url: "https://unisync.dypiu.ac.in",
          icon: "Share2",
          category: "Productivity",
          roles: ["student", "staff", "admin"],
          enabled: true,
          display_order: 2,
          sso_enabled: true,
          highlight_color: "from-emerald-500/20 to-green-500/5 border-emerald-200 text-emerald-600"
        },
        {
          id: "app-3",
          name: "UDMS Digital Document Management System",
          short_name: "UDMS",
          description: "Secure digital repository for official transcripts, migration certificates, and circulars.",
          url: "https://udms.dypiu.ac.in",
          icon: "FileText",
          category: "Administration",
          roles: ["student", "staff", "admin"],
          enabled: true,
          display_order: 3,
          sso_enabled: true,
          highlight_color: "from-amber-500/20 to-orange-500/5 border-amber-200 text-amber-600"
        }
      ];

      for (const item of initialApps) {
        await pool.query(
          `INSERT INTO applications (id, name, short_name, description, url, icon, category, roles, enabled, display_order, sso_enabled, highlight_color)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO NOTHING`,
          [item.id, item.name, item.short_name, item.description, item.url, item.icon, item.category, item.roles, item.enabled, item.display_order, item.sso_enabled, item.highlight_color]
        );
      }
    }

    // 2. Seed Notices if empty
    const noticeRes = await pool.query("SELECT COUNT(*) FROM notices");
    if (parseInt(noticeRes.rows[0].count, 10) === 0) {
      const initialNotices = [
        {
          id: "n-1",
          title: "End Semester Exam Schedule Released for Spring 2026",
          content: "The official datesheet for May 2026 End-Semester Examinations has been published. All students are advised to check their respective course exam schedules, hall ticket eligibility status, and room allocations on the Examination Engine portal.",
          category: "Academic",
          audience: "All",
          priority: "High",
          status: "published",
          author: "Controller of Examinations"
        },
        {
          id: "n-2",
          title: "DYPIU Seed Research Grant Applications Open for AY 2026-27",
          content: "Applications are officially open for the DYPIU Seed Research Grant for AY 2026-27. Faculty members and postgraduate scholars are invited to submit interdisciplinary project proposals with funding up to ₹5,000,000.",
          category: "Administrative",
          audience: "Staff",
          priority: "Medium",
          status: "published",
          author: "Dean Research & Innovation"
        }
      ];

      for (const item of initialNotices) {
        await pool.query(
          `INSERT INTO notices (id, title, content, category, audience, priority, status, author)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [item.id, item.title, item.content, item.category, item.audience, item.priority, item.status, item.author]
        );
      }
    }

    // 3. Seed Policies if empty
    const polRes = await pool.query("SELECT COUNT(*) FROM policies");
    if (parseInt(polRes.rows[0].count, 10) === 0) {
      const initialPolicies = [
        {
          id: "pol-1",
          title: "DYPIU Campus Information Security Policy",
          category: "IT & Security",
          summary: "Guidelines for acceptable use of campus network, accounts, data protection, and cybersecurity compliance.",
          content: "All students, faculty, and administrative staff must adhere to strict password governance, multi-factor authentication, and data privacy regulations.",
          version: "1.2",
          status: "published"
        },
        {
          id: "pol-2",
          title: "Academic Integrity Framework",
          category: "Academic",
          summary: "Policy governing originality of submitted course assignments and examination conduct.",
          content: "DYPIU maintains zero tolerance towards academic dishonesty and uncredited generation in accordance with UGC guidelines.",
          version: "2.0",
          status: "published"
        }
      ];

      for (const item of initialPolicies) {
        await pool.query(
          `INSERT INTO policies (id, title, category, summary, content, version, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [item.id, item.title, item.category, item.summary, item.content, item.version, item.status]
        );
      }
    }

    // 4. Seed Access Rules if empty
    const ruleRes = await pool.query("SELECT COUNT(*) FROM access_rules");
    if (parseInt(ruleRes.rows[0].count, 10) === 0) {
      const initialRules = [
        {
          id: "rule-1",
          name: "Super Administrator Grant",
          target_type: "role",
          target_value: "super_admin",
          services: ["notices", "policies", "applications", "access", "audit"],
          access_level: "full",
          status: "active"
        },
        {
          id: "rule-2",
          name: "Administrator Role Grant",
          target_type: "role",
          target_value: "admin",
          services: ["notices", "policies", "applications", "access", "audit"],
          access_level: "full",
          status: "active"
        },
        {
          id: "rule-3",
          name: "Student Account Notice Access",
          target_type: "email",
          target_value: "20240802084@dypiu.ac.in",
          services: ["notices"],
          access_level: "write",
          status: "active"
        }
      ];

      for (const item of initialRules) {
        await pool.query(
          `INSERT INTO access_rules (id, name, target_type, target_value, services, access_level, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [item.id, item.name, item.target_type, item.target_value, item.services, item.access_level, item.status]
        );
      }
    }
  } catch (err) {
    console.warn("Seeding warning:", err.message);
  }
}

module.exports = {
  pool,
  query,
  initDatabase
};
