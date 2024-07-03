import { GetUser } from '@/application/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  ResetPasswordForm,
  ResetPasswordRequestForm,
} from '@/presentation/components/auth/reset-password';
import { Symbols } from '@/config/symbols';
import { serverContainer } from '@/server-injection';
import { User } from '@/domain/entities';
export const metadata: Metadata = {
  title: 'Atur Ulang Kata Sandi',
};

type Props = {
  searchParams: {
    token?: string;
  };
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const getUser = serverContainer.get<GetUser>(Symbols.GetUser);
  let user: User | undefined;

  try {
    user = await getUser.execute();
  } catch (error) {
    // Do nothing
  }

  if (user) {
    redirect('/dashboard');
  }

  return (
    <section className="flex items-center px-6 py-20 min-h-screen md:px-12 lg:px-18">
      {searchParams.token ? (
        <ResetPasswordForm token={searchParams.token} />
      ) : (
        <ResetPasswordRequestForm />
      )}
    </section>
  );
}
