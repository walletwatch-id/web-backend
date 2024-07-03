import { ForbiddenError, UnauthorizedError } from '@/domain/errors';
import { GetUser, VerifyEmail } from '@/application/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { serverContainer } from '@/server-injection';
import { Symbols } from '@/config/symbols';
import { User } from '@/domain/entities';
import { VerifyEmailRequestForm } from '@/presentation/components/auth/verify-email';

export const metadata: Metadata = {
  title: 'Verifikasi Alamat Email',
};

type Props = {
  searchParams: {
    id?: string;
    hash?: string;
    expires?: number;
    signature?: string;
  };
};

export default async function VerifyEmailNoticePage({ searchParams }: Props) {
  const getUser = serverContainer.get<GetUser>(Symbols.GetUser);
  const verifyEmail = serverContainer.get<VerifyEmail>(Symbols.VerifyEmail);
  let user: User | undefined;

  try {
    user = await getUser.execute();
  } catch (error) {
    if (error instanceof UnauthorizedError && error.message.includes('Unauthenticated')) {
      redirect('/login');
    } else if (error instanceof ForbiddenError && error.message.includes('not verified')) {
      // Do nothing, this page is for unverified user
    } else {
      throw error;
    }
  }

  if (
    user &&
    !(searchParams.id && searchParams.hash && searchParams.expires && searchParams.signature)
  ) {
    redirect('/dashboard');
  } else if (
    searchParams.id &&
    searchParams.hash &&
    searchParams.expires &&
    searchParams.signature
  ) {
    let success = false;
    try {
      success = await verifyEmail.execute(
        searchParams.id,
        searchParams.hash,
        searchParams.expires,
        searchParams.signature,
      );
    } catch (error) {
      return (
        <section className="flex items-center px-6 py-20 min-h-screen md:px-12 lg:px-18">
          <VerifyEmailRequestForm failed />
        </section>
      );
    }

    if (success) {
      redirect('/dashboard');
    }
  } else {
    return (
      <section className="flex items-center px-6 py-20 min-h-screen md:px-12 lg:px-18">
        <VerifyEmailRequestForm />
      </section>
    );
  }
}
