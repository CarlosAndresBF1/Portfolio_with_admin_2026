'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getDB } from 'src/lib/db';
import { paths } from 'src/routes/paths';
import { requireAuth } from 'src/lib/require-auth';

export async function saveExperienceJob(formData) {
  await requireAuth();
  const db = await getDB();
  const langRepo = db.getRepository('Language');
  const jobRepo = db.getRepository('ExperienceJob');
  const transRepo = db.getRepository('ExperienceTranslation');
  const stackRepo = db.getRepository('ExperienceStack');

  const id = formData.get('id');
  const company = formData.get('company');
  const number = formData.get('number');
  const periodStart = formData.get('periodStart');
  const periodEnd = formData.get('periodEnd');
  const order = parseInt(formData.get('order') || '0', 10);

  // Traducciones
  const esRole = formData.get('es_role');
  const esSummary = formData.get('es_summary');
  const esDetails = formData.get('es_details');
  const enRole = formData.get('en_role');
  const enSummary = formData.get('en_summary');
  const enDetails = formData.get('en_details');

  // Stack (comma-separated)
  const stackStr = formData.get('stack') || '';
  const stackItems = stackStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const [esLang, enLang] = await Promise.all([
    langRepo.findOneBy({ code: 'es' }),
    langRepo.findOneBy({ code: 'en' }),
  ]);

  if (id) {
    // Update
    await jobRepo.update({ id }, { company, number, periodStart, periodEnd, order });
    // Upsert translations
    await Promise.all([
      transRepo.upsert(
        { jobId: id, languageId: esLang.id, role: esRole, summary: esSummary, details: esDetails },
        ['jobId', 'languageId']
      ),
      transRepo.upsert(
        { jobId: id, languageId: enLang.id, role: enRole, summary: enSummary, details: enDetails },
        ['jobId', 'languageId']
      ),
    ]);
    // Replace stack
    await stackRepo.delete({ jobId: id });
    if (stackItems.length > 0) {
      await stackRepo.save(
        stackItems.map((tech, idx) => ({ jobId: id, tech, order: idx }))
      );
    }
  } else {
    // Create
    const job = await jobRepo.save({ company, number, periodStart, periodEnd, order });
    await transRepo.save([
      { jobId: job.id, languageId: esLang.id, role: esRole, summary: esSummary, details: esDetails },
      { jobId: job.id, languageId: enLang.id, role: enRole, summary: enSummary, details: enDetails },
    ]);
    if (stackItems.length > 0) {
      await stackRepo.save(
        stackItems.map((tech, idx) => ({ jobId: job.id, tech, order: idx }))
      );
    }
  }

  revalidatePath(paths.dashboard.experience.root);
  redirect(`${paths.dashboard.experience.root}?saved=1`);
}

export async function deleteExperienceJob(id) {
  await requireAuth();
  const db = await getDB();
  await db.getRepository('ExperienceStack').delete({ jobId: id });
  await db.getRepository('ExperienceTranslation').delete({ jobId: id });
  await db.getRepository('ExperienceJob').delete({ id });
  revalidatePath(paths.dashboard.experience.root);
}
