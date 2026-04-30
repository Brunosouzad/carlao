"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/store/PropertiesContext";
import { useFavorites } from "@/store/FavoritesContext";
import { Heart, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function FavoritosPage() {
  const { properties } = useProperties();
  const { favorites } = useFavorites();

  const favoritedProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="container mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block font-oswald">Sua Lista Particular</span>
              <h1 className="text-4xl md:text-5xl font-bold text-primary font-oswald uppercase leading-none">Imóveis <span className="text-secondary">Favoritos</span></h1>
              <p className="text-slate-500 mt-4 max-w-xl">
                Estes são os imóveis que você marcou com um coração. Eles ficam salvos aqui para facilitar sua decisão final.
              </p>
            </div>
            {favoritedProperties.length > 0 && (
              <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                  <Heart size={20} className="fill-current" />
                </div>
                <div>
                  <p className="text-primary font-bold leading-none">{favoritedProperties.length}</p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Salvos</p>
                </div>
              </div>
            )}
          </div>

          {/* Grid */}
          {favoritedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favoritedProperties.map(property => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart size={40} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-4 font-oswald uppercase">Sua lista está vazia</h2>
              <p className="text-slate-500 mb-10 max-w-md mx-auto px-6 leading-relaxed">
                Você ainda não favoritou nenhum imóvel. Explore nossas opções e clique no coração para salvar seus preferidos aqui.
              </p>
              <Link 
                href="/venda" 
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-900 transition-all font-oswald uppercase tracking-widest text-sm"
              >
                Explorar Imóveis
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          )}

          {/* Tips Section */}
          {favoritedProperties.length > 0 && (
            <div className="mt-20 p-8 md:p-12 bg-primary rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-oswald uppercase tracking-tight">Dúvida entre as opções?</h3>
                  <p className="text-slate-300 leading-relaxed">Nossos consultores podem te ajudar a comparar os detalhes técnicos e as vantagens de cada um desses imóveis favoritados.</p>
                </div>
                <Link 
                  href="https://wa.me/553332210552" 
                  target="_blank"
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all font-oswald uppercase tracking-widest whitespace-nowrap"
                >
                  Falar com Especialista
                </Link>
              </div>
              <Heart size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
