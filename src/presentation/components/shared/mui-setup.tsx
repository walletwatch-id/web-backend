'use client';

import { CssBaseline } from '@mui/material';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir';
import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Themes } from '@/config/themes';

type Props = {
  children: ReactNode;
};

export function MuiSetup({ children }: Props) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
      <ThemeProvider theme={Themes.dark}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
