import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perguntas Frequentes sobre Compra, Venda e Aluguel de Imóveis',
  description: 'Tire suas dúvidas sobre compra, venda e aluguel de imóveis em Governador Valadares e Coronel Fabriciano. Documentação, financiamento, FGTS e mais.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ | Perguntas Frequentes | Carlão Imóveis',
    description: 'Respostas para as dúvidas mais comuns sobre compra, venda e aluguel de imóveis.',
    url: '/faq',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
