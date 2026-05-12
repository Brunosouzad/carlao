"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/store/ToastContext";

export default function ContatoPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: 'Informações Gerais',
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
            message: `[CONTATO] Assunto: ${formData.assunto} | Mensagem: ${formData.mensagem}`,
            status: 'novo',
            property_title: 'CONTATO GERAL'
          }
        ]);

      if (error) throw error;
      setSubmitSuccess(true);
      setFormData({ nome: '', email: '', telefone: '', assunto: 'Informações Gerais', mensagem: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Erro ao enviar:", err);
      toast.error("Erro ao enviar mensagem", "Tente novamente ou fale pelo WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const unidades = [
    {
      nome: "Governador Valadares",
      tipo: "Unidade Matriz",
      endereco: "Av. Brasil, 2890 - Centro, Gov. Valadares - MG, 35020-070",
      telefone: "(33) 8413-6800",
      telLink: "+553384136800",
      horario: "Seg a Sex: 08:00 às 18:00",
      mapa: "https://maps.google.com/maps?q=Av.%20Brasil%2C%202890%20-%20Centro%2C%20Governador%20Valadares%20-%20MG&t=&z=15&ie=UTF8&iwloc=&output=embed",
    },
    {
      nome: "Coronel Fabriciano",
      tipo: "Unidade Filial",
      endereco: "Av. Gov. José de Magalhães Pinto, Nº 2.026 - Melo Viana, Cel. Fabriciano - MG, 35170-097",
      telefone: "(31) 98895-6224",
      telLink: "+5531988956224",
      horario: "Seg a Sex: 08:00 às 18:00",
      mapa: "https://maps.google.com/maps?q=Av.%20Gov.%20Jos%C3%A9%20de%20Magalh%C3%A3es%20Pinto%2C%202026%20-%20Melo%20Viana%2C%20Cel.%20Fabriciano%20-%20MG&t=&z=15&ie=UTF8&iwloc=&output=embed",
    }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 md:pt-40 pb-12 md:pb-16 overflow-hidden bg-gradient-to-b from-white to-[#fcfcfc]">
        <div className="hidden md:block absolute top-0 right-0 w-[30rem] h-[30rem] bg-secondary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Fale Conosco</span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-oswald uppercase tracking-tight">
              Entre em <span className="text-secondary">Contato</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-0">
              Estamos prontos para ajudá-lo a encontrar o imóvel dos seus sonhos ou cuidar do seu patrimônio com excelência.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-4">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Phone, label: "Telefone GV", value: "(33) 8413-6800", href: "tel:+553384136800" },
              { icon: Phone, label: "Telefone CF", value: "(31) 98895-6224", href: "tel:+5531988956224" },
              { icon: Mail, label: "E-mail", value: "carlaoimoveisva@gmail.com", href: "mailto:carlaoimoveisva@gmail.com" },
              { icon: Clock, label: "Horário", value: "Seg a Sex: 08h às 18h", href: undefined },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {item.href ? (
                  <a href={item.href} className="bg-white p-6 rounded-none border border-slate-100 shadow-sm hover:shadow-md hover:border-secondary/30 transition-all flex items-center gap-4 group block">
                    <div className="w-12 h-12 rounded-none bg-primary/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors shrink-0">
                      <item.icon size={22} className="text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-primary font-bold text-sm break-all">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="bg-white p-6 rounded-none border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-none bg-primary/5 flex items-center justify-center shrink-0">
                      <item.icon size={22} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-primary font-bold text-sm break-all">{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-primary mb-2 font-oswald uppercase">Envie sua Mensagem</h2>
              <p className="text-slate-500 mb-8">Preencha o formulário e retornaremos em até 24 horas úteis.</p>

              <div className="bg-white p-8 md:p-10 rounded-none shadow-xl shadow-slate-200/50 border border-white">
                {submitSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2 font-oswald uppercase">Mensagem Enviada!</h3>
                    <p className="text-slate-500 text-sm">Obrigado pelo contato. Retornaremos em breve.</p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-8 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-none hover:bg-primary transition-all font-oswald uppercase tracking-wider text-xs"
                    >
                      Enviar outra
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          placeholder="Seu nome"
                          className="w-full px-5 py-3 rounded-none bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
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
                          className="w-full px-5 py-3 rounded-none bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          className="w-full px-5 py-3 rounded-none bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assunto</label>
                        <select
                          name="assunto"
                          value={formData.assunto}
                          onChange={handleInputChange}
                          className="w-full px-5 py-3 rounded-none bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm appearance-none cursor-pointer"
                        >
                          <option>Informações Gerais</option>
                          <option>Quero Comprar um Imóvel</option>
                          <option>Quero Vender um Imóvel</option>
                          <option>Quero Alugar um Imóvel</option>
                          <option>Administração de Imóvel</option>
                          <option>Outro Assunto</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mensagem</label>
                      <textarea
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        placeholder="Como podemos ajudá-lo?"
                        rows={4}
                        className="w-full px-5 py-3 rounded-none bg-slate-50 border border-slate-100 focus:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all font-medium text-sm resize-none"
                        required
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-primary hover:bg-slate-900 text-white py-4 rounded-none font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 font-oswald uppercase tracking-wider"
                      >
                        {isSubmitting ? "Enviando..." : (
                          <>
                            <Mail size={18} />
                            Enviar Mensagem
                          </>
                        )}
                      </button>
                      <a
                        href="https://wa.me/553384136800"
                        target="_blank"
                        className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-none font-bold shadow-lg shadow-green-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 font-oswald uppercase tracking-wider"
                      >
                        <MessageSquare size={18} />
                        WhatsApp
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Units */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-primary font-oswald uppercase">Nossas Unidades</h2>

              {unidades.map((u, i) => (
                <div key={i} className="bg-white rounded-none border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="w-full h-48 bg-slate-100">
                    <iframe
                      src={u.mapa}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest block mb-1">{u.tipo}</span>
                    <h3 className="text-xl font-bold text-primary mb-3 font-oswald uppercase">{u.nome}</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2">
                        <MapPin size={14} className="text-secondary shrink-0" />
                        {u.endereco}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone size={14} className="text-secondary shrink-0" />
                        <a href={`tel:${u.telLink}`} className="hover:text-secondary transition-colors font-bold">{u.telefone}</a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock size={14} className="text-secondary shrink-0" />
                        {u.horario}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
