import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: icon('ic_dashboard'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  job: icon('ic_job'),
  chat: icon('ic_chat'),
  booking: icon('ic_booking'),
  analytics: icon('ic_analytics'),
  blog: icon('ic_blog'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      {
        subheader: 'portfolio cms',
        items: [
          {
            title: 'Dashboard',
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: 'Contenido',
            path: paths.dashboard.content.root,
            icon: ICONS.file,
            children: [
              { title: 'Info Personal', path: paths.dashboard.content.personal },
              { title: 'About', path: paths.dashboard.content.about },
              { title: 'Summary Cards', path: paths.dashboard.content.summary },
              { title: 'Contacto (textos)', path: paths.dashboard.content.contactSection },
            ],
          },
          {
            title: 'Experiencia',
            path: paths.dashboard.experience.root,
            icon: ICONS.job,
          },
          {
            title: 'Skills',
            path: paths.dashboard.skills.root,
            icon: ICONS.analytics,
          },
          {
            title: 'Proyectos',
            path: paths.dashboard.projects.root,
            icon: ICONS.booking,
          },
          {
            title: 'Contactos',
            path: paths.dashboard.contacts,
            icon: ICONS.chat,
          },
        ],
      },
    ],
    []
  );

  return data;
}
