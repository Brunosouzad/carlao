"use client";

import { motion } from "framer-motion";
import { Home, Search, Phone, Menu } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 flex justify-center"
    >
      <div className="max-w-7xl w-full bg-white lg:bg-white/90 lg:backdrop-blur-md rounded-2xl shadow-xl px-4 lg:px-8 py-3 flex items-center justify-between border border-black/5">
        <Link href="/" className="flex items-center group shrink-0">
          <div className="bg-[#5F5F5F] px-4 lg:px-8 py-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
            <img 
              src="https://www.carlaoimoveismg.com.br/admin/images_logo/20200122115611.png" 
              alt="Carlão Imóveis Logo" 
              className="h-8 lg:h-10 w-auto"
            />
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-5 text-[11px] font-bold uppercase tracking-wider text-primary/70">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <Link href="#empresa" className="hover:text-secondary transition-colors">A Empresa</Link>
          <Link href="#servicos" className="hover:text-secondary transition-colors">Serviços</Link>
          <Link href="/imoveis" className="hover:text-secondary transition-colors">Imóveis</Link>
          <Link href="#" className="hover:text-secondary transition-colors">Administrar</Link>
          <Link href="#servicos" className="hover:text-secondary transition-colors">Procura?</Link>
          <Link href="#contato" className="hover:text-secondary transition-colors">Ligamos</Link>
          <Link href="#localizacao" className="hover:text-secondary transition-colors">Localização</Link>
          <Link href="#contato" className="hover:text-secondary transition-colors">Contato</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 lg:hidden text-primary hover:text-secondary transition-colors">
            <Menu size={24} />
          </button>
          <Link 
            href="https://wa.me/553332210552" 
            target="_blank"
            className="btn-primary py-2 px-5 text-xs hidden sm:flex items-center gap-2"
          >
            <Phone size={16} />
            ATENDIMENTO
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
