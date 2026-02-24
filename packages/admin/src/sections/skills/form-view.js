'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { saveSkill } from './actions';

// ─── Workplace chips input ────────────────────────────────────────────────────

function WorkplacesInput({ defaultValue }) {
  const [items, setItems] = useState(defaultValue || []);
  const [input, setInput] = useState('');

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      setItems((prev) => [...prev, trimmed]);
    }
    setInput('');
  };

  const remove = (workplace) => setItems((prev) => prev.filter((w) => w !== workplace));

  return (
    <Box>
      <input type="hidden" name="workplaces" value={items.join(',')} />
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }}>
        {items.map((workplace) => (
          <Chip
            key={workplace}
            label={workplace}
            onDelete={() => remove(workplace)}
            size="small"
          />
        ))}
        {items.length === 0 && (
          <Typography variant="caption" color="text.disabled">
            Sin lugares de trabajo agregados
          </Typography>
        )}
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          placeholder="Agregar lugar de trabajo..."
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

WorkplacesInput.propTypes = { defaultValue: PropTypes.array };

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

export default function SkillFormView({ skill, categories }) {
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
            <WorkplacesInput
              defaultValue={skill?.workplaces?.map((w) => w.workplace)}
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
            {langTab === 0 && <TranslationFields lang="es" translation={esTranslation} />}
            {langTab === 1 && <TranslationFields lang="en" translation={enTranslation} />}
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
};
