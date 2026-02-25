'use client';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';

import { updateProfile, changePassword } from './actions';

// ─── Error messages ───────────────────────────────────────────────────────────

const ERROR_MESSAGES = {
  empty: 'Todos los campos son obligatorios.',
  short: 'La nueva contraseña debe tener al menos 8 caracteres.',
  mismatch: 'Las contraseñas no coinciden.',
  invalid: 'La contraseña actual es incorrecta.',
  nouser: 'Usuario no encontrado.',
  noname: 'El nombre es obligatorio.',
};

// ─── Profile View ─────────────────────────────────────────────────────────────

export default function ProfileView({ user }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [snackOpen, setSnackOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const saved = searchParams.get('saved');
    const error = searchParams.get('error');

    if (saved === '1') {
      setSnackOpen(true);
      setErrorMsg('');
      router.replace(pathname, { scroll: false });
    } else if (error) {
      setErrorMsg(ERROR_MESSAGES[error] || 'Error desconocido.');
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return (
    <Box sx={{ p: 3, maxWidth: 700 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Perfil
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      {/* ── Profile Info Card ── */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Información general
        </Typography>

        <form action={updateProfile}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Nombre"
              name="name"
              defaultValue={user?.name || ''}
              required
            />

            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
              helperText="El email no se puede cambiar desde aquí."
            />

            <Stack direction="row" justifyContent="flex-end">
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
      </Card>

      {/* ── Password Card ── */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Cambiar contraseña
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <form action={changePassword}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Contraseña actual"
              name="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end">
                      <Iconify icon={showCurrent ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Nueva contraseña"
              name="newPassword"
              type={showNew ? 'text' : 'password'}
              required
              helperText="Mínimo 8 caracteres."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                      <Iconify icon={showNew ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirmar nueva contraseña"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                      <Iconify icon={showConfirm ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="warning"
                startIcon={<Iconify icon="solar:lock-password-bold" />}
              >
                Cambiar contraseña
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          ¡Guardado exitosamente!
        </Alert>
      </Snackbar>
    </Box>
  );
}

ProfileView.propTypes = {
  user: PropTypes.object,
};
