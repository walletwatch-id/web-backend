'use client';

import { Button, Grid, Paper, Typography } from '@mui/material';
import { ClientUIDto, ScopeUIDto } from '@/presentation/dtos';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { enqueueSnackbarOnError } from '@/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { approveAuthorize, denyAuthorize } from '@/presentation/actions';

type Props = {
  client: ClientUIDto;
  scopes: ScopeUIDto[];
  state: string;
  authToken: string;
};

export function AuthorizeForm({ client, scopes, state, authToken }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);

    const loadingKey = enqueueSnackbar('Menyetujui...', {
      variant: 'info',
      persist: true,
    });
    const result = await enqueueSnackbarOnError(
      () => approveAuthorize(state, client.id, authToken),
      () => setLoading(false),
    );

    if (result) {
      closeSnackbar(loadingKey);
      router.push(result);
    }
  };

  const handleDeny = async () => {
    setLoading(true);

    const loadingKey = enqueueSnackbar('Menolak...', {
      variant: 'info',
      persist: true,
    });
    const result = await enqueueSnackbarOnError(
      () => denyAuthorize(state, client.id, authToken),
      () => setLoading(false),
    );

    if (result) {
      closeSnackbar(loadingKey);
      router.push(result);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ bgcolor: 'surface.main' }}
      className="mx-auto p-0 w-full max-w-sm rounded-xl sm:p-8"
    >
      <Typography component="h1" variant="h5" className="text-center font-medium">
        Permintaan Otorisasi
      </Typography>
      <Typography component="p" className="mt-2 text-center text-sm">
        <b>{client.name}</b> meminta izin untuk mengakses akun WalletWatchmu!
      </Typography>

      {scopes.length > 0 ? (
        <>
          <Typography component="p" className="mt-6 text-left text-sm">
            Aplikasi ini akan mendapatkan akses:
          </Typography>
          <Typography variant="body2" component="ul" className="my-1 text-left">
            {scopes.map((scope) => (
              <li key={scope.id}>{scope.description}</li>
            ))}
          </Typography>
        </>
      ) : null}

      <Grid container spacing={2} className="mt-2">
        <Grid item xs={12} sm={6}>
          <Button variant="filled" fullWidth disabled={loading} onClick={handleApprove}>
            Setuju
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" fullWidth disabled={loading} onClick={handleDeny}>
            Tolak
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
