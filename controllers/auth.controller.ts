import { Context } from "oak";
import { Admin } from "../models/Admin.ts";
import { Staff } from "../models/Staff.ts";
import { sanitizeInput } from "../middleware/security.ts";
import { render } from "../utils/render.ts";
import { setSuccessFlash, setErrorFlash, FlashMessages } from "../utils/flash.ts";

export async function showAdminLogin(ctx: Context) {
  await render(ctx, "views/login.js", "loginView", {
    title: "Admin Login",
    userType: "Admin",
  });
}

export async function adminLogin(ctx: Context) {
  try {
    const body = await ctx.request.body.formData();
    const email = sanitizeInput(body.get("email") as string);
    const password = body.get("password") as string;
    
    const admin = await Admin.authenticate(email, password);
    
    if (!admin) {
      setErrorFlash(ctx, FlashMessages.INVALID_CREDENTIALS);
      ctx.response.redirect("/admin/login");
      return;
    }
    
    const session = ctx.state.session;
    session.adminId = (admin as any).id;
    session.adminEmail = (admin as any).email;
    session.isAdmin = true;
    
    setSuccessFlash(ctx, FlashMessages.LOGIN_SUCCESS);
    ctx.response.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, FlashMessages.INVALID_CREDENTIALS);
    ctx.response.redirect("/admin/login");
  }
}

export async function adminLogout(ctx: Context) {
  const session = ctx.state.session;
  delete session.adminId;
  delete session.adminEmail;
  delete session.isAdmin;
  
  setSuccessFlash(ctx, FlashMessages.LOGOUT_SUCCESS);
  ctx.response.redirect("/");
}

export async function showStaffLogin(ctx: Context) {
  await render(ctx, "views/login.js", "loginView", {
    title: "Staff Login",
    userType: "Staff",
  });
}

export async function staffLogin(ctx: Context) {
  try {
    const body = await ctx.request.body.formData();
    const email = sanitizeInput(body.get("email") as string);
    const password = body.get("password") as string;
    
    const staff = await Staff.authenticate(email, password);
    
    if (!staff) {
      setErrorFlash(ctx, FlashMessages.INVALID_CREDENTIALS);
      ctx.response.redirect("/staff/login");
      return;
    }
    
    const session = ctx.state.session;
    session.staffId = (staff as any).id;
    session.isStaff = true;
    
    setSuccessFlash(ctx, FlashMessages.LOGIN_SUCCESS);
    ctx.response.redirect("/staff/dashboard");
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, FlashMessages.INVALID_CREDENTIALS);
    ctx.response.redirect("/staff/login");
  }
}

export async function staffLogout(ctx: Context) {
  const session = ctx.state.session;
  delete session.staffId;
  delete session.isStaff;
  
  setSuccessFlash(ctx, FlashMessages.LOGOUT_SUCCESS);
  ctx.response.redirect("/");
}