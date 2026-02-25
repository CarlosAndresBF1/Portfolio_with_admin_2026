'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import Iconify from 'src/components/iconify';
import SaveSnackbar from 'src/components/save-snackbar/save-snackbar';

import { saveSummaryCards } from './summary-actions';

// ─── Single card fields ───────────────────────────────────────────────────────

function SummaryCardFields({ lang, card, index }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Tarjeta {index + 1}
        </Typography>
        <Stack spacing={2}>
          <input type="hidden" name={`${lang}_card_${index}_id`} value={card?.id || ''} />
          <TextField
            fullWidth
            label="Orden"
            name={`${lang}_card_${index}_order`}
            type="number"
            defaultValue={card?.order ?? index}
            sx={{ maxWidth: 120 }}
          />
          <TextField
            fullWidth
            label="Título"
            name={`${lang}_card_${index}_title`}
            defaultValue={card?.title || ''}
            helperText='Ej: "Años de"'
          />
          <TextField
            fullWidth
            label="Heading"
            name={`${lang}_card_${index}_heading`}
            defaultValue={card?.heading || ''}
            helperText='Número o valor destacado. Ej: "5+"'
          />
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Texto"
            name={`${lang}_card_${index}_text`}
            defaultValue={card?.text || ''}
            helperText="Descripción o detalle"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

SummaryCardFields.propTypes = {
  lang: PropTypes.string,
  card: PropTypes.object,
  index: PropTypes.number,
};

// ─── Cards list for a language ────────────────────────────────────────────────

function SummaryLangFields({ lang, cards }) {
  const CARD_COUNT = 6;
  const paddedCards = Array.from({ length: CARD_COUNT }, (_, i) => cards[i] || null);

  return (
    <Box>
      <input type="hidden" name={`${lang}_cardCount`} value={CARD_COUNT} />
      <Grid container spacing={2}>
        {paddedCards.map((card, i) => (
          <Grid key={i} item xs={12} sm={6}>
            <SummaryCardFields lang={lang} card={card} index={i} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

SummaryLangFields.propTypes = {
  lang: PropTypes.string,
  cards: PropTypes.array,
};

// ─── Main view ────────────────────────────────────────────────────────────────

export default function SummaryView({ esCards, enCards }) {
  const [langTab, setLangTab] = useState(0);

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <SaveSnackbar />
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Summary Cards</Typography>
      </Stack>

      <form action={saveSummaryCards}>
        <Stack spacing={3}>
          <Box>
            <Tabs value={langTab} onChange={(_, v) => setLangTab(v)} sx={{ mb: 2 }}>
              <Tab label="Español" />
              <Tab label="English" />
            </Tabs>
            <Box sx={{ display: langTab === 0 ? 'block' : 'none' }}>
              <SummaryLangFields lang="es" cards={esCards} />
            </Box>
            <Box sx={{ display: langTab === 1 ? 'block' : 'none' }}>
              <SummaryLangFields lang="en" cards={enCards} />
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

SummaryView.propTypes = {
  esCards: PropTypes.array,
  enCards: PropTypes.array,
};
