"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "../data/properties";

interface CompareContextType {
  compareList: string[];
  toggleCompare: (id: string) => "added" | "removed" | "limit";
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType>({
  compareList: [],
  toggleCompare: () => "limit",
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

  const toggleCompare = (id: string): "added" | "removed" | "limit" => {
    if (compareList.includes(id)) {
      const newList = compareList.filter(pId => pId !== id);
      setCompareList(newList);
      localStorage.setItem("@carlao-imoveis:compare", JSON.stringify(newList));
      return "removed";
    }

    if (compareList.length >= 4) {
      return "limit";
    }

    const newList = [...compareList, id];
    setCompareList(newList);
    localStorage.setItem("@carlao-imoveis:compare", JSON.stringify(newList));
    return "added";
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
