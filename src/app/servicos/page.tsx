"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-[2.5rem] font-medium text-[#AD0014] font-sans mb-2 uppercase tracking-tight">Nossos Serviços</h1>
            <div className="w-full h-[1px] bg-slate-100"></div>
          </div>

          {/* Intro */}
          <div className="mb-12 text-[15px] text-[#4C4D4F] leading-relaxed font-sans max-w-5xl">
            <p>
              <strong className="font-bold">Carlão Imóveis</strong> conta com uma equipe de profissionais especializados, preparada para oferecer assessoria completa e segura em todas as etapas de venda e locação de imóveis.
            </p>
          </div>

          <div className="space-y-16">
            {/* Venda Section */}
            <section>
              <h2 className="text-2xl font-bold text-[#4C4D4F] mb-8 border-b border-slate-50 pb-2 uppercase tracking-wide">Venda de Imóveis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-lg font-bold text-[#AD0014] mb-4">Para Proprietários</h3>
                  <p className="text-[15px] text-[#4C4D4F] mb-4">Oferecemos um atendimento estratégico para garantir rapidez e segurança na venda do seu imóvel:</p>
                  <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#4C4D4F]">
                    <li>Carteira ativa de compradores já cadastrados</li>
                    <li>Avaliação precisa e imediata do imóvel</li>
                    <li>Divulgação eficiente com placas, faixas e no site, com fotos profissionais</li>
                    <li>Assessoria jurídica completa durante todo o processo</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#AD0014] mb-4">Para Compradores</h3>
                  <p className="text-[15px] text-[#4C4D4F] mb-4">Proporcionamos tranquilidade e segurança na realização do seu investimento:</p>
                  <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#4C4D4F]">
                    <li>Imóveis com documentação regularizada para transferência de escritura</li>
                    <li>Consulta prática e rápida pelo site, com fotos e informações detalhadas</li>
                    <li>Assessoria em financiamento e cartas de crédito, com suporte especializado, inclusive junto à Caixa Econômica Federal</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Locação Section */}
            <section>
              <h2 className="text-2xl font-bold text-[#4C4D4F] mb-8 border-b border-slate-50 pb-2 uppercase tracking-wide">Locação de Imóveis</h2>
              
              <div>
                <h3 className="text-lg font-bold text-[#AD0014] mb-4">Para Proprietários e Inquilinos</h3>
                <p className="text-[15px] text-[#4C4D4F] mb-4">Atendimento completo para uma locação segura e sem dor de cabeça:</p>
                <ul className="list-disc pl-5 space-y-2 text-[15px] text-[#4C4D4F] max-w-3xl">
                  <li>Avaliação e vistoria detalhada do imóvel na entrada e na devolução</li>
                  <li>Análise criteriosa de cadastro de inquilinos e fiadores</li>
                  <li>Divulgação eficiente com placas, faixas e no site com fotos</li>
                  <li>Elaboração de contrato sem custos adicionais</li>
                  <li>Assessoria jurídica ao proprietário, incluindo cobranças extrajudiciais e medidas judiciais quando necessário</li>
                </ul>
              </div>
            </section>

            {/* Compromisso Section */}
            <section className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <h2 className="text-xl font-bold text-[#AD0014] mb-4 uppercase tracking-wide">Compromisso Carlão Imóveis</h2>
              <div className="space-y-4 text-[15px] text-[#4C4D4F] leading-relaxed">
                <p>
                  No Carlão Imóveis, cada cliente é atendido com seriedade, transparência e dedicação.
                </p>
                <p>
                  Nosso objetivo é facilitar negociações, reduzir riscos e garantir resultados seguros, sempre com excelência no atendimento.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
