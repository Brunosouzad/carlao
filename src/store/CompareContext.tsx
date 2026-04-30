"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "../data/properties";

interface CompareContextType {
  compareList: string[];
  toggleCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType>({
  compareList: [],
  toggleCompare: () => {},
  isInCompare: () => false,
  clearCompare: () => {},
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("@carlao-imoveis:compare");
    if (stored) {
      try {
        setCompareList(JSON.parse(stored));
      } catch (e) {
        console.error("Erro ao carregar comparação:", e);
      }
    }
  }, []);

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        const newList = prev.filter(pId => pId !== id);
        localStorage.setItem("@carlao-imoveis:compare", JSON.stringify(newList));
        return newList;
      }
      
      if (prev.length >= 4) {
        alert("Você pode comparar no máximo 4 imóveis por vez.");
        return prev;
      }

      const newList = [...prev, id];
      localStorage.setItem("@carlao-imoveis:compare", JSON.stringify(newList));
      return newList;
    });
  };

  const isInCompare = (id: string) => compareList.includes(id);

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem("@carlao-imoveis:compare");
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
