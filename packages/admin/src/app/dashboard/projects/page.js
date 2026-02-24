import { prisma } from 'src/lib/prisma';
import ProjectsListView from 'src/sections/projects/list-view';

export const metadata = { title: 'Portfolio CMS: Proyectos' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
    include: {
      translations: { include: { language: true } },
      stack: { orderBy: { order: 'asc' } },
    },
  });

  return <ProjectsListView projects={projects} />;
}
