import { Programme, Module, Student } from "../models/mod.js";
import { sanitizeInput, isValidEmail, validateRequired } from "../middleware/security.js";
import { render } from "../utils/render.js";
import { setSuccessFlash, setErrorFlash, setInfoFlash, FlashMessages } from "../utils/flash.js";

export async function listProgrammes(ctx) {
  try {
    const level = ctx.request.url.searchParams.get("level");
    const searchQuery = ctx.request.url.searchParams.get("q");

    const filters = { published: true };
    if (level) filters.level = level;
    if (searchQuery) filters.search = searchQuery;

    const [programmes, allProgrammes] = await Promise.all([
      Programme.findAll(filters),
      Programme.findAll({ published: true }),
    ]);

    const totalStats = {
      total: allProgrammes.length,
      undergraduate: allProgrammes.filter(p => p.level === "undergraduate").length,
      postgraduate:  allProgrammes.filter(p => p.level === "postgraduate").length,
    };

    await render(ctx, "views/home.js", "homeView", {
      title: "Browse Programmes",
      programmes,
      totalStats,
      levelFilter: level || "",
      searchQuery: searchQuery || "",
    });
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to load programmes.");
    ctx.response.redirect("/");
  }
}

export async function viewProgramme(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    const programme = await Programme.findById(id);

    if (!programme) {
      setErrorFlash(ctx, FlashMessages.PROGRAMME_NOT_FOUND);
      ctx.response.redirect("/");
      return;
    }

    const modules = await Programme.getModules(id);
    const interestedCount = await Programme.getInterestedCount(id);

    const modulesByYear = {};
    for (const mod of modules) {
      const year = mod.year || 1;
      if (!modulesByYear[year]) modulesByYear[year] = [];
      modulesByYear[year].push(mod);
    }

    await render(ctx, "views/programme-detail.js", "programmeDetailView", {
      title: programme.title,
      programme,
      modulesByYear,
      interestedCount,
    });
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to load programme.");
    ctx.response.redirect("/");
  }
}

export async function viewModule(ctx) {
  try {
    const id = parseInt(ctx.params.id);
    const mod = await Module.findById(id);

    if (!mod) {
      setErrorFlash(ctx, FlashMessages.MODULE_NOT_FOUND);
      ctx.response.redirect("/");
      return;
    }

    const programmes = await Module.getProgrammes(id);

    await render(ctx, "views/module-detail.js", "moduleDetailView", {
      title: `${mod.code}: ${mod.title}`,
      module: mod,
      programmes,
    });
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to load module.");
    ctx.response.redirect("/");
  }
}

export async function showRegisterInterest(ctx) {
  try {
    const programmeId = parseInt(ctx.params.id);
    const programme = await Programme.findById(programmeId);

    if (!programme) {
      setErrorFlash(ctx, FlashMessages.PROGRAMME_NOT_FOUND);
      ctx.response.redirect("/");
      return;
    }

    ctx.response.redirect(`/programmes/${programmeId}`);
  } catch (error) {
    console.error("Error:", error);
    ctx.response.redirect("/");
  }
}

export async function registerInterest(ctx) {
  try {
    const programmeId = parseInt(ctx.params.id);
    const programme = await Programme.findById(programmeId);

    if (!programme) {
      setErrorFlash(ctx, FlashMessages.PROGRAMME_NOT_FOUND);
      ctx.response.redirect("/");
      return;
    }

    const body = await ctx.request.body.formData();
    const name = sanitizeInput(body.get("name"));
    const email = sanitizeInput(body.get("email"));

    if (!validateRequired({ name, email }, ["name", "email"]).valid) {
      setErrorFlash(ctx, FlashMessages.REQUIRED_FIELDS);
      ctx.response.redirect(`/programmes/${programmeId}`);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorFlash(ctx, FlashMessages.INVALID_EMAIL);
      ctx.response.redirect(`/programmes/${programmeId}`);
      return;
    }

    let student = await Student.findByEmail(email);
    if (!student) {
      student = await Student.create({ name, email });
    }

    const existingInterest = await Student.hasInterest(student.id, programmeId);
    if (existingInterest) {
      setInfoFlash(ctx, FlashMessages.INTEREST_ALREADY_REGISTERED);
      ctx.response.redirect(`/programmes/${programmeId}`);
      return;
    }

    await Student.registerInterest(student.id, programmeId);
    setSuccessFlash(ctx, FlashMessages.INTEREST_REGISTERED);
    ctx.response.redirect(`/programmes/${programmeId}`);
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to register interest.");
    ctx.response.redirect("/");
  }
}

export async function showMyInterests(ctx) {
  try {
    const email = ctx.request.url.searchParams.get("email");

    if (!email) {
      await render(ctx, "views/my-interests.js", "myInterestsView", {
        title: "My Interests",
        studentEmail: null,
      });
      return;
    }

    if (!isValidEmail(email)) {
      setErrorFlash(ctx, FlashMessages.INVALID_EMAIL);
      ctx.response.redirect("/my-interests");
      return;
    }

    const student = await Student.findByEmail(email);
    if (!student) {
      setInfoFlash(ctx, "No interests found for this email.");
      ctx.response.redirect("/my-interests");
      return;
    }

    const interests = await Student.findAllWithProgrammes(student.id);

    await render(ctx, "views/my-interests.js", "myInterestsView", {
      title: "My Interests",
      studentEmail: email,
      studentName: student.name,
      interests,
    });
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to load interests.");
    ctx.response.redirect("/my-interests");
  }
}

export async function withdrawInterest(ctx) {
  try {
    const body = await ctx.request.body.formData();
    const email = sanitizeInput(body.get("email"));
    const programmeId = parseInt(body.get("programmeId"));

    const student = await Student.findByEmail(email);
    if (!student) {
      setErrorFlash(ctx, "Student not found.");
      ctx.response.redirect("/my-interests");
      return;
    }

    await Student.withdrawInterest(student.id, programmeId);
    setSuccessFlash(ctx, FlashMessages.INTEREST_WITHDRAWN);
    ctx.response.redirect(`/my-interests?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error("Error:", error);
    setErrorFlash(ctx, "Failed to withdraw interest.");
    ctx.response.redirect("/my-interests");
  }
}

export async function searchProgrammes(ctx) {
  const q = ctx.request.url.searchParams.get("q") || "";
  const level = ctx.request.url.searchParams.get("level") || "";
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (level) params.set("level", level);
  const query = params.toString();
  ctx.response.redirect(query ? `/?${query}` : "/");
}

export async function apiListProgrammes(ctx) {
  try {
    const q = ctx.request.url.searchParams.get("q") || "";
    const level = ctx.request.url.searchParams.get("level") || "";

    const filters = { published: true };
    if (level) filters.level = level;
    if (q) filters.search = q;

    const programmes = await Programme.findAll(filters);

    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = JSON.stringify({ programmes });
  } catch (error) {
    console.error("API Error:", error);
    ctx.response.status = 500;
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = JSON.stringify({ error: "Failed to load programmes" });
  }
}

export async function apiToggleInterest(ctx) {
  try {
    const programmeId = parseInt(ctx.params.id);
    const programme = await Programme.findById(programmeId);

    if (!programme) {
      ctx.response.status = 404;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({ error: "Programme not found" });
      return;
    }

    const body = await ctx.request.body.json();
    const name = sanitizeInput(body.name || "");
    const email = sanitizeInput(body.email || "");

    if (!name || !email) {
      ctx.response.status = 400;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({ error: "Name and email are required" });
      return;
    }

    if (!isValidEmail(email)) {
      ctx.response.status = 400;
      ctx.response.headers.set("Content-Type", "application/json");
      ctx.response.body = JSON.stringify({ error: "Please provide a valid email address" });
      return;
    }

    let student = await Student.findByEmail(email);
    if (!student) {
      student = await Student.create({ name, email });
    }

    const existingInterest = await Student.hasInterest(student.id, programmeId);
    const count = await Programme.getInterestedCount(programmeId);

    ctx.response.headers.set("Content-Type", "application/json");
    if (existingInterest) {
      ctx.response.body = JSON.stringify({
        success: true,
        alreadyRegistered: true,
        count,
        message: "You have already registered interest in this programme.",
      });
      return;
    }

    await Student.registerInterest(student.id, programmeId);
    const updatedCount = await Programme.getInterestedCount(programmeId);

    ctx.response.body = JSON.stringify({
      success: true,
      alreadyRegistered: false,
      count: updatedCount,
      message: "Your interest has been successfully registered!",
    });
  } catch (error) {
    console.error("API Error:", error);
    ctx.response.status = 500;
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = JSON.stringify({ error: "Failed to register interest" });
  }
}
