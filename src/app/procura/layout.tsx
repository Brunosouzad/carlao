import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Encomende seu Imóvel Ideal | Busca Personalizada',
  description: 'Não encontrou o imóvel perfeito? Conte-nos o que procura e nossa equipe fará uma busca personalizada no mercado de Governador Valadares e Coronel Fabriciano.',
  alternates: { canonical: '/procura' },
  openGraph: {
    title: 'Encomende seu Imóvel Ideal | Carlão Imóveis',
    description: 'Serviço de busca personalizada de imóveis. Nossa equipe encontra o imóvel dos seus sonhos.',
    url: '/procura',
  },
};

export default function ProcuraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
