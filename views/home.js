export function homeView(data) {
  const { programmes, flash, isAdmin, isStaff, totalStats } = data;

  const flashHTML = flash
    ? `<div class="flash-message flash-${flash.type}" id="flash-message">${flash.message}</div>`
    : "";

  const stats = totalStats || {
    total: programmes.length,
    undergraduate: programmes.filter(p => p.level === "undergraduate").length,
    postgraduate:  programmes.filter(p => p.level === "postgraduate").length,
  };

  const activeLevel = data.levelFilter || "";
  const searchQuery = data.searchQuery || "";

  const tabAll  = `<a href="/"                    class="level-tab${activeLevel === ""               ? " active" : ""}">All (${stats.total})</a>`;
  const tabUG   = `<a href="/?level=undergraduate" class="level-tab${activeLevel === "undergraduate" ? " active" : ""}">Undergraduate (${stats.undergraduate})</a>`;
  const tabPG   = `<a href="/?level=postgraduate"  class="level-tab${activeLevel === "postgraduate"  ? " active" : ""}">Postgraduate (${stats.postgraduate})</a>`;

  const programmesHTML = programmes.length === 0
    ? `<div id="programme-empty"><div class="empty-state"><p>No programmes match your search.</p></div></div>
       <div id="programme-results"></div>`
    : `<div id="programme-empty" hidden></div>
       <div id="programme-results">
         <div class="programme-grid">
           ${programmes.map(p => `
             <div class="programme-card">
               ${p.image_url
                 ? `<img src="${p.image_url}" alt="${p.title}" class="programme-image">`
                 : `<div class="programme-image" style="background:linear-gradient(135deg,#003c71,#0066cc);height:180px;"></div>`}
               <div class="programme-content">
                 <div class="programme-meta">
                   <span class="level-badge ${p.level}">
                     ${p.level === "undergraduate" ? "Undergraduate" : "Postgraduate"}
                   </span>
                 </div>
                 <h2><a href="/programmes/${p.id}">${p.title}</a></h2>
                 <p class="programme-description">${p.description}</p>
                 ${p.programme_leader_name
                   ? `<p class="programme-leader"><strong>Programme Leader:</strong> ${p.programme_leader_name}</p>`
                   : ""}
                 <div class="card-actions">
                   <a href="/programmes/${p.id}" class="btn btn-primary">View Details</a>
                 </div>
               </div>
             </div>`).join("")}
         </div>
       </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Course Hub — Discover Your Programme</title>
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
      <nav class="main-nav" aria-label="Main navigation">
        <ul>
          <li><a href="/" class="nav-active">Programmes</a></li>
          <li><a href="/my-interests">My Interests</a></li>
          ${isAdmin ? `
            <li><a href="/admin/dashboard">Admin Dashboard</a></li>
            <li><a href="/admin/logout" class="nav-logout">Logout</a></li>
          ` : isStaff ? `
            <li><a href="/staff/dashboard">Staff Dashboard</a></li>
            <li><a href="/staff/logout" class="nav-logout">Logout</a></li>
          ` : `
            <li><a href="/admin/login">Admin Login</a></li>
            <li><a href="/staff/login">Staff Login</a></li>
          `}
        </ul>
      </nav>
    </div>
  </header>

  <div class="home-hero">
    <div class="container">
      <h1>Discover Your Future Programme</h1>
      <p class="home-hero-sub">Explore undergraduate and postgraduate courses designed to prepare you for tomorrow's challenges.</p>
      <form method="GET" action="/" class="home-hero-search" id="hero-search-form">
        <label for="live-search-input" class="visually-hidden">Search programmes</label>
        <input
          type="text"
          id="live-search-input"
          name="q"
          placeholder="Search programmes by title or description…"
          value="${searchQuery}"
          aria-label="Search programmes"
          data-level="${activeLevel}"
          autocomplete="off"
        >
        ${activeLevel ? `<input type="hidden" name="level" value="${activeLevel}">` : ""}
        <button type="submit">Search</button>
      </form>
    </div>
  </div>

  <div class="home-stats-bar">
    <div class="container">
      <div class="home-stats-inner">
        <div class="home-stat">
          <span class="home-stat-value">${stats.total}</span>
          <div class="home-stat-label">Total Programmes</div>
        </div>
        <div class="home-stat">
          <span class="home-stat-value">${stats.undergraduate}</span>
          <div class="home-stat-label">Undergraduate</div>
        </div>
        <div class="home-stat">
          <span class="home-stat-value">${stats.postgraduate}</span>
          <div class="home-stat-label">Postgraduate</div>
        </div>
      </div>
    </div>
  </div>

  <main id="main-content">
    <div class="container page-content">
      ${flashHTML}

      <div class="home-programmes-header">
        <h2>Available Programmes</h2>
        <div class="level-tabs">
          ${tabAll}${tabUG}${tabPG}
        </div>
      </div>

      ${programmesHTML}
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 Student Course Hub. All rights reserved.</p>
    </div>
  </footer>

  <script src="/js/flash.js"></script>
  <script src="/js/search.js"></script>
</body>
</html>`;
}
