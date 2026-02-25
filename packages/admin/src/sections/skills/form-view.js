'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';

import { saveSkill } from './actions';

// ─── Workplace multi-select (from ExperienceJob) ─────────────────────────────

function WorkplacesSelect({ jobs, defaultValue }) {
  const [selected, setSelected] = useState(defaultValue || []);

  return (
    <Box>
      <input type="hidden" name="jobIds" value={selected.join(',')} />
      <FormControl fullWidth>
        <InputLabel>Empresas (de Experiencia)</InputLabel>
        <Select
          multiple
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          input={<OutlinedInput label="Empresas (de Experiencia)" />}
          renderValue={(ids) =>
            ids
              .map((id) => jobs.find((j) => j.id === id)?.company || id)
              .join(', ')
          }
        >
          {jobs.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              <Checkbox checked={selected.includes(job.id)} />
              <ListItemText primary={job.company} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
        {selected.map((id) => {
          const job = jobs.find((j) => j.id === id);
          return (
            <Chip
              key={id}
              label={job?.company || id}
              onDelete={() => setSelected((prev) => prev.filter((v) => v !== id))}
              size="small"
            />
          );
        })}
      </Stack>
    </Box>
  );
}

WorkplacesSelect.propTypes = { jobs: PropTypes.array, defaultValue: PropTypes.array };

// ─── Translation fields ───────────────────────────────────────────────────────

function TranslationFields({ lang, translation }) {
  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Nombre"
        name={`${lang}_name`}
        defaultValue={translation?.name || ''}
        required
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Descripción"
        name={`${lang}_description`}
        defaultValue={translation?.description || ''}
        helperText="Descripción breve de la habilidad"
      />
    </Stack>
  );
}

TranslationFields.propTypes = {
  lang: PropTypes.string,
  translation: PropTypes.object,
};

// ─── Main form ────────────────────────────────────────────────────────────────

export default function SkillFormView({ skill, categories, jobs }) {
  const [langTab, setLangTab] = useState(0);

  const esTranslation = skill?.translations?.find((t) => t.language?.code === 'es');
  const enTranslation = skill?.translations?.find((t) => t.language?.code === 'en');

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.skills.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          color="inherit"
        >
          Volver
        </Button>
        <Typography variant="h4">Editar Skill</Typography>
      </Stack>

      <form action={saveSkill}>
        {skill && <input type="hidden" name="id" value={skill.id} />}

        <Stack spacing={3}>
          {/* General data */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Datos generales
            </Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Años de experiencia"
                  name="years"
                  defaultValue={skill?.years || ''}
                  placeholder="5+"
                  sx={{ width: 180 }}
                  helperText='Ej: "3+", "5+", "1"'
                />
                <FormControl sx={{ minWidth: 240 }}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    name="categoryId"
                    defaultValue={skill?.categoryId || ''}
                    label="Categoría"
                  >
                    {categories.map((cat) => {
                      const esCatName = cat.translations.find((t) => t.language?.code === 'es');
                      return (
                        <MenuItem key={cat.id} value={cat.id}>
                          {esCatName?.name || `Categoría (order ${cat.order})`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Box>

          {/* Workplaces */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Lugares de trabajo
            </Typography>
            <WorkplacesSelect
              jobs={jobs}
              defaultValue={skill?.workplaces?.map((w) => w.jobId)}
            />
          </Box>

          {/* Translations */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Contenido por idioma
            </Typography>
            <Tabs value={langTab} onChange={(_, v) => setLangTab(v)} sx={{ mb: 2 }}>
              <Tab label="Español" />
              <Tab label="English" />
            </Tabs>
            <Box sx={{ display: langTab === 0 ? 'block' : 'none' }}>
              <TranslationFields lang="es" translation={esTranslation} />
            </Box>
            <Box sx={{ display: langTab === 1 ? 'block' : 'none' }}>
              <TranslationFields lang="en" translation={enTranslation} />
            </Box>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              component={RouterLink}
              href={paths.dashboard.skills.root}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Iconify icon="solar:diskette-bold" />}
            >
              Guardar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}

SkillFormView.propTypes = {
  skill: PropTypes.object,
  categories: PropTypes.array,
  jobs: PropTypes.array,
};
