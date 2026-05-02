import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anuncie seu Imóvel | Administração Profissional de Imóveis',
  description: 'Anuncie e administre seu imóvel com a Carlão Imóveis. Gestão completa, segurança jurídica e máxima visibilidade em Governador Valadares e Coronel Fabriciano.',
  alternates: { canonical: '/administrar' },
  openGraph: {
    title: 'Anuncie seu Imóvel | Carlão Imóveis',
    description: 'Administração profissional de imóveis. Maximize seu retorno com a gestão da Carlão Imóveis.',
    url: '/administrar',
  },
};

export default function AdministrarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
