import { getDB } from 'src/lib/db';
import ProjectsListView from 'src/sections/projects/list-view';

export const metadata = { title: 'Portfolio CMS: Proyectos' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const projects = await db.getRepository('Project').find({
    order: { order: 'ASC' },
    relations: { translations: { language: true }, stack: true },
  });
  projects.forEach((p) => p.stack.sort((a, b) => a.order - b.order));

  return <ProjectsListView projects={projects} />;
}
