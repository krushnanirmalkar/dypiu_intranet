-- DYPIU Intranet Database Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(255),
  description TEXT,
  url TEXT NOT NULL,
  icon VARCHAR(100) DEFAULT 'LayoutDashboard',
  category VARCHAR(100) DEFAULT 'Productivity',
  roles TEXT[] DEFAULT '{student,staff,admin}',
  enabled BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 1,
  sso_enabled BOOLEAN DEFAULT TRUE,
  highlight_color VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS notices (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'Academic',
  audience VARCHAR(100) DEFAULT 'All',
  priority VARCHAR(100) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'published',
  author VARCHAR(255) DEFAULT 'University Administration',
  publish_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  attachment_url TEXT,
  attachment_name TEXT,
  attachment_size VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS policies (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'Administrative',
  summary TEXT,
  content TEXT,
  version VARCHAR(50) DEFAULT '1.0',
  status VARCHAR(50) DEFAULT 'published',
  effective_date DATE DEFAULT CURRENT_DATE,
  attachment_url TEXT,
  attachment_name TEXT,
  attachment_size VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS access_rules (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  target_type VARCHAR(50) NOT NULL DEFAULT 'email',
  target_value VARCHAR(255) NOT NULL,
  services TEXT[] DEFAULT '{notices}',
  access_level VARCHAR(50) DEFAULT 'read',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(100) PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  actor_sub VARCHAR(255),
  actor_email VARCHAR(255),
  actor_name VARCHAR(255),
  actor_role VARCHAR(100),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  summary TEXT,
  details JSONB,
  ip VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  target_audience VARCHAR(100) DEFAULT 'All',
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255) DEFAULT 'University Administration'
);

CREATE INDEX IF NOT EXISTS idx_access_rules_target ON access_rules (LOWER(TRIM(target_value)));
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices (status);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies (status);
CREATE INDEX IF NOT EXISTS idx_applications_enabled ON applications (enabled);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications (created_at DESC);
