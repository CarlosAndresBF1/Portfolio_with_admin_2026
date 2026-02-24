'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import { paths } from 'src/routes/paths';

export async function saveProject(formData) {
  const id = formData.get('id');
  const order = parseInt(formData.get('order') || '0', 10);

  const esTitle = formData.get('es_title') || '';
  const esDescription = formData.get('es_description') || '';
  const enTitle = formData.get('en_title') || '';
  const enDescription = formData.get('en_description') || '';

  const stackStr = formData.get('stack') || '';
  const stackItems = stackStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const [esLang, enLang] = await Promise.all([
    prisma.language.findUnique({ where: { code: 'es' } }),
    prisma.language.findUnique({ where: { code: 'en' } }),
  ]);

  if (id) {
    // Update
    await prisma.project.update({
      where: { id },
      data: { order },
    });

    await Promise.all([
      prisma.projectTranslation.upsert({
        where: { projectId_languageId: { projectId: id, languageId: esLang.id } },
        update: { title: esTitle, description: esDescription },
        create: {
          projectId: id,
          languageId: esLang.id,
          title: esTitle,
          description: esDescription,
        },
      }),
      prisma.projectTranslation.upsert({
        where: { projectId_languageId: { projectId: id, languageId: enLang.id } },
        update: { title: enTitle, description: enDescription },
        create: {
          projectId: id,
          languageId: enLang.id,
          title: enTitle,
          description: enDescription,
        },
      }),
    ]);

    await prisma.projectStack.deleteMany({ where: { projectId: id } });
    if (stackItems.length > 0) {
      await prisma.projectStack.createMany({
        data: stackItems.map((tech, idx) => ({ projectId: id, tech, order: idx })),
      });
    }
  } else {
    // Create
    const project = await prisma.project.create({
      data: { order },
    });

    await prisma.projectTranslation.createMany({
      data: [
        {
          projectId: project.id,
          languageId: esLang.id,
          title: esTitle,
          description: esDescription,
        },
        {
          projectId: project.id,
          languageId: enLang.id,
          title: enTitle,
          description: enDescription,
        },
      ],
    });

    if (stackItems.length > 0) {
      await prisma.projectStack.createMany({
        data: stackItems.map((tech, idx) => ({
          projectId: project.id,
          tech,
          order: idx,
        })),
      });
    }
  }

  revalidatePath(paths.dashboard.projects.root);
  redirect(paths.dashboard.projects.root);
}

export async function deleteProject(id) {
  await prisma.projectStack.deleteMany({ where: { projectId: id } });
  await prisma.projectTranslation.deleteMany({ where: { projectId: id } });
  await prisma.project.delete({ where: { id } });
  revalidatePath(paths.dashboard.projects.root);
}
