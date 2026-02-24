import { prisma } from 'src/lib/prisma';
import AboutView from 'src/sections/content/about-view';

export const metadata = { title: 'Portfolio CMS: About' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const aboutSections = await prisma.aboutSection.findMany({
    include: {
      language: true,
      circleItems: { orderBy: { order: 'asc' } },
    },
  });

  const esAbout = aboutSections.find((a) => a.language.code === 'es');
  const enAbout = aboutSections.find((a) => a.language.code === 'en');

  return <AboutView esAbout={esAbout} enAbout={enAbout} />;
}
