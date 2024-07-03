import '@/presentation/styles/globals.css';
import { App } from '@/config/app';
import { AuthFooter, AuthMain } from '@/presentation/components/auth/shared';
import { Fonts } from '@/config/fonts';
import { MuiSetup, SkipToContentButton, SnackbarSetup } from '@/presentation/components/shared';
import { Metadata } from 'next';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: `Auth - ${App.site.title}`,
    template: `%s - ${App.site.title}`,
  },
  description: App.site.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function AuthLayout({ children }: Props) {
  return (
    <html lang={App.site.locale} className={`${Fonts.sans.variable} ${Fonts.mono.variable}`}>
      <body id="__next">
        <MuiSetup>
          <SnackbarSetup>
            <SkipToContentButton />
            <AuthMain>{children}</AuthMain>
            <AuthFooter />
          </SnackbarSetup>
        </MuiSetup>
      </body>
    </html>
  );
}
