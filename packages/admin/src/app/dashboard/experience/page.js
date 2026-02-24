import { prisma } from 'src/lib/prisma';
import ExperienceListView from 'src/sections/experience/list-view';

export const metadata = { title: 'Portfolio CMS: Experiencia' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const jobs = await prisma.experienceJob.findMany({
    orderBy: { order: 'asc' },
    include: {
      translations: { include: { language: true } },
      stack: { orderBy: { order: 'asc' } },
    },
  });

  return <ExperienceListView jobs={jobs} />;
}
