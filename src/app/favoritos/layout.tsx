import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Imóveis Favoritos',
  description: 'Seus imóveis favoritos salvos para facilitar sua decisão.',
  robots: { index: false, follow: true },
};

export default function FavoritosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
