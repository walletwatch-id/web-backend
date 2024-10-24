import '@/presentation/styles/globals.css';
import { App } from '@/config/app';
import { Fonts } from '@/config/fonts';
import { ForbiddenError, UnauthorizedError } from '@/domain/errors';
import { GetUser } from '@/application/server';
import { headers } from 'next/headers';
import {
  InternalFooter,
  InternalHeader,
  InternalMain,
  Sidebar,
} from '@/presentation/components/internal/shared';
import { Metadata } from 'next';
import { MuiSetup, SkipToContentButton, SnackbarSetup } from '@/presentation/components/shared';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { serverContainer } from '@/server-injection';
import { Symbols } from '@/config/symbols';
import { UserUIDto, UserUIMapper } from '@/presentation/dtos';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: `${App.site.title}`,
    template: `%s - ${App.site.title}`,
  },
  description: App.site.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function InternalLayout({ children }: Props) {
  const getUser = serverContainer.get<GetUser>(Symbols.GetUser);
  const headerUrl = headers().get('x-url') ?? '';
  const url = new URL(headerUrl);
  let user: UserUIDto | undefined;

  try {
    user = UserUIMapper.fromDomain(await getUser.execute());
  } catch (error) {
    const callbackUrl = encodeURIComponent(`${url.pathname}?${url.searchParams.toString()}`);

    if (error instanceof ForbiddenError && error.message.includes('not verified')) {
      redirect(`/verify-email?callback_url=${callbackUrl}`);
    } else if (error instanceof UnauthorizedError && error.message.includes('Unauthenticated')) {
      redirect(`/login?callback_url=${callbackUrl}`);
    } else {
      throw error;
    }
  }

  return (
    <html lang={App.site.locale} className={`${Fonts.sans.variable} ${Fonts.mono.variable}`}>
      <body id="__next" className="w-full">
        <MuiSetup>
          <SnackbarSetup>
            <SkipToContentButton />
            <InternalHeader user={user} />
            <Sidebar menus={App.sidebar.menus} />
            <InternalMain>{children}</InternalMain>
            <InternalFooter />
          </SnackbarSetup>
        </MuiSetup>
      </body>
    </html>
  );
}
