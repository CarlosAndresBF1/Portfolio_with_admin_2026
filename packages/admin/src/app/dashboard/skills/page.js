import { getDB } from 'src/lib/db';

import SkillsView from 'src/sections/skills/view';

export const metadata = { title: 'Portfolio CMS: Skills' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const categories = await db.getRepository('SkillCategory').find({
    order: { order: 'ASC' },
    relations: {
      translations: { language: true },
      skills: { translations: { language: true }, workplaces: { job: true } },
    },
  });
  categories.forEach((cat) => {
    cat.skills.sort((a, b) => a.order - b.order);
    cat.skills.forEach((s) => s.workplaces.sort((a, b) => a.order - b.order));
  });

  return <SkillsView categories={categories} />;
}
