import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Imóveis para Aluguel em Governador Valadares e Coronel Fabriciano',
  description: 'Encontre os melhores imóveis para alugar em Governador Valadares e Coronel Fabriciano. Casas, apartamentos e salas comerciais com contrato seguro.',
  alternates: { canonical: '/aluguel' },
  openGraph: {
    title: 'Imóveis para Aluguel | Carlão Imóveis',
    description: 'As melhores opções de locação em Governador Valadares e Coronel Fabriciano. Alugue com segurança jurídica.',
    url: '/aluguel',
  },
};

export default function AluguelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
