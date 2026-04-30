"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-[2.5rem] font-medium text-[#AD0014] font-sans mb-2">A empresa</h1>
            <div className="w-full h-[1px] bg-slate-100"></div>
          </div>

          {/* Text Content */}
          <div className="space-y-6 text-[15px] text-[#4C4D4F] leading-relaxed font-sans max-w-5xl">
            <p>
              <strong className="font-bold">Carlão Imóveis</strong>, proporciona a seus clientes bons negócios, com tranquilidade e garantia, resultantes da experiência e credibilidade.
            </p>
            <p>
              Presente em duas regiões para melhor lhe atender, Carlão Imóveis, possui consultores, profissionais competentes no Mercado Imobiliário, que direcionam o seu trabalho visando a venda ou locação do seu imóvel, como se ele fosse único, permitindo rápida aproximação entre as condições pretendidas por quem oferece e por quem procura.
            </p>
            <p>
              Carlão Imóveis, somam-se a experiência e a modernidade, na busca permanente dos melhores negócios para os seus clientes.
            </p>
            <p>
              Construa um novo momento, com credibilidade, modernidade e segurança.
            </p>
          </div>

          {/* Image */}
          <div className="mt-12">
            <img 
              src="/fachada-carlao.jpg" 
              alt="Fachada Carlão Imóveis" 
              className="w-full h-auto rounded-sm shadow-sm"
            />
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
