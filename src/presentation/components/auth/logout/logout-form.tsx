'use client';

import { Button, Grid, Paper, Typography } from '@mui/material';
import { clientContainer } from '@/client-injection';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { enqueueSnackbarOnError } from '@/utils';
import { Logout } from '@/application/client';
import { Symbols } from '@/config/symbols';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutForm() {
  const router = useRouter();
  const logout = clientContainer.get<Logout>(Symbols.Logout);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const loadingKey = enqueueSnackbar('Mengeluarkan...', {
      variant: 'info',
      persist: true,
    });
    const result = await enqueueSnackbarOnError(
      () => logout.execute(),
      () => setLoading(false),
    );

    if (result) {
      closeSnackbar(loadingKey);
      router.push('/login');
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ bgcolor: 'surface.main' }}
      className="mx-auto p-0 w-full max-w-sm rounded-xl sm:p-8"
    >
      <Typography component="h1" variant="h5" className="text-center font-medium">
        Keluar
      </Typography>
      <Typography component="p" className="mt-2 text-center text-sm">
        Apakah kamu yakin ingin keluar?
      </Typography>

      <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} sm={6}>
          <Button variant="filled" fullWidth disabled={loading} onClick={handleLogout}>
            Keluar
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" fullWidth disabled={loading} onClick={() => router.back()}>
            Kembali
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
