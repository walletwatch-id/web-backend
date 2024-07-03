import { Metadata } from 'next';
import { SectionHeader } from '@/presentation/components/internal/shared';
import { About } from '@/presentation/components/internal/overview';

export const metadata: Metadata = {
  title: 'Dasbor',
};

export default async function OverviewPage() {
  return (
    <>
      <SectionHeader title="Dasbor" />
      <About />
    </>
  );
}
