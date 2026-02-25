'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import SaveSnackbar from 'src/components/save-snackbar/save-snackbar';

import { deleteExperienceJob } from './actions';

export default function ExperienceListView({ jobs }) {
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este trabajo?')) return;
    await deleteExperienceJob(id);
    window.location.reload();
  };

  return (
    <Box sx={{ p: 3 }}>
      <SaveSnackbar />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Experiencia Laboral</Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.experience.new}
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
        >
          Nuevo trabajo
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Rol (ES)</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Stack</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => {
              const esTranslation = job.translations.find((t) => t.language.code === 'es');
              return (
                <TableRow key={job.id} hover>
                  <TableCell>{job.number}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{job.company}</Typography>
                  </TableCell>
                  <TableCell>{esTranslation?.role || '—'}</TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {job.periodStart} – {job.periodEnd}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {job.stack.slice(0, 3).map((s) => (
                        <Chip key={s.id} label={s.tech} size="small" />
                      ))}
                      {job.stack.length > 3 && (
                        <Chip label={`+${job.stack.length - 3}`} size="small" variant="outlined" />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={RouterLink}
                      href={paths.dashboard.experience.edit(job.id)}
                      size="small"
                    >
                      <Iconify icon="solar:pen-bold" width={18} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(job.id)}>
                      <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ExperienceListView.propTypes = { jobs: PropTypes.array };
