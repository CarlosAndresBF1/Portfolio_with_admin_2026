import { prisma } from 'src/lib/prisma';
import PersonalInfoView from 'src/sections/content/personal-view';

export const metadata = { title: 'Portfolio CMS: Información Personal' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const personalInfos = await prisma.personalInfo.findMany({
    include: { language: true },
  });

  const esInfo = personalInfos.find((p) => p.language.code === 'es');
  const enInfo = personalInfos.find((p) => p.language.code === 'en');

  return <PersonalInfoView esInfo={esInfo} enInfo={enInfo} />;
}
