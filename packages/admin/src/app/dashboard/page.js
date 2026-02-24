import { prisma } from 'src/lib/prisma';
import DashboardOverview from 'src/sections/dashboard/view';

export const metadata = { title: 'Portfolio CMS: Dashboard' };

export const dynamic = 'force-dynamic';

async function getStats() {
  const [totalContacts, unreadContacts, totalJobs, totalSkills, totalProjects] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.experienceJob.count(),
    prisma.skill.count(),
    prisma.project.count(),
  ]);

  const recentContacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return { totalContacts, unreadContacts, totalJobs, totalSkills, totalProjects, recentContacts };
}

export default async function Page() {
  const stats = await getStats();
  return <DashboardOverview stats={stats} />;
}
