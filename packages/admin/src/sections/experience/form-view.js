'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { saveExperienceJob } from './actions';

// ─── Stack chips input ────────────────────────────────────────────────────────

function StackInput({ defaultValue }) {
  const [items, setItems] = useState(defaultValue || []);
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
    }
    setInput('');
  };

  const remove = (tech) => setItems((prev) => prev.filter((t) => t !== tech));

  return (
    <Box>
      <input type="hidden" name="stack" value={items.join(',')} />
      <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" gap={0.5}>
        {items.map((tech) => (
          <Chip key={tech} label={tech} onDelete={() => remove(tech)} size="small" />
        ))}
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          placeholder="Agregar tecnología..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          sx={{ flex: 1 }}
        />
        <Button variant="outlined" size="small" onClick={add}>
          Agregar
        </Button>
      </Stack>
    </Box>
  );
}

StackInput.propTypes = { defaultValue: PropTypes.array };

// ─── Translation fields ───────────────────────────────────────────────────────

function TranslationFields({ lang, translation }) {
  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Rol / Cargo"
        name={`${lang}_role`}
        defaultValue={translation?.role || ''}
        required
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Resumen (summary)"
        name={`${lang}_summary`}
        defaultValue={translation?.summary || ''}
        helperText="Descripción breve visible en la lista"
      />
      <TextField
        fullWidth
        multiline
        rows={5}
        label="Detalles (details)"
        name={`${lang}_details`}
        defaultValue={translation?.details || ''}
        helperText="Descripción expandida al hacer clic"
      />
    </Stack>
  );
}

TranslationFields.propTypes = {
  lang: PropTypes.string,
  translation: PropTypes.object,
};

// ─── Main form ────────────────────────────────────────────────────────────────

export default function ExperienceFormView({ job }) {
  const [langTab, setLangTab] = useState(0);

  const esTranslation = job?.translations?.find((t) => t.language?.code === 'es');
  const enTranslation = job?.translations?.find((t) => t.language?.code === 'en');

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.experience.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          color="inherit"
        >
          Volver
        </Button>
        <Typography variant="h4">{job ? 'Editar Trabajo' : 'Nuevo Trabajo'}</Typography>
      </Stack>

      <form action={saveExperienceJob}>
        {job && <input type="hidden" name="id" value={job.id} />}

        <Stack spacing={3}>
          {/* Datos generales */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Datos generales
            </Typography>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Número"
                  name="number"
                  defaultValue={job?.number || ''}
                  placeholder="01"
                  required
                  sx={{ width: 100 }}
                />
                <TextField
                  fullWidth
                  label="Empresa"
                  name="company"
                  defaultValue={job?.company || ''}
                  required
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Inicio del período"
                  name="periodStart"
                  defaultValue={job?.periodStart || ''}
                  placeholder="Ene 2023"
                  required
                />
                <TextField
                  fullWidth
                  label="Fin del período"
                  name="periodEnd"
                  defaultValue={job?.periodEnd || ''}
                  placeholder="Presente"
                  required
                />
              </Stack>
              <TextField
                label="Orden"
                name="order"
                type="number"
                defaultValue={job?.order ?? 0}
                sx={{ width: 120 }}
              />
            </Stack>
          </Box>

          {/* Stack tecnológico */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Stack tecnológico
            </Typography>
            <StackInput defaultValue={job?.stack?.map((s) => s.tech)} />
          </Box>

          {/* Traducciones */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Contenido por idioma
            </Typography>
            <Tabs value={langTab} onChange={(_, v) => setLangTab(v)} sx={{ mb: 2 }}>
              <Tab label="🇨🇴 Español" />
              <Tab label="🇺🇸 English" />
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

ExperienceFormView.propTypes = { job: PropTypes.object };
