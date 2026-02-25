import { notFound } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import ExperienceFormView from 'src/sections/experience/form-view';

export const metadata = { title: 'Portfolio CMS: Editar Experiencia' };
export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { id } = await params;
  const job = await prisma.experienceJob.findUnique({
    where: { id },
    include: {
      translations: { include: { language: true } },
      stack: { orderBy: { order: 'asc' } },
    },
  });

  if (!job) notFound();

  return <ExperienceFormView job={job} />;
}
