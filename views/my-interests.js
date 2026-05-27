export function myInterestsView(data) {
  const { studentEmail, studentName, interests, flash, isAdmin, isStaff } = data;
  
  const flashHTML = flash ? `
    <div class="flash-message flash-${flash.type}" id="flash-message">
      ${flash.message}
    </div>
  ` : '';
  
  if (!studentEmail) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Interests - Student Course Hub</title>
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
            
<nav class="main-nav">
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
            
            <div class="interests-lookup">
              <h1>My Registered Interests</h1>
              <p>Enter your email to view and manage your programme interests</p>
              
              <div class="lookup-form-card">
                <form method="GET" action="/my-interests">
                  <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="your.email@example.com" autofocus>
                  </div>
                  <button type="submit" class="btn btn-primary btn-block btn-large">
                    View My Interests
                  </button>
                </form>
              </div>
            </div>
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
  
  const interestsHTML = interests.length === 0 ? `
    <div class="empty-state">
      <p>You haven't registered interest in any programmes yet.</p>
      <a href="/" class="btn btn-primary btn-large">Browse Programmes</a>
    </div>
  ` : `
    <div class="student-info">
      <strong>${studentName}</strong> · ${studentEmail}
    </div>
    
    <div class="interests-grid">
      ${interests.map(programme => `
        <div class="interest-card">
          <h2><a href="/programmes/${programme.id}">${programme.title}</a></h2>
          <span class="level-badge ${programme.level}">
            ${programme.level === 'undergraduate' ? 'UG' : 'PG'}
          </span>
          <p class="registered-date">
            Registered ${new Date(programme.registered_at).toLocaleDateString('en-GB')}
          </p>
          <div class="interest-actions">
            <a href="/programmes/${programme.id}" class="btn btn-primary">View Programme</a>
            <form method="POST" action="/withdraw-interest" style="display: inline;">
              <input type="hidden" name="email" value="${studentEmail}">
              <input type="hidden" name="programmeId" value="${programme.id}">
              <button type="submit" class="btn btn-danger">Withdraw</button>
            </form>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Interests - Student Course Hub</title>
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
          
          <nav class="main-nav">
            <ul>
              <li><a href="/">Programmes</a></li>
              <li><a href="/my-interests">My Interests</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main id="main-content">
        <div class="container page-content">
          ${flashHTML}
          
          <div class="interests-header-bar">
            <h1>My Registered Interests</h1>
            <a href="/my-interests" class="btn btn-secondary">Change Email</a>
          </div>
          
          ${interestsHTML}
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