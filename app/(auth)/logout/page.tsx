import { ForbiddenError } from '@/domain/errors';
import { GetUser } from '@/application/server';
import { LogoutForm } from '@/presentation/components/auth/logout';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { serverContainer } from '@/server-injection';
import { Symbols } from '@/config/symbols';

export const metadata: Metadata = {
  title: 'Keluar',
};

export default async function LogoutPage() {
  const getUser = serverContainer.get<GetUser>(Symbols.GetUser);

  try {
    await getUser.execute();
  } catch (error) {
    if (error instanceof ForbiddenError && error.message.includes('not verified')) {
      // Do nothing, unverified user can still logout
    } else {
      const callbackUrl = encodeURIComponent('/dashboard');

      redirect(`/login?callback_url=${callbackUrl}`);
    }
  }

  return (
    <section className="flex items-center px-6 py-20 min-h-screen md:px-12 lg:px-18">
      <LogoutForm />
    </section>
  );
}
