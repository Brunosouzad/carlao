"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  // Destaques Manuais
  featuredVendaIds?: string[];
  featuredAluguelIds?: string[];
  // Integrações e SEO
  metaTitle?: string;
  metaDescription?: string;
  googleAnalyticsId?: string; // G-XXXXXX
  googleAdsId?: string;       // AW-XXXXXX
  gtmId?: string;             // GTM-XXXXXX
  clarityId?: string;
  hotjarId?: string;
  hotjarSv?: string;
  customScripts?: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroImages: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  ],
  heroTitle: "Encontre o seu imóvel ideal",
  heroSubtitle: "Mais de 25 anos de tradição em Governador Valadares e região. Sua segurança é nossa prioridade.",
  heroSlideInterval: 5,
  homeCardsPerRow: 4,
  homeVendaTitle: "Melhores Oportunidades",
  homeVendaSubtitle: "Imóveis para Venda",
  homeAluguelTitle: "Destaques de Locação",
  homeAluguelSubtitle: "Imóveis para Alugar",
  homeMaxVenda: 4,
  homeMaxAluguel: 4,
  featuredVendaIds: [],
  featuredAluguelIds: [],
  metaTitle: "",
  metaDescription: "",
  googleAnalyticsId: "",
  googleAdsId: "",
  gtmId: "",
  clarityId: "",
  hotjarId: "",
  hotjarSv: "",
  customScripts: "",
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: async () => { },
  resetSettings: async () => { },
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings')
        .eq('key', 'singleton')
        .single();

      if (data && data.settings) {
        const mergedSettings = { ...DEFAULT_SETTINGS, ...data.settings };
        setSettings(mergedSettings);
        setIsLoaded(true);
        localStorage.setItem("@carlao-imoveis:site-settings", JSON.stringify(mergedSettings));
      } else if (error && (error.code === 'PGRST116' || error.message?.includes('No rows'))) {
        await supabase
          .from('site_settings')
          .insert([{ key: 'singleton', settings: DEFAULT_SETTINGS }]);
        setIsLoaded(true);
      }
    } catch (err) {
      console.error("Error fetching settings from Supabase:", err);
    }
  };

  useEffect(() => {
    // 1. Carrega do localStorage no client-side mount para evitar erro de hidratação
    const stored = localStorage.getItem("@carlao-imoveis:site-settings");
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch (e) {
        console.warn("Error parsing stored settings");
      }
    }
    fetchSettings();
  }, []);

  const updateSettings = async (patch: Partial<SiteSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    localStorage.setItem("@carlao-imoveis:site-settings", JSON.stringify(updated));

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          [{ key: 'singleton', settings: updated }],
          { onConflict: 'key' }
        );

      if (error) {
        console.error("Error saving settings:", error);
        throw error;
      }
    } catch (err) {
      console.error("Error saving settings to Supabase:", err);
    }
  };

  const resetSettings = async () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem("@carlao-imoveis:site-settings", JSON.stringify(DEFAULT_SETTINGS));
    try {
      await supabase
        .from('site_settings')
        .upsert(
          [{ key: 'singleton', settings: DEFAULT_SETTINGS }],
          { onConflict: 'key' }
        );
    } catch (err) {
      console.error("Error resetting settings in Supabase:", err);
    }
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
