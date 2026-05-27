export function adminDashboardView(data) {
  const { admin, stats, programmes, flash } = data;

  const flashHTML = flash
    ? `<div class="flash-message flash-${flash.type}" id="flash-message">${flash.message}</div>`
    : "";

  const iconProgramme = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>`;
  const iconModule   = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>`;
  const iconStudents = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`;
  const iconStaff    = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const statDefs = [
    { label: "Programmes", value: stats.totalProgrammes, icon: iconProgramme, color: "#003c71", link: "/admin/programmes" },
    { label: "Modules",    value: stats.totalModules,    icon: iconModule,    color: "#2e7d32", link: "/admin/modules"    },
    { label: "Students",   value: stats.totalStudents,   icon: iconStudents,  color: "#6a1b9a", link: "/admin/students"   },
    { label: "Staff",      value: stats.totalStaff,      icon: iconStaff,     color: "#bf360c", link: "#"                },
  ];

  const statCardsHTML = statDefs.map((s) => `
    <a href="${s.link}" class="dash-stat-link">
      <div class="dash-stat-card" style="--stat-color:${s.color}">
        <div class="dash-stat-icon">${s.icon}</div>
        <div class="dash-stat-value">${s.value}</div>
        <div class="dash-stat-label">${s.label}</div>
      </div>
    </a>`).join("");

  const actionDefs = [
    {
      icon: iconProgramme, color: "#003c71",
      title: "Manage Programmes",
      desc: "Create, edit, and publish programmes. Assign modules and export student mailing lists.",
      link: "/admin/programmes", cta: "Open Programmes",
    },
    {
      icon: iconModule, color: "#2e7d32",
      title: "Manage Modules",
      desc: "Create and update course modules. Set credits, descriptions, and module leaders.",
      link: "/admin/modules", cta: "Open Modules",
    },
    {
      icon: iconStudents, color: "#6a1b9a",
      title: "View Students",
      desc: "Browse all students who have registered interest and manage their records.",
      link: "/admin/students", cta: "Open Students",
    },
  ];

  const actionsHTML = actionDefs.map((a) => `
    <a href="${a.link}" class="dash-action-card">
      <div class="dash-action-icon" style="color:${a.color}">${a.icon}</div>
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
      <span class="dash-action-cta" style="color:${a.color}">${a.cta} &rarr;</span>
    </a>`).join("");

  const programmeCardsHTML = programmes.map((p) => {
    const initial = (p.title || "P").charAt(0).toUpperCase();
    const imgHTML = p.image_url
      ? `<img src="${p.image_url}" alt="${p.title}" class="dash-prog-image">`
      : `<div class="dash-prog-placeholder"><span>${initial}</span></div>`;
    return `
    <div class="dash-prog-card">
      ${imgHTML}
      <div class="dash-prog-body">
        <div class="dash-prog-meta-row">
          <span class="level-badge ${p.level}">${p.level === "undergraduate" ? "Undergraduate" : "Postgraduate"}</span>
        </div>
        <h3 class="dash-prog-title"><a href="/programmes/${p.id}">${p.title}</a></h3>
        ${p.programme_leader_name ? `<p class="dash-prog-leader"><svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;vertical-align:middle;margin-right:4px"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>${p.programme_leader_name}</p>` : ""}
        <div class="dash-prog-actions">
          <a href="/admin/programmes/${p.id}/edit" class="btn btn-small">Edit</a>
          <a href="/admin/programmes/${p.id}/modules" class="btn btn-small">Modules</a>
          <a href="/admin/programmes/${p.id}/mailing-list" class="btn btn-small">Mailing</a>
        </div>
      </div>
    </div>`;
  }).join("");

  const programmesSection = programmes.length === 0
    ? `<div class="empty-state"><p>No programmes yet. <a href="/admin/programmes/create">Create the first one.</a></p></div>`
    : `<div class="dash-prog-grid">${programmeCardsHTML}</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard | Student Course Hub</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="site-header">
    <div class="container header-content">
      <a href="/" class="site-title">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
        Student Course Hub
      </a>
      <nav class="main-nav" aria-label="Admin navigation">
        <ul>
          <li><a href="/admin/dashboard" class="nav-active">Dashboard</a></li>
          <li><a href="/admin/programmes">Programmes</a></li>
          <li><a href="/admin/modules">Modules</a></li>
          <li><a href="/admin/students">Students</a></li>
          <li><a href="/admin/logout" class="nav-logout">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="admin-dash-hero">
    <div class="container">
      <div class="admin-dash-hero-inner">
        <div class="admin-dash-hero-text">
          <span class="admin-dash-badge">Admin Portal</span>
          <h1>Welcome back</h1>
          <p class="admin-dash-email">${(admin && admin.email) ? admin.email : "Administrator"}</p>
          <p class="admin-dash-date">${today}</p>
        </div>
        <a href="/" class="btn admin-dash-site-btn">View Public Site &rarr;</a>
      </div>
    </div>
  </div>

  <main id="main-content">
    <div class="container page-content">
      ${flashHTML}

      <section class="dash-section">
        <div class="dash-stats-grid">${statCardsHTML}</div>
      </section>

      <section class="dash-section">
        <div class="dash-section-header">
          <h2>Quick Actions</h2>
        </div>
        <div class="dash-actions-grid">${actionsHTML}</div>
      </section>

      <section class="dash-section">
        <div class="dash-section-header">
          <h2>All Programmes <span class="dash-count">${programmes.length}</span></h2>
          <a href="/admin/programmes/create" class="btn btn-primary">+ New Programme</a>
        </div>
        ${programmesSection}
      </section>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 Student Course Hub. All rights reserved.</p>
    </div>
  </footer>

  <script src="/js/flash.js"></script>
</body>
</html>`;
}
