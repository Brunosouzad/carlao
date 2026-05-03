"use client";

import { useProperties } from "@/store/PropertiesContext";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { useParams, useRouter } from "next/navigation";
import { BedDouble, Bath, Square, MapPin, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight, Share2, Heart, Printer, ArrowLeftRight, Check, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Property } from "@/data/properties";
import { formatPrice } from "@/utils/format";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), { ssr: false });
import NeighborhoodPOIs from "@/components/NeighborhoodPOIs";

import { supabase } from "@/lib/supabase";
import { useCompare } from "@/store/CompareContext";
import { useFavorites } from "@/store/FavoritesContext";
import { useToast } from "@/store/ToastContext";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { properties } = useProperties();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [recommendTab, setRecommendTab] = useState<'recomendado' | 'tipo' | 'localizacao'>('recomendado');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isInCompare } = useCompare();
  const isFav = isFavorite(id as string);
  const isComparing = isInCompare(id as string);
  const toast = useToast();

  const toggleFav = () => {
    toggleFavorite(id as string);
  };

  const handleCompare = () => {
    const result = toggleCompare(id as string);
    if (result === "limit") {
      toast.warning("Limite atingido", "Você pode comparar no máximo 4 imóveis por vez.");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title || 'Carlão Imóveis',
          url: url
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    }
  };

  const handlePrint = () => {
    if (!property) return;
    const allImgs = Array.from(new Set([property.image, ...(property.images || [])])).filter(Boolean);
    const featuresList = (property.features || []).map((f: string) => `<li style="margin-bottom:4px">✓ ${f}</li>`).join('');
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>${property.title} – Carlão Imóveis</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Arial, sans-serif; color: #1e293b; padding: 32px; max-width: 800px; margin: auto; }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #c41230; padding-bottom: 16px; margin-bottom: 24px; }
          .logo { font-size: 22px; font-weight: 900; color: #c41230; letter-spacing: -1px; }
          .badge { background: #f59e0b; color: #1e293b; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
          .title { font-size: 26px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
          .location { color: #64748b; font-size: 14px; margin-bottom: 20px; }
          .price { font-size: 32px; font-weight: 900; color: #0ea5e9; margin-bottom: 4px; }
          .code { font-size: 13px; color: #94a3b8; margin-bottom: 24px; }
          .specs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
          .spec { text-align: center; background: #f8fafc; border-radius: 10px; padding: 14px 8px; }
          .spec-value { font-size: 22px; font-weight: 800; color: #1e293b; }
          .spec-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
          .section-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; border-left: 4px solid #c41230; padding-left: 10px; }
          .description { font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 24px; white-space: pre-wrap; }
          .features { columns: 2; list-style: none; font-size: 13px; color: #475569; margin-bottom: 24px; }
          .images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
          .images img { width: 100%; height: 140px; object-fit: cover; border-radius: 8px; }
          .footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
          @media print { body { padding: 16px; } button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="logo">CARLÃO IMÓVEIS</span>
          <span class="badge">${property.type?.toUpperCase()}</span>
        </div>
        <p class="title">${property.title}</p>
        <p class="location">📍 ${property.location}</p>
        <p class="price">${property.price}${property.type === 'Aluguel' ? '/mês' : ''}</p>
        <p class="code">CÓD: ${property.code}</p>
        <div class="specs">
          <div class="spec"><div class="spec-value">${property.beds}</div><div class="spec-label">Quartos</div></div>
          <div class="spec"><div class="spec-value">${property.baths}</div><div class="spec-label">Banheiros</div></div>
          <div class="spec"><div class="spec-value">${property.garages}</div><div class="spec-label">Vagas</div></div>
          <div class="spec"><div class="spec-value">${property.area} m²</div><div class="spec-label">Área</div></div>
        </div>
        ${property.description ? `<p class="section-title">Descrição</p><p class="description">${property.description}</p>` : ''}
        ${featuresList ? `<p class="section-title">Características</p><ul class="features">${featuresList}</ul>` : ''}
        ${allImgs.length ? `<p class="section-title">Fotos</p><div class="images">${allImgs.slice(0,6).map((img: string) => `<img src="${img}" alt="Foto" />`).join('')}</div>` : ''}
        <div class="footer">
          Carlão Imóveis | (31) 98895-6224 | carlaoimoveisva@gmail.com | ${window.location.href}
        </div>
        <script>window.onload = () => { window.print(); }<\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (id) {
      const found = properties.find((p) => String(p.id) === String(id));
      if (found) {
        setProperty(found);
        setFormData(prev => ({
          ...prev,
          mensagem: `Olá, estou interessado no imóvel código ${found.code} - ${found.title}.`
        }));
      }
    }
  }, [id, properties]);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Reset video play state when media changes
  useEffect(() => {
    setIsVideoPlaying(false);
  }, [currentImageIndex]);

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Imóvel não encontrado.</h2>
          <button onClick={() => router.back()} className="text-secondary font-bold hover:underline">
            Voltar
          </button>
        </div>
      </>
    );
  }

  const features = [
    { label: "Quartos", value: property.beds, icon: BedDouble },
    { label: "Banheiros", value: property.baths, icon: Bath },
    { label: "Vagas", value: property.garages, icon: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="22" height="18" rx="2" ry="2"></rect><path d="M7 21v-4"></path><path d="M17 21v-4"></path><path d="M1 8h22"></path></svg> },
    { label: "Área", value: `${property.area} m²`, icon: Square },
  ];

  const match = property.videoUrl?.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  const embedId = match ? match[1] : null;

  // Combine cover image with gallery images, removing duplicates
  const allImages = Array.from(new Set([
    property.image,
    ...(property.images || [])
  ])).filter(Boolean);

  const mediaItems = [
    ...(embedId ? [{ type: 'video' as const, url: `https://www.youtube.com/embed/${embedId}`, thumb: `https://img.youtube.com/vi/${embedId}/0.jpg` }] : []),
    ...allImages.map(url => ({ type: 'image' as const, url, thumb: url }))
  ];

  const nextMedia = () => setCurrentImageIndex((prev) => (prev + 1) % mediaItems.length);
  const prevMedia = () => setCurrentImageIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `${formData.mensagem}\n\n*Nome:* ${formData.nome}\n*Telefone:* ${formData.telefone}\n*E-mail:* ${formData.email}`;
    window.open(`https://wa.me/553186003497?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      toast.warning("Campos obrigatórios", "Preencha Nome e E-mail para podermos retornar o contato.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Salva no CRM (Supabase)
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.nome,
            email: formData.email,
            phone: formData.telefone,
            message: formData.mensagem,
            property_title: `[${property.code}] ${property.title}`,
            status: 'novo'
          }
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData(prev => ({ ...prev, nome: '', email: '', telefone: '' }));
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      console.error('Erro ao salvar lead:', err);
      // Mesmo se falhar no CRM, mostramos sucesso ou tentamos redirecionar pro WhatsApp?
      // Melhor mostrar sucesso pro usuário não ficar frustrado, mas logar o erro.
      setSubmitSuccess(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const similarProperties = properties
    .filter(p => p.id !== id)
    .filter(p => {
      if (recommendTab === 'tipo') return p.category === property.category;
      if (recommendTab === 'localizacao') return p.location.includes(property.location.split(',')[0]);
      return true; // recomendado
    })
    .slice(0, 4);

  const currentMedia = mediaItems[currentImageIndex];

  // SEO Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "image": property.image,
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city,
      "addressRegion": property.neighborhood,
      "streetAddress": property.street
    },
    "offers": {
      "@type": "Offer",
      "price": property.price.replace(/\D/g, ""),
      "priceCurrency": "BRL"
    },
    "numberOfRooms": property.beds,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "MTK"
    }
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="pt-44 md:pt-48 pb-24 bg-slate-50 min-h-screen overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto mx-auto px-4 md:px-8">
          
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-primary transition-colors cursor-pointer">
            <ArrowLeft size={20} /> Voltar
          </button>
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column (Images & Details) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Lightbox */}
              {lightboxOpen && currentMedia.type === 'image' && (
                <div 
                  className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
                  onClick={() => setLightboxOpen(false)}
                >
                  <button className="absolute top-4 right-4 text-white/80 hover:text-white text-4xl font-thin leading-none z-10" onClick={() => setLightboxOpen(false)}>✕</button>
                  <button onClick={(e) => { e.stopPropagation(); prevMedia(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10">
                    <ChevronLeft size={28} />
                  </button>
                  <img 
                    src={currentMedia.url} 
                    alt={property.title} 
                    className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button onClick={(e) => { e.stopPropagation(); nextMedia(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10">
                    <ChevronRight size={28} />
                  </button>
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{currentImageIndex + 1} / {mediaItems.length}</span>
                </div>
              )}

              <div className="w-full aspect-[4/3] md:aspect-[16/9] max-h-[70vh] rounded-3xl overflow-hidden shadow-lg relative group">
                {currentMedia.type === 'video' ? (
                  !isVideoPlaying ? (
                    <div 
                      className="w-full h-full relative cursor-pointer group/video"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <img src={currentMedia.thumb} alt="Video Preview" className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover/video:scale-110" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform duration-300 group-hover/video:scale-110 ring-8 ring-white/10">
                          <div className="w-0 h-0 border-t-[10px] md:border-t-[12px] border-t-transparent border-l-[16px] md:border-l-[20px] border-l-white border-b-[10px] md:border-b-[12px] border-b-transparent ml-2"></div>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-white font-bold text-lg md:text-xl drop-shadow-lg">Assista o vídeo deste imóvel</p>
                          <p className="text-white/70 text-xs md:text-sm font-medium">{property.title}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      className="w-full h-full"
                      src={`${currentMedia.url}?autoplay=1`}
                      title="Tour em Vídeo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                ) : (
                  <div 
                    className="w-full h-full cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img 
                      src={currentMedia.url} 
                      alt={property.title} 
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-[1.02]" 
                    />
                  </div>
                )}
                
                <button 
                  onClick={prevMedia} 
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 lg:backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10 focus:outline-none cursor-pointer"
                >
                  <ChevronLeft size={24} className="md:w-8 md:h-8" />
                </button>
                <button 
                  onClick={nextMedia} 
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 lg:backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10 focus:outline-none cursor-pointer"
                >
                  <ChevronRight size={24} className="md:w-8 md:h-8" />
                </button>
 
                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2">
                  <span className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-500 text-slate-950 text-xs md:text-sm font-bold uppercase rounded-xl shadow-lg">
                    {property.type}
                  </span>
                  {property.tag && (
                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-950/70 lg:backdrop-blur-md text-white text-xs md:text-sm font-bold uppercase rounded-xl shadow-lg">
                      {property.tag}
                    </span>
                  )}
                </div>

                {currentMedia.type === 'image' && (
                  <div className="absolute bottom-3 right-3 bg-black/40 lg:backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    🔍 Clique para ampliar
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="relative">
                <button 
                  onClick={() => scrollThumbnails('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-primary z-10 cursor-pointer border border-slate-100"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-3 overflow-x-auto pb-3 pt-2 px-12 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                >
                  {mediaItems.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-28 h-20 rounded-xl snap-start transition-all cursor-pointer focus:outline-none relative overflow-hidden ${currentImageIndex === idx ? 'outline outline-4 outline-secondary outline-offset-2 opacity-100 scale-105' : 'opacity-60 hover:opacity-90 hover:scale-[1.02]'}`}
                    >
                      <img src={item.thumb} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                           <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white">
                             <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                           </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => scrollThumbnails('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-primary z-10 cursor-pointer border border-slate-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
                {showCopyToast && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg z-20">
                    Link copiado!
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500">
                      ID do Imóvel: <span className="text-[#0ea5e9]">{property.code}</span>
                    </span>
                    {property.tag && (
                      <span className="px-2 py-1 bg-[#0ea5e9] text-white text-[10px] font-bold uppercase rounded">
                        {property.tag}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-400">
                    <button onClick={handleShare} className="hover:text-primary transition-colors cursor-pointer" title="Compartilhar">
                      <Share2 size={20} />
                    </button>
                    <button onClick={toggleFav} className={`transition-colors cursor-pointer ${isFav ? 'text-[#0ea5e9]' : 'hover:text-primary'}`} title="Favorito">
                      <Heart size={20} className={isFav ? "fill-current" : ""} />
                    </button>
                    <button onClick={handleCompare} className={`transition-colors cursor-pointer ${isComparing ? 'text-secondary' : 'hover:text-primary'}`} title="Comparar">
                      <ArrowLeftRight size={20} />
                    </button>
                    <button onClick={handlePrint} className="hover:text-primary transition-colors hidden md:block cursor-pointer" title="Imprimir">
                      <Printer size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 mb-2 md:mb-4 font-medium text-sm md:text-base">
                  <MapPin size={18} className="text-secondary" />
                  {property.location}
                </div>
                
                <h1 className="text-2xl md:text-4xl font-bold text-primary mb-6">{property.title}</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 py-6 border-y border-slate-100 mb-8">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center justify-center p-3 md:p-4 bg-slate-50 rounded-2xl">
                        <Icon size={24} className="text-slate-400 mb-2 md:w-7 md:h-7" />
                        <span className="text-lg md:text-xl font-bold text-slate-800">{feature.value}</span>
                        <span className="text-[10px] md:text-xs uppercase font-bold text-slate-400 tracking-wider">{feature.label}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary">Descrição do Imóvel</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {property.description || "Sem descrição detalhada para este imóvel."}
                  </p>
                </div>


                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="text-xl font-bold text-[#0ea5e9] mb-6">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                    {(property.features || [
                      "Aquecimento a gás",
                      "Churrasqueira",
                      "Espaço Gourmet",
                      "Infraestrutura para água quente",
                      "Interfone",
                      "Jardim",
                      "Piscina",
                      "Portão eletrônico",
                      "Sacada"
                    ]).map((feature, idx) => (
                      <Link 
                        key={idx} 
                        href={`/?q=${encodeURIComponent(feature)}`}
                        className="flex items-start gap-3 group cursor-pointer"
                      >
                        <Check size={20} strokeWidth={3} className="text-[#0ea5e9] mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 font-medium group-hover:text-[#0ea5e9] transition-colors">{feature}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mapa de Localização */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-secondary" />
                    Localização
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">{property.location}</p>
                  <PropertyMap 
                    location={property.location} 
                    title={property.title} 
                    city={property.city}
                    neighborhood={property.neighborhood}
                    street={property.street}
                  />
                </div>

                <NeighborhoodPOIs location={property.location} />
              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-8">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-black/5 border border-slate-100 sticky top-32">
                <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">Valor do Imóvel</p>
                <h2 className={`text-3xl md:text-4xl font-bold text-accent-blue ${!(property.condominium || property.iptu) ? 'mb-4 pb-4 border-b border-slate-100' : 'mb-1'}`}>
                  {formatPrice(property.price)}
                  {property.type === "Aluguel" && <span className="text-xl md:text-2xl font-normal text-slate-500">/mês</span>}
                </h2>
                {(property.condominium || property.iptu) && (
                  <div className="text-sm font-medium text-slate-400 mb-4 pb-4 border-b border-slate-100">
                    {[
                      property.condominium && `Cond. ${formatPrice(property.condominium)}`,
                      property.iptu && `IPTU ${formatPrice(property.iptu)}`
                    ].filter(Boolean).join(' • ')}
                  </div>
                )}

                <p className="text-base font-semibold text-primary mb-1 leading-snug">{property.title}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-5">
                  <MapPin size={12} className="text-secondary shrink-0" />
                  {property.location}
                </p>
                
                <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100 font-medium">
                  CÓD: <span className="text-primary font-bold">{property.code}</span>
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 bg-slate-50">
                    <div className="p-4 border-b border-slate-200 focus-within:bg-white transition-colors">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Nome</label>
                      <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Seu nome completo" className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium placeholder:font-normal placeholder:text-slate-400" required />
                    </div>
                    <div className="p-4 border-b border-slate-200 focus-within:bg-white transition-colors">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">E-mail</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Seu melhor e-mail" className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium placeholder:font-normal placeholder:text-slate-400" required />
                    </div>
                    <div className="p-4 border-b border-slate-200 focus-within:bg-white transition-colors">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-widest">Telefone</label>
                      <input type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(00) 00000-0000" className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium placeholder:font-normal placeholder:text-slate-400" />
                    </div>
                    <div className="p-4 focus-within:bg-white transition-colors relative">
                      <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-widest">Mensagem</label>
                      <textarea 
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        className="w-full bg-transparent outline-none text-slate-700 text-sm font-medium resize-none h-20 placeholder:font-normal placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button 
                      type="button"
                      onClick={handleWhatsApp}
                      className="btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-amber-500/20"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      WhatsApp
                    </button>
                    <a 
                      href="tel:+553186003497"
                      className="btn-secondary py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-primary hover:bg-slate-50 text-sm"
                    >
                      <Phone size={18} />
                      Ligue agora
                    </a>
                  </div>
                  
                  {submitSuccess ? (
                    <div className="w-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm mb-6">
                      <CheckCircle size={18} />
                      Mensagem Enviada!
                    </div>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-slate-800 transition-all cursor-pointer text-sm mb-6 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse flex items-center gap-2">Enviando...</span>
                      ) : (
                        <>
                          <Mail size={18} />
                          Enviar Mensagem
                        </>
                      )}
                    </button>
                  )}
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="font-bold text-primary mb-4">Benefícios Carlão Imóveis</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle size={18} className="text-green-500" /> Assessoria Completa
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle size={18} className="text-green-500" /> Contrato 100% Seguro
                    </li>
                    <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <CheckCircle size={18} className="text-green-500" /> Atendimento Personalizado
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties Section */}
          <div className="mt-24 pt-16 border-t border-slate-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
              <div className="space-y-2">
                <p className="text-primary font-bold uppercase tracking-[0.25em] text-[10px] bg-primary/5 w-fit px-3 py-1 rounded-full">Explore mais</p>
                <h2 className="text-4xl font-bold text-primary">Propriedades semelhantes</h2>
              </div>
              
              <div className="w-full md:w-fit overflow-x-auto no-scrollbar pb-2 md:pb-0">
                <div className="flex gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
                  {[
                    { id: 'recomendado', label: 'Recomendado' },
                    { id: 'tipo', label: 'Tipo De Imóvel' },
                    { id: 'localizacao', label: 'Localização' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setRecommendTab(tab.id as any)}
                      className={`px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        recommendTab === tab.id 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'text-slate-400 hover:text-primary hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} {...p} />
              ))}
              {similarProperties.length === 0 && (
                <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="text-4xl mb-4 opacity-20">🏘️</div>
                  <p className="text-slate-400 font-medium">Nenhum imóvel semelhante encontrado nesta categoria.</p>
                  <button onClick={() => setRecommendTab('recomendado')} className="mt-4 text-primary font-bold hover:underline cursor-pointer">Ver todos os recomendados</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex gap-3 pb-safe">
        <button 
          onClick={handleWhatsApp}
          className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          WhatsApp
        </button>
        <a 
          href="tel:+553186003497"
          className="flex-1 border-2 border-primary text-primary py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm active:scale-95 transition-transform"
        >
          <Phone size={20} />
          Ligar
        </a>
      </div>
    </>
  );
}
