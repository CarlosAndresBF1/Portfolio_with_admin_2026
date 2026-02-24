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
import { saveProject } from './actions';

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
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }}>
        {items.map((tech) => (
          <Chip key={tech} label={tech} onDelete={() => remove(tech)} size="small" />
        ))}
        {items.length === 0 && (
          <Typography variant="caption" color="text.disabled">
            Sin tecnologías agregadas
          </Typography>
        )}
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
        label="Título"
        name={`${lang}_title`}
        defaultValue={translation?.title || ''}
        required
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Descripción"
        name={`${lang}_description`}
        defaultValue={translation?.description || ''}
        helperText="Descripción del proyecto"
      />
    </Stack>
  );
}

TranslationFields.propTypes = {
  lang: PropTypes.string,
  translation: PropTypes.object,
};

// ─── Main form ────────────────────────────────────────────────────────────────

export default function ProjectFormView({ project }) {
  const [langTab, setLangTab] = useState(0);

  const esTranslation = project?.translations?.find((t) => t.language?.code === 'es');
  const enTranslation = project?.translations?.find((t) => t.language?.code === 'en');

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          href={paths.dashboard.projects.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          color="inherit"
        >
          Volver
        </Button>
        <Typography variant="h4">
          {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </Typography>
      </Stack>

      <form action={saveProject}>
        {project && <input type="hidden" name="id" value={project.id} />}

        <Stack spacing={3}>
          {/* General data */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Datos generales
            </Typography>
            <TextField
              label="Orden"
              name="order"
              type="number"
              defaultValue={project?.order ?? 0}
              sx={{ width: 120 }}
              helperText="Orden de aparición en el portfolio"
            />
          </Box>

          {/* Stack */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Stack tecnológico
            </Typography>
            <StackInput defaultValue={project?.stack?.map((s) => s.tech)} />
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
            {langTab === 0 && (
              <TranslationFields lang="es" translation={esTranslation} />
            )}
            {langTab === 1 && (
              <TranslationFields lang="en" translation={enTranslation} />
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              component={RouterLink}
              href={paths.dashboard.projects.root}
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

ProjectFormView.propTypes = {
  project: PropTypes.object,
};
