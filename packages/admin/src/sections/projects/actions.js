'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getDB } from 'src/lib/db';
import { paths } from 'src/routes/paths';
import { requireAuth } from 'src/lib/require-auth';

export async function saveProject(formData) {
  await requireAuth();
  const db = await getDB();
  const langRepo = db.getRepository('Language');
  const projRepo = db.getRepository('Project');
  const transRepo = db.getRepository('ProjectTranslation');
  const stackRepo = db.getRepository('ProjectStack');

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
    langRepo.findOneBy({ code: 'es' }),
    langRepo.findOneBy({ code: 'en' }),
  ]);

  if (id) {
    // Update
    await projRepo.update({ id }, { order });

    await Promise.all([
      transRepo.upsert(
        { projectId: id, languageId: esLang.id, title: esTitle, description: esDescription },
        ['projectId', 'languageId']
      ),
      transRepo.upsert(
        { projectId: id, languageId: enLang.id, title: enTitle, description: enDescription },
        ['projectId', 'languageId']
      ),
    ]);

    await stackRepo.delete({ projectId: id });
    if (stackItems.length > 0) {
      await stackRepo.save(
        stackItems.map((tech, idx) => ({ projectId: id, tech, order: idx }))
      );
    }
  } else {
    // Create
    const project = await projRepo.save({ order });

    await transRepo.save([
      { projectId: project.id, languageId: esLang.id, title: esTitle, description: esDescription },
      { projectId: project.id, languageId: enLang.id, title: enTitle, description: enDescription },
    ]);

    if (stackItems.length > 0) {
      await stackRepo.save(
        stackItems.map((tech, idx) => ({ projectId: project.id, tech, order: idx }))
      );
    }
  }

  revalidatePath(paths.dashboard.projects.root);
  redirect(`${paths.dashboard.projects.root}?saved=1`);
}

export async function deleteProject(id) {
  await requireAuth();
  const db = await getDB();
  await db.getRepository('ProjectStack').delete({ projectId: id });
  await db.getRepository('ProjectTranslation').delete({ projectId: id });
  await db.getRepository('Project').delete({ id });
  revalidatePath(paths.dashboard.projects.root);
}
