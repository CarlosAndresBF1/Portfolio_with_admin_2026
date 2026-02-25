'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import SaveSnackbar from 'src/components/save-snackbar/save-snackbar';

import { savePersonalInfo } from './content-actions';

// ─── Fields per language ──────────────────────────────────────────────────────

function PersonalFields({ lang, info }) {
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Nombre"
          name={`${lang}_name`}
          defaultValue={info?.name || ''}
          required
        />
        <TextField
          fullWidth
          label="Apellido"
          name={`${lang}_lastName`}
          defaultValue={info?.lastName || ''}
          required
        />
      </Stack>
      <TextField
        fullWidth
        label="Rol / Cargo"
        name={`${lang}_role`}
        defaultValue={info?.role || ''}
        required
        helperText='Ej: "Full Stack Developer"'
      />
      <TextField
        fullWidth
        label="Tagline"
        name={`${lang}_tagline`}
        defaultValue={info?.tagline || ''}
        helperText="Frase corta debajo del nombre"
      />
      <TextField
        fullWidth
        label="Texto botón cambio de idioma"
        name={`${lang}_switchLang`}
        defaultValue={info?.switchLang || ''}
        helperText='Ej: "EN" para ES, "ES" para EN'
        sx={{ maxWidth: 300 }}
      />
    </Stack>
  );
}

PersonalFields.propTypes = {
  lang: PropTypes.string,
  info: PropTypes.object,
};

// ─── Main view ────────────────────────────────────────────────────────────────

export default function PersonalInfoView({ esInfo, enInfo }) {
  const [langTab, setLangTab] = useState(0);

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <SaveSnackbar />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Información Personal</Typography>
      </Stack>

      <form action={savePersonalInfo}>
        <Stack spacing={3}>
          <Box>
            <Tabs value={langTab} onChange={(_, v) => setLangTab(v)} sx={{ mb: 2 }}>
              <Tab label="Español" />
              <Tab label="English" />
            </Tabs>
            <Box sx={{ display: langTab === 0 ? 'block' : 'none' }}>
              <PersonalFields lang="es" info={esInfo} />
            </Box>
            <Box sx={{ display: langTab === 1 ? 'block' : 'none' }}>
              <PersonalFields lang="en" info={enInfo} />
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

PersonalInfoView.propTypes = {
  esInfo: PropTypes.object,
  enInfo: PropTypes.object,
};
