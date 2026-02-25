'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import { paths } from 'src/routes/paths';
import { requireAuth } from 'src/lib/require-auth';

export async function saveExperienceJob(formData) {
  await requireAuth();
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
    prisma.language.findUnique({ where: { code: 'es' } }),
    prisma.language.findUnique({ where: { code: 'en' } }),
  ]);

  if (id) {
    // Update
    await prisma.experienceJob.update({
      where: { id },
      data: { company, number, periodStart, periodEnd, order },
    });
    // Update translations
    await Promise.all([
      prisma.experienceTranslation.upsert({
        where: { jobId_languageId: { jobId: id, languageId: esLang.id } },
        update: { role: esRole, summary: esSummary, details: esDetails },
        create: { jobId: id, languageId: esLang.id, role: esRole, summary: esSummary, details: esDetails },
      }),
      prisma.experienceTranslation.upsert({
        where: { jobId_languageId: { jobId: id, languageId: enLang.id } },
        update: { role: enRole, summary: enSummary, details: enDetails },
        create: { jobId: id, languageId: enLang.id, role: enRole, summary: enSummary, details: enDetails },
      }),
    ]);
    // Replace stack
    await prisma.experienceStack.deleteMany({ where: { jobId: id } });
    await prisma.experienceStack.createMany({
      data: stackItems.map((tech, idx) => ({ jobId: id, tech, order: idx })),
    });
  } else {
    // Create
    const job = await prisma.experienceJob.create({
      data: { company, number, periodStart, periodEnd, order },
    });
    await prisma.experienceTranslation.createMany({
      data: [
        { jobId: job.id, languageId: esLang.id, role: esRole, summary: esSummary, details: esDetails },
        { jobId: job.id, languageId: enLang.id, role: enRole, summary: enSummary, details: enDetails },
      ],
    });
    await prisma.experienceStack.createMany({
      data: stackItems.map((tech, idx) => ({ jobId: job.id, tech, order: idx })),
    });
  }

  revalidatePath(paths.dashboard.experience.root);
  redirect(`${paths.dashboard.experience.root}?saved=1`);
}

export async function deleteExperienceJob(id) {
  await requireAuth();
  await prisma.experienceStack.deleteMany({ where: { jobId: id } });
  await prisma.experienceTranslation.deleteMany({ where: { jobId: id } });
  await prisma.experienceJob.delete({ where: { id } });
  revalidatePath(paths.dashboard.experience.root);
}
