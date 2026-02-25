import { getDB } from 'src/lib/db';

import SummaryView from 'src/sections/content/summary-view';

export const metadata = { title: 'Portfolio CMS: Summary Cards' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const summaryCards = await db.getRepository('SummaryCard').find({
    order: { order: 'ASC', languageId: 'ASC' },
    relations: { language: true },
  });

  const esCards = summaryCards.filter((c) => c.language.code === 'es');
  const enCards = summaryCards.filter((c) => c.language.code === 'en');

  return <SummaryView esCards={esCards} enCards={enCards} />;
}
