'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import { paths } from 'src/routes/paths';
import { requireAuth } from 'src/lib/require-auth';

// ─── Save Personal Info ───────────────────────────────────────────────────────

export async function savePersonalInfo(formData) {
  await requireAuth();
  const [esLang, enLang] = await Promise.all([
    prisma.language.findUnique({ where: { code: 'es' } }),
    prisma.language.findUnique({ where: { code: 'en' } }),
  ]);

  const esData = {
    name: formData.get('es_name') || '',
    lastName: formData.get('es_lastName') || '',
    role: formData.get('es_role') || '',
    tagline: formData.get('es_tagline') || '',
    switchLang: formData.get('es_switchLang') || '',
  };

  const enData = {
    name: formData.get('en_name') || '',
    lastName: formData.get('en_lastName') || '',
    role: formData.get('en_role') || '',
    tagline: formData.get('en_tagline') || '',
    switchLang: formData.get('en_switchLang') || '',
  };

  await Promise.all([
    prisma.personalInfo.upsert({
      where: { languageId: esLang.id },
      update: esData,
      create: { languageId: esLang.id, ...esData },
    }),
    prisma.personalInfo.upsert({
      where: { languageId: enLang.id },
      update: enData,
      create: { languageId: enLang.id, ...enData },
    }),
  ]);

  revalidatePath(paths.dashboard.content.personal);
  redirect(`${paths.dashboard.content.personal}?saved=1`);
}

// ─── Save About Section ───────────────────────────────────────────────────────

export async function saveAboutSection(formData) {
  await requireAuth();
  const [esLang, enLang] = await Promise.all([
    prisma.language.findUnique({ where: { code: 'es' } }),
    prisma.language.findUnique({ where: { code: 'en' } }),
  ]);

  const parseCircleItems = (str) =>
    (str || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const esCircleItems = parseCircleItems(formData.get('es_circleItems'));
  const enCircleItems = parseCircleItems(formData.get('en_circleItems'));

  const esData = {
    title: formData.get('es_title') || '',
    subtitle: formData.get('es_subtitle') || '',
    description: formData.get('es_description') || '',
    location: formData.get('es_location') || '',
    email: formData.get('es_email') || '',
    phone: formData.get('es_phone') || '',
  };

  const enData = {
    title: formData.get('en_title') || '',
    subtitle: formData.get('en_subtitle') || '',
    description: formData.get('en_description') || '',
    location: formData.get('en_location') || '',
    email: formData.get('en_email') || '',
    phone: formData.get('en_phone') || '',
  };

  // Upsert ES about section
  const esAbout = await prisma.aboutSection.upsert({
    where: { languageId: esLang.id },
    update: esData,
    create: { languageId: esLang.id, ...esData },
  });

  // Upsert EN about section
  const enAbout = await prisma.aboutSection.upsert({
    where: { languageId: enLang.id },
    update: enData,
    create: { languageId: enLang.id, ...enData },
  });

  // Replace circle items for ES
  await prisma.aboutCircleItem.deleteMany({ where: { aboutSectionId: esAbout.id } });
  if (esCircleItems.length > 0) {
    await prisma.aboutCircleItem.createMany({
      data: esCircleItems.map((label, idx) => ({
        aboutSectionId: esAbout.id,
        label,
        order: idx,
      })),
    });
  }

  // Replace circle items for EN
  await prisma.aboutCircleItem.deleteMany({ where: { aboutSectionId: enAbout.id } });
  if (enCircleItems.length > 0) {
    await prisma.aboutCircleItem.createMany({
      data: enCircleItems.map((label, idx) => ({
        aboutSectionId: enAbout.id,
        label,
        order: idx,
      })),
    });
  }

  revalidatePath(paths.dashboard.content.about);
  redirect(`${paths.dashboard.content.about}?saved=1`);
}
