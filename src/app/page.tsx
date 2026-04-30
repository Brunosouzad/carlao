"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRight, Shield, Award, Handshake, Lightbulb, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProperties } from "@/store/PropertiesContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSiteSettings } from "@/store/SiteSettingsContext";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

function HomeContent() {
  const { properties } = useProperties();
  const { settings } = useSiteSettings();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  let filteredProperties = properties;
  if (query) {
    const qLower = query.toLowerCase();
    filteredProperties = properties.filter(p => 
      p.title.toLowerCase().includes(qLower) || 
      p.location.toLowerCase().includes(qLower) || 
      p.description?.toLowerCase().includes(qLower) ||
      (p.features && p.features.some(f => f.toLowerCase() === qLower)) ||
      (p.tag && p.tag.toLowerCase() === qLower) ||
      (p.type.toLowerCase() === qLower)
    );
    
    return (
      <>
        <Navbar />
        <div className="pt-36 pb-24 min-h-screen bg-slate-50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Resultados da Busca</h1>
                <p className="text-slate-500">Filtro ativo: <span className="font-bold text-secondary">{query}</span></p>
              </div>
              <Link href="/" className="btn-secondary px-6 py-2 rounded-xl text-primary font-bold hover:bg-slate-200 transition-colors">Limpar Filtro</Link>
            </div>
            
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xl text-slate-500 font-medium mb-4">Nenhum imóvel encontrado para essa característica.</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  const cols = settings.homeCardsPerRow || 4;
  const gridClass = cols === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
  const propertiesGroup1 = properties.filter(p => p.type === "Venda").slice(0, settings.homeMaxVenda || 4);
  const propertiesGroup2 = properties.filter(p => p.type === "Aluguel").slice(0, settings.homeMaxAluguel || 4);

  return (
    <>
      <Navbar />
      <Hero />
      
      <section id="imoveis" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">{settings.homeVendaSubtitle || "Imóveis para Venda"}</span>
              <h2 className="text-4xl font-bold text-primary">{settings.homeVendaTitle || "Melhores Oportunidades"}</h2>
            </div>
            <Link href="/venda" className="text-primary font-bold flex items-center gap-2 hover:text-secondary transition-colors group">
              Ver todos <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className={`grid ${gridClass} gap-8 mb-24`}>
            {propertiesGroup1.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">{settings.homeAluguelSubtitle || "Imóveis para Alugar"}</span>
              <h2 className="text-4xl font-bold text-primary">{settings.homeAluguelTitle || "Destaques de Locação"}</h2>
            </div>
            <Link href="/aluguel" className="text-primary font-bold flex items-center gap-2 hover:text-secondary transition-colors group">
              Ver todas as locações <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className={`grid ${gridClass} gap-8`}>
            {propertiesGroup2.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section — Premium */}
      <section id="empresa" className="py-28 overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-200/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            
            <div className="flex-1 relative w-full max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-square ring-1 ring-black/5">
                  <img 
                    src="/fachada-carlao.jpg" 
                    alt="Carlão Imóveis - Fachada" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">
                  Tradição e{" "}
                  <span className="relative inline-block">
                    <span className="text-secondary">Inovação</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none"><path d="M2 8c40-6 80-6 120-2s56 4 76-2" stroke="#E8913A" strokeWidth="3" strokeLinecap="round" opacity="0.4"/></svg>
                  </span>
                  <br />no Mercado Imobiliário
                </h2>

                <p className="text-slate-500 text-lg mb-4 leading-relaxed">
                  Com mais de 15 anos de atuação no mercado mineiro, a <strong className="text-primary">Carlão Imóveis</strong> consolidou-se como referência em segurança e transparência em negócios imobiliários.
                </p>
                <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                  Nossa missão é transformar a busca pelo imóvel ideal em uma experiêncian <strong className="text-primary">fluida, moderna e personalizada</strong> para cada cliente.
                </p>
                
                <div className="grid grid-cols-2 gap-px bg-slate-200/60 rounded-2xl overflow-hidden">
                  {[
                    { Icon: Handshake, title: "Compromisso", desc: "Transparência total em cada contrato e negociação." },
                    { Icon: Award,     title: "Excelência",  desc: "Equipe treinada para o melhor atendimento da região." },
                    { Icon: Shield,    title: "Segurança",   desc: "Processos jurídicos sólidos e confiáveis." },
                    { Icon: Lightbulb, title: "Inovação",    desc: "Tecnologia a serviço do mercado imobiliário." },
                  ].map(({ Icon, title, desc }, i) => (
                    <div key={i} className="bg-white p-6 flex flex-col group hover:bg-primary/[0.02] transition-colors">
                      <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-secondary/10 transition-colors">
                        <Icon size={20} strokeWidth={1.8} className="text-primary group-hover:text-secondary transition-colors" />
                      </div>
                      <h4 className="text-primary font-bold text-[15px] mb-1">{title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-24 bg-white">
        <div className="container mx-auto px-8 text-center mb-16">
          <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">O que fazemos</span>
          <h2 className="text-4xl font-bold text-primary">Soluções Imobiliárias <span className="text-secondary">Completas</span></h2>
        </div>
        
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-slate-200 rounded-3xl hover:border-secondary/30 hover:shadow-xl transition-all group shadow-sm bg-white">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <ArrowRight className="rotate-[-45deg]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Venda de Imóveis</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Avaliação criteriosa e marketing estratégico para vender seu imóvel pelo melhor valor de mercado.
              </p>
            </div>
            
            <div className="p-8 border border-slate-200 rounded-3xl hover:border-secondary/30 hover:shadow-xl transition-all group shadow-sm bg-white">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <ArrowRight className="rotate-[-45deg]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Locação & Gestão</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Segurança jurídica e administrativa para proprietários e facilidade para quem deseja alugar.
              </p>
            </div>
            
            <div className="p-8 border border-slate-200 rounded-3xl hover:border-secondary/30 hover:shadow-xl transition-all group shadow-sm bg-white">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-secondary group-hover:text-white transition-all">
                <ArrowRight className="rotate-[-45deg]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Consultoria Especializada</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Orientação estratégica para investidores que buscam rentabilidade e valorização em MG.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="localizacao" className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">Onde estamos</span>
              <h2 className="text-4xl font-bold text-primary">Nossas <span className="text-secondary">Unidades</span></h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Unidade Matriz */}
            <div className="glass-card p-8 border-slate-200 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left shadow-lg shadow-black/5 group hover:border-primary/30 transition-all">
              <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.6948374781723!2d-41.9426083!3d-18.8562318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xb1a70b9765658f%3A0x7dd69c9f71ebf77c!2sR.%20Mal.%20Floriano%2C%20600%20-%20Centro%2C%20Gov.%20Valadares%20-%20MG%2C%2035010-140!5e0!3m2!1spt-BR!2sbr"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="flex-1 flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest block mb-1">Unidade Matriz</span>
                  <h3 className="text-2xl font-bold text-primary mb-2 font-oswald uppercase">Governador Valadares</h3>
                  <p className="text-slate-500 text-xs font-medium mb-1">Rua Marechal Floriano, 600, Loja 05 - Centro</p>
                  <p className="text-slate-400 text-[10px] font-bold">Seg a Sex: 08:00 às 18:00</p>
                </div>

                <div className="space-y-3 mt-auto">
                  <a href="tel:+553332210552" className="flex items-center justify-center md:justify-start gap-2 text-primary hover:text-secondary transition-colors group/tel">
                    <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center group-hover/tel:bg-secondary/10">
                      <Phone size={14} className="group-hover/tel:text-secondary transition-colors" />
                    </div>
                    <span className="font-bold text-lg font-oswald tracking-tighter">(33) 3221-0552</span>
                  </a>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link 
                      href="https://wa.me/553332210552" 
                      target="_blank"
                      className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-green-500/10"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      Falar com Corretor
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Unidade Filial */}
            <div className="glass-card p-8 border-slate-200 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left shadow-lg shadow-black/5 group hover:border-primary/30 transition-all">
              <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3760.327180140302!2d-42.6219575!3d-19.527562100000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa554228869f4d1%3A0xc732a0909ae4ee39!2sR.%20Pedro%20Nolasco%2C%20510%20-%20Centro%2C%20Cel.%20Fabriciano%20-%20MG%2C%2035170-300!5e0!3m2!1spt-BR!2sbr"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="flex-1 flex flex-col h-full">
                <div className="mb-4">
                  <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest block mb-1">Unidade Filial</span>
                  <h3 className="text-2xl font-bold text-primary mb-2 font-oswald uppercase">Coronel Fabriciano</h3>
                  <p className="text-slate-500 text-xs font-medium mb-1">Rua Pedro Nolasco, 510 - Centro</p>
                  <p className="text-slate-400 text-[10px] font-bold">Seg a Sex: 08:00 às 18:00</p>
                </div>

                <div className="space-y-3 mt-auto">
                  <a href="tel:+553138421200" className="flex items-center justify-center md:justify-start gap-2 text-primary hover:text-secondary transition-colors group/tel">
                    <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center group-hover/tel:bg-secondary/10">
                      <Phone size={14} className="group-hover/tel:text-secondary transition-colors" />
                    </div>
                    <span className="font-bold text-lg font-oswald tracking-tighter">(31) 3842-1200</span>
                  </a>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link 
                      href="https://wa.me/553138421200" 
                      target="_blank"
                      className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md shadow-green-500/10"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      Falar com Corretor
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-100 border-y border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white border-l-8 border-secondary p-12 md:p-16 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl">
              <span className="text-secondary font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Atendimento Exclusivo</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight font-oswald uppercase">
                Pronto para encontrar seu <span className="text-secondary">próximo grande negócio?</span>
              </h2>
              <p className="text-slate-500 text-lg mb-0 max-w-2xl leading-relaxed">
                Nossa equipe está preparada para oferecer um atendimento personalizado, seguro e ágil. 
                Fale agora com um de nossos corretores especialistas.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <Link 
                href="https://wa.me/553332210552" 
                target="_blank"
                className="w-full sm:w-auto bg-primary hover:bg-black text-white flex items-center justify-center gap-3 px-10 py-5 font-bold transition-all uppercase tracking-widest text-sm"
              >
                <Phone size={18} />
                Falar com Corretor
              </Link>
              <Link 
                href="#imoveis"
                className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center gap-3 px-10 py-5 font-bold transition-all uppercase tracking-widest text-sm"
              >
                Ver Imóveis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-primary">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
