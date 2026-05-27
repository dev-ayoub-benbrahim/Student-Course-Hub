export function staffDashboardView(data) {
  const { staff, ledModules, programmes, flash } = data;

  const flashHTML = flash
    ? `<div class="flash-message flash-${flash.type}" id="flash-message">${flash.message}</div>`
    : "";

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // ── Stat cards ────────────────────────────────────────────────────
  const iconModule = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>`;
  const iconProg   = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>`;

  const statsHTML = `
    <div class="staff-stats-grid">
      <div class="staff-stat-card" style="--stat-color:#0f766e">
        <div class="staff-stat-icon" style="color:#0f766e">${iconModule}</div>
        <div class="staff-stat-value" style="color:#0f766e">${ledModules.length}</div>
        <div class="staff-stat-label">Module${ledModules.length === 1 ? "" : "s"} Leading</div>
      </div>
      <div class="staff-stat-card" style="--stat-color:#1d4ed8">
        <div class="staff-stat-icon" style="color:#1d4ed8">${iconProg}</div>
        <div class="staff-stat-value" style="color:#1d4ed8">${programmes.length}</div>
        <div class="staff-stat-label">Programme${programmes.length === 1 ? "" : "s"} Teaching</div>
      </div>
    </div>`;

  // ── Module accent colour by code prefix ───────────────────────────
  function moduleAccent(code) {
    if (!code) return { bg: "#e8eef7", border: "#003c71", text: "#003c71" };
    const prefix = code.replace(/\d.*$/, "").toUpperCase();
    const map = {
      IMAT: { bg: "#f3e8ff", border: "#7e22ce", text: "#7e22ce" },
      CTEC: { bg: "#e8eef7", border: "#1e40af", text: "#1e40af" },
      DATA: { bg: "#ecfdf5", border: "#065f46", text: "#065f46" },
    };
    return map[prefix] || { bg: "#f1f5f9", border: "#475569", text: "#475569" };
  }

  // ── My Modules ────────────────────────────────────────────────────
  const modulesHTML = ledModules.length === 0
    ? `<div class="empty-state"><p>You are not currently leading any modules.</p></div>`
    : `<div class="staff-module-grid">
        ${ledModules.map(m => {
          const accent = moduleAccent(m.code);
          return `
          <div class="staff-mod-card" style="border-top:4px solid ${accent.border}">
            <div class="staff-mod-header">
              <span class="staff-mod-code" style="background:${accent.bg};color:${accent.text}">${m.code}</span>
              <span class="staff-mod-credits">${m.credits} cr</span>
            </div>
            <h3 class="staff-mod-title">
              <a href="/modules/${m.id}">${m.title}</a>
            </h3>
            <p class="staff-mod-desc">${m.description || ""}</p>
            <a href="/modules/${m.id}" class="staff-mod-link">View module details &rarr;</a>
          </div>`;
        }).join("")}
      </div>`;

  // ── My Programmes ─────────────────────────────────────────────────
  const programmesHTML = programmes.length === 0
    ? `<div class="empty-state"><p>No programmes found.</p></div>`
    : `<div class="staff-prog-grid">
        ${programmes.map(p => {
          const count = Number(p.module_count) || 0;
          const initial = (p.title || "P").charAt(0).toUpperCase();
          const imgHTML = p.image_url
            ? `<img src="${p.image_url}" alt="${p.title}" class="staff-prog-image">`
            : `<div class="staff-prog-placeholder"><span>${initial}</span></div>`;
          return `
          <div class="staff-prog-card">
            ${imgHTML}
            <div class="staff-prog-body">
              <span class="level-badge ${p.level}">${p.level === "undergraduate" ? "Undergraduate" : "Postgraduate"}</span>
              <h3><a href="/programmes/${p.id}">${p.title}</a></h3>
              <p class="staff-prog-meta">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width:14px;height:14px;vertical-align:middle;margin-right:3px"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
                ${count} module${count === 1 ? "" : "s"} you lead ${count === 1 ? "is" : "are"} taught here
              </p>
              <a href="/programmes/${p.id}" class="btn btn-small">View Programme</a>
            </div>
          </div>`;
        }).join("")}
      </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Staff Dashboard | Student Course Hub</title>
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
      <nav class="main-nav" aria-label="Staff navigation">
        <ul>
          <li><a href="/">Programmes</a></li>
          <li><a href="/staff/dashboard" class="nav-active">My Dashboard</a></li>
          <li><a href="/staff/logout" class="nav-logout">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="staff-dash-hero">
    <div class="container">
      <div class="staff-dash-hero-inner">
        <div class="staff-dash-hero-text">
          <span class="staff-dash-badge">Staff Portal</span>
          <h1>Welcome back, ${staff.name.split(" ")[0]}</h1>
          <p class="staff-dash-name">${staff.name}</p>
          <p class="staff-dash-email">${staff.email}</p>
          <p class="staff-dash-date">${today}</p>
        </div>
        <a href="/" class="btn staff-dash-site-btn">View Public Site &rarr;</a>
      </div>
    </div>
  </div>

  <main id="main-content">
    <div class="container page-content">
      ${flashHTML}

      <section class="dash-section">
        ${statsHTML}
      </section>

      <section class="dash-section">
        <div class="dash-section-header">
          <h2>My Modules <span class="dash-count">${ledModules.length}</span></h2>
        </div>
        ${modulesHTML}
      </section>

      <section class="dash-section">
        <div class="dash-section-header">
          <h2>Programmes I Teach In <span class="dash-count">${programmes.length}</span></h2>
        </div>
        ${programmesHTML}
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
