"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Shield, Award, Handshake, Lightbulb } from "lucide-react";

const images = [
  "/WhatsApp Image 2026-04-30 at 16.28.00 (1).jpeg",
  "/WhatsApp Image 2026-04-30 at 16.28.01.jpeg",
  "/WhatsApp Image 2026-04-30 at 16.28.02.jpeg",
  "/WhatsApp Image 2026-04-30 at 16.31.10.jpeg",
  "/WhatsApp Image 2026-04-30 at 16.31.11.jpeg",
  "/WhatsApp Image 2026-04-30 at 16.31.12.jpeg"
];

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-28 md:pt-40 pb-12 md:pb-20 overflow-hidden bg-gradient-to-b from-white to-[#fcfcfc]">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-secondary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Nossa História</span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-oswald uppercase tracking-tight">
              A Sua Parceira de Confiança em <span className="text-secondary">Negócios Imobiliários</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-0">
              A <strong>Carlão Imóveis</strong> soma experiência e modernidade na busca permanente dos melhores negócios para você. Presentes em duas regiões para garantir um atendimento de excelência.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-primary mb-6 font-oswald uppercase">Construindo um Novo Momento</h2>
              <div className="space-y-6 text-slate-500 leading-relaxed text-[15px]">
                <p>
                  <strong className="text-primary font-bold">Carlão Imóveis</strong> é uma empresa consolidada no mercado imobiliário, reconhecida pela seriedade, transparência e credibilidade na condução de negócios.
                </p>
                <p>
                  Com atuação estratégica em duas regiões, oferece aos seus clientes um atendimento qualificado e personalizado, por meio de uma equipe de consultores experientes e devidamente capacitados, aptos a compreender as necessidades específicas de cada cliente e de cada imóvel.
                </p>
                <p>
                  A empresa tem como missão intermediar negociações com segurança jurídica, agilidade e eficiência, promovendo a perfeita convergência entre as expectativas de quem deseja vender ou locar e daqueles que buscam adquirir ou alugar um imóvel.
                </p>
                <p className="font-medium text-primary bg-primary/5 p-5 rounded-2xl border border-primary/10">
                  Comprometida com a excelência, a Carlão Imóveis trata cada negociação com responsabilidade e profissionalismo, assegurando tranquilidade em todas as etapas do processo.
                </p>
              </div>
            </motion.div>

            {/* Carousel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-slate-100 group ring-1 ring-black/5"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt="Instalações Carlão Imóveis"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              {/* Navigation Controls */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-secondary' : 'w-1.5 bg-white/50 hover:bg-white'}`}
                  />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary font-oswald uppercase">Nossos Pilares</h2>
          </div>
          
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 px-4 md:px-0 -mx-4 md:mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { Icon: Handshake, title: "Compromisso", desc: "Transparência total em cada contrato e negociação." },
              { Icon: Award,     title: "Excelência",  desc: "Equipe treinada para o melhor atendimento da região." },
              { Icon: Shield,    title: "Segurança",   desc: "Processos jurídicos sólidos e totalmente confiáveis." },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 transition-all group shrink-0 w-[85%] sm:w-[300px] md:w-auto snap-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Icon size={24} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-primary font-bold text-lg mb-3 font-oswald uppercase tracking-tight">{title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
