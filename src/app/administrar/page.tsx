"use client";

import Navbar from "@/components/Navbar";
import { 
  Building2, Key, ShieldCheck, TrendingUp, 
  Clock, CheckCircle2, Phone, Mail, MessageSquare 
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/store/ToastContext";
import { motion } from "framer-motion";

export default function AdministrarPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    localizacao: '',
    tipo: 'Casa',
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
            message: `[PROPRIETÁRIO] Localização: ${formData.localizacao} | Tipo: ${formData.tipo} | Mensagem: ${formData.mensagem}`,
            status: 'novo',
            property_title: 'SOLICITAÇÃO DE ADMINISTRAÇÃO'
          }
        ]);

      if (error) throw error;
      setSubmitSuccess(true);
      setFormData({ nome: '', email: '', telefone: '', localizacao: '', tipo: 'Casa', mensagem: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Erro ao enviar:", err);
      toast.error("Erro ao enviar solicitação", "Tente novamente ou fale pelo WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Segurança Total",
      description: "Análise criteriosa de pretendentes e garantia jurídica em todos os contratos."
    },
    {
      icon: TrendingUp,
      title: "Máxima Visibilidade",
      description: "Seu imóvel nos maiores portais e redes sociais com fotos profissionais."
    },
    {
      icon: Clock,
      title: "Agilidade no Aluguel",
      description: "Processos digitais que aceleram a locação e o recebimento dos seus aluguéis."
    },
    {
      icon: Key,
      title: "Gestão Completa",
      description: "Cuidamos de tudo: desde a vistoria até a manutenção e cobrança."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fcfcfc]">
        {/* Hero Section */}
        <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-gradient-to-b from-white to-[#fcfcfc]">
          <div className="hidden md:block absolute top-0 right-0 w-[30rem] h-[30rem] bg-secondary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="hidden md:block absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Administração Profissional</span>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight font-oswald uppercase tracking-tight">
                Seu imóvel merece a <span className="text-secondary underline decoration-secondary/30 underline-offset-8">gestão certa</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Maximize seu retorno e minimize suas preocupações. A <strong className="text-primary font-bold">Carlão Imóveis</strong> oferece soluções completas de administração patrimonial com transparência absoluta.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#contato" className="bg-secondary hover:bg-secondary/90 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-secondary/10 flex items-center gap-3 active:scale-95 font-oswald uppercase tracking-wider text-sm">
                  Quero anunciar agora
                </a>
                <a href="https://wa.me/553186003497" target="_blank" className="bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-3 active:scale-95 font-oswald uppercase tracking-wider text-sm shadow-sm">
                  <MessageSquare size={18} className="text-secondary" /> Consultor
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="w-full max-w-7xl mx-auto mx-auto px-6 -mt-10 relative z-20">
          <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 px-4 sm:px-0 -mx-4 sm:mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { label: "Anos de Experiência", value: "25+" },
              { label: "Imóveis Gerenciados", value: "800+" },
              { label: "Índice de Satisfação", value: "98%" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center shrink-0 w-[80%] sm:w-auto snap-center">
                <span className="text-2xl font-bold text-primary mb-0.5 font-oswald">{stat.value}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <section className="py-12 md:py-20 bg-white overflow-hidden">
          <div className="w-full max-w-7xl mx-auto mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3">Diferenciais Carlão</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-primary leading-tight font-oswald uppercase">Por que confiar a gestão do seu patrimônio a nós?</h3>
              </div>
              <div className="w-16 h-1 bg-secondary rounded-full mb-3 hidden md:block" />
            </div>

            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {benefits.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="group p-6 md:p-8 rounded-[2rem] bg-slate-50 hover:bg-primary transition-all duration-500 border border-slate-100 shrink-0 w-[85%] md:w-auto snap-center">
                    <div className="w-12 h-12 bg-white shadow-md text-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-white transition-colors font-oswald uppercase">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed group-hover:text-white/90 transition-colors">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="contato" className="py-20 bg-slate-100 border-y border-slate-200 relative overflow-hidden">
          <div className="w-full max-w-7xl mx-auto mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-5/12">
                <span className="text-secondary font-bold uppercase tracking-widest text-[10px] mb-3 block">Comece Agora</span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight font-oswald uppercase">Vamos valorizar o seu imóvel juntos?</h2>
                <p className="text-base text-slate-600 mb-8 leading-relaxed">
                  Deixe seus dados e as informações básicas do seu imóvel. Nossa equipe entrará em contato para agendar uma visita e apresentar nosso plano de gestão.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">Telefone Principal</p>
                      <p className="text-lg font-bold text-primary hover:text-secondary transition-colors cursor-pointer font-oswald">(31) 8600-3497</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-secondary shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">E-mail</p>
                      <p className="text-lg font-bold text-primary hover:text-secondary transition-colors cursor-pointer font-oswald uppercase">carlaoimoveisva@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-7/12 w-full">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-white">
                  {submitSuccess ? (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-2 font-oswald uppercase">Solicitação Enviada!</h3>
                      <p className="text-slate-500 text-sm">Obrigado pela confiança. Em breve entraremos em contato.</p>
                      <button 
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-8 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-primary transition-all active:scale-95 font-oswald uppercase tracking-wider text-xs"
                      >
                        Enviar outro
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                          <input 
                            type="text" 
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            placeholder="Ex: João Silva"
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

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Seu E-mail</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bairro / Cidade</label>
                          <input 
                            type="text" 
                            name="localizacao"
                            value={formData.localizacao}
                            onChange={handleInputChange}
                            placeholder="Onde fica?"
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo do Imóvel</label>
                          <div className="relative">
                            <select 
                              name="tipo"
                              value={formData.tipo}
                              onChange={handleInputChange}
                              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm appearance-none cursor-pointer"
                            >
                              <option>Casa</option>
                              <option>Apartamento</option>
                              <option>Lote / Terreno</option>
                              <option>Comercial</option>
                              <option>Chácara / Fazenda</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <Building2 size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mais informações</label>
                        <textarea 
                          name="mensagem"
                          value={formData.mensagem}
                          onChange={handleInputChange}
                          placeholder="Fale um pouco sobre o imóvel..."
                          rows={3}
                          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm resize-none"
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 rounded-xl text-lg font-bold shadow-lg shadow-secondary/10 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group font-oswald uppercase tracking-wider"
                      >
                        {isSubmitting ? "Enviando..." : (
                          <>
                            Solicitar Administração
                            <CheckCircle2 size={20} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-slate-400 font-medium italic">Dados protegidos pela LGPD.</p>
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
