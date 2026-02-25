'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import { getDB } from 'src/lib/db';
import { requireAuth } from 'src/lib/require-auth';

// ─── Save Personal Info ───────────────────────────────────────────────────────

export async function savePersonalInfo(formData) {
  await requireAuth();
  const db = await getDB();
  const langRepo = db.getRepository('Language');
  const piRepo = db.getRepository('PersonalInfo');

  const [esLang, enLang] = await Promise.all([
    langRepo.findOneBy({ code: 'es' }),
    langRepo.findOneBy({ code: 'en' }),
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
    piRepo.upsert({ languageId: esLang.id, ...esData, updatedAt: new Date() }, ['languageId']),
    piRepo.upsert({ languageId: enLang.id, ...enData, updatedAt: new Date() }, ['languageId']),
  ]);

  revalidatePath(paths.dashboard.content.personal);
  redirect(`${paths.dashboard.content.personal}?saved=1`);
}

// ─── Save About Section ───────────────────────────────────────────────────────

export async function saveAboutSection(formData) {
  await requireAuth();
  const db = await getDB();
  const langRepo = db.getRepository('Language');
  const aboutRepo = db.getRepository('AboutSection');
  const circleRepo = db.getRepository('AboutCircleItem');

  const [esLang, enLang] = await Promise.all([
    langRepo.findOneBy({ code: 'es' }),
    langRepo.findOneBy({ code: 'en' }),
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
  await aboutRepo.upsert({ languageId: esLang.id, ...esData, updatedAt: new Date() }, ['languageId']);
  const esAbout = await aboutRepo.findOneBy({ languageId: esLang.id });

  // Upsert EN about section
  await aboutRepo.upsert({ languageId: enLang.id, ...enData, updatedAt: new Date() }, ['languageId']);
  const enAbout = await aboutRepo.findOneBy({ languageId: enLang.id });

  // Replace circle items for ES
  await circleRepo.delete({ aboutSectionId: esAbout.id });
  if (esCircleItems.length > 0) {
    await circleRepo.save(
      esCircleItems.map((label, idx) => ({
        aboutSectionId: esAbout.id,
        label,
        order: idx,
      }))
    );
  }

  // Replace circle items for EN
  await circleRepo.delete({ aboutSectionId: enAbout.id });
  if (enCircleItems.length > 0) {
    await circleRepo.save(
      enCircleItems.map((label, idx) => ({
        aboutSectionId: enAbout.id,
        label,
        order: idx,
      }))
    );
  }

  revalidatePath(paths.dashboard.content.about);
  redirect(`${paths.dashboard.content.about}?saved=1`);
}
