import { Admin } from "../models/Admin.js";
import { Staff } from "../models/Staff.js";
import { sanitizeInput } from "../middleware/security.js";
import { render } from "../utils/render.js";
import { setSuccessFlash, setErrorFlash, FlashMessages } from "../utils/flash.js";

export async function showAdminLogin(ctx) {
  await render(ctx, "views/login.js", "loginView", {
    title: "Admin Login",
    userType: "Admin",
  });
}

export async function adminLogin(ctx) {
  try {
    const body = await ctx.request.body.formData();
    const email = sanitizeInput(body.get("email"));
    const password = body.get("password");

    const admin = await Admin.authenticate(email, password);

    if (!admin) {
      setErrorFlash(ctx, FlashMessages.INVALID_CREDENTIALS);
      ctx.response.redirect("/admin/login");
      return;
    }

    const session = ctx.state.session;
    session.adminId = admin.id;
    session.adminEmail = admin.email;
    session.isAdmin = true;

    setSuccessFlash(ctx, FlashMessages.LOGIN_SUCCESS);
    ctx.response.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, FlashMessages.INVALID_CREDENTIALS);
    ctx.response.redirect("/admin/login");
  }
}

export async function adminLogout(ctx) {
  const session = ctx.state.session;
  delete session.adminId;
  delete session.adminEmail;
  delete session.isAdmin;

  setSuccessFlash(ctx, FlashMessages.LOGOUT_SUCCESS);
  ctx.response.redirect("/");
}

export async function showStaffLogin(ctx) {
  await render(ctx, "views/login.js", "loginView", {
    title: "Staff Login",
    userType: "Staff",
  });
}

export async function staffLogin(ctx) {
  try {
    const body = await ctx.request.body.formData();
    const email = sanitizeInput(body.get("email"));
    const password = body.get("password");

    const staff = await Staff.authenticate(email, password);

    if (!staff) {
      setErrorFlash(ctx, FlashMessages.INVALID_CREDENTIALS);
      ctx.response.redirect("/staff/login");
      return;
    }

    const session = ctx.state.session;
    session.staffId = staff.id;
    session.isStaff = true;

    setSuccessFlash(ctx, FlashMessages.LOGIN_SUCCESS);
    ctx.response.redirect("/staff/dashboard");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, FlashMessages.INVALID_CREDENTIALS);
    ctx.response.redirect("/staff/login");
  }
}

export async function staffLogout(ctx) {
  const session = ctx.state.session;
  delete session.staffId;
  delete session.isStaff;

  setSuccessFlash(ctx, FlashMessages.LOGOUT_SUCCESS);
  ctx.response.redirect("/");
}
