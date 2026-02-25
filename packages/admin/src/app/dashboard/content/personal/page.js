import { getDB } from 'src/lib/db';
import PersonalInfoView from 'src/sections/content/personal-view';

export const metadata = { title: 'Portfolio CMS: Información Personal' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const db = await getDB();
  const personalInfos = await db.getRepository('PersonalInfo').find({
    relations: { language: true },
  });

  const esInfo = personalInfos.find((p) => p.language.code === 'es');
  const enInfo = personalInfos.find((p) => p.language.code === 'en');

  return <PersonalInfoView esInfo={esInfo} enInfo={enInfo} />;
}
