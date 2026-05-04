"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property, INITIAL_PROPERTIES } from "../data/properties";
import { supabase } from "../lib/supabase";
import { useToast } from "@/store/ToastContext";
import { generateSlug } from "@/utils/slug";

interface PropertiesContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (property: Omit<Property, "id">) => Promise<void>;
  updateProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType>({
  properties: INITIAL_PROPERTIES,
  loading: false,
  addProperty: async () => {},
  updateProperty: async () => {},
  deleteProperty: async () => {},
  refreshProperties: async () => {},
});

export function PropertiesProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Consideramos configurado se não for o placeholder padrão
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

  const fetchProperties = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn("Supabase fetch error, falling back to local:", error.message);
          toast.error("Erro ao carregar dados", "Não foi possível conectar ao banco de dados.");
          loadLocalData();
        } else if (data) {
          const mappedData = data.map((p: any) => {
            const { video_url, zip_code, images, ...rest } = p;
            // Garantir que images seja um array e videoUrl/zipCode sejam camelCase
            const mapped = { 
              ...rest, 
              videoUrl: video_url, 
              zipCode: zip_code,
              images: Array.isArray(images) ? images : (typeof images === 'string' ? JSON.parse(images) : [])
            } as Property;
            
            return { ...mapped, slug: generateSlug(mapped) };
          });
          setProperties(mappedData as Property[]);
        }
      } else {
        loadLocalData();
      }
    } catch (e) {
      console.error("Error in fetchProperties:", e);
      loadLocalData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalData = () => {
    if (typeof window === 'undefined') {
      setProperties(INITIAL_PROPERTIES);
      return;
    }

    const stored = localStorage.getItem("@carlao-imoveis:properties");
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((p: Property) => ({ ...p, slug: generateSlug(p) }));
        setProperties(parsed);
      } catch (e) {
        const local = INITIAL_PROPERTIES.map(p => ({ ...p, slug: generateSlug(p) }));
        setProperties(local);
      }
    } else {
      const local = INITIAL_PROPERTIES.map(p => ({ ...p, slug: generateSlug(p) }));
      setProperties(local);
      localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(local));
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (propertyData: Omit<Property, "id">) => {
    try {
      if (isSupabaseConfigured) {
        const { videoUrl, zipCode, ...rest } = propertyData;
        const { data, error } = await supabase
          .from('properties')
          .insert([{ ...rest, video_url: videoUrl, zip_code: zipCode }])
          .select();

        if (error) throw error;
        if (data) {
          setProperties(prev => [data[0] as Property, ...prev]);
        }
      } else {
        const newProperty = { ...propertyData, id: Date.now().toString() } as Property;
        const newProperties = [newProperty, ...properties];
        setProperties(newProperties);
        localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(newProperties));
      }
    } catch (e) {
      console.error("Error adding property:", e);
      alert("Erro ao salvar no banco. Verifique se a tabela 'properties' foi criada no Supabase.");
    }
  };

  const updateProperty = async (updatedProperty: Property) => {
    try {
      if (isSupabaseConfigured) {
        const { videoUrl, zipCode, ...rest } = updatedProperty;
        const { error } = await supabase
          .from('properties')
          .update({ ...rest, video_url: videoUrl, zip_code: zipCode })
          .eq('id', updatedProperty.id);

        if (error) throw error;
        setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
      } else {
        const newProperties = properties.map((p) => (p.id === updatedProperty.id ? updatedProperty : p));
        setProperties(newProperties);
        localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(newProperties));
      }
    } catch (e) {
      console.error("Error updating property:", e);
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
        setProperties(prev => prev.filter(p => p.id !== id));
      } else {
        const newProperties = properties.filter((p) => (p.id !== id));
        setProperties(newProperties);
        localStorage.setItem("@carlao-imoveis:properties", JSON.stringify(newProperties));
      }
    } catch (e) {
      console.error("Error deleting property:", e);
    }
  };

  return (
    <PropertiesContext.Provider
      value={{ 
        properties, 
        loading, 
        addProperty, 
        updateProperty, 
        deleteProperty,
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
