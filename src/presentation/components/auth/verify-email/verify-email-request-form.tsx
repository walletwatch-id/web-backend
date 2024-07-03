'use client';

import { Button, Paper, Typography } from '@mui/material';
import { clientContainer } from '@/client-injection';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { enqueueSnackbarOnError } from '@/utils';
import { SendVerifyEmailNotification } from '@/application/client';
import { Symbols } from '@/config/symbols';
import { useState } from 'react';

type Props = {
  failed?: boolean;
  errorMessage?: string;
};

export function VerifyEmailRequestForm({ failed }: Props) {
  const sendVerifyEmailNotification = clientContainer.get<SendVerifyEmailNotification>(
    Symbols.SendVerifyEmailNotification,
  );

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendVerifyEmailNotification = async () => {
    setLoading(true);

    const loadingKey = enqueueSnackbar('Mengirim...', {
      variant: 'info',
      persist: true,
    });
    const result = await enqueueSnackbarOnError(
      () => sendVerifyEmailNotification.execute(),
      () => setLoading(false),
    );

    if (result) {
      closeSnackbar(loadingKey);
      setSent(true);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ bgcolor: 'surface.main' }}
      className="mx-auto p-0 max-w-sm rounded-xl sm:p-8"
    >
      <Typography component="h1" variant="h5" className="text-center font-medium">
        Verifikasi Alamat Email
      </Typography>
      {sent ? (
        <Typography component="p" className="my-2 text-justify text-sm">
          Tautan untuk memverifikasi alamat email sudah kami kirimkan. Periksa kotak masuk atau
          folder spam!
        </Typography>
      ) : (
        <>
          {failed ? (
            <Typography component="p" className="my-2 text-justify text-sm">
              Kami tidak bisa memverifikasi alamat emailmu. Periksa kotak masuk atau folder spam dan
              pastikan kamu telah menggunakan tautan yang tepat dan terkini, atau kirim ulang tautan
              verifikasi ke alamat emailmu!
            </Typography>
          ) : (
            <Typography component="p" className="my-2 text-justify text-sm">
              Alamat emailmu belum terverifikasi. Periksa pesan di kotak masuk atau folder spam,
              atau kirim ulang tautan verifikasi ke alamat emailmu!
            </Typography>
          )}

          <Button
            type="submit"
            variant="filled"
            fullWidth
            disabled={loading}
            className="mt-3"
            onClick={handleSendVerifyEmailNotification}
          >
            Kirim
          </Button>
        </>
      )}
    </Paper>
  );
}
