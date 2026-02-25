'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import { paths } from 'src/routes/paths';
import { requireAuth } from 'src/lib/require-auth';

export async function saveSkill(formData) {
  await requireAuth();
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
    prisma.language.findUnique({ where: { code: 'es' } }),
    prisma.language.findUnique({ where: { code: 'en' } }),
  ]);

  if (id) {
    // Update base skill
    await prisma.skill.update({
      where: { id },
      data: {
        years,
        ...(categoryId ? { categoryId } : {}),
      },
    });

    // Upsert translations
    await Promise.all([
      prisma.skillTranslation.upsert({
        where: { skillId_languageId: { skillId: id, languageId: esLang.id } },
        update: { name: esName, description: esDescription },
        create: {
          skillId: id,
          languageId: esLang.id,
          name: esName,
          description: esDescription,
        },
      }),
      prisma.skillTranslation.upsert({
        where: { skillId_languageId: { skillId: id, languageId: enLang.id } },
        update: { name: enName, description: enDescription },
        create: {
          skillId: id,
          languageId: enLang.id,
          name: enName,
          description: enDescription,
        },
      }),
    ]);

    // Replace workplaces
    await prisma.skillWorkplace.deleteMany({ where: { skillId: id } });
    if (workplaceItems.length > 0) {
      await prisma.skillWorkplace.createMany({
        data: workplaceItems.map((workplace, idx) => ({
          skillId: id,
          workplace,
          order: idx,
        })),
      });
    }
  }

  revalidatePath(paths.dashboard.skills.root);
  redirect(`${paths.dashboard.skills.root}?saved=1`);
}
