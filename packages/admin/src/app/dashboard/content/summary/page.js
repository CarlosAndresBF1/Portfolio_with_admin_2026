import { prisma } from 'src/lib/prisma';
import SummaryView from 'src/sections/content/summary-view';

export const metadata = { title: 'Portfolio CMS: Summary Cards' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const summaryCards = await prisma.summaryCard.findMany({
    orderBy: [{ order: 'asc' }, { languageId: 'asc' }],
    include: { language: true },
  });

  const esCards = summaryCards.filter((c) => c.language.code === 'es');
  const enCards = summaryCards.filter((c) => c.language.code === 'en');

  return <SummaryView esCards={esCards} enCards={enCards} />;
}
