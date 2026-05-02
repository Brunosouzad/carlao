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

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: async () => {},
  resetSettings: async () => {},
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings')
        .eq('key', 'singleton')
        .single();
      
      if (data && data.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      } else if (error && (error.code === 'PGRST116' || error.message?.includes('No rows'))) {
        // Nenhuma linha encontrada, cria a primeira
        await supabase
          .from('site_settings')
          .insert([{ key: 'singleton', settings: DEFAULT_SETTINGS }]);
      }
    } catch (err) {
      console.error("Error fetching settings from Supabase:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (patch: Partial<SiteSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    
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
