'use client';

import { App } from '@/config/app';
import { AppBar, IconButton, Typography } from '@mui/material';
import { mainStore, useStore } from '@/presentation/hooks';
import { MenuRounded } from '@mui/icons-material';
import { Navbar } from './navbar';
import { UserUIDto, UserUIMapper } from '@/presentation/dtos';

type Props = {
  user: UserUIDto | null;
};

export function InternalHeader({ user }: Props) {
  const [sidebarOpened, setSidebarOpenedState] = useStore(mainStore, (s) => [
    s.sidebarOpened,
    s.setSidebarOpenedState,
  ]);

  return (
    <AppBar
      component="header"
      sx={{
        bgcolor: 'surfaceContainer.main',
      }}
      className="flex flex-row items-center w-full h-[74px] p-4 shadow-none lg:pl-0"
    >
      <IconButton className="lg:hidden" onClick={() => setSidebarOpenedState(!sidebarOpened)}>
        <MenuRounded />
      </IconButton>
      <div className="w-full md:w-[204px] lg:w-[260px]">
        <Typography
          component="h1"
          variant="h6"
          className="mx-auto text-center font-medium text-infinite-green"
        >
          WalletWatch
        </Typography>
      </div>
      <Navbar menus={App.nav.menus} user={user ? UserUIMapper.toDomain(user) : null} />
    </AppBar>
  );
}
