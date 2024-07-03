import { AuthorizeForm } from '@/presentation/components/auth/authorize';
import { Authorize } from '@/application/server';
import { ClientUIMapper, ScopeUIMapper } from '@/presentation/dtos';
import { ForbiddenError, UnauthorizedError } from '@/domain/errors';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import { redirect, RedirectType } from 'next/navigation';
import { serverContainer } from '@/server-injection';
import { Symbols } from '@/config/symbols';
import { User, Client, Scope } from '@/domain/entities';

export const metadata: Metadata = {
  title: 'Otorisasi',
};

type Props = {
  searchParams: {
    state?: string;
  };
};

export default async function AuthorizePage({ searchParams }: Props) {
  const authorize = serverContainer.get<Authorize>(Symbols.Authorize);
  const headerUrl = headers().get('x-url') ?? '';
  const url = new URL(headerUrl);
  let result:
    | {
        user: User;
        client: Client;
        scopes: Scope[];
        authToken: string;
      }
    | {
        redirect: string;
      }
    | undefined;

  try {
    result = await authorize.execute(url.searchParams);
  } catch (error) {
    if (error instanceof ForbiddenError && error.message.includes('not verified')) {
      redirect('/verify-email', RedirectType.push);
    } else if (error instanceof UnauthorizedError && error.message.includes('Unauthenticated')) {
      if (url) {
        const searchParams = url.searchParams;

        if (searchParams.get('prompt') === 'login') {
          searchParams.delete('prompt');
        }

        const callbackUrl = encodeURIComponent(`${url.pathname}?${searchParams.toString()}`);

        redirect(`/login?callback_url=${callbackUrl}`, RedirectType.push);
      } else {
        redirect('/login', RedirectType.push);
      }
    } else {
      throw error;
    }
  }

  if (result && 'redirect' in result) {
    redirect(result.redirect, RedirectType.push);
  } else {
    return (
      <section className="flex items-center px-6 py-20 min-h-screen md:px-12 lg:px-18">
        <AuthorizeForm
          client={ClientUIMapper.fromDomain(result.client)}
          scopes={result.scopes.map(ScopeUIMapper.fromDomain)}
          state={searchParams.state!}
          authToken={result.authToken}
        />
      </section>
    );
  }
}
