import { getDB } from 'src/lib/db';
import ExperienceListView from 'src/sections/experience/list-view';

export const metadata = { title: 'Portfolio CMS: Experiencia' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const jobs = await db.getRepository('ExperienceJob').find({
    order: { order: 'ASC' },
    relations: { translations: { language: true }, stack: true },
  });
  jobs.forEach((j) => j.stack.sort((a, b) => a.order - b.order));

  return <ExperienceListView jobs={jobs} />;
}
