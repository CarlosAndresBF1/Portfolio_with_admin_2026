import { prisma } from 'src/lib/prisma';
import ContactsView from 'src/sections/contacts/view';

export const metadata = { title: 'Portfolio CMS: Contactos' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <ContactsView contacts={contacts} />;
}
