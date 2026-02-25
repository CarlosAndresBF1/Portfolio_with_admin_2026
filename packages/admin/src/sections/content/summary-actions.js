'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from 'src/lib/prisma';
import { paths } from 'src/routes/paths';
import { requireAuth } from 'src/lib/require-auth';

export async function saveSummaryCards(formData) {
  await requireAuth();
  const [esLang, enLang] = await Promise.all([
    prisma.language.findUnique({ where: { code: 'es' } }),
    prisma.language.findUnique({ where: { code: 'en' } }),
  ]);

  const CARD_COUNT = 6;

  const buildCardUpdates = (code, langId) => {
    const count = parseInt(formData.get(`${code}_cardCount`) || String(CARD_COUNT), 10);

    return Array.from({ length: count }, (_, i) => {
      const id = formData.get(`${code}_card_${i}_id`) || '';
      const order = parseInt(formData.get(`${code}_card_${i}_order`) || String(i), 10);
      const title = formData.get(`${code}_card_${i}_title`) || '';
      const heading = formData.get(`${code}_card_${i}_heading`) || '';
      const text = formData.get(`${code}_card_${i}_text`) || '';

      if (id) {
        return prisma.summaryCard.update({
          where: { id },
          data: { order, title, heading, text },
        });
      }

      return prisma.summaryCard.create({
        data: { languageId: langId, order, title, heading, text },
      });
    });
  };

  const esUpdates = buildCardUpdates('es', esLang.id);
  const enUpdates = buildCardUpdates('en', enLang.id);

  await Promise.all([...esUpdates, ...enUpdates]);

  revalidatePath(paths.dashboard.content.summary);
  redirect(`${paths.dashboard.content.summary}?saved=1`);
}
