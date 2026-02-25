'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useSearchParams, useRouter, usePathname } from 'src/routes/hooks';

export default function SaveSnackbar({ message }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('saved') === '1') {
      setOpen(true);
      // Remove the ?saved=1 from the URL without navigation
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={() => setOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

SaveSnackbar.propTypes = {
  message: PropTypes.string,
};

SaveSnackbar.defaultProps = {
  message: '¡Guardado exitosamente!',
};
