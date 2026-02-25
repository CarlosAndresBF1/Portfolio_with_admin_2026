'use client';

import PropTypes from 'prop-types';
import { useState, useTransition } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';

import { saveSocialLink, deleteSocialLink } from './social-links-actions';

// ── Platform presets with default Phosphor Regular icons (256×256 viewBox) ──

const PLATFORM_PRESETS = {
  linkedin: {
    label: 'LinkedIn',
    icon: 'M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z',
  },
  github: {
    label: 'GitHub',
    icon: 'M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.55a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.55a8,8,0,0,0,1.1,7.69A41.72,41.72,0,0,1,200,104Z',
  },
  gitlab: {
    label: 'GitLab',
    icon: 'M230.15,117.1,210.25,41a11.94,11.94,0,0,0-22.79-1.11L169.78,88H86.22L68.54,39.87A11.94,11.94,0,0,0,45.75,41L25.85,117.1a57.19,57.19,0,0,0,22,61l73.27,51.76a11.91,11.91,0,0,0,13.74,0l73.27-51.76A57.19,57.19,0,0,0,230.15,117.1ZM58,57.5,73.13,98.76A8,8,0,0,0,80.64,104h94.72a8,8,0,0,0,7.51-5.24L198,57.5l13.07,50L128,166.21,44.9,107.5ZM40.68,124.11,114.13,176,93.41,190.65,57.09,165A41.06,41.06,0,0,1,40.68,124.11Zm87.32,91-20.73-14.65L128,185.8l20.73,14.64ZM198.91,165l-36.32,25.66L141.87,176l73.45-51.9A41.06,41.06,0,0,1,198.91,165Z',
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: 'M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z',
  },
  email: {
    label: 'Email',
    icon: 'M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z',
  },
  website: {
    label: 'Website',
    icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM101.63,168h52.74C149,186.34,140,202.87,128,213.65,116,202.87,107.05,186.34,101.63,168ZM98,152a145.72,145.72,0,0,1,0-48h60a145.72,145.72,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.79a161.79,161.79,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128Zm114.37-40H101.63C107.05,69.66,116,53.13,128,42.35,140,53.13,149,69.66,154.37,88Zm19.84,16h38.46a88.15,88.15,0,0,1,0,48H174.21a161.79,161.79,0,0,0,0-48Zm32.16-16H170.94a142.39,142.39,0,0,0-20.26-45A88.37,88.37,0,0,1,206.37,88ZM105.32,43A142.39,142.39,0,0,0,85.06,88H49.63A88.37,88.37,0,0,1,105.32,43ZM49.63,168H85.06a142.39,142.39,0,0,0,20.26,45A88.37,88.37,0,0,1,49.63,168Zm101.05,45a142.39,142.39,0,0,0,20.26-45h35.43A88.37,88.37,0,0,1,150.68,213Z',
  },
  other: {
    label: 'Otro',
    icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z',
  },
};

const PLATFORMS = Object.keys(PLATFORM_PRESETS);

// ── Tiny SVG preview ────────────────────────────────────────────────────────

function IconPreview({ pathData, size = 24 }) {
  if (!pathData) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="currentColor">
      <path d={pathData} />
    </svg>
  );
}

IconPreview.propTypes = { pathData: PropTypes.string, size: PropTypes.number };

// ── Empty form state ────────────────────────────────────────────────────────

const EMPTY_LINK = {
  id: '',
  platform: 'other',
  label: '',
  url: '',
  urlEn: '',
  icon: PLATFORM_PRESETS.other.icon,
  order: 0,
  visible: true,
};

// ── Main view ───────────────────────────────────────────────────────────────

export default function SocialLinksView({ links: initialLinks }) {
  const [links, setLinks] = useState(initialLinks);
  const [editing, setEditing] = useState(null); // null | link object
  const [isPending, startTransition] = useTransition();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openNew = () =>
    setEditing({ ...EMPTY_LINK, order: links.length });

  const openEdit = (link) =>
    setEditing({ ...link, urlEn: link.urlEn || '' });

  const handlePlatformChange = (platform) => {
    const preset = PLATFORM_PRESETS[platform] || PLATFORM_PRESETS.other;
    setEditing((prev) => ({
      ...prev,
      platform,
      label: prev.label || preset.label,
      icon: preset.icon,
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const fd = new FormData();
      if (editing.id) fd.set('id', editing.id);
      fd.set('platform', editing.platform);
      fd.set('label', editing.label);
      fd.set('url', editing.url);
      fd.set('urlEn', editing.urlEn || '');
      fd.set('icon', editing.icon);
      fd.set('order', String(editing.order));
      if (editing.visible) fd.set('visible', 'on');

      await saveSocialLink(fd);

      // Refetch by reloading (server component will re-render)
      window.location.reload();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set('id', id);
      await deleteSocialLink(fd);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setDeleteConfirm(null);
    });
  };

  const moveUp = (index) => {
    if (index === 0) return;
    startTransition(async () => {
      const updated = [...links];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      // Update order for both
      const fd1 = new FormData();
      fd1.set('id', updated[index - 1].id);
      fd1.set('platform', updated[index - 1].platform);
      fd1.set('label', updated[index - 1].label);
      fd1.set('url', updated[index - 1].url);
      fd1.set('urlEn', updated[index - 1].urlEn || '');
      fd1.set('icon', updated[index - 1].icon);
      fd1.set('order', String(index - 1));
      if (updated[index - 1].visible) fd1.set('visible', 'on');

      const fd2 = new FormData();
      fd2.set('id', updated[index].id);
      fd2.set('platform', updated[index].platform);
      fd2.set('label', updated[index].label);
      fd2.set('url', updated[index].url);
      fd2.set('urlEn', updated[index].urlEn || '');
      fd2.set('icon', updated[index].icon);
      fd2.set('order', String(index));
      if (updated[index].visible) fd2.set('visible', 'on');

      await Promise.all([saveSocialLink(fd1), saveSocialLink(fd2)]);
      setLinks(updated.map((l, i) => ({ ...l, order: i })));
    });
  };

  const moveDown = (index) => {
    if (index === links.length - 1) return;
    startTransition(async () => {
      const updated = [...links];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];

      const fd1 = new FormData();
      fd1.set('id', updated[index].id);
      fd1.set('platform', updated[index].platform);
      fd1.set('label', updated[index].label);
      fd1.set('url', updated[index].url);
      fd1.set('urlEn', updated[index].urlEn || '');
      fd1.set('icon', updated[index].icon);
      fd1.set('order', String(index));
      if (updated[index].visible) fd1.set('visible', 'on');

      const fd2 = new FormData();
      fd2.set('id', updated[index + 1].id);
      fd2.set('platform', updated[index + 1].platform);
      fd2.set('label', updated[index + 1].label);
      fd2.set('url', updated[index + 1].url);
      fd2.set('urlEn', updated[index + 1].urlEn || '');
      fd2.set('icon', updated[index + 1].icon);
      fd2.set('order', String(index + 1));
      if (updated[index + 1].visible) fd2.set('visible', 'on');

      await Promise.all([saveSocialLink(fd1), saveSocialLink(fd2)]);
      setLinks(updated.map((l, i) => ({ ...l, order: i })));
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4">Redes Sociales</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
          onClick={openNew}
        >
          Agregar enlace
        </Button>
      </Stack>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50}>Orden</TableCell>
                <TableCell width={40} />
                <TableCell>Plataforma</TableCell>
                <TableCell>URL</TableCell>
                <TableCell width={80} align="center">Visible</TableCell>
                <TableCell width={140} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay enlaces sociales. Haz clic en &quot;Agregar enlace&quot; para empezar.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {links.map((link, index) => (
                <TableRow key={link.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={0}>
                      <IconButton size="small" onClick={() => moveUp(index)} disabled={index === 0 || isPending}>
                        <Iconify icon="solar:alt-arrow-up-bold" width={16} />
                      </IconButton>
                      <IconButton size="small" onClick={() => moveDown(index)} disabled={index === links.length - 1 || isPending}>
                        <Iconify icon="solar:alt-arrow-down-bold" width={16} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <IconPreview pathData={link.icon} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{link.label}</Typography>
                    <Typography variant="caption" color="text.secondary">{link.platform}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                      {link.url}
                    </Typography>
                    {link.urlEn && (
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 300 }}>
                        EN: {link.urlEn}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={link.visible ? 'Sí' : 'No'}
                      color={link.visible ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(link)} disabled={isPending} title="Editar">
                      <Iconify icon="solar:pen-bold" width={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteConfirm(link)}
                      disabled={isPending}
                      title="Eliminar"
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── Edit / Create Dialog ───────────────────────────────────────── */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="sm" fullWidth>
        {editing && (
          <>
            <DialogTitle>{editing.id ? 'Editar enlace social' : 'Nuevo enlace social'}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Plataforma</InputLabel>
                  <Select
                    value={editing.platform}
                    label="Plataforma"
                    onChange={(e) => handlePlatformChange(e.target.value)}
                  >
                    {PLATFORMS.map((p) => (
                      <MenuItem key={p} value={p}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconPreview pathData={PLATFORM_PRESETS[p].icon} size={20} />
                          <span>{PLATFORM_PRESETS[p].label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Etiqueta"
                  value={editing.label}
                  onChange={(e) => setEditing((prev) => ({ ...prev, label: e.target.value }))}
                  fullWidth
                  helperText="Nombre visible en tooltip (ej: LinkedIn, GitHub)"
                />

                <TextField
                  label="URL"
                  value={editing.url}
                  onChange={(e) => setEditing((prev) => ({ ...prev, url: e.target.value }))}
                  fullWidth
                  helperText="URL principal (o URL en español para WhatsApp)"
                />

                <TextField
                  label="URL en inglés (opcional)"
                  value={editing.urlEn}
                  onChange={(e) => setEditing((prev) => ({ ...prev, urlEn: e.target.value }))}
                  fullWidth
                  helperText="Solo para enlaces con texto distinto por idioma (ej: WhatsApp)"
                />

                <TextField
                  label="Ícono (SVG path data)"
                  value={editing.icon}
                  onChange={(e) => setEditing((prev) => ({ ...prev, icon: e.target.value }))}
                  fullWidth
                  multiline
                  rows={3}
                  helperText={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <span>SVG path d= para viewBox 0 0 256 256 (Phosphor Icons)</span>
                      {editing.icon && <IconPreview pathData={editing.icon} size={20} />}
                    </Stack>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={editing.visible}
                      onChange={(e) => setEditing((prev) => ({ ...prev, visible: e.target.checked }))}
                    />
                  }
                  label="Visible en portafolio"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditing(null)}>Cancelar</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isPending || !editing.label || !editing.url}
              >
                {isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Delete confirmation ────────────────────────────────────────── */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs">
        {deleteConfirm && (
          <>
            <DialogTitle>Eliminar enlace</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Seguro que quieres eliminar <strong>{deleteConfirm.label}</strong>?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={isPending}
              >
                {isPending ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

SocialLinksView.propTypes = {
  links: PropTypes.array,
};
