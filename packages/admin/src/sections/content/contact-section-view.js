'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import SaveSnackbar from 'src/components/save-snackbar/save-snackbar';
import { saveContactSection } from './contact-section-actions';

// ─── Fields per language ──────────────────────────────────────────────────────

function ContactSectionFields({ lang, translation }) {
  return (
    <Stack spacing={2}>
      <Typography variant="subtitle2" color="text.secondary">
        Encabezado
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Título"
          name={`${lang}_title`}
          defaultValue={translation?.title || ''}
        />
        <TextField
          fullWidth
          label="Título (highlight)"
          name={`${lang}_titleHighlight`}
          defaultValue={translation?.titleHighlight || ''}
          helperText="Parte del título resaltada en color"
        />
      </Stack>
      <TextField
        fullWidth
        label="Subtítulo"
        name={`${lang}_subtitle`}
        defaultValue={translation?.subtitle || ''}
      />

      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" color="text.secondary">
        Labels del formulario
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Campo Nombre"
          name={`${lang}_formName`}
          defaultValue={translation?.formName || ''}
        />
        <TextField
          fullWidth
          label="Campo Email"
          name={`${lang}_formEmail`}
          defaultValue={translation?.formEmail || ''}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Campo Asunto"
          name={`${lang}_formSubject`}
          defaultValue={translation?.formSubject || ''}
        />
        <TextField
          fullWidth
          label="Campo Mensaje"
          name={`${lang}_formMessage`}
          defaultValue={translation?.formMessage || ''}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="Botón Enviar"
          name={`${lang}_formSend`}
          defaultValue={translation?.formSend || ''}
        />
        <TextField
          fullWidth
          label="Botón Enviando..."
          name={`${lang}_formSending`}
          defaultValue={translation?.formSending || ''}
        />
      </Stack>

      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" color="text.secondary">
        Mensajes de estado
      </Typography>
      <TextField
        fullWidth
        label="Mensaje de éxito"
        name={`${lang}_formSuccess`}
        defaultValue={translation?.formSuccess || ''}
        multiline
        rows={2}
      />
      <TextField
        fullWidth
        label="Mensaje de error"
        name={`${lang}_formError`}
        defaultValue={translation?.formError || ''}
        multiline
        rows={2}
      />
    </Stack>
  );
}

ContactSectionFields.propTypes = {
  lang: PropTypes.string,
  translation: PropTypes.object,
};

// ─── Main view ────────────────────────────────────────────────────────────────

export default function ContactSectionView({ esTranslation, enTranslation }) {
  const [langTab, setLangTab] = useState(0);

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <SaveSnackbar />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Sección Contacto</Typography>
      </Stack>

      <form action={saveContactSection}>
        <Stack spacing={3}>
          <Box>
            <Tabs value={langTab} onChange={(_, v) => setLangTab(v)} sx={{ mb: 2 }}>
              <Tab label="Español" />
              <Tab label="English" />
            </Tabs>
            <Box sx={{ display: langTab === 0 ? 'block' : 'none' }}>
              <ContactSectionFields lang="es" translation={esTranslation} />
            </Box>
            <Box sx={{ display: langTab === 1 ? 'block' : 'none' }}>
              <ContactSectionFields lang="en" translation={enTranslation} />
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

ContactSectionView.propTypes = {
  esTranslation: PropTypes.object,
  enTranslation: PropTypes.object,
};
