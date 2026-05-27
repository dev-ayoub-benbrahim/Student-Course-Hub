// Flash Message Handler - Client-side JavaScript
// Auto-dismiss flash messages with animations

document.addEventListener('DOMContentLoaded', function() {
  const flashMessage = document.getElementById('flash-message');
  
  if (flashMessage) {
    // Animate in
    setTimeout(() => {
      flashMessage.style.opacity = '1';
      flashMessage.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissFlash();
    }, 5000);
    
    // Add close button if not exists
    if (!flashMessage.querySelector('.flash-close')) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'flash-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close message');
      closeBtn.onclick = dismissFlash;
      flashMessage.appendChild(closeBtn);
    }
  }
  
  function dismissFlash() {
    if (flashMessage) {
      flashMessage.style.opacity = '0';
      flashMessage.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        flashMessage.remove();
      }, 300);
    }
  }
});

// Form submission feedback
document.addEventListener('DOMContentLoaded', function() {
  // Add loading state to forms
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (submitBtn && !form.hasAttribute('data-no-loading')) {
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        // Re-enable after delay (in case of validation errors)
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 3000);
      }
    });
  });
});

// Delete confirmations
document.addEventListener('DOMContentLoaded', function() {
  const deleteButtons = document.querySelectorAll('[data-confirm-delete]');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const message = this.getAttribute('data-confirm-delete') || 
                     'Are you sure you want to delete this? This action cannot be undone.';
      
      if (!confirm(message)) {
        e.preventDefault();
        return false;
      }
    });
  });
});

// Withdraw interest confirmation
document.addEventListener('DOMContentLoaded', function() {
  const withdrawForms = document.querySelectorAll('form[action="/withdraw-interest"]');
  
  withdrawForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!confirm('Are you sure you want to withdraw your interest from this programme?')) {
        e.preventDefault();
        return false;
      }
    });
  });
});

// Register interest button feedback
document.addEventListener('DOMContentLoaded', function() {
  const registerButtons = document.querySelectorAll('a[href^="/register-interest/"]');
  
  registerButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Show loading state
      const originalText = this.textContent;
      this.textContent = 'Registering...';
      this.style.pointerEvents = 'none';
      
      // Allow the navigation to proceed
      // The server will handle the registration and show flash message
    });
  });
});

// Auto-scroll to flash message if present
document.addEventListener('DOMContentLoaded', function() {
  const flashMessage = document.getElementById('flash-message');
  
  if (flashMessage) {
    flashMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});