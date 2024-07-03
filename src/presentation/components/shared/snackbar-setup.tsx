'use client';

import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';

type Props = {
  children: ReactNode;
};

export function SnackbarSetup({ children }: Props) {
  return (
    <SnackbarProvider
      preventDuplicate
      maxSnack={1}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
