"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/store/FavoritesContext";
import { useCompare } from "@/store/CompareContext";
import { Phone, Menu, X, Heart, ArrowLeftRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const { compareList } = useCompare();

  // Close mobile menu when scrolling down to prevent it staying open randomly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY > 100) setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[94%] lg:w-[95%] max-w-7xl z-50 flex justify-center"
    >
      <div className="max-w-7xl w-full bg-white lg:bg-white/90 lg:backdrop-blur-md rounded-2xl shadow-xl px-4 lg:px-8 py-5 lg:py-4 flex items-center justify-between border border-black/5">
        <div className="flex-none w-auto lg:w-[280px] flex justify-start">
          <Link href="/" className="flex items-center group shrink-0">
            <div className="group-hover:scale-105 transition-transform origin-left">
              {/* Mobile logo - visível apenas abaixo de lg */}
              <img 
                src="/logo-carlao.png" 
                alt="Carlão Imóveis Logo" 
                className="block lg:hidden h-10 w-auto"
              />
              {/* Desktop logo - visível apenas em lg+ (original intocado) */}
              <img 
                src="/logo-carlao.png" 
                alt="Carlão Imóveis Logo" 
                className="hidden lg:block h-24 lg:h-26 w-auto scale-[1.6] lg:scale-[1.8] origin-left"
              />
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-primary/70 font-oswald mr-8">
          {[
            { name: "Home", href: "/" },
            { name: "A Empresa", href: "/a-empresa" },
            { name: "Serviços", href: "/servicos" },
            { name: "Anuncie seu Imóvel", href: "/administrar" },
            { name: "Venda", href: "/venda" },
            { name: "Aluguel", href: "/aluguel" },
            { name: "Contato", href: "/contato" },
          ].map((item) => (
            <Link key={item.name} href={item.href} className="relative py-1 hover:text-secondary transition-colors group/link whitespace-nowrap">
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover/link:w-full transition-all duration-300"></span>
            </Link>
          ))}
          
          <Link href="/favoritos" className="relative py-1 flex items-center gap-1 hover:text-secondary transition-colors group/link whitespace-nowrap">
            Favoritos
            {favorites.length > 0 && (
              <span className="flex items-center justify-center bg-secondary text-white text-[8px] w-4 h-4 rounded-full font-bold">
                {favorites.length}
              </span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover/link:w-full transition-all duration-300"></span>
          </Link>

          <Link href="/comparar" className="relative py-1 flex items-center gap-1 hover:text-secondary transition-colors group/link whitespace-nowrap">
            Comparar
            {compareList.length > 0 && (
              <span className="flex items-center justify-center bg-primary text-white text-[8px] w-4 h-4 rounded-full font-bold">
                {compareList.length}
              </span>
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover/link:w-full transition-all duration-300"></span>
          </Link>

          <Link href="/procura" className="relative py-1 hover:text-[#B30F1A] transition-colors text-[#B30F1A] group/link">
            O que procura?
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B30F1A] group-hover/link:w-full transition-all duration-300"></span>
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="lg:hidden flex items-center gap-3">
            <Link 
              href="/favoritos"
              className="relative p-2 text-primary hover:text-secondary transition-colors"
            >
              <Heart size={20} className={favorites.length > 0 ? "fill-secondary text-secondary" : ""} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center bg-secondary text-white text-[8px] w-3.5 h-3.5 rounded-full font-bold border border-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link 
              href="/comparar"
              className="relative p-2 text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeftRight size={20} className={compareList.length > 0 ? "text-primary font-bold" : ""} />
              {compareList.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center bg-primary text-white text-[8px] w-3.5 h-3.5 rounded-full font-bold border border-white">
                  {compareList.length}
                </span>
              )}
            </Link>
          </div>
          
          <Link 
            href="https://wa.me/553384136800" 
            target="_blank"
            className="bg-secondary hover:bg-secondary/90 text-white py-3 px-8 rounded-full text-[10px] font-bold tracking-widest hidden sm:flex items-center gap-2 shadow-lg shadow-secondary/20 transition-all active:scale-95"
          >
            <Phone size={14} strokeWidth={3} />
            ATENDIMENTO
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-primary hover:text-secondary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white rounded-2xl shadow-xl border border-black/5 p-5 flex flex-col gap-4 lg:hidden"
          >
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-primary/80">
               <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">Home</Link>
              <Link href="/a-empresa" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">A Empresa</Link>
              <Link href="/servicos" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">Serviços</Link>
              <Link href="/administrar" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">Anuncie seu Imóvel</Link>
              <Link href="/venda" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">Venda</Link>
              <Link href="/aluguel" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">Aluguel</Link>
              <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">Contato</Link>
              <Link href="/favoritos" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">Favoritos ({favorites.length})</Link>
              <Link href="/comparar" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors py-2 border-b border-slate-50">Comparar ({compareList.length})</Link>
              <Link href="/procura" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#B30F1A] transition-colors py-2 text-[#B30F1A]">O que procura?</Link>
            </div>
            
            <Link 
              href="https://wa.me/553384136800" 
              target="_blank"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn-primary py-3 mt-2 w-full flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              Atendimento via WhatsApp
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
