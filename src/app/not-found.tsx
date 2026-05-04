"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 pt-32">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary opacity-10 font-oswald">404</h1>
            <div className="relative -mt-16">
              <h2 className="text-3xl font-bold text-primary font-oswald uppercase tracking-tight mb-4">Página não encontrada</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                O endereço que você tentou acessar não existe ou o imóvel foi removido de nossa base.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-primary text-white px-8 py-4 rounded-none font-bold flex items-center justify-center gap-3 hover:bg-slate-900 transition-all font-oswald uppercase tracking-widest text-sm"
            >
              <Home size={18} />
              Ir para Início
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-none font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-oswald uppercase tracking-widest text-sm"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
