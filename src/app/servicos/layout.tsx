import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossos Serviços | Venda, Locação e Consultoria Imobiliária',
  description: 'Conheça os serviços da Carlão Imóveis: venda de imóveis, locação, administração de patrimônio e consultoria especializada em Governador Valadares e Coronel Fabriciano.',
  alternates: { canonical: '/servicos' },
  openGraph: {
    title: 'Serviços Imobiliários | Carlão Imóveis',
    description: 'Serviços completos de venda, locação e consultoria imobiliária em Governador Valadares e Coronel Fabriciano.',
    url: '/servicos',
  },
};

export default function ServicosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
