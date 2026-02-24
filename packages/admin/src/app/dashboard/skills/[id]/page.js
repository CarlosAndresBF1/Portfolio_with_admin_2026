import { notFound } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import SkillFormView from 'src/sections/skills/form-view';

export const metadata = { title: 'Portfolio CMS: Editar Skill' };
export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const [skill, categories] = await Promise.all([
    prisma.skill.findUnique({
      where: { id: params.id },
      include: {
        translations: { include: { language: true } },
        workplaces: { orderBy: { order: 'asc' } },
        category: true,
      },
    }),
    prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: { translations: { include: { language: true } } },
    }),
  ]);

  if (!skill) notFound();

  return <SkillFormView skill={skill} categories={categories} />;
}
