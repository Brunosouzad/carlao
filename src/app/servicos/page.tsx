"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Key, ShieldCheck } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-8 overflow-hidden bg-gradient-to-b from-white to-[#fcfcfc]">
        <div className="hidden md:block absolute top-0 right-0 w-[30rem] h-[30rem] bg-secondary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Especialistas em Imóveis</span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-oswald uppercase tracking-tight">
              Nossos <span className="text-secondary">Serviços</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-0">
              A <strong className="text-primary font-bold">Carlão Imóveis</strong> conta com uma equipe de profissionais especializados, preparada para oferecer assessoria completa e segura em todas as etapas de venda e locação de imóveis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="pb-12 md:pb-16 pt-4 md:pt-8">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Venda */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <Home className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-primary font-oswald uppercase">Venda de Imóveis</h2>
            </div>
            
            <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 px-4 md:px-0 -mx-4 md:mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow shrink-0 w-[85%] sm:w-[400px] md:w-auto snap-center">
                <h3 className="text-xl font-bold text-secondary mb-4 font-oswald uppercase tracking-wide">Para Proprietários</h3>
                <p className="text-slate-500 mb-6">Oferecemos um atendimento estratégico para garantir rapidez e segurança na venda do seu imóvel:</p>
                <ul className="space-y-4">
                  {[
                    "Carteira ativa de compradores já cadastrados",
                    "Avaliação precisa e imediata do imóvel",
                    "Divulgação eficiente com placas, faixas e no site, com fotos profissionais",
                    "Assessoria jurídica completa durante todo o processo"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="text-secondary shrink-0 mt-0.5" size={18} />
                      <span className="text-slate-600 text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow shrink-0 w-[85%] sm:w-[400px] md:w-auto snap-center">
                <h3 className="text-xl font-bold text-secondary mb-4 font-oswald uppercase tracking-wide">Para Compradores</h3>
                <p className="text-slate-500 mb-6">Proporcionamos tranquilidade e segurança na realização do seu investimento:</p>
                <ul className="space-y-4">
                  {[
                    "Imóveis com documentação regularizada para transferência de escritura",
                    "Consulta prática e rápida pelo site, com fotos e informações detalhadas",
                    "Assessoria em financiamento e cartas de crédito, com suporte especializado, inclusive junto à Caixa Econômica Federal"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="text-secondary shrink-0 mt-0.5" size={18} />
                      <span className="text-slate-600 text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Locação */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <Key className="text-primary" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-primary font-oswald uppercase">Locação de Imóveis</h2>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow max-w-4xl mx-4 md:mx-0">
              <h3 className="text-xl font-bold text-secondary mb-4 font-oswald uppercase tracking-wide">Para Proprietários e Inquilinos</h3>
              <p className="text-slate-500 mb-6">Atendimento completo para uma locação segura e sem dor de cabeça:</p>
              <ul className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  "Avaliação e vistoria detalhada do imóvel na entrada e na devolução",
                  "Análise criteriosa de cadastro de inquilinos e fiadores",
                  "Divulgação eficiente com placas, faixas e no site com fotos",
                  "Elaboração de contrato sem custos adicionais",
                  "Assessoria jurídica ao proprietário, incluindo cobranças extrajudiciais e medidas judiciais quando necessário"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="text-secondary shrink-0 mt-0.5" size={18} />
                    <span className="text-slate-600 text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Compromisso */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary/5 p-8 md:p-12 rounded-[2rem] border border-primary/10 flex flex-col md:flex-row items-center gap-6 md:gap-8 mx-4 md:mx-0"
          >
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="text-primary" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4 font-oswald uppercase">Compromisso Carlão Imóveis</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                No Carlão Imóveis, cada cliente é atendido com seriedade, transparência e dedicação.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Nosso objetivo é facilitar negociações, reduzir riscos e garantir resultados seguros, sempre com excelência no atendimento.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
