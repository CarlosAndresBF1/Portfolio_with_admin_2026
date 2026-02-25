'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { paths } from 'src/routes/paths';

import { getDB } from 'src/lib/db';
import { requireAuth } from 'src/lib/require-auth';

// ─── Change Password ──────────────────────────────────────────────────────────

export async function changePassword(formData) {
  const session = await requireAuth();
  const db = await getDB();
  const userRepo = db.getRepository('User');

  const currentPassword = formData.get('currentPassword') || '';
  const newPassword = formData.get('newPassword') || '';
  const confirmPassword = formData.get('confirmPassword') || '';

  if (!currentPassword || !newPassword || !confirmPassword) {
    redirect(`${paths.dashboard.profile}?error=empty`);
  }

  if (newPassword.length < 8) {
    redirect(`${paths.dashboard.profile}?error=short`);
  }

  if (newPassword !== confirmPassword) {
    redirect(`${paths.dashboard.profile}?error=mismatch`);
  }

  const user = await userRepo.findOneBy({ id: session.user.id });
  if (!user?.password) {
    redirect(`${paths.dashboard.profile}?error=nouser`);
  }

  const isValid = await bcrypt.compare(String(currentPassword), user.password);
  if (!isValid) {
    redirect(`${paths.dashboard.profile}?error=invalid`);
  }

  const hashedPassword = await bcrypt.hash(String(newPassword), 12);
  await userRepo.update({ id: user.id }, { password: hashedPassword });

  revalidatePath(paths.dashboard.profile);
  redirect(`${paths.dashboard.profile}?saved=1`);
}

// ─── Update Profile Info ──────────────────────────────────────────────────────

export async function updateProfile(formData) {
  const session = await requireAuth();
  const db = await getDB();
  const userRepo = db.getRepository('User');

  const name = formData.get('name') || '';

  if (!name.trim()) {
    redirect(`${paths.dashboard.profile}?error=noname`);
  }

  await userRepo.update({ id: session.user.id }, { name: name.trim() });

  revalidatePath(paths.dashboard.profile);
  redirect(`${paths.dashboard.profile}?saved=1`);
}
