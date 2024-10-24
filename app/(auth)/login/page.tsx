import { ForbiddenError } from '@/domain/errors';
import { GetUser } from '@/application/server';
import { LoginForm } from '@/presentation/components/auth/login';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Symbols } from '@/config/symbols';
import { serverContainer } from '@/server-injection';
import { User } from '@/domain/entities';

export const metadata: Metadata = {
  title: 'Masuk',
};

type Props = {
  searchParams: {
    callback_url?: string;
  };
};

export default async function LoginPage({ searchParams }: Props) {
  const getUser = serverContainer.get<GetUser>(Symbols.GetUser);
  let user: User | undefined;

  try {
    user = await getUser.execute();
  } catch (error) {
    if (error instanceof ForbiddenError && error.message.includes('not verified')) {
      redirect(`/verify-email?callback_url=${searchParams.callback_url}`);
    }
  }

  if (user) {
    if (searchParams.callback_url) {
      redirect(searchParams.callback_url);
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <section className="flex items-center px-6 py-20 min-h-screen md:px-12 lg:px-18">
      <LoginForm callbackUrl={searchParams.callback_url} />
    </section>
  );
}
