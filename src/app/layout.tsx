import type { Metadata } from "next";
import { Outfit, Inter, Oswald } from "next/font/google";
import "./globals.css";
import { PropertiesProvider } from "@/store/PropertiesContext";
import { SiteSettingsProvider } from "@/store/SiteSettingsContext";
import { FavoritesProvider } from "@/store/FavoritesContext";
import { CompareProvider } from "@/store/CompareContext";
import { ToastProvider } from "@/store/ToastContext";
import IntegrationsScript from "@/components/IntegrationsScript";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.carlaoimoveismg.com.br'),
  title: {
    default: 'Carlão Imóveis | Imobiliária em Governador Valadares e Coronel Fabriciano - MG',
    template: '%s | Carlão Imóveis',
  },
  description: 'Encontre os melhores imóveis em Governador Valadares e Coronel Fabriciano. Casas, apartamentos, lotes e fazendas à venda e para alugar com atendimento personalizado.',
  keywords: 'imobiliária, corretor de imóveis, minas gerais, carlão imóveis, casas à venda, apartamentos, aluguel, Governador Valadares, Coronel Fabriciano, imóveis MG',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Carlão Imóveis | Imobiliária em Governador Valadares e Coronel Fabriciano',
    description: 'A sua parceira de confiança em negócios imobiliários. Casas, apartamentos, fazendas e lotes em Governador Valadares e região.',
    url: 'https://www.carlaoimoveismg.com.br',
    siteName: 'Carlão Imóveis',
    images: [
      {
        url: '/og-carlao.png',
        width: 1200,
        height: 630,
        alt: 'Carlão Imóveis - Imobiliária em Governador Valadares e Coronel Fabriciano',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carlão Imóveis | Imobiliária em Governador Valadares e Coronel Fabriciano',
    description: 'A sua parceira de confiança em negócios imobiliários em Minas Gerais.',
    images: ['/og-carlao.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <body className="antialiased selection:bg-amber-500/30 selection:text-amber-200" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "RealEstateAgent",
                  "name": "Carlão Imóveis",
                  "image": "https://www.carlaoimoveismg.com.br/logo-carlao.png",
                  "description": "Sua parceira de confiança em negócios imobiliários em Minas Gerais desde 2011. Especialistas em venda, aluguel e administração de imóveis em Governador Valadares e Coronel Fabriciano.",
                  "@id": "https://www.carlaoimoveismg.com.br/#organization",
                  "url": "https://www.carlaoimoveismg.com.br",
                  "telephone": "+553384136800",
                  "email": "carlaoimoveisva@gmail.com",
                  "priceRange": "$$",
                  "areaServed": [
                    { "@type": "City", "name": "Governador Valadares", "address": { "@type": "PostalAddress", "addressRegion": "MG", "addressCountry": "BR" } },
                    { "@type": "City", "name": "Coronel Fabriciano", "address": { "@type": "PostalAddress", "addressRegion": "MG", "addressCountry": "BR" } }
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Rua Marechal Floriano, 600, Loja 05",
                    "addressLocality": "Governador Valadares",
                    "addressRegion": "MG",
                    "postalCode": "35010-140",
                    "addressCountry": "BR"
                  },
                  "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "08:00",
                    "closes": "18:00"
                  },
                  "sameAs": [
                    "https://www.instagram.com/carlao_imoveis",
                    "https://facebook.com/carlaoimoveismg"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.carlaoimoveismg.com.br/#website",
                  "url": "https://www.carlaoimoveismg.com.br",
                  "name": "Carlão Imóveis",
                  "publisher": { "@id": "https://www.carlaoimoveismg.com.br/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.carlaoimoveismg.com.br/pesquisa?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "SiteNavigationElement",
                  "name": ["Home", "A Empresa", "Serviços", "Imóveis à Venda", "Imóveis para Aluguel", "Anuncie seu Imóvel", "FAQ", "Contato"],
                  "url": [
                    "https://www.carlaoimoveismg.com.br/",
                    "https://www.carlaoimoveismg.com.br/a-empresa",
                    "https://www.carlaoimoveismg.com.br/servicos",
                    "https://www.carlaoimoveismg.com.br/venda",
                    "https://www.carlaoimoveismg.com.br/aluguel",
                    "https://www.carlaoimoveismg.com.br/administrar",
                    "https://www.carlaoimoveismg.com.br/faq",
                    "https://www.carlaoimoveismg.com.br/contato"
                  ]
                }
              ]
            })
          }}
        />
        <SiteSettingsProvider>
          <IntegrationsScript />
          <PropertiesProvider>
            <FavoritesProvider>
              <CompareProvider>
                <ToastProvider>
                  <main>{children}</main>
                </ToastProvider>
              </CompareProvider>
            </FavoritesProvider>
          </PropertiesProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
