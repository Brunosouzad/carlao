"use client";

import { motion } from "framer-motion";
import { BedDouble, Bath, Square, MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface PropertyCardProps {
  id: string;
  code: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  garages: number;
  area: number;
  image: string;
  type: "Venda" | "Aluguel";
  tag?: string;
}

export default function PropertyCard({ id, code, title, location, price, beds, baths, garages, area, image, type, tag }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 lg:backdrop-blur-md lg:bg-white/70 hover:border-amber-500/30 transition-all duration-500 shadow-sm"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent opacity-80" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase rounded-lg shadow-lg">
            {type}
          </div>
          {tag && (
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-lg border border-white/10">
              {tag}
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 px-2 py-1 bg-slate-950/60 backdrop-blur-md text-slate-300 text-[9px] font-mono rounded border border-white/5">
          CÓD: {code}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <p className="text-accent-blue font-bold text-2xl tracking-tighter drop-shadow-md">{price}</p>
          </div>
          <Link 
            href={`/imoveis/${id}`}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-amber-500 hover:text-slate-950 transition-all shadow-xl group-hover:translate-y-0"
          >
            <ArrowUpRight size={24} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin size={14} className="text-secondary" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{location}</p>
        </div>
        <h3 className="text-lg font-bold text-primary mb-6 group-hover:text-secondary transition-colors line-clamp-1 leading-tight">
          {title}
        </h3>

      </div>
      <div className="bg-slate-50 px-6 py-4 grid grid-cols-4 gap-2 border-t border-slate-100">
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <BedDouble size={18} className="text-slate-400" />
          <span className="text-[9px] font-bold uppercase tracking-tighter">{beds} Qtos</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <Bath size={18} className="text-slate-400" />
          <span className="text-[9px] font-bold uppercase tracking-tighter">{baths} Banh</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
            <rect x="1" y="3" width="22" height="18" rx="2" ry="2"></rect>
            <path d="M7 21v-4"></path>
            <path d="M17 21v-4"></path>
            <path d="M1 8h22"></path>
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-tighter">{garages} Vagas</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-500">
          <Square size={16} className="text-slate-400" />
          <span className="text-[9px] font-bold uppercase tracking-tighter">{area} m²</span>
        </div>
      </div>
    </motion.div>
  );
}
