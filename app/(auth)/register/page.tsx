import { GetUser } from '@/application/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { RegisterForm } from '@/presentation/components/auth/register';
import { Symbols } from '@/config/symbols';
import { serverContainer } from '@/server-injection';
import { User } from '@/domain/entities';

export const metadata: Metadata = {
  title: 'Daftar',
};

type Props = {
  searchParams: {
    callback_url?: string;
  };
};

export default async function RegisterPage({ searchParams }: Props) {
  const getUser = serverContainer.get<GetUser>(Symbols.GetUser);
  let user: User | undefined;

  try {
    user = await getUser.execute();
  } catch (error) {
    // Do nothing
  }

  if (user) {
    if (searchParams.callback_url) {
      redirect(searchParams.callback_url);
    }

    redirect('/dashboard');
  }

  return (
    <section className="flex items-center px-6 py-20 min-h-screen md:px-12 lg:px-18">
      <RegisterForm callbackUrl={searchParams.callback_url} />
    </section>
  );
}
