import { Admin } from "../models/Admin.js";
import { Programme } from "../models/Programme.js";
import { Module } from "../models/Module.js";
import { Staff } from "../models/Staff.js";
import { Student } from "../models/Student.js";
import { sanitizeInput, validateRequired } from "../middleware/security.js";
import { setSuccessFlash, setErrorFlash, setInfoFlash } from "../utils/flash.js";
import { render } from "../utils/render.js";

function adminPage(ctx, title, content) {
  const flash = ctx.state.flash;
  const flashHTML = flash
    ? `<div class="flash-message flash-${flash.type}" id="flash-message">${flash.message}</div>`
    : "";
  const path = ctx.request.url.pathname;
  const nav = (href, label, cls = "") => {
    const active = path === href || (href !== "/admin/dashboard" && path.startsWith(href));
    const classes = [active ? "nav-active" : "", cls].filter(Boolean).join(" ");
    return `<li><a href="${href}"${classes ? ` class="${classes}"` : ""}>${label}</a></li>`;
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Admin | Student Course Hub</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header class="site-header">
    <div class="container header-content">
      <a href="/" class="site-title">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:28px;height:28px">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
        Student Course Hub
      </a>
      <nav class="main-nav" aria-label="Admin navigation">
        <ul>
          ${nav("/admin/dashboard", "Dashboard")}
          ${nav("/admin/programmes", "Programmes")}
          ${nav("/admin/modules", "Modules")}
          ${nav("/admin/students", "Students")}
          <li><a href="/admin/logout" class="nav-logout">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <main id="main-content">
    <div class="container page-content">
      ${flashHTML}
      ${content}
    </div>
  </main>
  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2026 Student Course Hub. All rights reserved.</p>
    </div>
  </footer>

  <!-- Confirm Modal -->
  <div id="confirm-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
    <div class="modal-box">
      <div class="modal-icon-wrap">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      </div>
      <h3 id="modal-title">Confirm Delete</h3>
      <p id="modal-message">Are you sure you want to delete this item? This action cannot be undone.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
        <button class="btn btn-danger" id="modal-confirm">Yes, Delete</button>
      </div>
    </div>
  </div>

  <script src="/js/flash.js"></script>
  <script>
    (function () {
      var overlay = document.getElementById('confirm-modal');
      var msgEl   = document.getElementById('modal-message');
      var pending = null;

      document.querySelectorAll('.delete-form').forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          pending = form;
          msgEl.textContent = form.dataset.confirmMsg || 'Are you sure you want to delete this item?';
          overlay.hidden = false;
          document.getElementById('modal-cancel').focus();
        });
      });

      document.getElementById('modal-cancel').addEventListener('click', close);
      document.getElementById('modal-confirm').addEventListener('click', function () {
        if (pending) { var form = pending; close(); form.submit(); }
      });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

      function close() { overlay.hidden = true; pending = null; }
    })();
  </script>
</body>
</html>`;
}

export async function showDashboard(ctx) {
  try {
    const adminId = ctx.state.session.adminId;
    const admin = await Admin.findById(adminId);

    if (!admin) {
      setErrorFlash(ctx, "Admin not found.");
      ctx.response.redirect("/admin/login");
      return;
    }

    const stats = {
      totalProgrammes: (await Programme.findAll({})).length,
      totalModules: (await Module.findAll({})).length,
      totalStudents: (await Student.findAll()).length,
      totalStaff: (await Staff.findAll()).length,
    };

    const programmes = await Programme.findAll({});

    await render(ctx, "views/admin-dashboard.js", "adminDashboardView", {
      title: "Admin Dashboard",
      admin,
      stats,
      programmes,
    });
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to load dashboard.");
    ctx.response.redirect("/admin/login");
  }
}

export async function listProgrammes(ctx) {
  try {
    const programmes = await Programme.findAll({});

    const cards = programmes.map(p => {
      const initial = (p.title || "P").charAt(0).toUpperCase();
      const imgHTML = p.image_url
        ? `<img src="${p.image_url}" alt="${p.title}" class="dash-prog-image">`
        : `<div class="dash-prog-placeholder"><span>${initial}</span></div>`;
      const modCount = Number(p.module_count) || 0;
      const pubBadge = p.published
        ? `<span class="mgmt-pub-badge pub-on">Published</span>`
        : `<span class="mgmt-pub-badge pub-off">Draft</span>`;

      return `
        <div class="dash-prog-card" data-search-title="${p.title.toLowerCase()}">
          ${imgHTML}
          <div class="dash-prog-body">
            <div class="dash-prog-meta-row" style="display:flex;gap:0.4rem;align-items:center;flex-wrap:wrap;margin-bottom:0.4rem">
              <span class="level-badge ${p.level}">${p.level === "undergraduate" ? "UG" : "PG"}</span>
              ${pubBadge}
            </div>
            <h3 class="dash-prog-title"><a href="/programmes/${p.id}">${p.title}</a></h3>
            ${p.programme_leader_name ? `<p class="dash-prog-leader">${p.programme_leader_name}</p>` : ""}
            <p class="mgmt-prog-modules">${modCount} module${modCount === 1 ? "" : "s"} assigned</p>
            <div class="dash-prog-actions">
              <a href="/admin/programmes/${p.id}/edit" class="btn btn-small">Edit</a>
              <a href="/admin/programmes/${p.id}/modules" class="btn btn-small">Modules</a>
              <a href="/admin/programmes/${p.id}/mailing-list" class="btn btn-small">Mailing</a>
              <form method="POST" action="/admin/programmes/${p.id}/toggle-published" style="display:inline">
                <button type="submit" class="btn btn-small ${p.published ? "btn-unpublish" : "btn-publish"}">
                  ${p.published ? "Unpublish" : "Publish"}
                </button>
              </form>
              <form method="POST" action="/admin/programmes/${p.id}/delete"
                    class="delete-form" data-confirm-msg="Delete &quot;${p.title}&quot;? All module links and student interests will also be removed.">
                <button type="submit" class="btn btn-small btn-danger">Delete</button>
              </form>
            </div>
          </div>
        </div>`;
    }).join("");

    const content = `
      <div class="dash-section-header">
        <h1>Manage Programmes <span class="dash-count">${programmes.length}</span></h1>
        <a href="/admin/programmes/create" class="btn btn-primary">+ New Programme</a>
      </div>
      <div class="mgmt-search-bar">
        <svg class="mgmt-search-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" id="mgmt-search" class="mgmt-search-input" placeholder="Filter programmes by title…" autocomplete="off">
      </div>
      <div class="dash-prog-grid" id="mgmt-grid">
        ${cards.length ? cards : `<p class="text-muted">No programmes yet. <a href="/admin/programmes/create">Create the first one.</a></p>`}
      </div>
      <script>
        (function(){
          var input = document.getElementById('mgmt-search');
          if(!input) return;
          input.addEventListener('input', function(){
            var q = this.value.toLowerCase();
            document.querySelectorAll('#mgmt-grid [data-search-title]').forEach(function(card){
              card.style.display = card.dataset.searchTitle.includes(q) ? '' : 'none';
            });
          });
        })();
      </script>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Programmes", content);
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to load programmes.");
    ctx.response.redirect("/admin/dashboard");
  }
}

export async function showCreateProgramme(ctx) {
  try {
    const staff = await Staff.findAll();
    const content = `
      <a href="/admin/programmes" class="breadcrumb-link">&larr; Back to Programmes</a>
      <h1 style="margin-top:0.5rem">Create Programme</h1>
      <div class="admin-form-card">
        <form method="POST" action="/admin/programmes/create">
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" name="title" required>
          </div>
          <div class="form-group">
            <label for="level">Level</label>
            <select id="level" name="level" required>
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
            </select>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="programmeLeaderId">Programme Leader</label>
            <select id="programmeLeaderId" name="programmeLeaderId">
              <option value="">None</option>
              ${staff.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="imageUrl">Image URL <span class="text-muted">(optional)</span></label>
            <input id="imageUrl" name="imageUrl" type="url" placeholder="https://...">
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Create Programme</button>
            <a href="/admin/programmes" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Create Programme", content);
  } catch (error) {
    console.error("Error:", error);
    ctx.response.redirect("/admin/programmes");
  }
}

export async function createProgramme(ctx) {
  try {
    const body = await ctx.request.body.formData();
    const title = sanitizeInput(body.get("title"));
    const level = sanitizeInput(body.get("level"));
    const description = sanitizeInput(body.get("description"));
    const programmeLeaderId = body.get("programmeLeaderId");
    const imageUrl = sanitizeInput(body.get("imageUrl"));

    if (!validateRequired({ title, level, description }, ["title", "level", "description"]).valid) {
      setErrorFlash(ctx, "Please fill in all required fields.");
      ctx.response.redirect("/admin/programmes/create");
      return;
    }

    await Programme.create({
      title,
      level,
      description,
      programme_leader_id: programmeLeaderId ? parseInt(programmeLeaderId) : null,
      image_url: imageUrl || null,
      published: true,
    });

    setSuccessFlash(ctx, "Programme created successfully!");
    ctx.response.redirect("/admin/programmes");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to create programme.");
    ctx.response.redirect("/admin/programmes/create");
  }
}

export async function showEditProgramme(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    const programme = await Programme.findById(id);
    const staff = await Staff.findAll();

    if (!programme) {
      setErrorFlash(ctx, "Programme not found.");
      ctx.response.redirect("/admin/programmes");
      return;
    }

    const p = programme;
    const content = `
      <a href="/admin/programmes" class="breadcrumb-link">&larr; Back to Programmes</a>
      <h1 style="margin-top:0.5rem">Edit Programme</h1>
      <div class="admin-form-card">
        <form method="POST" action="/admin/programmes/${id}/update">
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" name="title" value="${p.title}" required>
          </div>
          <div class="form-group">
            <label for="level">Level</label>
            <select id="level" name="level" required>
              <option value="undergraduate" ${p.level === "undergraduate" ? "selected" : ""}>Undergraduate</option>
              <option value="postgraduate" ${p.level === "postgraduate" ? "selected" : ""}>Postgraduate</option>
            </select>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required>${p.description}</textarea>
          </div>
          <div class="form-group">
            <label for="programmeLeaderId">Programme Leader</label>
            <select id="programmeLeaderId" name="programmeLeaderId">
              <option value="">None</option>
              ${staff.map(s => `<option value="${s.id}" ${s.id === p.programme_leader_id ? "selected" : ""}>${s.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="imageUrl">Image URL <span class="text-muted">(optional)</span></label>
            <input id="imageUrl" name="imageUrl" type="url" value="${p.image_url || ""}" placeholder="https://...">
          </div>
          <div class="form-group">
            <label class="mgmt-checkbox-label">
              <input type="checkbox" name="published" value="true" ${p.published ? "checked" : ""}>
              Published (visible to students)
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <a href="/admin/programmes" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Edit Programme", content);
  } catch (error) {
    console.error("Error:", error);
    ctx.response.redirect("/admin/programmes");
  }
}

export async function updateProgramme(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    const body = await ctx.request.body.formData();
    const title = sanitizeInput(body.get("title"));
    const level = sanitizeInput(body.get("level"));
    const description = sanitizeInput(body.get("description"));
    const programmeLeaderId = body.get("programmeLeaderId");
    const imageUrl = sanitizeInput(body.get("imageUrl"));
    const published = body.get("published") === "true";

    if (!validateRequired({ title, level, description }, ["title", "level", "description"]).valid) {
      setErrorFlash(ctx, "Please fill in all required fields.");
      ctx.response.redirect(`/admin/programmes/${id}/edit`);
      return;
    }

    await Programme.update(id, {
      title,
      level,
      description,
      programme_leader_id: programmeLeaderId ? parseInt(programmeLeaderId) : null,
      image_url: imageUrl || null,
      published,
    });

    setSuccessFlash(ctx, "Programme updated successfully!");
    ctx.response.redirect("/admin/programmes");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to update programme.");
    ctx.response.redirect(`/admin/programmes/${ctx.params.id}/edit`);
  }
}

export async function deleteProgramme(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    await Programme.delete(id);
    setSuccessFlash(ctx, "Programme deleted successfully!");
    ctx.response.redirect("/admin/programmes");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to delete programme.");
    ctx.response.redirect("/admin/programmes");
  }
}

export async function togglePublished(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    const programme = await Programme.findById(id);
    if (!programme) {
      setErrorFlash(ctx, "Programme not found.");
      ctx.response.redirect("/admin/programmes");
      return;
    }
    await Programme.setPublished(id, !programme.published);
    setSuccessFlash(ctx, `Programme ${!programme.published ? "published" : "unpublished"} successfully.`);
    ctx.response.redirect("/admin/programmes");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to update programme status.");
    ctx.response.redirect("/admin/programmes");
  }
}

export async function showProgrammeModules(ctx) {
  try {
    const programmeId = parseInt(ctx.params.id);
    const programme = await Programme.findById(programmeId);
    const allModules = await Module.findAll({});
    const assignedModules = await Programme.getModules(programmeId);

    if (!programme) {
      setErrorFlash(ctx, "Programme not found.");
      ctx.response.redirect("/admin/programmes");
      return;
    }

    const assignedIds = new Set(assignedModules.map(m => m.id));
    const unassigned = allModules.filter(m => !assignedIds.has(m.id));

    const assignedCards = assignedModules.length === 0
      ? `<p class="text-muted" style="padding:var(--space-md)">No modules assigned yet.</p>`
      : assignedModules.map(m => `
        <div class="assigned-module-card">
          <div class="assigned-module-info">
            <span class="assigned-module-year">Year ${m.year}</span>
            <strong>${m.code}</strong>
            <span>${m.title}</span>
            ${m.credits ? `<span class="text-muted">&bull; ${m.credits} credits</span>` : ""}
          </div>
          <form method="POST" action="/admin/programmes/${programmeId}/modules/${m.id}/remove"
                class="delete-form" data-confirm-msg="Remove ${m.code} - ${m.title} from this programme?">
            <button type="submit" class="btn btn-small btn-danger">Remove</button>
          </form>
        </div>`).join("");

    const content = `
      <div class="dash-section-header" style="margin-bottom:var(--space-lg)">
        <div>
          <a href="/admin/programmes" class="breadcrumb-link">&larr; Back to Programmes</a>
          <h1 style="margin-top:0.375rem">Module Assignment</h1>
          <p class="text-muted" style="margin:0">${programme.title}</p>
        </div>
      </div>

      <div class="module-assign-layout">
        <div class="module-assign-panel">
          <h2 class="panel-title">Add a Module</h2>
          ${unassigned.length === 0
            ? `<p class="text-muted">All available modules are already assigned.</p>`
            : `<form method="POST" action="/admin/programmes/${programmeId}/modules">
                <div class="form-group">
                  <label for="moduleId">Module</label>
                  <select name="moduleId" id="moduleId" required>
                    <option value="">— Select a module —</option>
                    ${unassigned.map(m => `<option value="${m.id}">${m.code} &ndash; ${m.title}</option>`).join("")}
                  </select>
                </div>
                <div class="form-group">
                  <label for="year">Year of Study</label>
                  <select name="year" id="year" required>
                    <option value="">— Select year —</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary">Assign Module</button>
                </div>
              </form>`
          }
        </div>

        <div class="module-assigned-panel">
          <h2 class="panel-title">
            Assigned Modules
            <span class="dash-count">${assignedModules.length}</span>
          </h2>
          <div class="assigned-module-list">${assignedCards}</div>
        </div>
      </div>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Programme Modules", content);
  } catch (error) {
    console.error("Error:", error);
    ctx.response.redirect("/admin/programmes");
  }
}

export async function assignModuleToProgramme(ctx) {
  try {
    const programmeId = parseInt(ctx.params.id);
    const body = await ctx.request.body.formData();
    const moduleId = parseInt(body.get("moduleId"));
    const year = parseInt(body.get("year"));

    await Programme.assignModule(programmeId, moduleId, year);
    setSuccessFlash(ctx, "Module assigned successfully!");
    ctx.response.redirect(`/admin/programmes/${programmeId}/modules`);
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to assign module.");
    ctx.response.redirect(`/admin/programmes/${ctx.params.id}/modules`);
  }
}

export async function removeModuleFromProgramme(ctx) {
  try {
    const programmeId = parseInt(ctx.params.id);
    const moduleId = parseInt(ctx.params.moduleId);

    await Programme.removeModule(programmeId, moduleId);
    setSuccessFlash(ctx, "Module removed successfully!");
    ctx.response.redirect(`/admin/programmes/${programmeId}/modules`);
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to remove module.");
    ctx.response.redirect(`/admin/programmes/${ctx.params.id}/modules`);
  }
}

function moduleAccent(code) {
  const prefix = (code || "").replace(/\d.*$/, "").toUpperCase();
  const map = {
    IMAT: { bg: "#f3e8ff", border: "#7e22ce", text: "#7e22ce" },
    CTEC: { bg: "#e8eef7", border: "#1e40af", text: "#1e40af" },
    DATA: { bg: "#ecfdf5", border: "#065f46", text: "#065f46" },
  };
  return map[prefix] || { bg: "#f1f5f9", border: "#475569", text: "#475569" };
}

export async function listModules(ctx) {
  try {
    const modules = await Module.findAll({});

    const cards = modules.map(m => {
      const accent = moduleAccent(m.code);
      return `
        <div class="mgmt-mod-card" data-search-title="${m.title.toLowerCase()} ${m.code.toLowerCase()}" style="border-top:4px solid ${accent.border}">
          <div class="staff-mod-header">
            <span class="staff-mod-code" style="background:${accent.bg};color:${accent.text}">${m.code}</span>
            <span class="staff-mod-credits">${m.credits} cr</span>
          </div>
          <h3 class="staff-mod-title">${m.title}</h3>
          <p class="staff-mod-desc">${m.description || ""}</p>
          ${m.module_leader_name ? `<p class="mgmt-mod-leader">${m.module_leader_name}</p>` : ""}
          <div class="mgmt-mod-actions">
            <a href="/admin/modules/${m.id}/edit" class="btn btn-small">Edit</a>
            <form method="POST" action="/admin/modules/${m.id}/delete"
                  class="delete-form" data-confirm-msg="Delete &quot;${m.code} — ${m.title}&quot;? It will be removed from all programmes.">
              <button type="submit" class="btn btn-small btn-danger">Delete</button>
            </form>
          </div>
        </div>`;
    }).join("");

    const content = `
      <div class="dash-section-header">
        <h1>Manage Modules <span class="dash-count">${modules.length}</span></h1>
        <a href="/admin/modules/create" class="btn btn-primary">+ New Module</a>
      </div>
      <div class="mgmt-search-bar">
        <svg class="mgmt-search-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" id="mgmt-search" class="mgmt-search-input" placeholder="Filter modules by title or code…" autocomplete="off">
      </div>
      <div class="mgmt-mod-grid" id="mgmt-grid">
        ${cards.length ? cards : `<p class="text-muted">No modules yet. <a href="/admin/modules/create">Create the first one.</a></p>`}
      </div>
      <script>
        (function(){
          var input = document.getElementById('mgmt-search');
          if(!input) return;
          input.addEventListener('input', function(){
            var q = this.value.toLowerCase();
            document.querySelectorAll('#mgmt-grid [data-search-title]').forEach(function(card){
              card.style.display = card.dataset.searchTitle.includes(q) ? '' : 'none';
            });
          });
        })();
      </script>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Modules", content);
  } catch (error) {
    console.error("Error:", error);
    ctx.response.redirect("/admin/dashboard");
  }
}

export async function showCreateModule(ctx) {
  try {
    const staff = await Staff.findAll();
    const content = `
      <a href="/admin/modules" class="breadcrumb-link">&larr; Back to Modules</a>
      <h1 style="margin-top:0.5rem">Create Module</h1>
      <div class="admin-form-card">
        <form method="POST" action="/admin/modules/create">
          <div class="form-group">
            <label for="code">Module Code</label>
            <input id="code" name="code" required placeholder="e.g. CS101">
          </div>
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" name="title" required>
          </div>
          <div class="form-group">
            <label for="credits">Credits</label>
            <input id="credits" type="number" name="credits" min="1" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="moduleLeaderId">Module Leader</label>
            <select id="moduleLeaderId" name="moduleLeaderId">
              <option value="">None</option>
              ${staff.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Create Module</button>
            <a href="/admin/modules" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Create Module", content);
  } catch (error) {
    console.error("Error:", error);
    ctx.response.redirect("/admin/modules");
  }
}

export async function createModule(ctx) {
  try {
    const body = await ctx.request.body.formData();
    const code = sanitizeInput(body.get("code"));
    const title = sanitizeInput(body.get("title"));
    const credits = parseInt(body.get("credits"));
    const description = sanitizeInput(body.get("description"));
    const moduleLeaderId = body.get("moduleLeaderId");

    if (!validateRequired({ code, title, description }, ["code", "title", "description"]).valid || !credits) {
      setErrorFlash(ctx, "Please fill in all required fields.");
      ctx.response.redirect("/admin/modules/create");
      return;
    }

    await Module.create({
      code,
      title,
      credits,
      description,
      module_leader_id: moduleLeaderId ? parseInt(moduleLeaderId) : null,
    });

    setSuccessFlash(ctx, "Module created successfully!");
    ctx.response.redirect("/admin/modules");
  } catch (error) {
    console.error("Error:", error);
    if (error?.fields?.code === "23505") {
      setErrorFlash(ctx, "A module with that code already exists. Please use a different code.");
    } else {
      setErrorFlash(ctx, "Failed to create module.");
    }
    ctx.response.redirect("/admin/modules/create");
  }
}

export async function showEditModule(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    const mod = await Module.findById(id);
    const staff = await Staff.findAll();

    if (!mod) {
      setErrorFlash(ctx, "Module not found.");
      ctx.response.redirect("/admin/modules");
      return;
    }

    const content = `
      <a href="/admin/modules" class="breadcrumb-link">&larr; Back to Modules</a>
      <h1 style="margin-top:0.5rem">Edit Module</h1>
      <div class="admin-form-card">
        <form method="POST" action="/admin/modules/${id}/update">
          <div class="form-group">
            <label for="code">Module Code</label>
            <input id="code" name="code" value="${mod.code}" required>
          </div>
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" name="title" value="${mod.title}" required>
          </div>
          <div class="form-group">
            <label for="credits">Credits</label>
            <input id="credits" type="number" name="credits" value="${mod.credits}" min="1" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required>${mod.description}</textarea>
          </div>
          <div class="form-group">
            <label for="moduleLeaderId">Module Leader</label>
            <select id="moduleLeaderId" name="moduleLeaderId">
              <option value="">None</option>
              ${staff.map(s => `<option value="${s.id}" ${s.id === mod.module_leader_id ? "selected" : ""}>${s.name}</option>`).join("")}
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <a href="/admin/modules" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Edit Module", content);
  } catch (error) {
    console.error("Error:", error);
    ctx.response.redirect("/admin/modules");
  }
}

export async function updateModule(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    const body = await ctx.request.body.formData();
    const code = sanitizeInput(body.get("code"));
    const title = sanitizeInput(body.get("title"));
    const credits = parseInt(body.get("credits"));
    const description = sanitizeInput(body.get("description"));
    const moduleLeaderId = body.get("moduleLeaderId");

    if (!validateRequired({ code, title, description }, ["code", "title", "description"]).valid || !credits) {
      setErrorFlash(ctx, "Please fill in all required fields.");
      ctx.response.redirect(`/admin/modules/${id}/edit`);
      return;
    }

    await Module.update(id, {
      code,
      title,
      credits,
      description,
      module_leader_id: moduleLeaderId ? parseInt(moduleLeaderId) : null,
    });

    setSuccessFlash(ctx, "Module updated successfully!");
    ctx.response.redirect("/admin/modules");
  } catch (error) {
    console.error("Error:", error);
    if (error?.fields?.code === "23505") {
      setErrorFlash(ctx, "A module with that code already exists. Please use a different code.");
    } else {
      setErrorFlash(ctx, "Failed to update module.");
    }
    ctx.response.redirect(`/admin/modules/${ctx.params.id}/edit`);
  }
}

export async function deleteModule(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    await Module.delete(id);
    setSuccessFlash(ctx, "Module deleted successfully!");
    ctx.response.redirect("/admin/modules");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to delete module.");
    ctx.response.redirect("/admin/modules");
  }
}

export async function listStudents(ctx) {
  try {
    const students = await Student.findAllWithInterestSummary();
    const rows = students.map(s => {
      const programmes = s.interested_programmes
        ? s.interested_programmes.split(", ").map(t => `<span class="interest-tag">${t}</span>`).join("")
        : `<span class="text-muted">None</span>`;
      return `
      <tr>
        <td>${s.name}</td>
        <td><a href="mailto:${s.email}">${s.email}</a></td>
        <td class="interest-tags-cell">${programmes}</td>
        <td>${s.created_at ? new Date(s.created_at).toLocaleDateString("en-GB") : "—"}</td>
        <td>
          <form method="POST" action="/admin/students/${s.id}/delete"
                class="delete-form" data-confirm-msg="Delete student &quot;${s.name}&quot;? This will also remove all their interest records.">
            <button type="submit" class="btn btn-small btn-danger">Delete</button>
          </form>
        </td>
      </tr>`;
    }).join("");

    const content = `
      <div class="dash-section-header">
        <h1>Students <span class="dash-count">${students.length}</span></h1>
      </div>
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Interested Programmes</th><th>Registered</th><th>Actions</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Students", content);
  } catch (error) {
    console.error("Error:", error);
    ctx.response.redirect("/admin/dashboard");
  }
}

export async function exportMailingList(ctx) {
  try {
    const programmeId = parseInt(ctx.params.id);
    const students = await Programme.getInterestedStudents(programmeId);

    if (students.length === 0) {
      setInfoFlash(ctx, "No students registered.");
      ctx.response.redirect("/admin/programmes");
      return;
    }

    const csv = "Name,Email\n" + students.map(s => `${s.name},${s.email}`).join("\n");

    ctx.response.headers.set("Content-Type", "text/csv");
    ctx.response.headers.set("Content-Disposition", `attachment; filename="mailing-list-${programmeId}.csv"`);
    ctx.response.body = csv;
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to export.");
    ctx.response.redirect("/admin/programmes");
  }
}

export async function showMailingList(ctx) {
  try {
    const programmeId = parseInt(ctx.params.id);
    const programme = await Programme.findById(programmeId);
    const students = await Programme.getInterestedStudents(programmeId);

    if (!programme) {
      setErrorFlash(ctx, "Programme not found.");
      ctx.response.redirect("/admin/programmes");
      return;
    }

    const rows = students.map(s => `
      <tr>
        <td>${s.name}</td>
        <td><a href="mailto:${s.email}">${s.email}</a></td>
        <td>${new Date(s.registered_at).toLocaleDateString("en-GB")}</td>
      </tr>
    `).join("");

    const content = `
      <div class="dash-section-header">
        <h1>Mailing List: ${programme.title}</h1>
        <div style="display:flex;gap:0.5rem">
          <a href="/admin/programmes/${programmeId}/mailing-list/export" class="btn btn-primary">Export CSV</a>
          <a href="/admin/programmes" class="btn">Back</a>
        </div>
      </div>
      <p style="color:var(--text-light);margin-bottom:1rem">${students.length} student${students.length === 1 ? "" : "s"} registered interest</p>
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Registered</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = adminPage(ctx, "Mailing List", content);
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to load mailing list.");
    ctx.response.redirect("/admin/programmes");
  }
}

export async function deleteStudent(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    await Student.delete(id);
    setSuccessFlash(ctx, "Student deleted successfully!");
    ctx.response.redirect("/admin/students");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to delete student.");
    ctx.response.redirect("/admin/students");
  }
}
