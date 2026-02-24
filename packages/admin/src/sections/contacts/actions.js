'use server';

import { prisma } from 'src/lib/prisma';
import { requireAuth } from 'src/lib/require-auth';

export async function markContactRead(id, read) {
  await requireAuth();
  await prisma.contactSubmission.update({
    where: { id },
    data: { read },
  });
}
