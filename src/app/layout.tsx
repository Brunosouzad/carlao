import type { Metadata } from "next";
import { Outfit, Inter, Oswald } from "next/font/google";
import "./globals.css";
import { PropertiesProvider } from "@/store/PropertiesContext";
import { SiteSettingsProvider } from "@/store/SiteSettingsContext";
import { FavoritesProvider } from "@/store/FavoritesContext";
import { CompareProvider } from "@/store/CompareContext";

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
  title: "Carlão Imóveis | A sua Imobiliária de confiança em Minas Gerais",
  description: "Encontre os melhores imóveis em Minas Gerais com o corretor Carlão. Casas, apartamentos, lotes e fazendas com atendimento personalizado e excelência.",
  keywords: "imobiliária, corretor de imóveis, minas gerais, carlão imóveis, casas à venda, apartamentos, aluguel, Governador Valadares, Coronel Fabriciano",
  openGraph: {
    title: 'Carlão Imóveis | Imobiliária em Minas Gerais',
    description: 'A sua parceira de confiança em negócios imobiliários. Casas, apartamentos, fazendas e lotes em Governador Valadares e região.',
    url: 'https://www.carlaoimoveismg.com.br',
    siteName: 'Carlão Imóveis',
    images: [
      {
        url: '/logo-carlao.png',
        width: 1200,
        height: 630,
        alt: 'Carlão Imóveis Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carlão Imóveis | Imobiliária em Minas Gerais',
    description: 'A sua parceira de confiança em negócios imobiliários.',
    images: ['/logo-carlao.png'],
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
    icon: "/favicon.png",
    apple: "/favicon.png",
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
                  "description": "Sua parceira de confiança em negócios imobiliários em Minas Gerais desde 2011.",
                  "@id": "https://www.carlaoimoveismg.com.br",
                  "url": "https://www.carlaoimoveismg.com.br",
                  "telephone": "+5531988956224",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "R. Nádia, 134 - Loja 1",
                    "addressLocality": "Pte. Preta, Queimados",
                    "addressRegion": "RJ",
                    "postalCode": "26311-420",
                    "addressCountry": "BR"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.carlaoimoveismg.com.br/#website",
                  "url": "https://www.carlaoimoveismg.com.br",
                  "name": "Carlão Imóveis",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.carlaoimoveismg.com.br/pesquisa?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
        <SiteSettingsProvider>
          <PropertiesProvider>
            <FavoritesProvider>
              <CompareProvider>
                <main>{children}</main>
              </CompareProvider>
            </FavoritesProvider>
          </PropertiesProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
