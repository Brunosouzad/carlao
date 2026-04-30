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
  title: "Carlão Imóveis | Imobiliária em Minas Gerais",
  description: "Encontre os melhores imóveis em Minas Gerais com o corretor Carlão. Casas, apartamentos, lotes e fazendas com atendimento personalizado.",
  keywords: "imobiliária, corretor de imóveis, minas gerais, carlão imóveis, casas à venda, apartamentos",
  icons: {
    icon: "/logo-carlao.png",
    apple: "/logo-carlao.png",
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
