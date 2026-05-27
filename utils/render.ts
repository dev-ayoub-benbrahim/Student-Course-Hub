import { Context } from "oak";

export async function render(
  ctx: Context,
  viewModule: string,
  viewFunction: string,
  data: any = {}
) {
  try {
    const defaultData = {
      admin: ctx.state.admin || null,
      isAdmin: ctx.state.isAdmin || false,
      staff: ctx.state.staff || null,
      isStaff: ctx.state.isStaff || false,
      flash: ctx.state.flash || null,
    };
    
    const templateData = { ...defaultData, ...data };
    
    const viewModulePath = `../${viewModule}`;
    const module = await import(viewModulePath);
    
    const renderFunction = module[viewFunction];
    
    if (!renderFunction || typeof renderFunction !== 'function') {
      throw new Error(`View function '${viewFunction}' not found in ${viewModule}`);
    }
    
    const html = renderFunction(templateData);
    
    ctx.response.headers.set("Content-Type", "text/html");
    ctx.response.body = html;
  } catch (error) {
    console.error("Error rendering JavaScript view:", error);
    ctx.response.status = 500;
    ctx.response.body = "Error rendering page";
  }
}