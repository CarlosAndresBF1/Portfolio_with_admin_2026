import { getDB } from 'src/lib/db';
import AboutView from 'src/sections/content/about-view';

export const metadata = { title: 'Portfolio CMS: About' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const aboutSections = await db.getRepository('AboutSection').find({
    relations: { language: true, circleItems: true },
  });
  aboutSections.forEach((a) => a.circleItems.sort((x, y) => x.order - y.order));

  const esAbout = aboutSections.find((a) => a.language.code === 'es');
  const enAbout = aboutSections.find((a) => a.language.code === 'en');

  return <AboutView esAbout={esAbout} enAbout={enAbout} />;
}
