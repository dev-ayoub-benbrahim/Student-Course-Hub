// Module Detail View - JavaScript Template
export function moduleDetailView(data) {
  const { module, programmes, isAdmin, isStaff, flash } = data;
  
  // Flash message HTML
  const flashHTML = flash ? `
    <div class="flash-message flash-${flash.type}" id="flash-message">
      ${flash.message}
    </div>
  ` : '';
  
  // Programmes HTML
  let programmesHTML = '';
  if (programmes.length === 0) {
    programmesHTML = `
      <div class="empty-state">
        <p>This module is not currently assigned to any programmes.</p>
      </div>
    `;
  } else {
    programmesHTML = programmes.map(programme => `
      <div class="programme-item">
        <h3>
          <a href="/programmes/${programme.id}">${programme.title}</a>
        </h3>
        <span class="level-badge ${programme.level}">
          ${programme.level === 'undergraduate' ? 'UG' : 'PG'}
        </span>
        <p class="year-info">Taught in Year ${programme.year}</p>
      </div>
    `).join('');
  }
  
  // CTA section for students
  const ctaHTML = (!isAdmin && !isStaff) ? `
    <div class="cta-section">
      <h2>Interested in programmes with this module?</h2>
      <p>Explore the degree programmes that include ${module.title} and register your interest.</p>
      <a href="/" class="btn btn-large">Browse All Programmes</a>
    </div>
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${module.code}: ${module.title} - Student Course Hub</title>
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
            <li><a href="/">Programmes</a></li>
            <li><a href="/my-interests">My Interests</a></li>
            ${isAdmin ? `
              <li><a href="/admin/dashboard">Admin Dashboard</a></li>
              <li><a href="/admin/logout">Logout</a></li>
            ` : isStaff ? `
              <li><a href="/staff/dashboard">Staff Dashboard</a></li>
              <li><a href="/staff/logout">Logout</a></li>
            ` : `
              <li><a href="/admin/login">Admin Login</a></li>
              <li><a href="/staff/login">Staff Login</a></li>
            `}
          </ul>
        </nav>
        </div>
      </header>
      
      <main id="main-content">
        <div class="container page-content">
          ${flashHTML}
          
          <nav aria-label="Breadcrumb" class="breadcrumb-nav">
            <a href="/" class="breadcrumb-link">← Back to Programmes</a>
          </nav>
          
          <div class="module-detail-header">
            <div class="module-code-line">${module.code} · ${module.credits} Credits</div>
            
            <h1>${module.title}</h1>
            
            ${module.module_leader_name ? `
              <p>
                <strong>Module Leader:</strong> ${module.module_leader_name}
                ${module.module_leader_email ? `
                  (<a href="mailto:${module.module_leader_email}">${module.module_leader_email}</a>)
                ` : ''}
              </p>
            ` : ''}
          </div>
          
          <div class="module-section">
            <h2>Module Overview</h2>
            <p>${module.description}</p>
          </div>
          
          <div class="module-section">
            <h2>This Module is Part Of</h2>
            <p>This module is taught as part of the following degree programmes:</p>
            ${programmesHTML}
          </div>
          
          ${ctaHTML}
        </div>
      </main>
      
      <footer class="site-footer">
        <div class="container">
          <p>&copy; 2026 Student Course Hub. All rights reserved.</p>
        </div>
      </footer>
      
      <script src="/js/flash.js"></script>
    </body>
    </html>
  `;
}