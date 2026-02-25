'use server';

import { getDB } from 'src/lib/db';
import { requireAuth } from 'src/lib/require-auth';

export async function markContactRead(id, read) {
  await requireAuth();
  const db = await getDB();
  await db.getRepository('ContactSubmission').update({ id }, { read });
}
