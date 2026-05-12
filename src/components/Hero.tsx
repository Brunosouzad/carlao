"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SearchWidget from "./SearchWidget";
import { useSiteSettings } from "@/store/SiteSettingsContext";
import Image from "next/image";

export default function Hero() {
  const { settings } = useSiteSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = settings.heroImages.length > 0 ? settings.heroImages : [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, (settings.heroSlideInterval || 5) * 1000);
    return () => clearInterval(timer);
  }, [slides.length, settings.heroSlideInterval]);

  // Parse title: bold the last word by default, or support **highlight**
  const renderTitle = (title: string) => {
    const parts = title.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <span key={i} className="text-secondary">{part.slice(2, -2)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section className="relative min-h-[85vh] lg:h-[85vh] flex flex-col justify-end pt-44 lg:pt-36 overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSlide}-${slides[currentSlide]}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slides[currentSlide]}
              alt="Hero Slide"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={80}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

        {/* Slide dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === currentSlide ? "bg-secondary w-6" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 md:px-8 relative z-10 pb-20 lg:pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            key={settings.heroTitle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center lg:text-left"
          >
            <h1 suppressHydrationWarning className="text-3xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {renderTitle(settings.heroTitle || "Encontre o seu **imóvel ideal**")}
            </h1>
            <p suppressHydrationWarning className="text-base md:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
              {settings.heroSubtitle || "Mais de 25 anos de tradição em Governador Valadares e região. Sua segurança é nossa prioridade."}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SearchWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
