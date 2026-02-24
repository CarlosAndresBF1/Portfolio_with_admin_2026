'use server';

import { prisma } from 'src/lib/prisma';

export async function markContactRead(id, read) {
  await prisma.contactSubmission.update({
    where: { id },
    data: { read },
  });
}
