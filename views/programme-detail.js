// Programme Detail View - JavaScript Template
export function programmeDetailView(data) {
  const { programme, modulesByYear, interestedCount, isAdmin, isStaff, flash } = data;
  
  // Flash message HTML
  const flashHTML = flash ? `
    <div class="flash-message flash-${flash.type}" id="flash-message">
      ${flash.message}
    </div>
  ` : '';
  
  // Modules by year HTML
  let modulesHTML = '';
  
  if (Object.keys(modulesByYear).length === 0) {
    modulesHTML = `
      <div class="empty-state">
        <p>No modules assigned to this programme yet.</p>
      </div>
    `;
  } else {
    const years = Object.keys(modulesByYear).sort();
    modulesHTML = years.map(year => {
      const modules = modulesByYear[year];
      const moduleItems = modules.map(module => `
        <div class="module-item">
          <h4>
            <a href="/modules/${module.id}">
              ${module.code}: ${module.title}
            </a>
            <span class="credits">${module.credits} credits</span>
          </h4>
          <p>${module.description}</p>
          ${module.module_leader_name ? `
            <p class="module-leader">
              <strong>Module Leader:</strong> ${module.module_leader_name}
            </p>
          ` : ''}
        </div>
      `).join('');
      
      return `
        <div class="year-section">
          <h3>Year ${year}</h3>
          <div class="module-list">
            ${moduleItems}
          </div>
        </div>
      `;
    }).join('');
  }
  
  // CTA section for students
  const ctaHTML = (!isAdmin && !isStaff) ? `
    <div class="cta-section">
      <h2>Interested in this programme?</h2>
      <p>Register your interest to receive updates about open days, application deadlines, and programme information.</p>
      <div id="interest-form-container">
        <form
          id="interest-form"
          method="POST"
          action="/register-interest/${programme.id}"
          data-programme-id="${programme.id}"
        >
          <div class="form-group">
            <label for="interest-name">Full Name</label>
            <input type="text" id="interest-name" name="name" required placeholder="Your full name" autocomplete="name">
          </div>
          <div class="form-group">
            <label for="interest-email">Email Address</label>
            <input type="email" id="interest-email" name="email" required placeholder="your@email.com" autocomplete="email">
          </div>
          <button type="submit" class="btn btn-large">Register Your Interest</button>
        </form>
      </div>
    </div>
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${programme.title} - Student Course Hub</title>
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
              ${isAdmin ? '<li><a href="/admin/dashboard">Admin</a></li>' : ''}
              ${isStaff ? '<li><a href="/staff/dashboard">Staff</a></li>' : ''}
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
          
          <div class="programme-detail-header">
            <span class="level-badge ${programme.level}">
              ${programme.level === 'undergraduate' ? 'Undergraduate Programme' : 'Postgraduate Programme'}
            </span>
            
            <h1>${programme.title}</h1>
            
            <ul class="programme-meta-list">
              ${programme.programme_leader_name ? `
                <li>
                  <strong>Programme Leader:</strong> ${programme.programme_leader_name}
                  ${programme.programme_leader_email ? `
                    (<a href="mailto:${programme.programme_leader_email}">${programme.programme_leader_email}</a>)
                  ` : ''}
                </li>
              ` : ''}
              <li>
                <strong>Student Interest:</strong> <span id="interest-count">${interestedCount} ${interestedCount === 1 ? 'student has' : 'students have'} registered interest</span>
              </li>
            </ul>
          </div>
          
          <div class="programme-section">
            <h2>Programme Overview</h2>
            <p>${programme.description}</p>
          </div>
          
          <div class="programme-section">
            <h2>Programme Modules</h2>
            ${modulesHTML}
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
      <script src="/js/interest.js"></script>
    </body>
    </html>
  `;
}