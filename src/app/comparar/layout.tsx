import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comparar Imóveis',
  description: 'Compare imóveis lado a lado e tome a melhor decisão para sua compra ou aluguel.',
  robots: { index: false, follow: true },
};

export default function CompararLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
