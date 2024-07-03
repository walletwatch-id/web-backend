'use client';

import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { clientContainer } from '@/client-injection';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { enqueueSnackbarOnError } from '@/utils';
import { SendResetPasswordNotification } from '@/application/client';
import { Symbols } from '@/config/symbols';
import { TypeOf, z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import NextLink from 'next/link';

const resetPasswordRequestInputSchema = z.object({
  emailAddress: z
    .string()
    .trim()
    .min(1, { message: 'Alamat email tidak boleh kosong' })
    .email('Alamat email tidak valid'),
});

type ResetPasswordRequestInput = TypeOf<typeof resetPasswordRequestInputSchema>;

export function ResetPasswordRequestForm() {
  const sendResetPasswordNotification = clientContainer.get<SendResetPasswordNotification>(
    Symbols.SendResetPasswordNotification,
  );

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestInput>({
    resolver: zodResolver(resetPasswordRequestInputSchema),
  });

  const handleSendResetPasswordNotification = handleSubmit(async (data) => {
    setLoading(true);

    const loadingKey = enqueueSnackbar('Mengirim...', {
      variant: 'info',
      persist: true,
    });
    const result = await enqueueSnackbarOnError(
      () => sendResetPasswordNotification.execute(data.emailAddress),
      () => setLoading(false),
    );

    if (result) {
      closeSnackbar(loadingKey);
      setSent(true);
    }
  });

  return (
    <Paper
      elevation={0}
      sx={{ bgcolor: 'surface.main' }}
      className="mx-auto p-0 max-w-sm rounded-xl sm:p-8"
    >
      <Typography component="h1" variant="h5" className="text-center font-medium">
        Atur Ulang Kata Sandi
      </Typography>
      {sent ? (
        <Typography component="p" className="my-2 text-justify text-sm">
          Tautan untuk mengatur ulang kata sandi sudah kami kirim ke alamat emailmu. Periksa kotak
          masuk atau folder spam!
        </Typography>
      ) : (
        <>
          <Typography component="p" className="my-2 text-center text-sm">
            Kirim tautan atur ulang kata sandi ke alamat emailmu!
          </Typography>

          <Box
            component="form"
            noValidate
            className="mt-4 text-right"
            onSubmit={handleSendResetPasswordNotification}
          >
            <TextField
              id="email"
              label="Alamat email"
              error={!!errors.emailAddress}
              helperText={errors.emailAddress?.message}
              autoComplete="email"
              autoFocus
              fullWidth
              margin="dense"
              {...register('emailAddress')}
            />

            <Button type="submit" variant="filled" fullWidth disabled={loading} className="mt-3">
              Kirim
            </Button>

            <Typography component="p" className="mt-8 text-center text-sm">
              Sudah ingat kata sandimu?{' '}
              <Link component={NextLink} className="no-underline hover:underline" href="/login">
                Masuk!
              </Link>
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
}
