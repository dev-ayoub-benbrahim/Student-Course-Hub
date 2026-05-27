import { Context } from "oak";
import { Staff } from "../models/Staff.ts";
import { render } from "../utils/render.ts";
import { setErrorFlash } from "../utils/flash.ts";

export async function showDashboard(ctx: Context) {
  try {
    const staffId = ctx.state.session.staffId;
    const staff = await Staff.findById(staffId);
    
    if (!staff) {
      setErrorFlash(ctx, "Staff not found.");
      ctx.response.redirect("/staff/login");
      return;
    }
    
    const ledModules = await Staff.getLedModules(staffId);
    const programmes = await Staff.getProgrammes(staffId);
    
    await render(ctx, "views/staff-dashboard.js", "staffDashboardView", {
      title: "Staff Dashboard",
      staff,
      ledModules,
      programmes,
    });
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to load dashboard.");
    ctx.response.redirect("/staff/login");
  }
}