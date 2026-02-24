/**
 * Seed script: migra los datos de en.json / es.json del portfolio a la base de datos.
 * Ejecutar UNA SOLA VEZ tras el primer deploy o para resetear datos.
 *
 * Uso: pnpm --filter admin run prisma:seed
 */

import "dotenv/config";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Rutas a los JSON del portfolio (usa los reales si existen, sino los .example)
const portfolioI18nPath = path.resolve(__dirname, "../../portfolio/src/i18n");

function loadPortfolioJson(lang: "en" | "es") {
  const realPath = path.join(portfolioI18nPath, `${lang}.json`);
  const examplePath = path.join(portfolioI18nPath, `${lang}.example.json`);
  const filePath = fs.existsSync(realPath) ? realPath : examplePath;
  console.log(`  📄 Cargando ${filePath}`);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function splitPeriod(period: string): { periodStart: string; periodEnd: string } {
  // Soporta " – " (em dash), " - " (hyphen), " — " (em dash alternativo)
  const separators = [" – ", " — ", " - "];
  for (const sep of separators) {
    if (period.includes(sep)) {
      const [start, ...rest] = period.split(sep);
      return { periodStart: start.trim(), periodEnd: rest.join(sep).trim() };
    }
  }
  return { periodStart: period.trim(), periodEnd: "Present" };
}

async function main() {
  console.log("\n🌱 Iniciando seed...\n");

  const enData = loadPortfolioJson("en");
  const esData = loadPortfolioJson("es");

  // ── 1. Lenguajes ───────────────────────────────────────────────────────────
  console.log("📌 Creando lenguajes...");
  const enLang = await prisma.language.upsert({
    where: { code: "en" },
    update: {},
    create: { code: "en", name: "English" },
  });
  const esLang = await prisma.language.upsert({
    where: { code: "es" },
    update: {},
    create: { code: "es", name: "Español" },
  });

  const langMap = { en: enLang, es: esLang };
  const dataMap = { en: enData, es: esData };

  // ── 2. Personal Info (hero) ────────────────────────────────────────────────
  console.log("📌 Insertando personal info...");
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code as "en" | "es"];
    await prisma.personalInfo.upsert({
      where: { languageId: lang.id },
      update: {
        name: data.hero.name,
        lastName: data.hero.lastName,
        role: data.hero.role,
        tagline: data.hero.tagline,
        switchLang: data.switchLang || (code === "en" ? "ES" : "EN"),
      },
      create: {
        languageId: lang.id,
        name: data.hero.name,
        lastName: data.hero.lastName,
        role: data.hero.role,
        tagline: data.hero.tagline,
        switchLang: data.switchLang || (code === "en" ? "ES" : "EN"),
      },
    });
  }

  // ── 3. SEO Meta ────────────────────────────────────────────────────────────
  console.log("📌 Insertando SEO meta...");
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code as "en" | "es"];
    await prisma.metaSeo.upsert({
      where: { languageId: lang.id },
      update: { title: data.meta.title, description: data.meta.description },
      create: { languageId: lang.id, title: data.meta.title, description: data.meta.description },
    });
  }

  // ── 4. Nav Labels ──────────────────────────────────────────────────────────
  console.log("📌 Insertando nav labels...");
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code as "en" | "es"];
    await prisma.navLabel.upsert({
      where: { languageId: lang.id },
      update: { ...data.nav },
      create: { languageId: lang.id, ...data.nav },
    });
  }

  // ── 5. About Section ──────────────────────────────────────────────────────
  console.log("📌 Insertando about section...");
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code as "en" | "es"];
    const existing = await prisma.aboutSection.findUnique({ where: { languageId: lang.id } });
    if (existing) {
      await prisma.aboutCircleItem.deleteMany({ where: { aboutSectionId: existing.id } });
      await prisma.aboutSection.update({
        where: { languageId: lang.id },
        data: {
          title: data.about.title,
          subtitle: data.about.subtitle,
          description: data.about.description,
          location: data.about.location,
          email: data.about.email,
          phone: data.about.phone,
          circleItems: {
            create: (data.about.circleItems as string[]).map((label, idx) => ({ label, order: idx })),
          },
        },
      });
    } else {
      await prisma.aboutSection.create({
        data: {
          languageId: lang.id,
          title: data.about.title,
          subtitle: data.about.subtitle,
          description: data.about.description,
          location: data.about.location,
          email: data.about.email,
          phone: data.about.phone,
          circleItems: {
            create: (data.about.circleItems as string[]).map((label, idx) => ({ label, order: idx })),
          },
        },
      });
    }
  }

  // ── 6. Summary Cards ──────────────────────────────────────────────────────
  console.log("📌 Insertando summary cards...");
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code as "en" | "es"];
    await prisma.summaryCard.deleteMany({ where: { languageId: lang.id } });
    await prisma.summaryCard.createMany({
      data: (data.summary as any[]).map((card, idx) => ({
        languageId: lang.id,
        order: idx,
        title: card.title,
        heading: card.heading,
        text: card.text,
      })),
    });
  }

  // ── 7. Marquee Items ──────────────────────────────────────────────────────
  console.log("📌 Insertando marquee items...");
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code as "en" | "es"];
    await prisma.marqueeItem.deleteMany({ where: { languageId: lang.id } });
    await prisma.marqueeItem.createMany({
      data: (data.hero.marquee as string[]).map((text, idx) => ({
        languageId: lang.id,
        text,
        order: idx,
      })),
    });
  }

  // ── 8. Experience Jobs ────────────────────────────────────────────────────
  console.log("📌 Insertando experience jobs...");
  // Usar los jobs del ES (tienen todos los campos), EN es traducción
  const esJobs: any[] = esData.experience?.jobs || [];
  const enJobs: any[] = enData.experience?.jobs || [];

  // Limpiar datos existentes
  const existingJobs = await prisma.experienceJob.findMany({ include: { stack: true, translations: true } });
  for (const job of existingJobs) {
    await prisma.experienceStack.deleteMany({ where: { jobId: job.id } });
    await prisma.experienceTranslation.deleteMany({ where: { jobId: job.id } });
    await prisma.experienceJob.delete({ where: { id: job.id } });
  }

  for (let i = 0; i < esJobs.length; i++) {
    const esJob = esJobs[i];
    const enJob = enJobs[i] || esJob;
    const { periodStart, periodEnd } = splitPeriod(esJob.period || "");

    const job = await prisma.experienceJob.create({
      data: {
        number: esJob.number || String(i + 1).padStart(2, "0"),
        company: esJob.company,
        periodStart,
        periodEnd,
        order: i,
      },
    });

    // Traducciones
    await prisma.experienceTranslation.createMany({
      data: [
        { jobId: job.id, languageId: esLang.id, role: esJob.role, summary: esJob.summary, details: esJob.details },
        { jobId: job.id, languageId: enLang.id, role: enJob.role, summary: enJob.summary, details: enJob.details },
      ],
    });

    // Stack
    const stack: string[] = esJob.stack || [];
    await prisma.experienceStack.createMany({
      data: stack.map((tech, idx) => ({ jobId: job.id, tech, order: idx })),
    });
  }

  // ── 9. Skills ─────────────────────────────────────────────────────────────
  console.log("📌 Insertando skills...");
  const esCategories: any[] = esData.skills?.categories || [];
  const enCategories: any[] = enData.skills?.categories || [];

  // Limpiar categorías existentes (cascade elimina skills, traducciones y workplaces)
  const existingCats = await prisma.skillCategory.findMany();
  for (const cat of existingCats) {
    const skills = await prisma.skill.findMany({ where: { categoryId: cat.id } });
    for (const skill of skills) {
      await prisma.skillTranslation.deleteMany({ where: { skillId: skill.id } });
      await prisma.skillWorkplace.deleteMany({ where: { skillId: skill.id } });
      await prisma.skill.delete({ where: { id: skill.id } });
    }
    await prisma.skillCategoryTranslation.deleteMany({ where: { categoryId: cat.id } });
    await prisma.skillCategory.delete({ where: { id: cat.id } });
  }

  for (let ci = 0; ci < esCategories.length; ci++) {
    const esCat = esCategories[ci];
    const enCat = enCategories[ci] || esCat;

    const category = await prisma.skillCategory.create({ data: { order: ci } });

    await prisma.skillCategoryTranslation.createMany({
      data: [
        { categoryId: category.id, languageId: esLang.id, name: esCat.name },
        { categoryId: category.id, languageId: enLang.id, name: enCat.name || esCat.name },
      ],
    });

    const esItems: any[] = esCat.items || [];
    const enItems: any[] = enCat.items || [];

    for (let si = 0; si < esItems.length; si++) {
      const esSkill = esItems[si];
      const enSkill = enItems[si] || esSkill;

      const skill = await prisma.skill.create({
        data: { categoryId: category.id, order: si, years: esSkill.years || "1+" },
      });

      await prisma.skillTranslation.createMany({
        data: [
          { skillId: skill.id, languageId: esLang.id, name: esSkill.name, description: esSkill.description || "" },
          { skillId: skill.id, languageId: enLang.id, name: enSkill.name, description: enSkill.description || "" },
        ],
      });

      const workplaces: string[] = esSkill.workplaces || [];
      if (workplaces.length > 0) {
        await prisma.skillWorkplace.createMany({
          data: workplaces.map((workplace, idx) => ({ skillId: skill.id, workplace, order: idx })),
        });
      }
    }
  }

  // ── 10. Projects ──────────────────────────────────────────────────────────
  console.log("📌 Insertando projects...");
  const esProjects: any[] = esData.projects?.items || esData.projects || [];
  const enProjects: any[] = enData.projects?.items || enData.projects || [];

  // Limpiar proyectos existentes
  const existingProjects = await prisma.project.findMany();
  for (const proj of existingProjects) {
    await prisma.projectTranslation.deleteMany({ where: { projectId: proj.id } });
    await prisma.projectStack.deleteMany({ where: { projectId: proj.id } });
    await prisma.project.delete({ where: { id: proj.id } });
  }

  if (Array.isArray(esProjects) && esProjects.length > 0) {
    for (let pi = 0; pi < esProjects.length; pi++) {
      const esProj = esProjects[pi];
      const enProj = enProjects[pi] || esProj;

      const project = await prisma.project.create({ data: { order: pi } });

      await prisma.projectTranslation.createMany({
        data: [
          { projectId: project.id, languageId: esLang.id, title: esProj.title || esProj.name, description: esProj.description || "" },
          { projectId: project.id, languageId: enLang.id, title: enProj.title || enProj.name, description: enProj.description || "" },
        ],
      });

      const stack: string[] = esProj.stack || esProj.technologies || [];
      if (stack.length > 0) {
        await prisma.projectStack.createMany({
          data: stack.map((tech, idx) => ({ projectId: project.id, tech, order: idx })),
        });
      }
    }
  }

  // ── 11. Contact Section ───────────────────────────────────────────────────
  console.log("📌 Insertando contact section...");
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code as "en" | "es"];
    const form = data.contact?.form || {};
    await prisma.contactSectionTranslation.upsert({
      where: { languageId: lang.id },
      update: {
        title: data.contact?.title || "",
        titleHighlight: data.contact?.titleHighlight || "",
        subtitle: data.contact?.subtitle || "",
        formName: form.name || "Name",
        formEmail: form.email || "Email",
        formSubject: form.subject || "Subject",
        formMessage: form.message || "Message",
        formSend: form.send || "Send",
        formSending: form.sending || "Sending...",
        formSuccess: form.success || "Message sent!",
        formError: form.error || "Error sending message.",
      },
      create: {
        languageId: lang.id,
        title: data.contact?.title || "",
        titleHighlight: data.contact?.titleHighlight || "",
        subtitle: data.contact?.subtitle || "",
        formName: form.name || "Name",
        formEmail: form.email || "Email",
        formSubject: form.subject || "Subject",
        formMessage: form.message || "Message",
        formSend: form.send || "Send",
        formSending: form.sending || "Sending...",
        formSuccess: form.success || "Message sent!",
        formError: form.error || "Error sending message.",
      },
    });
  }

  // ── 12. Footer ────────────────────────────────────────────────────────────
  console.log("📌 Insertando footer...");
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code as "en" | "es"];
    await prisma.footerTranslation.upsert({
      where: { languageId: lang.id },
      update: { name: data.footer?.name || "", email: data.footer?.email || "" },
      create: { languageId: lang.id, name: data.footer?.name || "", email: data.footer?.email || "" },
    });
  }

  // ── 13. Admin User ────────────────────────────────────────────────────────
  console.log("📌 Creando usuario admin...");
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("  ⚠️  ADMIN_EMAIL o ADMIN_PASSWORD no definidos. Saltando creación de usuario.");
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: "Admin",
        password: hashedPassword,
      },
    });
    console.log(`  ✅ Usuario admin creado: ${adminEmail}`);
  }

  console.log("\n✅ Seed completado exitosamente!\n");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
