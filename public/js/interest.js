// Async interest registration — intercepts form submit, sends JSON to /api/interest/:id,
// updates count and replaces form with success state without a full page reload.
(function () {
  var form = document.getElementById('interest-form');
  if (!form) return;

  var programmeId = form.dataset.programmeId;
  var countEl = document.getElementById('interest-count');
  var container = document.getElementById('interest-form-container');

  function showInlineError(msg) {
    var existing = document.getElementById('async-flash');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.id = 'async-flash';
    div.className = 'flash-message flash-error';
    div.setAttribute('role', 'alert');
    div.textContent = msg;
    form.parentNode.insertBefore(div, form);
    setTimeout(function () { if (div.parentNode) div.remove(); }, 6000);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]');
    var submitBtn = form.querySelector('button[type="submit"]');

    var name = nameInput ? nameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim() : '';

    if (!name || !email) {
      showInlineError('Please fill in your name and email.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering…';

    fetch('/api/interest/' + programmeId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.error) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Register Your Interest';
          showInlineError(data.error);
          return;
        }

        // Update the interest count in the programme header
        if (countEl && data.count !== undefined) {
          var plural = data.count === 1 ? 'student has' : 'students have';
          countEl.textContent = data.count + ' ' + plural + ' registered interest';
        }

        // Replace the form with a success panel
        if (container) {
          container.innerHTML =
            '<div class="interest-success" role="status">'
            + '<svg class="interest-success-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
            + '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>'
            + '</svg>'
            + '<p>' + (data.alreadyRegistered ? 'You have already registered interest in this programme.' : 'Your interest has been successfully registered!') + '</p>'
            + '<a href="/my-interests?email=' + encodeURIComponent(email) + '" class="btn btn-secondary">View My Interests</a>'
            + '</div>';
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Your Interest';
        showInlineError('Something went wrong. Please try again.');
      });
  });
}());
