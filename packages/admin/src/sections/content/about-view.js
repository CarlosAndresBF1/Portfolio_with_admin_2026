'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import SaveSnackbar from 'src/components/save-snackbar/save-snackbar';

import { saveAboutSection } from './content-actions';

// ─── Circle items chip input ──────────────────────────────────────────────────

function CircleItemsInput({ lang, defaultValue }) {
  const [items, setItems] = useState(defaultValue || []);
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
    }
    setInput('');
  };

  const remove = (label) => setItems((prev) => prev.filter((i) => i !== label));

  return (
    <Box>
      <input type="hidden" name={`${lang}_circleItems`} value={items.join(',')} />
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }}>
        {items.map((label) => (
          <Chip key={label} label={label} onDelete={() => remove(label)} size="small" />
        ))}
        {items.length === 0 && (
          <Typography variant="caption" color="text.disabled">
            Sin elementos en el círculo
          </Typography>
        )}
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          placeholder="Agregar elemento..."
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

CircleItemsInput.propTypes = {
  lang: PropTypes.string,
  defaultValue: PropTypes.array,
};

// ─── About fields per language ────────────────────────────────────────────────

function AboutFields({ lang, about }) {
  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Título"
        name={`${lang}_title`}
        defaultValue={about?.title || ''}
        required
      />
      <TextField
        fullWidth
        label="Subtítulo"
        name={`${lang}_subtitle`}
        defaultValue={about?.subtitle || ''}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Descripción"
        name={`${lang}_description`}
        defaultValue={about?.description || ''}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Ubicación"
          name={`${lang}_location`}
          defaultValue={about?.location || ''}
        />
        <TextField
          fullWidth
          label="Email"
          name={`${lang}_email`}
          type="email"
          defaultValue={about?.email || ''}
        />
        <TextField
          fullWidth
          label="Teléfono"
          name={`${lang}_phone`}
          defaultValue={about?.phone || ''}
        />
      </Stack>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Circle Items
        </Typography>
        <CircleItemsInput
          lang={lang}
          defaultValue={about?.circleItems?.map((c) => c.label)}
        />
      </Box>
    </Stack>
  );
}

AboutFields.propTypes = {
  lang: PropTypes.string,
  about: PropTypes.object,
};

// ─── Main view ────────────────────────────────────────────────────────────────

export default function AboutView({ esAbout, enAbout }) {
  const [langTab, setLangTab] = useState(0);

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <SaveSnackbar />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Sección About</Typography>
      </Stack>

      <form action={saveAboutSection}>
        <Stack spacing={3}>
          <Box>
            <Tabs value={langTab} onChange={(_, v) => setLangTab(v)} sx={{ mb: 2 }}>
              <Tab label="Español" />
              <Tab label="English" />
            </Tabs>
            <Box sx={{ display: langTab === 0 ? 'block' : 'none' }}>
              <AboutFields lang="es" about={esAbout} />
            </Box>
            <Box sx={{ display: langTab === 1 ? 'block' : 'none' }}>
              <AboutFields lang="en" about={enAbout} />
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

AboutView.propTypes = {
  esAbout: PropTypes.object,
  enAbout: PropTypes.object,
};
