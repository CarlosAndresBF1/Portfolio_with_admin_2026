import { getDB } from 'src/lib/db';

import DashboardOverview from 'src/sections/dashboard/view';

export const metadata = { title: 'Portfolio CMS: Dashboard' };

export const dynamic = 'force-dynamic';

async function getStats() {
  const db = await getDB();
  const [totalContacts, unreadContacts, totalJobs, totalSkills, totalProjects] = await Promise.all([
    db.getRepository('ContactSubmission').count(),
    db.getRepository('ContactSubmission').count({ where: { read: false } }),
    db.getRepository('ExperienceJob').count(),
    db.getRepository('Skill').count(),
    db.getRepository('Project').count(),
  ]);

  const recentContacts = await db.getRepository('ContactSubmission').find({
    order: { createdAt: 'DESC' },
    take: 5,
  });

  return { totalContacts, unreadContacts, totalJobs, totalSkills, totalProjects, recentContacts };
}

export default async function Page() {
  const stats = await getStats();
  return <DashboardOverview stats={stats} />;
}
