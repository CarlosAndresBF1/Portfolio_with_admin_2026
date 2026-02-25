'use server';

import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import { getDB } from 'src/lib/db';
import { requireAuth } from 'src/lib/require-auth';

// ─── Save (create or update) a social link ────────────────────────────────────

export async function saveSocialLink(formData) {
  await requireAuth();
  const db = await getDB();
  const repo = db.getRepository('SocialLink');

  const id = formData.get('id') || undefined;
  const data = {
    platform: formData.get('platform') || '',
    label: formData.get('label') || '',
    url: formData.get('url') || '',
    urlEn: formData.get('urlEn') || null,
    icon: formData.get('icon') || '',
    order: parseInt(formData.get('order') || '0', 10),
    visible: formData.get('visible') === 'on',
  };

  if (id) {
    await repo.update(id, data);
  } else {
    await repo.save(data);
  }

  revalidatePath(paths.dashboard.socialLinks);
}

// ─── Delete a social link ─────────────────────────────────────────────────────

export async function deleteSocialLink(formData) {
  await requireAuth();
  const db = await getDB();
  const id = formData.get('id');
  if (id) {
    await db.getRepository('SocialLink').delete(id);
  }
  revalidatePath(paths.dashboard.socialLinks);
}

// ─── Reorder social links ────────────────────────────────────────────────────

export async function reorderSocialLinks(formData) {
  await requireAuth();
  const db = await getDB();
  const repo = db.getRepository('SocialLink');
  const ids = formData.get('orderedIds')?.split(',') || [];

  await Promise.all(ids.map((id, index) => repo.update(id, { order: index })));

  revalidatePath(paths.dashboard.socialLinks);
}
