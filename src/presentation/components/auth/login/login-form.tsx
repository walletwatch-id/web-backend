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
import { Login } from '@/application/client';
import { MouseEvent, useState } from 'react';
import { Symbols } from '@/config/symbols';
import { TypeOf, z } from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import NextLink from 'next/link';

const loginInputSchema = z.object({
  emailAddress: z
    .string()
    .trim()
    .min(1, { message: 'Alamat email tidak boleh kosong' })
    .email('Alamat email tidak valid'),
  password: z.string().min(1, { message: 'Password tidak boleh kosong' }),
});

type LoginInput = TypeOf<typeof loginInputSchema>;

type Props = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl }: Props) {
  const router = useRouter();
  const login = clientContainer.get<Login>(Symbols.Login);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
  });

  const handlePasswordShow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword((show) => !show);
  };

  const handleLogin = handleSubmit(async (data) => {
    setLoading(true);

    const loadingKey = enqueueSnackbar('Mengautentikasi...', {
      variant: 'info',
      persist: true,
    });
    const result = await enqueueSnackbarOnError(
      () => login.execute(data.emailAddress, data.password),
      () => setLoading(false),
    );

    if (result) {
      closeSnackbar(loadingKey);

      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        router.push('/dashboard');
      }
    }
  });

  return (
    <Paper
      elevation={0}
      sx={{ bgcolor: 'surface.main' }}
      className="mx-auto p-0 max-w-sm rounded-xl sm:p-8"
    >
      <Typography component="h1" variant="h5" className="text-center font-medium">
        Masuk
      </Typography>
      <Typography component="p" className="my-2 text-center text-sm">
        Gunakan akun WalletWatchmu!
      </Typography>

      <Box component="form" noValidate className="mt-4 text-right" onSubmit={handleLogin}>
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

        <Button
          LinkComponent={NextLink}
          variant="text"
          size="small"
          href={
            callbackUrl
              ? `/reset-password?callback_url=${encodeURIComponent(callbackUrl)}`
              : '/reset-password'
          }
        >
          Lupa kata sandi?
        </Button>
        <Button type="submit" variant="filled" fullWidth disabled={loading} className="mt-3">
          Masuk
        </Button>

        <Typography component="p" className="mt-8 text-center text-sm">
          Belum punya akun?{' '}
          <Link
            component={NextLink}
            className="no-underline hover:underline"
            href={
              callbackUrl
                ? `/register?callback_url=${encodeURIComponent(callbackUrl)}`
                : '/register'
            }
          >
            Daftar!
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
