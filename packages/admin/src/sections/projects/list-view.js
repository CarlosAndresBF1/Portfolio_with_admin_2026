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
import { deleteProject } from './actions';

export default function ProjectsListView({ projects }) {
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    await deleteProject(id);
    window.location.reload();
  };

  return (
    <Box sx={{ p: 3 }}>
      <SaveSnackbar />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Proyectos</Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.projects.new}
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
        >
          Nuevo proyecto
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Título (ES)</TableCell>
              <TableCell>Stack</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => {
              const esTranslation = project.translations.find((t) => t.language.code === 'es');

              return (
                <TableRow key={project.id} hover>
                  <TableCell>{project.order}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {esTranslation?.title || '—'}
                    </Typography>
                    {esTranslation?.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {esTranslation.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {project.stack.slice(0, 4).map((s) => (
                        <Chip key={s.id} label={s.tech} size="small" />
                      ))}
                      {project.stack.length > 4 && (
                        <Chip
                          label={`+${project.stack.length - 4}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={RouterLink}
                      href={paths.dashboard.projects.edit(project.id)}
                      size="small"
                    >
                      <Iconify icon="solar:pen-bold" width={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.disabled" sx={{ py: 2, textAlign: 'center' }}>
                    No hay proyectos. Crea el primero.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ProjectsListView.propTypes = {
  projects: PropTypes.array,
};
