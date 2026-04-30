"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SiteSettings {
  // Hero / Banner
  heroImages: string[];
  heroTitle: string;
  heroSubtitle: string;
  heroSlideInterval: number; // segundos
  // Layout da página principal
  homeCardsPerRow: 3 | 4;
  homeVendaTitle: string;
  homeVendaSubtitle: string;
  homeAluguelTitle: string;
  homeAluguelSubtitle: string;
  homeMaxVenda: number;
  homeMaxAluguel: number;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroImages: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  ],
  heroTitle: "Encontre o seu imóvel ideal",
  heroSubtitle: "Mais de 15 anos de tradição em Governador Valadares e região. Sua segurança é nossa prioridade.",
  heroSlideInterval: 5,
  homeCardsPerRow: 4,
  homeVendaTitle: "Melhores Oportunidades",
  homeVendaSubtitle: "Imóveis para Venda",
  homeAluguelTitle: "Destaques de Locação",
  homeAluguelSubtitle: "Imóveis para Alugar",
  homeMaxVenda: 4,
  homeMaxAluguel: 4,
};

const STORAGE_KEY = "@carlao-imoveis:site-settings";

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {},
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateSettings = (patch: Partial<SiteSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
