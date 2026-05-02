import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Imóveis à Venda em Governador Valadares e Coronel Fabriciano',
  description: 'Confira as melhores casas, apartamentos, lotes e fazendas à venda em Governador Valadares e Coronel Fabriciano com a Carlão Imóveis. Financiamento facilitado.',
  alternates: { canonical: '/venda' },
  openGraph: {
    title: 'Imóveis à Venda | Carlão Imóveis',
    description: 'Encontre seu próximo imóvel. Casas, apartamentos, lotes e fazendas com as melhores condições em Governador Valadares e região.',
    url: '/venda',
  },
};

export default function VendaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
