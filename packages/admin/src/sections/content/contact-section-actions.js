'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import { paths } from 'src/routes/paths';

export async function saveContactSection(formData) {
  const [esLang, enLang] = await Promise.all([
    prisma.language.findUnique({ where: { code: 'es' } }),
    prisma.language.findUnique({ where: { code: 'en' } }),
  ]);

  const buildData = (lang) => ({
    title: formData.get(`${lang}_title`) || '',
    titleHighlight: formData.get(`${lang}_titleHighlight`) || '',
    subtitle: formData.get(`${lang}_subtitle`) || '',
    formName: formData.get(`${lang}_formName`) || '',
    formEmail: formData.get(`${lang}_formEmail`) || '',
    formSubject: formData.get(`${lang}_formSubject`) || '',
    formMessage: formData.get(`${lang}_formMessage`) || '',
    formSend: formData.get(`${lang}_formSend`) || '',
    formSending: formData.get(`${lang}_formSending`) || '',
    formSuccess: formData.get(`${lang}_formSuccess`) || '',
    formError: formData.get(`${lang}_formError`) || '',
  });

  await Promise.all([
    prisma.contactSectionTranslation.upsert({
      where: { languageId: esLang.id },
      update: buildData('es'),
      create: { languageId: esLang.id, ...buildData('es') },
    }),
    prisma.contactSectionTranslation.upsert({
      where: { languageId: enLang.id },
      update: buildData('en'),
      create: { languageId: enLang.id, ...buildData('en') },
    }),
  ]);

  revalidatePath(paths.dashboard.content.contactSection);
  redirect(paths.dashboard.content.contactSection);
}
