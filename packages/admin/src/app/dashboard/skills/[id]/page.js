import { notFound } from 'next/navigation';

import { getDB } from 'src/lib/db';

import SkillFormView from 'src/sections/skills/form-view';

export const metadata = { title: 'Portfolio CMS: Editar Skill' };
export const dynamic = 'force-dynamic';

// eslint-disable-next-line react/prop-types
export default async function Page({ params }) {
  const { id } = await params;
  const db = await getDB();
  const [skill, categories] = await Promise.all([
    db.getRepository('Skill').findOne({
      where: { id },
      relations: { translations: { language: true }, workplaces: true, category: true },
    }),
    db.getRepository('SkillCategory').find({
      order: { order: 'ASC' },
      relations: { translations: { language: true } },
    }),
  ]);

  if (!skill) notFound();
  skill.workplaces.sort((a, b) => a.order - b.order);

  return <SkillFormView skill={skill} categories={categories} />;
}
