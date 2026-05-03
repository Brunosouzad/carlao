"use client";

import Navbar from "@/components/Navbar";
import { 
  Search, MapPin, DollarSign, Home, 
  CheckCircle2, Phone, Mail, MessageSquare, 
  Compass, Zap, Heart
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/store/ToastContext";
import { motion } from "framer-motion";

export default function ProcuraPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    objetivo: 'Comprar',
    tipo: 'Casa',
    localizacao: '',
    valor: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.nome,
            email: formData.email,
            phone: formData.telefone,
            message: `[ENCOMENDA] Objetivo: ${formData.objetivo} | Localização: ${formData.localizacao} | Valor: ${formData.valor} | Tipo: ${formData.tipo} | Detalhes: ${formData.mensagem}`,
            status: 'novo',
            property_title: 'ENCOMENDA DE IMÓVEL'
          }
        ]);

      if (error) throw error;
      setSubmitSuccess(true);
      setFormData({ 
        nome: '', email: '', telefone: '', objetivo: 'Comprar', 
        tipo: 'Casa', localizacao: '', valor: '', mensagem: '' 
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Erro ao enviar:", err);
      toast.error("Erro ao enviar pedido", "Tente novamente ou fale pelo WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Compass,
      title: "Busca Ativa no Mercado",
      desc: "Varremos imobiliárias parceiras, classificados e até imóveis que ainda não foram anunciados oficialmente."
    },
    {
      icon: Zap,
      title: "Filtro Especialista",
      desc: "Nossa equipe analisa cada detalhe técnico para garantir que você só visite imóveis que realmente atendam ao seu perfil."
    },
    {
      icon: Heart,
      title: "Curadoria de Valor",
      desc: "Avaliamos o custo-benefício e o potencial de valorização do imóvel antes de apresentá-lo a você."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fcfcfc]">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden bg-white border-b border-slate-100">
          <div className="w-full max-w-7xl mx-auto mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight font-oswald uppercase"
              >
                Não encontrou o imóvel <span className="text-secondary">que procurava?</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg text-slate-500 mb-0 leading-relaxed max-w-2xl mx-auto"
              >
                Conte-nos exatamente o que você precisa. Nossa equipe fará uma busca personalizada em todo o mercado para encontrar o seu lar ideal.
              </motion.p>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="hidden md:block absolute top-0 right-0 w-1/4 h-full bg-secondary/5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
          <div className="hidden md:block absolute bottom-0 left-0 w-1/4 h-full bg-primary/5 blur-[100px] translate-y-1/2 -translate-x-1/2 rounded-full" />
        </section>

        <section className="py-16 bg-slate-100 border-y border-slate-200">
          <div className="w-full max-w-7xl mx-auto mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Info Column */}
              <div className="lg:col-span-5 space-y-10">
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-primary font-oswald uppercase tracking-tight">O que fazemos por você?</h2>
                  <div className="space-y-8">
                    {benefits.map((item, i) => (
                      <div key={i} className="flex gap-5 group">
                        <div className="flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary mb-2" />
                          <div className="w-px h-full bg-slate-100" />
                        </div>
                        <div className="pb-4">
                          <h3 className="font-bold text-primary mb-2 text-lg font-oswald uppercase tracking-tight flex items-center gap-3">
                            <item.icon size={20} className="text-secondary" /> {item.title}
                          </h3>
                          <p className="text-sm text-slate-500 leading-relaxed max-w-md">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-primary text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 font-oswald uppercase">Prefere falar agora?</h3>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed">Nossos consultores estão prontos para ouvir suas necessidades pelo WhatsApp.</p>
                    <a 
                      href="https://wa.me/553186003497" 
                      target="_blank" 
                      className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all font-oswald uppercase tracking-wider"
                    >
                      <MessageSquare size={18} /> Chamar no WhatsApp
                    </a>
                  </div>
                  <Search size={120} className="absolute -bottom-10 -right-10 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                </div>
              </div>

              {/* Form Column */}
              <div className="lg:col-span-7">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
                  {submitSuccess ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-2 font-oswald uppercase">Pedido Recebido!</h3>
                      <p className="text-slate-500 text-sm">Nossa equipe já está iniciando as buscas. Entraremos em contato em breve.</p>
                      <button 
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-8 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary transition-all font-oswald uppercase tracking-wider text-xs"
                      >
                        Fazer outro pedido
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Seu Nome</label>
                          <input 
                            type="text" 
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            placeholder="João Silva"
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp</label>
                          <input 
                            type="tel" 
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleInputChange}
                            placeholder="(00) 00000-0000"
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Eu quero</label>
                          <select 
                            name="objetivo"
                            value={formData.objetivo}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm appearance-none cursor-pointer"
                          >
                            <option>Comprar</option>
                            <option>Alugar</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Imóvel</label>
                          <select 
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm appearance-none cursor-pointer"
                          >
                            <option>Casa</option>
                            <option>Apartamento</option>
                            <option>Lote / Terreno</option>
                            <option>Fazenda / Sítio</option>
                            <option>Comercial</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Localização Desejada</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              name="localizacao"
                              value={formData.localizacao}
                              onChange={handleInputChange}
                              placeholder="Bairro ou região"
                              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
                              required
                            />
                            <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Faixa de Preço</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              name="valor"
                              value={formData.valor}
                              onChange={handleInputChange}
                              placeholder="Ex: Até 500 mil"
                              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
                              required
                            />
                            <DollarSign size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Descreva seu imóvel dos sonhos</label>
                        <textarea 
                          name="mensagem"
                          value={formData.mensagem}
                          onChange={handleInputChange}
                          placeholder="Ex: Casa com 3 quartos, quintal grande e próximo a escolas..."
                          rows={4}
                          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm resize-none"
                          required
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-slate-900 text-white py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group font-oswald uppercase tracking-wider"
                      >
                        {isSubmitting ? "Enviando..." : (
                          <>
                            Encontrar meu imóvel
                            <Search size={20} className="group-hover:scale-110 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
