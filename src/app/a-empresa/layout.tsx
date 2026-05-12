import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre a Carlão Imóveis | Imobiliária em Governador Valadares e Coronel Fabriciano',
  description: 'Conheça a história, missão e valores da Carlão Imóveis. Mais de 25 anos de tradição no mercado imobiliário de Governador Valadares e Coronel Fabriciano.',
  alternates: { canonical: '/a-empresa' },
  openGraph: {
    title: 'Sobre a Carlão Imóveis',
    description: 'Conheça a imobiliária de confiança em Governador Valadares e Coronel Fabriciano. Tradição, segurança e excelência no mercado imobiliário.',
    url: '/a-empresa',
  },
};

export default function AEmpresaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
