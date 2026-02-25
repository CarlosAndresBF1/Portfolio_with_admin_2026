'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getDB } from 'src/lib/db';
import { paths } from 'src/routes/paths';
import { requireAuth } from 'src/lib/require-auth';

export async function saveSkill(formData) {
  await requireAuth();
  const db = await getDB();
  const langRepo = db.getRepository('Language');
  const skillRepo = db.getRepository('Skill');
  const transRepo = db.getRepository('SkillTranslation');
  const wpRepo = db.getRepository('SkillWorkplace');

  const id = formData.get('id');
  const years = formData.get('years') || '';
  const categoryId = formData.get('categoryId');

  const esName = formData.get('es_name') || '';
  const esDescription = formData.get('es_description') || '';
  const enName = formData.get('en_name') || '';
  const enDescription = formData.get('en_description') || '';

  const workplacesStr = formData.get('workplaces') || '';
  const workplaceItems = workplacesStr
    .split(',')
    .map((w) => w.trim())
    .filter(Boolean);

  const [esLang, enLang] = await Promise.all([
    langRepo.findOneBy({ code: 'es' }),
    langRepo.findOneBy({ code: 'en' }),
  ]);

  if (id) {
    // Update base skill
    const updateData = { years };
    if (categoryId) updateData.categoryId = categoryId;
    await skillRepo.update({ id }, updateData);

    // Upsert translations
    await Promise.all([
      transRepo.upsert(
        { skillId: id, languageId: esLang.id, name: esName, description: esDescription },
        ['skillId', 'languageId']
      ),
      transRepo.upsert(
        { skillId: id, languageId: enLang.id, name: enName, description: enDescription },
        ['skillId', 'languageId']
      ),
    ]);

    // Replace workplaces
    await wpRepo.delete({ skillId: id });
    if (workplaceItems.length > 0) {
      await wpRepo.save(
        workplaceItems.map((workplace, idx) => ({
          skillId: id,
          workplace,
          order: idx,
        }))
      );
    }
  }

  revalidatePath(paths.dashboard.skills.root);
  redirect(`${paths.dashboard.skills.root}?saved=1`);
}
