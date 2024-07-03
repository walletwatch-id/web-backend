'use client';

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { clientContainer } from '@/client-injection';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { enqueueSnackbarOnError } from '@/utils';
import { MouseEvent, useState } from 'react';
import { ResetPassword } from '@/application/client';
import { Symbols } from '@/config/symbols';
import { TypeOf, z } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import NextLink from 'next/link';

const resetPasswordInputSchema = z
  .object({
    emailAddress: z
      .string()
      .trim()
      .min(1, { message: 'Alamat email tidak boleh kosong' })
      .email('Alamat email tidak valid'),
    password: z.string().min(1, { message: 'Password tidak boleh kosong' }),
    passwordConfirmation: z
      .string()
      .min(1, { message: 'Konfirmasi kata sandi tidak boleh kosong' }),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Konfirmasi kata sandi tidak sama',
        path: ['passwordConfirmation'],
      });
    }
  });

type ResetPasswordInput = TypeOf<typeof resetPasswordInputSchema>;

type Props = {
  token: string;
};

export function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const resetPassword = clientContainer.get<ResetPassword>(Symbols.ResetPassword);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInputSchema),
  });

  const handlePasswordShow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword((show) => !show);
  };

  const handlePasswordConfirmationShow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPasswordConfirmation((show) => !show);
  };

  const handleResetPassword = handleSubmit(async (data) => {
    setLoading(true);

    const loadingKey = enqueueSnackbar('Mengatur ulang...', {
      variant: 'info',
      persist: true,
    });
    const result = await enqueueSnackbarOnError(
      () =>
        resetPassword.execute(data.emailAddress, token, data.password, data.passwordConfirmation),
      () => setLoading(false),
    );

    if (result) {
      closeSnackbar(loadingKey);
      router.push('/login');
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
      <Typography component="p" className="my-2 text-center text-sm">
        Buat kata sandi baru untuk akun WalletWatchmu!
      </Typography>

      <Box component="form" noValidate className="mt-4 text-right" onSubmit={handleResetPassword}>
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
        <TextField
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Kata sandi"
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="current-password"
          fullWidth
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="mr-2">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={handlePasswordShow}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register('password')}
        />
        <TextField
          id="password"
          type={showPasswordConfirmation ? 'text' : 'password'}
          label="Konfirmasi kata sandi"
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
          autoComplete="new-password"
          fullWidth
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="mr-2">
                <IconButton
                  aria-label="Ubah visibilitas kata sandi"
                  onClick={handlePasswordConfirmationShow}
                  edge="end"
                >
                  {showPasswordConfirmation ? <VisibilityOffRounded /> : <VisibilityRounded />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...register('passwordConfirmation')}
        />

        <Button type="submit" variant="filled" fullWidth disabled={loading} className="mt-3">
          Atur ulang
        </Button>

        <Typography component="p" className="mt-8 text-center text-sm">
          Batal mengatur ulang kata sandi?{' '}
          <Link component={NextLink} className="no-underline hover:underline" href="/login">
            Masuk!
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
