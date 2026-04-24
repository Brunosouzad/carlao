"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const PROPERTIES_GROUP_1 = [
  {
    id: "1",
    code: "CV-001",
    title: "Casa de Alto Padrão no Belvedere",
    location: "Belvedere, Governador Valadares - MG",
    price: "R$ 1.850.000",
    beds: 4,
    baths: 5,
    garages: 4,
    area: 320,
    type: "Venda",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop",
    tag: "Destaque"
  },
  {
    id: "2",
    code: "CV-002",
    title: "Apartamento Luxo Vila Bretas",
    location: "Vila Bretas, Governador Valadares - MG",
    price: "R$ 850.000",
    beds: 3,
    baths: 2,
    garages: 2,
    area: 110,
    type: "Venda",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    tag: "Novo"
  },
  {
    id: "4",
    code: "CV-003",
    title: "Mansão Lagoa Santa",
    location: "Lagoa Santa, Gov. Valadares - MG",
    price: "R$ 2.400.000",
    beds: 5,
    baths: 6,
    garages: 6,
    area: 450,
    type: "Venda",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    tag: "Exclusivo"
  },
  {
    id: "5",
    code: "CV-004",
    title: "Apto Garden Grã-Duquesa",
    location: "Grã-Duquesa, Gov. Valadares - MG",
    price: "R$ 680.000",
    beds: 3,
    baths: 2,
    garages: 2,
    area: 140,
    type: "Venda",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
    tag: "Oportunidade"
  }
];

const PROPERTIES_GROUP_2 = [
  {
    id: "3",
    code: "AL-001",
    title: "Cobertura Duplex Centro",
    location: "Centro, Coronel Fabriciano - MG",
    price: "R$ 4.500 /mês",
    beds: 3,
    baths: 3,
    garages: 2,
    area: 180,
    type: "Aluguel",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
    tag: "Destaque"
  },
  {
    id: "6",
    code: "AL-002",
    title: "Apto Moderno Melo Viana",
    location: "Melo Viana, Coronel Fabriciano - MG",
    price: "R$ 1.800 /mês",
    beds: 2,
    baths: 1,
    garages: 1,
    area: 75,
    type: "Aluguel",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop",
    tag: "Novo"
  },
  {
    id: "7",
    code: "AL-003",
    title: "Casa Ampla Caladinho",
    location: "Caladinho, Coronel Fabriciano - MG",
    price: "R$ 2.800 /mês",
    beds: 3,
    baths: 2,
    garages: 2,
    area: 200,
    type: "Aluguel",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=800&auto=format&fit=crop",
    tag: "Familiar"
  },
  {
    id: "8",
    code: "AL-004",
    title: "Sala Comercial Centro",
    location: "Centro, Gov. Valadares - MG",
    price: "R$ 1.200 /mês",
    beds: 0,
    baths: 1,
    garages: 1,
    area: 45,
    type: "Aluguel",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    tag: "Comercial"
  }
];

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      
      <section id="imoveis" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">Imóveis para Venda</span>
              <h2 className="text-4xl font-bold text-primary">Melhores <span className="text-secondary">Oportunidades</span></h2>
            </div>
            <Link href="/venda" className="text-primary font-bold flex items-center gap-2 hover:text-secondary transition-colors group">
              Ver todos <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {PROPERTIES_GROUP_1.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">Imóveis para Alugar</span>
              <h2 className="text-4xl font-bold text-primary">Destaques de <span className="text-secondary">Locação</span></h2>
            </div>
            <Link href="/aluguel" className="text-primary font-bold flex items-center gap-2 hover:text-secondary transition-colors group">
              Ver todas as locações <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROPERTIES_GROUP_2.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="empresa" className="py-24 overflow-hidden relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden shadow-2xl z-10 aspect-[4/3]"
              >
                <img 
                  src="https://www.carlaoimoveismg.com.br/ckfinder/userfiles/images/carlao-03.jpeg" 
                  alt="Nossa História - Carlão Imóveis" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] -z-10" />
            </div>
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">Nossa História</span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">Carlão Imóveis: Tradição e <span className="text-secondary">Inovação</span></h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Com mais de 15 anos de atuação no mercado mineiro, a Carlão Imóveis consolidou-se como referência em 
                  segurança e transparência em negócios imobiliários. 
                </p>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                  Nossa missão é transformar a busca pelo imóvel ideal em uma experiéncia fluida, moderna e 
                  totalmente personalizada para cada cliente.
                </p>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-primary font-bold text-lg mb-2">Compromisso</h4>
                    <p className="text-slate-500 text-sm">Transparência total em cada contrato e negociação.</p>
                  </div>
                  <div>
                    <h4 className="text-primary font-bold text-lg mb-2">Excelência</h4>
                    <p className="text-slate-500 text-sm">Equipe treinada para o melhor atendimento da região.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center mb-16">
          <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">O que fazemos</span>
          <h2 className="text-4xl font-bold text-primary">Soluções Imobiliárias <span className="text-secondary">Completas</span></h2>
        </div>
        
        <div className="container mx-auto px-6">
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

      {/* Locations Section */}
      <section id="localizacao" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">Onde estamos</span>
              <h2 className="text-4xl font-bold text-primary">Nossas <span className="text-secondary">Unidades</span></h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 border-slate-200 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left shadow-lg shadow-black/5">
              <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden shrink-0 border border-slate-100">
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
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Governador Valadares</h3>
                <p className="text-slate-500 text-sm mb-4 font-medium">Rua Marechal Floriano, 600, Loja 05 - Centro</p>
                <div className="flex flex-col items-center md:items-start gap-2">
                  <span className="text-accent-blue font-bold text-lg">(33) 3221-0552</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Unidade Matriz</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-8 border-slate-200 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left shadow-lg shadow-black/5">
              <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden shrink-0 border border-slate-100">
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
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Coronel Fabriciano</h3>
                <p className="text-slate-500 text-sm mb-4 font-medium">Rua Pedro Nolasco, 510 - Centro</p>
                <div className="flex flex-col items-center md:items-start gap-2">
                  <span className="text-accent-blue font-bold text-lg">(31) 3842-1200</span>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Unidade Filial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">Vamos conversar?</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">Pronto para encontrar seu <span className="text-secondary">próximo lar?</span></h2>
              <p className="text-slate-500 text-lg mb-10 max-w-xl leading-relaxed">
                Nossa equipe está preparada para oferecer um atendimento personalizado e seguro. 
                Entre em contato e agende uma visita aos melhores imóveis da região.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="https://wa.me/553332210552" 
                  target="_blank"
                  className="btn-primary flex items-center gap-3 px-8 py-4 rounded-xl"
                >
                  Falar no WhatsApp
                  <ArrowRight size={20} />
                </Link>
                <button className="btn-secondary px-8 py-4 rounded-xl border-primary text-primary hover:bg-primary hover:text-white transition-all">
                  Ver Localização
                </button>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <h4 className="text-4xl font-bold text-primary mb-1">98%</h4>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Satisfação</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <h4 className="text-4xl font-bold text-secondary mb-1">50M+</h4>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Vendas</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <h4 className="text-4xl font-bold text-primary mb-1">15+</h4>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Anos</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <h4 className="text-4xl font-bold text-secondary mb-1">24h</h4>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Suporte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="contato" className="py-24 bg-[#5F5F5F] text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16">
            <div className="space-y-8">
              <div className="bg-white/10 p-4 rounded-2xl w-fit">
                <img 
                  src="https://www.carlaoimoveismg.com.br/admin/images_logo/20200122115611.png" 
                  alt="Carlão Imóveis" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-white text-sm leading-relaxed max-w-xs">
                Sua parceira de confiança em negócios imobiliários em Minas Gerais desde 2011. Excelência, tradição e os melhores imóveis da região.
              </p>
            </div>
            
            <div>
              <h4 className="text-secondary font-bold mb-8 uppercase text-xs tracking-widest">Navegação</h4>
              <ul className="space-y-4">
                <li><Link href="#inicio" className="text-white hover:text-secondary transition-colors text-sm font-medium">Início</Link></li>
                <li><Link href="#empresa" className="text-white hover:text-secondary transition-colors text-sm font-medium">A Empresa</Link></li>
                <li><Link href="#servicos" className="text-white hover:text-secondary transition-colors text-sm font-medium">Nossos Serviços</Link></li>
                <li><Link href="#imoveis" className="text-white hover:text-secondary transition-colors text-sm font-medium">Busca de Imóveis</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-secondary font-bold mb-8 uppercase text-xs tracking-widest">Fale Conosco</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white text-sm">
                  <span className="text-secondary font-bold">GV:</span> (33) 3221-0552
                </li>
                <li className="flex items-center gap-3 text-white text-sm">
                  <span className="text-secondary font-bold">CF:</span> (31) 3842-1200
                </li>
                <li className="flex items-center gap-3 text-white text-sm">
                  contato@carlaoimoveismg.com.br
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-secondary font-bold mb-6 uppercase text-xs tracking-widest">Siga-nos</h4>
              <div className="flex gap-4">
                <Link 
                  href="https://facebook.com/carlaoimoveismg" 
                  target="_blank"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </Link>
                <Link 
                  href="https://instagram.com/carlaoimoveismg" 
                  target="_blank"
                  className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col md:row justify-between items-center gap-6">
            <p className="text-white text-[10px] uppercase tracking-[0.2em] font-bold">
              © 2026 Carlão Imóveis MG. CRECI J-4123.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-white hover:text-secondary text-[10px] uppercase tracking-widest font-bold">Privacidade</Link>
              <Link href="#" className="text-white hover:text-secondary text-[10px] uppercase tracking-widest font-bold">Termos</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <Link 
        href="https://wa.me/553332210552" 
        target="_blank"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </Link>
    </>
  );
}
