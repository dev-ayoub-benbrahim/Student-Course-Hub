// Live search — debounced fetch against /api/programmes, updates DOM without reload
(function () {
  var input = document.getElementById('live-search-input');
  var resultsEl = document.getElementById('programme-results');
  var emptyEl = document.getElementById('programme-empty');
  if (!input || !resultsEl) return;

  var currentLevel = input.dataset.level || '';
  var debounceTimer;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderCard(p) {
    var imgHTML = p.image_url
      ? '<img src="' + escapeHtml(p.image_url) + '" alt="' + escapeHtml(p.title) + '" class="programme-image">'
      : '<div class="programme-image" style="background:linear-gradient(135deg,#003c71,#0066cc);height:180px;"></div>';
    var levelLabel = p.level === 'undergraduate' ? 'Undergraduate' : 'Postgraduate';
    var leaderHTML = p.programme_leader_name
      ? '<p class="programme-leader"><strong>Programme Leader:</strong> ' + escapeHtml(p.programme_leader_name) + '</p>'
      : '';
    return '<div class="programme-card">'
      + imgHTML
      + '<div class="programme-content">'
      + '<div class="programme-meta"><span class="level-badge ' + escapeHtml(p.level) + '">' + levelLabel + '</span></div>'
      + '<h2><a href="/programmes/' + p.id + '">' + escapeHtml(p.title) + '</a></h2>'
      + '<p class="programme-description">' + escapeHtml(p.description || '') + '</p>'
      + leaderHTML
      + '<div class="card-actions"><a href="/programmes/' + p.id + '" class="btn btn-primary">View Details</a></div>'
      + '</div></div>';
  }

  function doSearch() {
    var q = input.value.trim();
    var params = new URLSearchParams();
    if (q) params.set('q', q);
    if (currentLevel) params.set('level', currentLevel);

    fetch('/api/programmes?' + params.toString())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var programmes = data.programmes || [];
        if (programmes.length === 0) {
          resultsEl.innerHTML = '';
          if (emptyEl) emptyEl.hidden = false;
        } else {
          if (emptyEl) emptyEl.hidden = true;
          resultsEl.innerHTML = '<div class="programme-grid">'
            + programmes.map(renderCard).join('')
            + '</div>';
        }
        // Keep URL in sync so the page is shareable
        var url = new URL(window.location.href);
        if (q) { url.searchParams.set('q', q); } else { url.searchParams.delete('q'); }
        if (currentLevel) { url.searchParams.set('level', currentLevel); } else { url.searchParams.delete('level'); }
        history.replaceState({}, '', url.toString());
      })
      .catch(function (err) { console.error('Live search failed:', err); });
  }

  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doSearch, 320);
  });
}());
