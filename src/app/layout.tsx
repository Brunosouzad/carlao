import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Carlão Imóveis | Imobiliária em Minas Gerais",
  description: "Encontre os melhores imóveis em Minas Gerais com o corretor Carlão. Casas, apartamentos, lotes e fazendas com atendimento personalizado.",
  keywords: "imobiliária, corretor de imóveis, minas gerais, carlão imóveis, casas à venda, apartamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <main>{children}</main>
      </body>
    </html>
  );
}
