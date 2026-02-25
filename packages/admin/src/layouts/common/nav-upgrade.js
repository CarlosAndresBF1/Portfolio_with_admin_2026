import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user } = useAuthContext();

  return (
    <Stack
      sx={{
        px: 2,
        py: 3,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Avatar
          alt={user?.name || 'Admin'}
          sx={{ width: 48, height: 48, mb: 1.5 }}
        >
          {(user?.name || 'A').charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={0.5} sx={{ width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name || 'Admin'}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email || ''}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
