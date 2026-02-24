import { redirect } from 'next/navigation';

import { paths } from 'src/routes/paths';

export const dynamic = 'force-dynamic';

export default function Page() {
  redirect(paths.dashboard.content.personal);
}
