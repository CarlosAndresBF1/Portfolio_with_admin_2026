import { getDB } from 'src/lib/db';

import SocialLinksView from 'src/sections/social-links/social-links-view';

export const metadata = { title: 'Portfolio CMS: Social Links' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const links = await db.getRepository('SocialLink').find({
    order: { order: 'ASC' },
  });

  return <SocialLinksView links={links} />;
}
