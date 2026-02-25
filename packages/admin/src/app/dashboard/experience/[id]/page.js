import { notFound } from 'next/navigation';

import { getDB } from 'src/lib/db';

import ExperienceFormView from 'src/sections/experience/form-view';

export const metadata = { title: 'Portfolio CMS: Editar Experiencia' };
export const dynamic = 'force-dynamic';

// eslint-disable-next-line react/prop-types
export default async function Page({ params }) {
  const { id } = await params;
  const db = await getDB();
  const job = await db.getRepository('ExperienceJob').findOne({
    where: { id },
    relations: { translations: { language: true }, stack: true },
  });

  if (!job) notFound();
  job.stack.sort((a, b) => a.order - b.order);

  return <ExperienceFormView job={job} />;
}
