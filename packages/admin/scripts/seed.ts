/**
 * Seed script: migra los datos de en.json / es.json del portfolio a la base de datos.
 * Ejecutar UNA SOLA VEZ tras el primer deploy o para resetear datos.
 *
 * Uso: pnpm --filter admin run typeorm:seed
 */

// dotenv solo es necesario en desarrollo local; en Docker las env vars vienen de compose
try {
  require('dotenv/config');
} catch {}
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { allEntities } from '../src/entities';

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: allEntities,
  synchronize: false,
});

// Rutas a los JSON del portfolio (usa los reales si existen, sino los .example)
const portfolioI18nPath = path.resolve(__dirname, '../../portfolio/src/i18n');

function loadPortfolioJson(lang: 'en' | 'es') {
  const realPath = path.join(portfolioI18nPath, `${lang}.json`);
  const examplePath = path.join(portfolioI18nPath, `${lang}.example.json`);
  const filePath = fs.existsSync(realPath) ? realPath : examplePath;
  console.log(`  📄 Cargando ${filePath}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function splitPeriod(period: string): { periodStart: string; periodEnd: string } {
  const separators = [' – ', ' — ', ' - '];
  for (const sep of separators) {
    if (period.includes(sep)) {
      const [start, ...rest] = period.split(sep);
      return { periodStart: start.trim(), periodEnd: rest.join(sep).trim() };
    }
  }
  return { periodStart: period.trim(), periodEnd: 'Present' };
}

async function main() {
  await ds.initialize();
  console.log('\n🌱 Iniciando seed...\n');

  const enData = loadPortfolioJson('en');
  const esData = loadPortfolioJson('es');

  const langRepo = ds.getRepository('Language');
  const piRepo = ds.getRepository('PersonalInfo');
  const metaRepo = ds.getRepository('MetaSeo');
  const navRepo = ds.getRepository('NavLabel');
  const aboutRepo = ds.getRepository('AboutSection');
  const circleRepo = ds.getRepository('AboutCircleItem');
  const cardRepo = ds.getRepository('SummaryCard');
  const marqueeRepo = ds.getRepository('MarqueeItem');
  const jobRepo = ds.getRepository('ExperienceJob');
  const jobTransRepo = ds.getRepository('ExperienceTranslation');
  const jobStackRepo = ds.getRepository('ExperienceStack');
  const catRepo = ds.getRepository('SkillCategory');
  const catTransRepo = ds.getRepository('SkillCategoryTranslation');
  const skillRepo = ds.getRepository('Skill');
  const skillTransRepo = ds.getRepository('SkillTranslation');
  const wpRepo = ds.getRepository('SkillWorkplace');
  const projRepo = ds.getRepository('Project');
  const projTransRepo = ds.getRepository('ProjectTranslation');
  const projStackRepo = ds.getRepository('ProjectStack');
  const csRepo = ds.getRepository('ContactSectionTranslation');
  const footerRepo = ds.getRepository('FooterTranslation');
  const userRepo = ds.getRepository('User');

  // ── 1. Lenguajes
  console.log('📌 Creando lenguajes...');
  await langRepo.upsert({ code: 'en', name: 'English' } as any, ['code']);
  await langRepo.upsert({ code: 'es', name: 'Español' } as any, ['code']);
  const enLang = await langRepo.findOneBy({ code: 'en' });
  const esLang = await langRepo.findOneBy({ code: 'es' });

  const langMap: Record<string, any> = { en: enLang, es: esLang };
  const dataMap: Record<string, any> = { en: enData, es: esData };

  // ── 2. Personal Info (hero)
  console.log('📌 Insertando personal info...');
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code];
    await piRepo.upsert(
      {
        languageId: lang.id,
        name: data.hero.name,
        lastName: data.hero.lastName,
        role: data.hero.role,
        tagline: data.hero.tagline,
        switchLang: data.switchLang || (code === 'en' ? 'ES' : 'EN'),
        updatedAt: new Date(),
      } as any,
      ['languageId']
    );
  }

  // ── 3. SEO Meta
  console.log('📌 Insertando SEO meta...');
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code];
    await metaRepo.upsert(
      {
        languageId: lang.id,
        title: data.meta.title,
        description: data.meta.description,
        updatedAt: new Date(),
      } as any,
      ['languageId']
    );
  }

  // ── 4. Nav Labels
  console.log('📌 Insertando nav labels...');
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code];
    await navRepo.upsert({ languageId: lang.id, ...data.nav, updatedAt: new Date() } as any, [
      'languageId',
    ]);
  }

  // ── 5. About Section
  console.log('📌 Insertando about section...');
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code];
    const existing = await aboutRepo.findOneBy({ languageId: lang.id });
    if (existing) {
      await circleRepo.delete({ aboutSectionId: existing.id });
    }
    await aboutRepo.upsert(
      {
        languageId: lang.id,
        title: data.about.title,
        subtitle: data.about.subtitle,
        description: data.about.description,
        location: data.about.location,
        email: data.about.email,
        phone: data.about.phone,
        updatedAt: new Date(),
      } as any,
      ['languageId']
    );
    const aboutSection = await aboutRepo.findOneBy({ languageId: lang.id });
    if (aboutSection) {
      await circleRepo.save(
        (data.about.circleItems as string[]).map((label: string, idx: number) => ({
          aboutSectionId: aboutSection.id,
          label,
          order: idx,
        }))
      );
    }
  }

  // ── 6. Summary Cards
  console.log('📌 Insertando summary cards...');
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code];
    await cardRepo.delete({ languageId: lang.id });
    await cardRepo.save(
      (data.summary as any[]).map((card: any, idx: number) => ({
        languageId: lang.id,
        order: idx,
        title: card.title,
        heading: card.heading,
        text: card.text,
      }))
    );
  }

  // ── 7. Marquee Items
  console.log('📌 Insertando marquee items...');
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code];
    await marqueeRepo.delete({ languageId: lang.id });
    await marqueeRepo.save(
      (data.hero.marquee as string[]).map((text: string, idx: number) => ({
        languageId: lang.id,
        text,
        order: idx,
      }))
    );
  }

  // ── 8. Experience Jobs
  console.log('📌 Insertando experience jobs...');
  const esJobs: any[] = esData.experience?.jobs || [];
  const enJobs: any[] = enData.experience?.jobs || [];

  const existingJobs = await jobRepo.find();
  for (const job of existingJobs) {
    await jobStackRepo.delete({ jobId: job.id });
    await jobTransRepo.delete({ jobId: job.id });
    await jobRepo.delete({ id: job.id });
  }

  for (let i = 0; i < esJobs.length; i++) {
    const esJob = esJobs[i];
    const enJob = enJobs[i] || esJob;
    const { periodStart, periodEnd } = splitPeriod(esJob.period || '');

    const job = await jobRepo.save({
      number: esJob.number || String(i + 1).padStart(2, '0'),
      company: esJob.company,
      periodStart,
      periodEnd,
      order: i,
    });

    await jobTransRepo.save([
      {
        jobId: job.id,
        languageId: esLang!.id,
        role: esJob.role,
        summary: esJob.summary,
        details: esJob.details,
      },
      {
        jobId: job.id,
        languageId: enLang!.id,
        role: enJob.role,
        summary: enJob.summary,
        details: enJob.details,
      },
    ]);

    const stack: string[] = esJob.stack || [];
    if (stack.length > 0) {
      await jobStackRepo.save(
        stack.map((tech: string, idx: number) => ({ jobId: job.id, tech, order: idx }))
      );
    }
  }

  // ── 9. Skills
  console.log('📌 Insertando skills...');
  const esCategories: any[] = esData.skills?.categories || [];
  const enCategories: any[] = enData.skills?.categories || [];

  const existingCats = await catRepo.find();
  for (const cat of existingCats) {
    const skills = await skillRepo.find({ where: { categoryId: cat.id } });
    for (const skill of skills) {
      await skillTransRepo.delete({ skillId: skill.id });
      await wpRepo.delete({ skillId: skill.id });
      await skillRepo.delete({ id: skill.id });
    }
    await catTransRepo.delete({ categoryId: cat.id });
    await catRepo.delete({ id: cat.id });
  }

  for (let ci = 0; ci < esCategories.length; ci++) {
    const esCat = esCategories[ci];
    const enCat = enCategories[ci] || esCat;

    const category = await catRepo.save({ order: ci });

    await catTransRepo.save([
      { categoryId: category.id, languageId: esLang!.id, name: esCat.name },
      { categoryId: category.id, languageId: enLang!.id, name: enCat.name || esCat.name },
    ]);

    const esItems: any[] = esCat.items || [];
    const enItems: any[] = enCat.items || [];

    for (let si = 0; si < esItems.length; si++) {
      const esSkill = esItems[si];
      const enSkill = enItems[si] || esSkill;

      const skill = await skillRepo.save({
        categoryId: category.id,
        order: si,
        years: esSkill.years || '1+',
      });

      await skillTransRepo.save([
        {
          skillId: skill.id,
          languageId: esLang!.id,
          name: esSkill.name,
          description: esSkill.description || '',
        },
        {
          skillId: skill.id,
          languageId: enLang!.id,
          name: enSkill.name,
          description: enSkill.description || '',
        },
      ]);

      const workplaces: string[] = esSkill.workplaces || [];
      if (workplaces.length > 0) {
        await wpRepo.save(
          workplaces.map((workplace: string, idx: number) => ({
            skillId: skill.id,
            workplace,
            order: idx,
          }))
        );
      }
    }
  }

  // ── 10. Projects
  console.log('📌 Insertando projects...');
  const esProjects: any[] = esData.projects?.items || esData.projects || [];
  const enProjects: any[] = enData.projects?.items || enData.projects || [];

  const existingProjects = await projRepo.find();
  for (const proj of existingProjects) {
    await projTransRepo.delete({ projectId: proj.id });
    await projStackRepo.delete({ projectId: proj.id });
    await projRepo.delete({ id: proj.id });
  }

  if (Array.isArray(esProjects) && esProjects.length > 0) {
    for (let pi = 0; pi < esProjects.length; pi++) {
      const esProj = esProjects[pi];
      const enProj = enProjects[pi] || esProj;

      const project = await projRepo.save({ order: pi });

      await projTransRepo.save([
        {
          projectId: project.id,
          languageId: esLang!.id,
          title: esProj.title || esProj.name,
          description: esProj.description || '',
        },
        {
          projectId: project.id,
          languageId: enLang!.id,
          title: enProj.title || enProj.name,
          description: enProj.description || '',
        },
      ]);

      const stack: string[] = esProj.stack || esProj.technologies || [];
      if (stack.length > 0) {
        await projStackRepo.save(
          stack.map((tech: string, idx: number) => ({ projectId: project.id, tech, order: idx }))
        );
      }
    }
  }

  // ── 11. Contact Section
  console.log('📌 Insertando contact section...');
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code];
    const form = data.contact?.form || {};
    await csRepo.upsert(
      {
        languageId: lang.id,
        title: data.contact?.title || '',
        titleHighlight: data.contact?.titleHighlight || '',
        subtitle: data.contact?.subtitle || '',
        formName: form.name || 'Name',
        formEmail: form.email || 'Email',
        formSubject: form.subject || 'Subject',
        formMessage: form.message || 'Message',
        formSend: form.send || 'Send',
        formSending: form.sending || 'Sending...',
        formSuccess: form.success || 'Message sent!',
        formError: form.error || 'Error sending message.',
        updatedAt: new Date(),
      } as any,
      ['languageId']
    );
  }

  // ── 12. Footer
  console.log('📌 Insertando footer...');
  for (const [code, data] of Object.entries(dataMap)) {
    const lang = langMap[code];
    await footerRepo.upsert(
      {
        languageId: lang.id,
        name: data.footer?.name || '',
        email: data.footer?.email || '',
        updatedAt: new Date(),
      } as any,
      ['languageId']
    );
  }

  // ── 13. Admin User
  console.log('📌 Creando usuario admin...');
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('  ⚠️  ADMIN_EMAIL o ADMIN_PASSWORD no definidos. Saltando creación de usuario.');
  } else {
    const existing = await userRepo.findOneBy({ email: adminEmail });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await userRepo.save({ email: adminEmail, name: 'Admin', password: hashedPassword });
      console.log(`  ✅ Usuario admin creado: ${adminEmail}`);
    } else {
      console.log(`  ℹ️  Usuario admin ya existe: ${adminEmail}`);
    }
  }

  console.log('\n✅ Seed completado exitosamente!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await ds.destroy();
  });
