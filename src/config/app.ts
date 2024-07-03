import { NestedMenu, PathMenu, UrlMenu } from '@/domain/entities';

export const App: {
  site: {
    url: string;
    title: string;
    tagline: string;
    description: string;
    locale: string;
  };
  nav: {
    menus: Required<
      | Omit<PathMenu, 'matcher'>
      | UrlMenu
      | NestedMenu<Omit<PathMenu, 'icon' | 'matcher'> | Omit<UrlMenu, 'icon'>>
    >[];
  };
  sidebar: {
    menus: RequiredProperty<PathMenu | NestedMenu<RequiredProperty<PathMenu, 'icon'>>, 'icon'>[];
  };
} = {
  site: {
    url: process.env.NEXT_PUBLIC_APP_URL as string,
    title: 'WalletWatch',
    tagline: 'Aplikasi Automatic Self-Control Paylater',
    description:
      'Aplikasi automatic self-Control berbasis machine learning untuk meminimalisir tingkat kecanduan pengguna paylater.',
    locale: 'en-UK',
  },
  nav: {
    menus: [],
  },
  sidebar: {
    menus: [
      {
        name: 'Dasbor',
        icon: 'space-dashboard',
        path: '/dashboard',
      },
    ],
  },
};
