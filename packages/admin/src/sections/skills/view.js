'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
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

export default function SkillsView({ categories }) {
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Skills</Typography>
      </Stack>

      {categories.map((category) => {
        const esCatTranslation = category.translations.find((t) => t.language.code === 'es');

        return (
          <Box key={category.id} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary' }}>
              {esCatTranslation?.name || `Categoría (order: ${category.order})`}
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre (ES)</TableCell>
                    <TableCell>Años</TableCell>
                    <TableCell>Lugares de trabajo</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {category.skills.map((skill) => {
                    const esTranslation = skill.translations.find((t) => t.language.code === 'es');

                    return (
                      <TableRow key={skill.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{esTranslation?.name || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{skill.years || '—'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" flexWrap="wrap" gap={0.5}>
                            {skill.workplaces.slice(0, 3).map((w) => (
                              <Chip key={w.id} label={w.workplace} size="small" />
                            ))}
                            {skill.workplaces.length > 3 && (
                              <Chip
                                label={`+${skill.workplaces.length - 3}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            {skill.workplaces.length === 0 && (
                              <Typography variant="caption" color="text.disabled">
                                Sin lugares
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            component={RouterLink}
                            href={paths.dashboard.skills.edit(skill.id)}
                            size="small"
                          >
                            <Iconify icon="solar:pen-bold" width={18} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {category.skills.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
                          Sin skills en esta categoría
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}

      {categories.length === 0 && (
        <Typography variant="body1" color="text.disabled">
          No hay categorías de skills disponibles.
        </Typography>
      )}
    </Box>
  );
}

SkillsView.propTypes = {
  categories: PropTypes.array,
};
