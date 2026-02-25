import { notFound } from 'next/navigation';

import { getDB } from 'src/lib/db';

import ProjectFormView from 'src/sections/projects/form-view';

export const metadata = { title: 'Portfolio CMS: Editar Proyecto' };
export const dynamic = 'force-dynamic';

// eslint-disable-next-line react/prop-types
export default async function Page({ params }) {
  const { id } = await params;
  const db = await getDB();
  const project = await db.getRepository('Project').findOne({
    where: { id },
    relations: { translations: { language: true }, stack: true },
  });

  if (!project) notFound();
  project.stack.sort((a, b) => a.order - b.order);

  return <ProjectFormView project={project} />;
}
