'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getDB } from 'src/lib/db';
import { paths } from 'src/routes/paths';
import { requireAuth } from 'src/lib/require-auth';

export async function saveContactSection(formData) {
  await requireAuth();
  const db = await getDB();
  const langRepo = db.getRepository('Language');
  const csRepo = db.getRepository('ContactSectionTranslation');

  const [esLang, enLang] = await Promise.all([
    langRepo.findOneBy({ code: 'es' }),
    langRepo.findOneBy({ code: 'en' }),
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
    csRepo.upsert(
      { languageId: esLang.id, ...buildData('es'), updatedAt: new Date() },
      ['languageId']
    ),
    csRepo.upsert(
      { languageId: enLang.id, ...buildData('en'), updatedAt: new Date() },
      ['languageId']
    ),
  ]);

  revalidatePath(paths.dashboard.content.contactSection);
  redirect(`${paths.dashboard.content.contactSection}?saved=1`);
}
