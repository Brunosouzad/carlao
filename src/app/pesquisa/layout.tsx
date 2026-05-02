import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar Imóveis em Governador Valadares e Coronel Fabriciano',
  description: 'Pesquise imóveis à venda e para alugar em Governador Valadares e Coronel Fabriciano. Filtre por tipo, preço, quartos, área e localização.',
  alternates: { canonical: '/pesquisa' },
  robots: { index: true, follow: true },
};

export default function PesquisaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
