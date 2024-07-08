import Link from 'next/link';
import { Icon } from '@/presentation/components/shared';
import { PathMenu, UrlMenu } from '@/domain/entities';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

type Props = {
  menu: PathMenu | UrlMenu;
};

export function NavbarMenu({ menu }: Props) {
  return (
    <ListItem disableGutters={true} className="mr-3">
      <ListItemButton
        LinkComponent={Link}
        href={menu.hasOwnProperty('path') ? (menu as PathMenu).path : (menu as UrlMenu).url}
        className="py-[6px]"
      >
        {menu.icon ? (
          <ListItemIcon>
            <Icon name={menu.icon} className="align-text-bottom " />
          </ListItemIcon>
        ) : null}
        <ListItemText>{menu.name}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
