"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const faqItems = [
  {
    question: "Quais documentos são necessários para comprar um imóvel?",
    answer: "Para comprar um imóvel, você geralmente precisa de: RG e CPF, comprovante de renda (últimos 3 meses), comprovante de residência, certidão de estado civil, e declaração do Imposto de Renda. Se for financiar, o banco pode solicitar documentos adicionais. Nossa equipe orienta você em todo o processo documental."
  },
  {
    question: "Posso usar o FGTS para comprar um imóvel?",
    answer: "Sim! O FGTS pode ser utilizado na compra de imóveis residenciais, desde que atenda aos requisitos: ter no mínimo 3 anos de trabalho sob o regime do FGTS, não possuir outro financiamento ativo pelo SFH, e não ser proprietário de outro imóvel residencial no município. A Carlão Imóveis possui consultores especializados em operações com FGTS."
  },
  {
    question: "Como funciona o financiamento imobiliário?",
    answer: "O financiamento imobiliário permite parcelar a compra em até 35 anos. Você paga uma entrada (geralmente 20% do valor) e financia o restante. As taxas variam entre bancos — trabalhamos com correspondentes bancários da Caixa Econômica Federal e outros bancos para encontrar as melhores condições para o seu perfil."
  },
  {
    question: "Quais são as taxas envolvidas na compra de um imóvel?",
    answer: "Além do valor do imóvel, você deve considerar: ITBI (Imposto de Transmissão, geralmente 2-3% do valor), registro em cartório, escritura pública, e eventuais taxas bancárias no caso de financiamento. Nossa equipe apresenta uma simulação completa de custos antes do fechamento."
  },
  {
    question: "Como faço para anunciar meu imóvel com a Carlão Imóveis?",
    answer: "É simples! Acesse nossa página 'Anuncie seu Imóvel' e preencha o formulário, ou entre em contato pelo WhatsApp. Faremos uma avaliação gratuita do seu imóvel, tiraremos fotos profissionais e anunciaremos em nosso site e portais parceiros. Cuidamos de toda a parte jurídica e administrativa."
  },
  {
    question: "Quanto tempo leva para vender um imóvel?",
    answer: "O prazo varia conforme o tipo de imóvel, localização e preço. Em média, um imóvel bem precificado e em boa localização em Governador Valadares leva de 30 a 90 dias para ser vendido. Nossa equipe trabalha com marketing ativo para acelerar esse processo."
  },
  {
    question: "Quais documentos preciso para alugar um imóvel?",
    answer: "Para locação, você precisa de: RG e CPF, comprovante de renda (mínimo 3x o valor do aluguel), comprovante de residência, e referências comerciais. Também é necessário um fiador com imóvel próprio quitado ou seguro fiança. A Carlão Imóveis aceita múltiplas modalidades de garantia."
  },
  {
    question: "A Carlão Imóveis administra imóveis para locação?",
    answer: "Sim! Oferecemos administração completa: divulgação, seleção de inquilinos, vistoria de entrada e saída, elaboração de contrato, cobrança de aluguéis e assessoria jurídica. O proprietário pode ficar tranquilo enquanto cuidamos de tudo."
  },
  {
    question: "A imobiliária atua em quais regiões?",
    answer: "A Carlão Imóveis possui duas unidades: uma em Governador Valadares (matriz) e outra em Coronel Fabriciano (filial). Atendemos toda a região do Vale do Rio Doce e Vale do Aço, incluindo cidades como Ipatinga, Timóteo e região."
  },
  {
    question: "Como agendar uma visita a um imóvel?",
    answer: "Você pode agendar uma visita de diversas formas: pelo botão de WhatsApp disponível em cada anúncio do site, pelo formulário de contato na página do imóvel, pelo telefone (33) 8413-6800 ou (31) 98895-6224, ou visitando diretamente uma de nossas unidades."
  },
  {
    question: "A Carlão Imóveis oferece avaliação gratuita?",
    answer: "Sim! Realizamos avaliação de mercado gratuita para proprietários que desejam vender ou alugar seus imóveis. A avaliação é feita por corretores experientes com profundo conhecimento do mercado local."
  },
  {
    question: "É seguro comprar imóvel pela Carlão Imóveis?",
    answer: "Absolutamente. A Carlão Imóveis possui registro no CRECI (J-4123) e mais de 15 anos de atuação no mercado. Todos os imóveis passam por análise documental rigorosa e oferecemos assessoria jurídica completa para garantir segurança em todas as etapas da negociação."
  },
];

// JSON-LD for FAQ Schema (rich snippets)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-slate-100 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
      >
        <h3 className="text-primary font-bold text-[15px] pr-4 group-hover:text-secondary transition-colors">{question}</h3>
        <ChevronDown
          size={20}
          className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-secondary' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className="px-6 text-slate-500 text-sm leading-relaxed">{answer}</p>
      </div>
    </motion.div>
  );
}

export default function FaqPage() {
  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <Navbar />

      {/* JSON-LD for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-28 md:pt-40 pb-12 md:pb-16 overflow-hidden bg-gradient-to-b from-white to-[#fcfcfc]">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-secondary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-primary/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-secondary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Central de Ajuda</span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-oswald uppercase tracking-tight">
              Perguntas <span className="text-secondary">Frequentes</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-0">
              Reunimos as dúvidas mais comuns sobre compra, venda e locação de imóveis. Se não encontrar a resposta que procura, fale com nossa equipe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-primary mb-4 font-oswald uppercase">Não encontrou sua dúvida?</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            Nossa equipe está pronta para esclarecer qualquer questão sobre compra, venda ou locação de imóveis.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://wa.me/553186003497"
              target="_blank"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all font-oswald uppercase tracking-wider shadow-lg shadow-green-500/10"
            >
              <MessageSquare size={18} />
              Falar no WhatsApp
            </a>
            <Link
              href="/contato"
              className="bg-primary hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all font-oswald uppercase tracking-wider"
            >
              Ir para Contato
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
