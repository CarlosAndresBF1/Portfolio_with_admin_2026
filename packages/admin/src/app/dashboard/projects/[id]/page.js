import { notFound } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import ProjectFormView from 'src/sections/projects/form-view';

export const metadata = { title: 'Portfolio CMS: Editar Proyecto' };
export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      translations: { include: { language: true } },
      stack: { orderBy: { order: 'asc' } },
    },
  });

  if (!project) notFound();

  return <ProjectFormView project={project} />;
}
