'use client';

import {
  Avatar,
  Box,
  Button,
  Container,
  FormHelperText,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, MouseEvent, useRef, useState } from 'react';
import { clientContainer } from '@/client-injection';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { CloudUpload, VisibilityOffRounded, VisibilityRounded } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbarOnError } from '@/utils';
import { Register } from '@/application/client';
import { Symbols } from '@/config/symbols';
import { TypeOf, z } from 'zod';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import NextLink from 'next/link';

const registerInputSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Nama tidak boleh kosong' }),
    emailAddress: z
      .string()
      .trim()
      .min(1, { message: 'Alamat email tidak boleh kosong' })
      .email('Alamat email tidak valid'),
    password: z.string().min(1, { message: 'Kata sandi tidak boleh kosong' }),
    passwordConfirmation: z
      .string()
      .min(1, { message: 'Konfirmasi kata sandi tidak boleh kosong' }),
    picture: z
      .any()
      .refine(
        (file) => (file instanceof Blob ? file?.size <= 1024 * 1024 * 5 : true),
        `Gambar harus berukuran kurang dari atau sama dengan 5MB`,
      )
      .refine(
        (file) =>
          file instanceof Blob
            ? ['image/jpeg', 'image/png', 'image/webp'].includes(file?.type)
            : true,
        'Gambar harus berekstensi .jpg, .jpeg, .png atau .webp',
      ),
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

type RegisterInput = TypeOf<typeof registerInputSchema>;

type Props = {
  callbackUrl?: string;
};

export function RegisterForm({ callbackUrl }: Props) {
  const router = useRouter();
  const register = clientContainer.get<Register>(Symbols.Register);

  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
  });

  const handlePasswordShow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword((show) => !show);
  };

  const handlePasswordConfirmationShow = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPasswordConfirmation((show) => !show);
  };

  const handleRegister = handleSubmit(async (data) => {
    setLoading(true);

    const loadingKey = enqueueSnackbar('Mendaftarkan...', {
      variant: 'info',
      persist: true,
    });
    const result = await enqueueSnackbarOnError(
      () =>
        register.execute(
          data.name,
          data.emailAddress,
          data.password,
          data.passwordConfirmation,
          data.picture,
        ),
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
        Daftar
      </Typography>
      <Typography component="p" className="my-2 text-center text-sm">
        Buat akun WalletWatchmu!
      </Typography>

      <Box component="form" noValidate className="mt-4 text-center" onSubmit={handleRegister}>
        <TextField
          id="name"
          label="Nama"
          error={!!errors.name}
          helperText={errors.name?.message}
          autoComplete="name"
          autoFocus
          fullWidth
          margin="dense"
          {...registerField('name')}
        />
        <TextField
          id="email"
          label="Alamat email"
          error={!!errors.emailAddress}
          helperText={errors.emailAddress?.message}
          autoComplete="email"
          autoFocus
          fullWidth
          margin="dense"
          {...registerField('emailAddress')}
        />
        <TextField
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Kata sandi"
          error={!!errors.password}
          helperText={errors.password?.message}
          autoComplete="new-password"
          fullWidth
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" className="mr-2">
                <IconButton
                  aria-label="Ubah visibilitas kata sandi"
                  onClick={handlePasswordShow}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...registerField('password')}
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
          {...registerField('passwordConfirmation')}
        />
        <Controller
          name={'picture'}
          control={control}
          render={({
            field: { value, onChange, ref, ...field },
            formState: { defaultValues, errors },
          }) => {
            return (
              <Container maxWidth={false} disableGutters={true} className="mt-2 mb-1">
                <Container
                  maxWidth={false}
                  disableGutters={true}
                  className="flex items-center place-content-evenly"
                >
                  <Avatar
                    variant="circular"
                    src={
                      image ||
                      (value?.startsWith('/api')
                        ? (process.env.NEXT_PUBLIC_API_URL as string) + value
                        : value)
                    }
                    alt={defaultValues?.name}
                    sizes="5rem"
                    className="flex-initial w-24 h-24 text-5xl"
                  />
                  <Button
                    component="label"
                    variant="filled"
                    startIcon={<CloudUpload />}
                    htmlFor="picture"
                    role={undefined}
                    className="flex-initial"
                    onKeyDownCapture={(event) => {
                      if (event.code === 'Enter') {
                        inputRef.current?.click();
                      }
                    }}
                  >
                    Unggah foto profil
                    <input
                      id="picture"
                      type="file"
                      accept=".jpg, .jpeg, .png, .webp"
                      hidden
                      aria-describedby="picture-helper-text"
                      aria-invalid={!!errors.picture}
                      ref={(element) => {
                        ref(element);
                        inputRef.current = element;
                      }}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        if (image) {
                          URL.revokeObjectURL(image);
                        }

                        if (event.target.files?.[0]) {
                          onChange(event.target.files[0]);
                          setImage(URL.createObjectURL(event.target.files[0]));
                        }
                      }}
                      {...field}
                    />
                  </Button>
                </Container>
                <FormHelperText
                  id="picture-helper-text"
                  error={!!errors.picture}
                  className="flex-auto mt-2 text-center"
                >
                  {(errors.picture?.message as string) ||
                    'Gambar harus berekstensi .jpg, .jpeg, .png atau .webp, dan berukuran kurang dari atau sama dengan 5MB (opsional)'}
                </FormHelperText>
              </Container>
            );
          }}
        />

        <Button type="submit" variant="filled" fullWidth disabled={loading} className="mt-3">
          Daftar
        </Button>

        <Typography component="p" className="mt-8 text-center text-sm">
          Sudah punya akun?{' '}
          <Link
            component={NextLink}
            className="no-underline hover:underline"
            href={callbackUrl ? `/login?callback_url=${encodeURIComponent(callbackUrl)}` : '/login'}
          >
            Masuk!
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
}
