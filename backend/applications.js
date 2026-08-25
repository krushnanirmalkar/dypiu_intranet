module.exports = [
  {
    id: "unisync",
    name: "UniSync",
    shortName: "UniSync",
    description: "University ERP",
    url: "https://unisync.dypiu.ac.in",
    icon: "layout-dashboard",
    category: "Academic",
    roles: ["student", "faculty", "admin"],
    enabled: true
  },

  {
    id: "lms",
    name: "Learning Management System",
    shortName: "LMS",
    description: "Course materials and assignments",
    url: "https://lms.dypiu.ac.in",
    icon: "graduation-cap",
    category: "Academic",
    roles: ["student", "faculty"],
    enabled: true
  },

  {
    id: "library",
    name: "Library",
    shortName: "Library",
    description: "Library services",
    url: "https://library.dypiu.ac.in",
    icon: "library",
    category: "Academic",
    roles: ["student", "faculty"],
    enabled: true
  },

  {
    id: "admin",
    name: "Administration",
    shortName: "Admin",
    description: "Administration Portal",
    url: "https://admin.dypiu.ac.in",
    icon: "shield",
    category: "Administration",
    roles: ["admin"],
    enabled: true
  }
];
