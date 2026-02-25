'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

function StatCard({ title, value, icon, color, href }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3">{value}</Typography>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
            }}
          >
            <Iconify icon={icon} width={28} />
          </Box>
        </Stack>
        {href && (
          <Button
            component={RouterLink}
            href={href}
            size="small"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            sx={{ mt: 1, px: 0 }}
          >
            Ver todos
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  icon: PropTypes.string,
  color: PropTypes.string,
  href: PropTypes.string,
};

// ----------------------------------------------------------------------

function RecentContactsCard({ contacts }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Contactos Recientes</Typography>
          <Button
            component={RouterLink}
            href={paths.dashboard.contacts}
            size="small"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          >
            Ver todos
          </Button>
        </Stack>

        {contacts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            No hay contactos aún
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {contacts.map((contact) => (
              <Stack
                key={contact.id}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: contact.read ? 'transparent' : 'info.lighter',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: contact.read ? 'text.disabled' : 'info.main',
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {contact.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {contact.subject}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {new Date(contact.createdAt).toLocaleDateString('es-CO')}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

RecentContactsCard.propTypes = {
  contacts: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function DashboardOverview({ stats }) {
  const { totalContacts, unreadContacts, totalJobs, totalProjects, recentContacts } =
    stats;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Contactos sin leer"
            value={unreadContacts}
            icon="solar:chat-round-unread-bold-duotone"
            color="error"
            href={paths.dashboard.contacts}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total contactos"
            value={totalContacts}
            icon="solar:chat-round-dots-bold-duotone"
            color="info"
            href={paths.dashboard.contacts}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Experiencias"
            value={totalJobs}
            icon="solar:case-bold-duotone"
            color="warning"
            href={paths.dashboard.experience.root}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Proyectos"
            value={totalProjects}
            icon="solar:layers-bold-duotone"
            color="success"
            href={paths.dashboard.projects.root}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          <RecentContactsCard contacts={recentContacts} />
        </Grid>

        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Accesos Rápidos
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'Editar info personal', href: paths.dashboard.content.personal, icon: 'solar:user-bold-duotone' },
                  { label: 'Editar About', href: paths.dashboard.content.about, icon: 'solar:document-text-bold-duotone' },
                  { label: 'Nueva experiencia', href: paths.dashboard.experience.new, icon: 'solar:add-circle-bold-duotone' },
                  { label: 'Nuevo proyecto', href: paths.dashboard.projects.new, icon: 'solar:add-circle-bold-duotone' },
                  { label: 'Ver contactos', href: paths.dashboard.contacts, icon: 'solar:inbox-bold-duotone' },
                ].map((item) => (
                  <Button
                    key={item.href}
                    component={RouterLink}
                    href={item.href}
                    variant="outlined"
                    startIcon={<Iconify icon={item.icon} />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

DashboardOverview.propTypes = {
  stats: PropTypes.object,
};
