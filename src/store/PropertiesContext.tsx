"use client";
// Force redeploy to clear Vercel cache and update property images

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property, INITIAL_PROPERTIES } from "../data/properties";
import { supabase } from "../lib/supabase";
import { useToast } from "@/store/ToastContext";
import { generateSlug } from "@/utils/slug";

interface PropertiesContextType {
  properties: Property[];
  activeProperties: Property[];
  loading: boolean;
  addProperty: (property: Omit<Property, "id">) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  duplicateProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType>({
  properties: INITIAL_PROPERTIES,
  activeProperties: INITIAL_PROPERTIES.filter(p => p.active !== false),
  loading: false,
  addProperty: async () => {},
  updateProperty: async () => {},
  deleteProperty: async () => {},
  duplicateProperty: async () => {},
  refreshProperties: async () => {},
});

export function PropertiesProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos com o que houver no localStorage para ser instantâneo
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeProperties, setActiveProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  const fetchProperties = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn("Supabase fetch error:", error.message);
          if (!silent) loadLocalData();
        } else if (data) {
          const mappedData = data.map((p: any) => {
            const { video_url, zip_code, images, ...rest } = p;
            const mapped = { 
              ...rest, 
              videoUrl: video_url, 
              zipCode: zip_code,
              images: Array.isArray(images) ? images : (typeof images === 'string' ? JSON.parse(images) : [])
            } as Property;
            
            return { ...mapped, slug: generateSlug(mapped) };
          });
          setProperties(mappedData as Property[]);
          setActiveProperties(mappedData.filter((p: Property) => p.active !== false) as Property[]);
          // Salva no localStorage para o próximo carregamento ser instantâneo
          localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(mappedData));
          localStorage.setItem("@carlao-imoveis:lastFetch", Date.now().toString());
        }
      } else {
        loadLocalData();
      }
    } catch (e) {
      console.error("Error in fetchProperties:", e);
      if (!silent) loadLocalData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalData = () => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem("@carlao-imoveis:properties");
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((p: Property) => ({ ...p, slug: generateSlug(p) }));
        setProperties(parsed);
        setActiveProperties(parsed.filter((p: Property) => p.active !== false));
        setLoading(false);
      } catch (e) {
        setProperties(INITIAL_PROPERTIES);
      }
    } else {
      setProperties(INITIAL_PROPERTIES);
    }
  };

  useEffect(() => {
    // 1. Tenta carregar local imediatamente (instantâneo)
    const stored = typeof window !== 'undefined' ? localStorage.getItem("@carlao-imoveis:properties") : null;
    const lastFetch = typeof window !== 'undefined' ? localStorage.getItem("@carlao-imoveis:lastFetch") : null;
    
    // Verifica se os dados foram buscados há menos de 15 minutos (900.000 ms)
    const isCacheFresh = lastFetch && (Date.now() - parseInt(lastFetch)) < 900000;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProperties(parsed);
        setActiveProperties(parsed.filter((p: Property) => p.active !== false));
        setLoading(false); // Já temos dados para mostrar
        
        // Busca novos dados em silêncio APENAS se o cache não estiver fresco
        if (!isCacheFresh) {
          fetchProperties(true);
        }
      } catch (e) {
        fetchProperties();
      }
    } else {
      // Primeira vez ou sem cache: busca normal
      fetchProperties();
    }
  }, []);

  const addProperty = async (propertyData: Omit<Property, "id">) => {
    try {
      if (isSupabaseConfigured) {
        const { videoUrl, zipCode, price, condominium, iptu, ...rest } = propertyData;
        
        // Limpar formatação de moeda para salvar apenas números (centavos)
        const cleanPrice = price ? price.replace(/\D/g, "") : "0";
        const cleanCondominium = condominium ? condominium.replace(/\D/g, "") : "0";
        const cleanIptu = iptu ? iptu.replace(/\D/g, "") : "0";

        const { data, error } = await supabase
          .from('properties')
          .insert([{ 
            ...rest, 
            price: cleanPrice,
            condominium: cleanCondominium,
            iptu: cleanIptu,
            video_url: videoUrl, 
            zip_code: zipCode 
          }])
          .select();

        if (error) {
          console.error("Supabase insert error details:", error);
          throw new Error(error.message);
        }

        if (data && data[0]) {
          const p = data[0] as any;
          const { video_url, zip_code, images, ...restData } = p;
          
          const mappedProp = { 
            ...restData, 
            videoUrl: video_url, 
            zipCode: zip_code,
            images: Array.isArray(images) ? images : (typeof images === 'string' ? JSON.parse(images) : [])
          } as Property;

          const newPropWithSlug = { ...mappedProp, slug: generateSlug(mappedProp) };
          setProperties(prev => {
            const newList = [newPropWithSlug, ...prev];
            localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(newList));
            return newList;
          });
          if (newPropWithSlug.active !== false) {
            setActiveProperties(prev => [newPropWithSlug, ...prev]);
          }
          toast.success("Sucesso", "Imóvel cadastrado com sucesso!");
        }
      } else {
        const newProperty = { ...propertyData, id: Date.now().toString() } as Property;
        const newPropertyWithSlug = { ...newProperty, slug: generateSlug(newProperty) };
        const newProperties = [newPropertyWithSlug, ...properties];
        setProperties(newProperties);
        setActiveProperties(newProperties.filter(p => p.active !== false));
        localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(newProperties));
        toast.success("Sucesso", "Imóvel salvo localmente (Supabase não configurado).");
      }
    } catch (e: any) {
      console.error("Error adding property:", e);
      alert(`Erro ao salvar no banco: ${e.message || "Erro desconhecido"}. Verifique se todos os campos estão corretos.`);
    }
  };

  const updateProperty = async (updatedProperty: Property) => {
    try {
      if (isSupabaseConfigured) {
        const { videoUrl, zipCode, price, condominium, iptu, slug, ...rest } = updatedProperty;
        
        // Limpar formatação de moeda para salvar apenas números (centavos)
        const cleanPrice = price ? String(price).replace(/\D/g, "") : "0";
        const cleanCondominium = condominium ? String(condominium).replace(/\D/g, "") : "0";
        const cleanIptu = iptu ? String(iptu).replace(/\D/g, "") : "0";

        const { error } = await supabase
          .from('properties')
          .update({ 
            ...rest, 
            price: cleanPrice,
            condominium: cleanCondominium,
            iptu: cleanIptu,
            video_url: videoUrl, 
            zip_code: zipCode 
          })
          .eq('id', updatedProperty.id);

        if (error) {
          console.error("Supabase update error details:", error);
          throw new Error(error.message);
        }
        
        const updatedWithSlug = { ...updatedProperty, slug: generateSlug(updatedProperty) };
        const updatedList = properties.map(p => p.id === updatedProperty.id ? updatedWithSlug : p);
        setProperties(updatedList);
        setActiveProperties(updatedList.filter(p => p.active !== false));
        localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(updatedList));
        toast.success("Sucesso", "Imóvel atualizado com sucesso!");
      } else {
        const updatedWithSlug = { ...updatedProperty, slug: generateSlug(updatedProperty) };
        const newProperties = properties.map((p) => (p.id === updatedProperty.id ? updatedWithSlug : p));
        setProperties(newProperties);
        setActiveProperties(newProperties.filter(p => p.active !== false));
        localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(newProperties));
        toast.success("Sucesso", "Imóvel atualizado localmente.");
      }
    } catch (e: any) {
      console.error("Error updating property:", e);
      alert(`Erro ao atualizar no banco: ${e.message || "Erro desconhecido"}.`);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', id);

        if (error) throw error;
        const filtered = properties.filter(p => p.id !== id);
        setProperties(filtered);
        setActiveProperties(filtered.filter(p => p.active !== false));
        localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(filtered));
      } else {
        const newProperties = properties.filter((p) => (p.id !== id));
        setProperties(newProperties);
        setActiveProperties(newProperties.filter(p => p.active !== false));
        localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(newProperties));
      }
    } catch (e) {
      console.error("Error deleting property:", e);
    }
  };

  const duplicateProperty = async (id: string) => {
    const propertyToDuplicate = properties.find(p => p.id === id);
    if (!propertyToDuplicate) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, slug: __, created_at: ___, ...propertyData } = propertyToDuplicate;
    
    const newPropertyData = {
      ...propertyData,
      title: `${propertyData.title} (Cópia)`,
      active: false, // Começa inativo para revisão
      code: propertyData.code ? `${propertyData.code}-C` : ""
    };

    await addProperty(newPropertyData);
  };

  return (
    <PropertiesContext.Provider
      value={{ 
        properties, 
        activeProperties,
        loading, 
        addProperty, 
        updateProperty, 
        deleteProperty,
        duplicateProperty,
        refreshProperties: fetchProperties 
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
}
