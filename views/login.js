export function loginView(data) {
  const { title, userType, flash } = data;
  
  const flashHTML = flash ? `
    <div class="flash-message flash-${flash.type}" id="flash-message">
      ${flash.message}
    </div>
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Student Course Hub</title>
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
          <li><a href="/">Browse Programmes</a></li>
          ${userType === 'Admin'
            ? '<li><a href="/staff/login">Staff Login</a></li>'
            : userType === 'Staff'
            ? '<li><a href="/admin/login">Admin Login</a></li>'
            : ''}
        </ul>
      </nav>
        </div>
      </header>
      
      <main id="main-content">
        <div class="login-page">
          <div class="login-container">
            ${flashHTML}
            
            <div class="login-card">
              <h1>${userType} Login</h1>
              <p>Enter your credentials to access the ${userType.toLowerCase()} portal</p>
              
              <form method="POST" action="/${userType.toLowerCase()}/login">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" required autofocus>
                </div>
                
                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block btn-large">
                  Login
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