import { Context } from "oak";
import { Staff } from "../models/mod.ts";

export async function requireAdminAuth(ctx: Context, next: () => Promise<unknown>) {
  const session = ctx.state.session;

  if (!session || !session.adminId) {
    ctx.response.redirect("/admin/login");
    return;
  }

  await next();
}

export async function requireStaffAuth(ctx: Context, next: () => Promise<unknown>) {
  const session = ctx.state.session;

  if (!session || !session.staffId) {
    ctx.response.redirect("/staff/login");
    return;
  }

  const staff = await Staff.findById(session.staffId);

  if (!staff) {
    ctx.response.redirect("/staff/login");
    return;
  }

  ctx.state.staff = staff;
  ctx.state.isStaff = true;

  await next();
}

export async function redirectIfAuth(ctx: Context, next: () => Promise<unknown>) {
  const session = ctx.state.session;

  if (session && session.adminId) {
    ctx.response.redirect("/admin/dashboard");
    return;
  }

  await next();
}

export async function attachAdmin(ctx: Context, next: () => Promise<unknown>) {
  const session = ctx.state.session;

  if (session) {
    const adminId = session.adminId;
    const adminEmail = session.adminEmail;

    if (adminId) {
      ctx.state.admin = {
        id: adminId,
        email: adminEmail,
      };
      ctx.state.isAdmin = true;
    }

    const staffId = session.staffId;
    if (staffId) {
      const staff = await Staff.findById(staffId);
      if (staff) {
        ctx.state.staff = staff;
        ctx.state.isStaff = true;
      }
    }
  }

  await next();
}
