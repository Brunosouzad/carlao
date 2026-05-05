"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BedDouble, Bath, Square, MapPin, ArrowUpRight, X, Camera, ChevronLeft, ChevronRight, Heart, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatPrice } from "@/utils/format";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

import { useFavorites } from "@/store/FavoritesContext";
import { useCompare } from "@/store/CompareContext";
import { useToast } from "@/store/ToastContext";

function FavoriteButton({ id }: { id: string }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showTooltip, setShowTooltip] = useState(false);
  const isFav = isFavorite(id);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isFav) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } else {
      setShowTooltip(false);
    }
    toggleFavorite(id);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-secondary text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-lg pointer-events-none z-20 font-oswald tracking-widest"
          >
            ADICIONADO AOS FAVORITOS
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={toggleFav}
        className={`w-12 h-12 lg:backdrop-blur-md bg-black/40 lg:bg-transparent rounded-2xl flex items-center justify-center transition-all shadow-xl pointer-events-auto cursor-pointer ${isFav ? 'bg-secondary text-white' : 'lg:bg-white/10 text-white hover:bg-white/20'}`}
      >
        <Heart size={20} className={isFav ? "fill-current" : ""} />
      </button>
    </div>
  );
}

function CompareButton({ id }: { id: string }) {
  const { toggleCompare, isInCompare } = useCompare();
  const [showTooltip, setShowTooltip] = useState(false);
  const isComparing = isInCompare(id);
  const toast = useToast();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = toggleCompare(id);

    if (result === "added") {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } else if (result === "limit") {
      toast.warning("Limite atingido", "Você pode comparar no máximo 4 imóveis por vez.");
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-lg pointer-events-none z-20 font-oswald tracking-widest"
          >
            ADICIONADO PARA COMPARAR
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={handleToggle}
        className={`w-12 h-12 lg:backdrop-blur-md bg-black/40 lg:bg-transparent rounded-2xl flex items-center justify-center transition-all shadow-xl pointer-events-auto cursor-pointer ${isComparing ? 'bg-primary text-white' : 'lg:bg-white/10 text-white hover:bg-white/20'}`}
        title="Comparar imóvel"
      >
        <ArrowLeftRight size={20} />
      </button>
    </div>
  );
}

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
  images?: string[];
  type: "Venda" | "Aluguel";
  tag?: string;
  condominium?: string;
  iptu?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  slug?: string;
  priority?: boolean;
}

export default function PropertyCard({ id, code, title, location, price, beds, baths, garages, area, image, images, type, tag, condominium, iptu, city, neighborhood, street, slug, priority: isPriority = false }: PropertyCardProps) {
  const router = useRouter();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const cardImages = [image, ...(images || [])].filter(img => img && img.trim() !== "");
  
  // If no images, provide a fallback
  if (cardImages.length === 0) {
    cardImages.push("https://images.unsplash.com/photo-1564013467402-9fef2662880e?q=80&w=1000&auto=format&fit=crop");
  }

  
  const propertyUrl = slug ? `/imovel/${slug}` : `/imovel/${id}`;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % cardImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + cardImages.length) % cardImages.length);
  };

  const [isHovered, setIsHovered] = useState(false);
  const [renderedIndexes, setRenderedIndexes] = useState<number[]>([0]);

  // Preload next and previous images via Next.js when hovered to eliminate gallery delay
  useEffect(() => {
    setRenderedIndexes(prev => {
      const nextSet = new Set(prev);
      nextSet.add(currentImageIndex);
      
      if (isHovered && cardImages.length > 1) {
        nextSet.add((currentImageIndex + 1) % cardImages.length);
        nextSet.add((currentImageIndex - 1 + cardImages.length) % cardImages.length);
      }
      
      if (nextSet.size !== prev.length) {
        return Array.from(nextSet);
      }
      return prev;
    });
  }, [currentImageIndex, isHovered, cardImages.length]);

  const variants = {
    enter: { opacity: 0 },
    center: { zIndex: 1, opacity: 1 },
    exit: { zIndex: 0, opacity: 0 }
  };


  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-none overflow-hidden border border-slate-200 lg:backdrop-blur-md lg:bg-white/70 hover:border-amber-500/30 transition-all duration-500 shadow-sm relative cursor-pointer"
      onClick={() => router.push(propertyUrl)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 w-full h-full cursor-zoom-in relative overflow-hidden bg-slate-200"
          onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
        >
          {cardImages.map((src, idx) => {
            if (!renderedIndexes.includes(idx)) return null;
            const isCurrent = idx === currentImageIndex;
            return (
              <Image
                key={idx}
                src={src || "https://images.unsplash.com/photo-1564013467402-9fef2662880e?q=80&w=1000&auto=format&fit=crop"} 
                alt={`${title} - Foto ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={70}
                priority={isPriority && idx === 0}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:scale-110 ${isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              />
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent opacity-80 z-20 pointer-events-none" />
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={(e) => { e.stopPropagation(); prevImage(e); }} 
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 lg:bg-black/30 lg:backdrop-blur-sm text-white flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-black/50 z-10 focus:outline-none cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextImage(e); }} 
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 lg:bg-black/30 lg:backdrop-blur-sm text-white flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-black/50 z-10 focus:outline-none cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-[#0ea5e9] text-white text-[12px] font-bold rounded-lg shadow-lg flex items-center gap-1.5">
              <Camera size={14} />
              {cardImages.length}
            </div>
            <div className="px-3 py-1 bg-[#B30F1A] text-white text-[10px] flex items-center font-bold uppercase rounded-lg shadow-lg">
              {type}
            </div>
          </div>
          {tag && (
            <div className="w-max px-3 py-1 bg-black/40 lg:bg-white/10 lg:backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-lg border border-white/10">
              {tag}
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 px-2 py-1 bg-slate-950/80 lg:bg-slate-950/60 lg:backdrop-blur-md text-slate-300 text-[9px] font-mono rounded border border-white/5 pointer-events-none z-10">
          CÓD: {code}
        </div>
        
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          <FavoriteButton id={id} />
          <CompareButton id={id} />
          <div 
            onClick={(e) => { e.stopPropagation(); router.push(propertyUrl); }}
            className="w-12 h-12 bg-black/40 lg:bg-white/10 lg:backdrop-blur-md rounded-none flex items-center justify-center text-white hover:bg-amber-500 hover:text-slate-950 transition-all shadow-xl group-hover:translate-y-0 cursor-pointer"
          >
            <ArrowUpRight size={24} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 bg-white">
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMapOpen(true); }}
          className="flex items-center gap-1.5 mb-2 group/location cursor-pointer w-full text-left focus:outline-none"
        >
          <MapPin size={14} className="text-secondary" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover/location:text-secondary group-hover/location:underline underline-offset-4 transition-colors line-clamp-1">{location}</p>
        </button>
        <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-secondary transition-colors line-clamp-1 leading-tight">
          {title}
        </h3>
        <p className={`text-accent-blue font-bold text-2xl tracking-tighter ${!(condominium && condominium !== "0" || iptu && iptu !== "0") ? 'mb-4' : ''}`}>
          {formatPrice(price)}
          {type === 'Aluguel' && formatPrice(price) !== "Consulte-nos" && <span className="text-sm font-normal text-slate-500">/mês</span>}
        </p>
        {(condominium && condominium !== "0" || iptu && iptu !== "0") && (
          <p className="text-xs text-slate-400 font-medium mb-4 mt-1">
            {[
              condominium && condominium !== "0" && `Cond. ${formatPrice(condominium)}`,
              iptu && iptu !== "0" && `IPTU ${formatPrice(iptu)}`
            ].filter(Boolean).join(' • ')}
          </p>
        )}

      </div>
      <div className="bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 grid grid-cols-4 gap-1 sm:gap-2 border-t border-slate-100">
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

    {/* Gallery Modal */}
    <AnimatePresence>
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsGalleryOpen(false)}
            className="absolute inset-0 bg-slate-950/95 cursor-pointer backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-auto h-auto max-w-[95vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl z-10 flex items-center justify-center bg-black/20"
          >
            <div 
              className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center overflow-hidden"
            >
              <img 
                key={currentImageIndex}
                src={cardImages[currentImageIndex] || undefined} 
                alt={title}
                loading="lazy"
                decoding="async"
                className={`max-w-full max-h-[90vh] object-contain select-none transition-opacity duration-300 ease-in-out ${imgLoaded[currentImageIndex + 100] || currentImageIndex === 0 ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(prev => ({ ...prev, [currentImageIndex + 100]: true }))}
              />
            </div>
            
            <button 
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-20 cursor-pointer"
            >
              <X size={24} />
            </button>

            <button 
              onClick={prevImage} 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-20 cursor-pointer"
            >
              <ChevronLeft size={32} />
            </button>

            <button 
              onClick={nextImage} 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors z-20 cursor-pointer"
            >
              <ChevronRight size={32} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-bold tracking-widest z-20 pointer-events-none">
              {currentImageIndex + 1} / {cardImages.length}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Map Modal */}
    <AnimatePresence>
      {isMapOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMapOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-none overflow-hidden shadow-2xl z-10 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <MapPin size={18} className="text-secondary" /> {location}
              </h3>
              <button 
                onClick={() => setIsMapOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="w-full bg-slate-100 p-2 sm:p-4">
              <PropertyMap 
                location={location} 
                title={title} 
                city={city} 
                neighborhood={neighborhood} 
                street={street} 
                className="h-[50vh] sm:h-[60vh] w-full" 
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
