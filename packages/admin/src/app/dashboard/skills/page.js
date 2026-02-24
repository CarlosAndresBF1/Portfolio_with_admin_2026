import { prisma } from 'src/lib/prisma';
import SkillsView from 'src/sections/skills/view';

export const metadata = { title: 'Portfolio CMS: Skills' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      translations: { include: { language: true } },
      skills: {
        orderBy: { order: 'asc' },
        include: {
          translations: { include: { language: true } },
          workplaces: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  return <SkillsView categories={categories} />;
}
