import { getDB } from 'src/lib/db';
import { auth } from 'src/lib/auth';

import ProfileView from 'src/sections/profile/view';

export const metadata = { title: 'Portfolio CMS: Perfil' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await auth();
  const db = await getDB();
  const user = await db.getRepository('User').findOneBy({ id: session?.user?.id });

  return <ProfileView user={user ? { id: user.id, name: user.name, email: user.email } : null} />;
}
