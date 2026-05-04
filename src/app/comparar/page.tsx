"use client";

import Navbar from "@/components/Navbar";
import { useProperties } from "@/store/PropertiesContext";
import { useCompare } from "@/store/CompareContext";
import { X, ArrowLeft, ArrowLeftRight, Check, BedDouble, Bath, Square, Car, Tag, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils/format";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { generateSlug } from "@/utils/slug";

export default function CompararPage() {
  const { properties } = useProperties();
  const { compareList, toggleCompare, clearCompare } = useCompare();

  const compareProperties = properties.filter(p => compareList.includes(p.id));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block font-oswald">Análise Lado a Lado</span>
              <h1 className="text-4xl md:text-5xl font-bold text-primary font-oswald uppercase leading-none">Comparar <span className="text-secondary">Imóveis</span></h1>
              <p className="text-slate-500 mt-4 max-w-xl">
                Compare as especificações técnicas e preços dos imóveis que você selecionou para tomar a melhor decisão.
              </p>
            </div>
            {compareProperties.length > 0 && (
              <button 
                onClick={clearCompare}
                className="text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors font-oswald"
              >
                <X size={16} /> Limpar Comparação
              </button>
            )}
          </div>

          {compareProperties.length > 0 ? (
            <div className="bg-white rounded-none shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="p-8 w-64 bg-slate-50/50">
                        <div className="flex items-center gap-3 text-primary font-oswald uppercase tracking-wider text-sm">
                          <ArrowLeftRight size={20} className="text-secondary" />
                          Características
                        </div>
                      </th>
                      {compareProperties.map(p => (
                        <th key={p.id} className="p-8 min-w-[300px] relative group">
                          <button 
                            onClick={() => toggleCompare(p.id)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <X size={20} />
                          </button>
                          <Link href={`/imovel/${generateSlug(p)}`} className="block">
                            <img src={p.image} alt={p.title} className="w-full h-48 object-cover rounded-none mb-4 group-hover:scale-[1.02] transition-transform" />
                            <h3 className="font-bold text-primary line-clamp-1 mb-2 font-oswald uppercase tracking-tight">{p.title}</h3>
                            <p className="text-accent-blue font-bold text-xl font-oswald tracking-tighter">{formatPrice(p.price)}</p>
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Código", key: "code", icon: <Tag size={16} /> },
                      { label: "Tipo", key: "type", icon: <Check size={16} /> },
                      { label: "Categoria", key: "category", icon: <Check size={16} /> },
                      { label: "Quartos", key: "beds", icon: <BedDouble size={16} /> },
                      { label: "Banheiros", key: "baths", icon: <Bath size={16} /> },
                      { label: "Vagas", key: "garages", icon: <Car size={16} /> },
                      { label: "Área (m²)", key: "area", icon: <Square size={16} /> },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                        <td className="p-6 bg-slate-50/30">
                          <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <span className="text-secondary/50">{row.icon}</span>
                            {row.label}
                          </div>
                        </td>
                        {compareProperties.map(p => (
                          <td key={p.id} className="p-6 text-primary font-bold">
                            {p[row.key as keyof typeof p]}
                            {row.key === 'area' && ' m²'}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Location row */}
                    <tr className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <td className="p-6 bg-slate-50/30">
                        <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                          <span className="text-secondary/50"><MapPin size={16} /></span>
                          Localização
                        </div>
                      </td>
                      {compareProperties.map(p => (
                        <td key={p.id} className="p-6 text-slate-600 text-xs font-medium leading-relaxed">
                          {p.location}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white rounded-none border border-slate-100 shadow-xl shadow-slate-200/50 max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-none flex items-center justify-center mx-auto mb-8">
                <ArrowLeftRight size={40} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-4 font-oswald uppercase">Nada para comparar</h2>
              <p className="text-slate-500 mb-10 max-w-md mx-auto px-6 leading-relaxed">
                Selecione até 4 imóveis clicando no ícone de comparação nos cartões para analisá-los lado a lado.
              </p>
              <Link 
                href="/venda" 
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-none font-bold hover:bg-slate-900 transition-all font-oswald uppercase tracking-widest text-sm"
              >
                Explorar Imóveis
                <ArrowLeft size={18} />
              </Link>
            </motion.div>
          )}

        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function MapPin({ size }: { size: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
}
