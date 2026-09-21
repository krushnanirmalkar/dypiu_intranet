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

async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
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
    // Return false to indicate DB is offline or fallback needed
    return false;
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
