import { Application } from "oak";
import  {studentRoutes}  from "./routes/student.routes.ts";
import  {adminRoutes}  from "./routes/admin.routes.ts";
import  {authRoutes}  from "./routes/auth.routes.ts";
import  {staffRoutes}  from "./routes/staff.routes.ts";
import  {getFlash}  from "./utils/flash.ts";

const app = new Application();

// Simple session middleware
const sessions = new Map();

app.use(async (ctx, next) => {
  const sessionId = await ctx.cookies.get("session_id") || crypto.randomUUID();
  
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {});
  }
  
  ctx.state.session = sessions.get(sessionId);
  await ctx.cookies.set("session_id", sessionId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, 
  });
  
  await next();
});

// Flash message middleware
app.use(async (ctx, next) => {
  ctx.state.flash = getFlash(ctx);
  await next();
});

// Static files
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// Routes
app.use(studentRoutes.routes());
app.use(studentRoutes.allowedMethods());

app.use(adminRoutes.routes());
app.use(adminRoutes.allowedMethods());

app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());

app.use(staffRoutes.routes());
app.use(staffRoutes.allowedMethods());

// 404 handler
app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = "Page not found";
});

const PORT = 8000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });