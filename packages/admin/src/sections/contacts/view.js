'use client';

import PropTypes from 'prop-types';
import { useState, useTransition } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Iconify from 'src/components/iconify';
import { markContactRead } from './actions';

// ----------------------------------------------------------------------

export default function ContactsView({ contacts: initialContacts }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [isPending, startTransition] = useTransition();

  const filtered = contacts.filter((c) => {
    if (filter === 'unread') return !c.read;
    if (filter === 'read') return c.read;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.read).length;

  const handleMarkRead = (id, read) => {
    startTransition(async () => {
      await markContactRead(id, read);
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read } : c)));
      if (selected?.id === id) setSelected((prev) => ({ ...prev, read }));
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h4">Contactos</Typography>
          {unreadCount > 0 && (
            <Chip label={`${unreadCount} nuevos`} color="error" size="small" />
          )}
        </Stack>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, v) => v && setFilter(v)}
          size="small"
        >
          <ToggleButton value="all">Todos ({contacts.length})</ToggleButton>
          <ToggleButton value="unread">No leídos ({unreadCount})</ToggleButton>
          <ToggleButton value="read">Leídos ({contacts.length - unreadCount})</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Asunto</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((contact) => (
              <TableRow
                key={contact.id}
                hover
                sx={{
                  cursor: 'pointer',
                  bgcolor: contact.read ? 'transparent' : 'info.lighter',
                }}
                onClick={() => setSelected(contact)}
              >
                <TableCell>
                  <Chip
                    label={contact.read ? 'Leído' : 'Nuevo'}
                    color={contact.read ? 'default' : 'info'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{contact.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {contact.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {contact.subject}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(contact.createdAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    title={contact.read ? 'Marcar como no leído' : 'Marcar como leído'}
                    onClick={() => handleMarkRead(contact.id, !contact.read)}
                    disabled={isPending}
                  >
                    <Iconify
                      icon={contact.read ? 'solar:eye-closed-bold' : 'solar:eye-bold'}
                      width={18}
                    />
                  </IconButton>
                  <IconButton
                    size="small"
                    title="Responder por email"
                    component="a"
                    href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                  >
                    <Iconify icon="solar:reply-bold" width={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de detalle */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">{selected.subject}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    De: {selected.name} &lt;{selected.email}&gt;
                  </Typography>
                </Box>
                <Chip
                  label={selected.read ? 'Leído' : 'Nuevo'}
                  color={selected.read ? 'default' : 'info'}
                  size="small"
                />
              </Stack>
            </DialogTitle>

            <DialogContent dividers>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selected.message}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Recibido:{' '}
                {new Date(selected.createdAt).toLocaleString('es-CO')}
                {selected.ipAddress && ` · IP: ${selected.ipAddress}`}
              </Typography>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setSelected(null)}>Cerrar</Button>
              <Button
                onClick={() => handleMarkRead(selected.id, !selected.read)}
                disabled={isPending}
                startIcon={<Iconify icon={selected.read ? 'solar:eye-closed-bold' : 'solar:eye-bold'} />}
              >
                {selected.read ? 'Marcar como no leído' : 'Marcar como leído'}
              </Button>
              <Button
                variant="contained"
                component="a"
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                startIcon={<Iconify icon="solar:reply-bold" />}
              >
                Responder
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

ContactsView.propTypes = {
  contacts: PropTypes.array,
};
