import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { clientContainer } from '@/client-injection';
import { enqueueSnackbarOnError } from '@/utils';
import { Logout } from '@/application/client';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { NestedMenu, PathMenu, UrlMenu, User } from '@/domain/entities';
import { NavbarDropdownMenu } from './navbar-dropdown-menu';
import { NavbarMenu } from './navbar-menu';
import { Symbols } from '@/config/symbols';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type Props = {
  menus?: (PathMenu | UrlMenu | NestedMenu)[];
  user: User | null;
};

export function Navbar({ menus, user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const logout = clientContainer.get<Logout>(Symbols.Logout);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

    const result = await enqueueSnackbarOnError(() => logout.execute());

    if (result) {
      const callbackUrl = encodeURIComponent(`${pathname}?${searchParams}`);

      router.push(`/login?callback_url=${callbackUrl}`);
    }
  };

  return (
    <nav className="flex flex-grow items-center justify-end md:ml-4">
      <List dense={true} disablePadding={true} className="hidden text-center md:flex">
        {menus &&
          menus.map((menu, i) => {
            if (menu.hasOwnProperty('path') || menu.hasOwnProperty('url')) {
              return <NavbarMenu key={i} menu={menu as PathMenu | UrlMenu} />;
            } else {
              return <NavbarDropdownMenu key={i} menu={menu as NestedMenu} />;
            }
          })}
      </List>
      <IconButton
        onClick={handleClick}
        size="small"
        className="p-1"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          variant="circular"
          sizes="32px"
          src={user?.picture}
          alt={user?.name || 'User'}
          className="w-8 h-8"
        />
      </IconButton>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            className:
              'max-w-[300px] min-w-[250px] mt-3 overflow-visible drop-shadow-md before:content-[""] before:block before:absolute before:top-0 before:right-3.5 before:w-2.5 before:h-2.5 before:-translate-y-1/2 before:rotate-45 before:z-0',
            sx: {
              '&::before': {
                bgcolor: 'background.paper',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography className="px-4 pb-2">{user?.name || 'User'}</Typography>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Keluar
        </MenuItem>
      </Menu>
    </nav>
  );
}
