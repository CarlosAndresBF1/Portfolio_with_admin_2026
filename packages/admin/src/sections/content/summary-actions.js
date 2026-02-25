'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import { getDB } from 'src/lib/db';
import { requireAuth } from 'src/lib/require-auth';

export async function saveSummaryCards(formData) {
  await requireAuth();
  const db = await getDB();
  const langRepo = db.getRepository('Language');
  const cardRepo = db.getRepository('SummaryCard');

  const [esLang, enLang] = await Promise.all([
    langRepo.findOneBy({ code: 'es' }),
    langRepo.findOneBy({ code: 'en' }),
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
        return cardRepo.save({ id, order, title, heading, text });
      }

      return cardRepo.save({ languageId: langId, order, title, heading, text });
    });
  };

  const esUpdates = buildCardUpdates('es', esLang.id);
  const enUpdates = buildCardUpdates('en', enLang.id);

  await Promise.all([...esUpdates, ...enUpdates]);

  revalidatePath(paths.dashboard.content.summary);
  redirect(`${paths.dashboard.content.summary}?saved=1`);
}
