"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[85vh] lg:h-[85vh] flex flex-col justify-end pt-32 lg:pt-24 overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-20 lg:pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Encontre o seu <span className="text-secondary">imóvel ideal</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl drop-shadow-md">
              Mais de 15 anos de tradição em Governador Valadares e região. 
              Sua segurança é nossa prioridade.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Finalidade</label>
                <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-secondary outline-none appearance-none cursor-pointer">
                  <option>Venda</option>
                  <option>Aluguel</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Tipo</label>
                <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-secondary outline-none appearance-none cursor-pointer">
                  <option>Todos os tipos</option>
                  <option>Casa</option>
                  <option>Apartamento</option>
                  <option>Lote</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Cidade</label>
                <input 
                  type="text" 
                  placeholder="Ex: Valadares"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Bairro</label>
                <input 
                  type="text" 
                  placeholder="Ex: Belvedere"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Valor Máximo</label>
                <input 
                  type="text" 
                  placeholder="R$ 0,00"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>

              <div className="flex flex-col justify-end">
                <button className="btn-primary w-full h-12 flex items-center justify-center gap-2">
                  <Search size={20} />
                  <span className="font-bold">BUSCAR</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                <Search size={12} /> Busca por código
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="cursor-pointer hover:text-primary transition-colors">Mais Filtros</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
