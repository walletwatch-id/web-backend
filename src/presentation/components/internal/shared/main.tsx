'use client';

import { Container } from '@mui/material';
import { ReactNode } from 'react';
import { mainStore, useStore } from '@/presentation/hooks';

type Props = {
  children: ReactNode;
};

export function InternalMain({ children }: Props) {
  const sidebarExtended = useStore(mainStore, (s) => s.sidebarExtended);

  return (
    <Container
      id="content"
      component="main"
      maxWidth={false}
      sx={{ bgcolor: 'surfaceContainer.main' }}
      className={`min-h-[calc(100vh-4rem)] w-full pt-[74px] px-0 scroll-mt-[74px] overflow-auto ${
        sidebarExtended ? 'lg:pl-[260px]' : 'lg:pl-20'
      }`}
    >
      {children}
    </Container>
  );
}
