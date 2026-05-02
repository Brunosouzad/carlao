import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato | Fale com a Carlão Imóveis',
  description: 'Entre em contato com a Carlão Imóveis. Atendimento em Governador Valadares e Coronel Fabriciano. Telefone, WhatsApp, e-mail e endereços das unidades.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato | Carlão Imóveis',
    description: 'Fale conosco pelo WhatsApp, telefone ou visite nossas unidades em Governador Valadares e Coronel Fabriciano.',
    url: '/contato',
  },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
