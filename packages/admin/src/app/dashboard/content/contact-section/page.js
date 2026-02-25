import { getDB } from 'src/lib/db';

import ContactSectionView from 'src/sections/content/contact-section-view';

export const metadata = { title: 'Portfolio CMS: Sección Contacto' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const translations = await db.getRepository('ContactSectionTranslation').find({
    relations: { language: true },
  });

  const esTranslation = translations.find((t) => t.language.code === 'es');
  const enTranslation = translations.find((t) => t.language.code === 'en');

  return (
    <ContactSectionView esTranslation={esTranslation} enTranslation={enTranslation} />
  );
}
