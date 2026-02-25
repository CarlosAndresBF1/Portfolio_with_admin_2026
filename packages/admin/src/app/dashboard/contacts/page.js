import { getDB } from 'src/lib/db';

import ContactsView from 'src/sections/contacts/view';

export const metadata = { title: 'Portfolio CMS: Contactos' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const contacts = await db.getRepository('ContactSubmission').find({
    order: { createdAt: 'DESC' },
  });

  return <ContactsView contacts={contacts} />;
}
