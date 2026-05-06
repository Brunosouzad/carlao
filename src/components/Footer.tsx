import Link from "next/link";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contato" className="py-24 bg-[#5F5F5F] text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
      
      <div className="w-full max-w-7xl mx-auto mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl w-fit shadow-lg">
              <Image 
                src="/logo-carlao.png" 
                alt="Carlão Imóveis" 
                width={200}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </div>
            <p className="text-white text-sm leading-relaxed max-w-xs">
              Sua parceira de confiança em negócios imobiliários em Minas Gerais desde 2011. Excelência, tradição e os melhores imóveis da região.
            </p>
          </div>
          
          <div>
            <h4 className="text-secondary font-bold mb-8 uppercase text-xs tracking-widest">Navegação</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-white hover:text-secondary transition-colors text-sm font-medium">Início</Link></li>
              <li><Link href="/a-empresa" className="text-white hover:text-secondary transition-colors text-sm font-medium">A Empresa</Link></li>
              <li><Link href="/servicos" className="text-white hover:text-secondary transition-colors text-sm font-medium">Nossos Serviços</Link></li>
              <li><Link href="/venda" className="text-white hover:text-secondary transition-colors text-sm font-medium">Imóveis à Venda</Link></li>
              <li><Link href="/aluguel" className="text-white hover:text-secondary transition-colors text-sm font-medium">Imóveis para Aluguel</Link></li>
              <li><Link href="/faq" className="text-white hover:text-secondary transition-colors text-sm font-medium">Perguntas Frequentes</Link></li>
              <li><Link href="/contato" className="text-white hover:text-secondary transition-colors text-sm font-medium">Contato</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-secondary font-bold mb-8 uppercase text-xs tracking-widest">Fale Conosco</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white text-sm">
                <Phone size={16} className="text-secondary" />
                <span className="text-secondary font-bold">GV:</span> (33) 8413-6800
              </li>
              <li className="flex items-center gap-3 text-white text-sm">
                <Phone size={16} className="text-secondary" />
                <span className="text-secondary font-bold">CF:</span> (31) 98895-6224
              </li>
              <li className="flex items-center gap-3 text-white text-sm">
                <Mail size={16} className="text-secondary" />
                carlaoimoveisva@gmail.com
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-secondary font-bold mb-6 uppercase text-xs tracking-widest">Siga-nos</h4>
            <div className="flex gap-4">
              <Link 
                href="https://facebook.com/carlaoimoveismg" 
                target="_blank"
                className="w-10 h-10 rounded-none bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Link>
              <Link 
                href="https://www.instagram.com/carlao_imoveis?igsh=M3pzMmNlaHVqMmZ4" 
                target="_blank"
                className="w-10 h-10 rounded-none bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/80 text-xs uppercase tracking-[0.1em] font-medium">
            © 2026 Carlão Imóveis MG. CRECI J-4123.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="flex gap-6">
              <Link href="#" className="text-white/80 hover:text-secondary text-xs uppercase tracking-wider font-bold transition-colors">Privacidade</Link>
              <Link href="#" className="text-white/80 hover:text-secondary text-xs uppercase tracking-wider font-bold transition-colors">Termos</Link>
            </div>
            
            <a href="https://wa.me/5511997852477?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20a%20criação%20de%20sites" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 group bg-white hover:bg-slate-50 px-4 py-1.5 rounded-none transition-all shadow-xl border border-transparent hover:border-slate-200">
              <span className="text-slate-500 text-[9px] uppercase tracking-wider font-bold">Desenvolvido por</span>
              <div className="flex items-center gap-0.5">
                <img src="/webcrialogo.png" alt="Webcria Logo" className="h-5 sm:h-6 -mx-1 group-hover:scale-105 transition-transform" />
                <span className="text-slate-900 font-bold text-xs sm:text-sm tracking-tight">Webcria</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
