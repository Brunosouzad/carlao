"use client";

import { ArrowUpDown } from "lucide-react";

export type SortOption = "newest" | "price_asc" | "price_desc" | "area_desc";

interface SortFilterProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalResults: number;
}

export default function SortFilter({ currentSort, onSortChange, totalResults }: SortFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div className="text-slate-500 text-sm font-medium ml-2">
        Mostrando <span className="text-primary font-bold">{totalResults}</span> imóvel{totalResults !== 1 ? 'is' : ''} encontrado{totalResults !== 1 ? 's' : ''}
      </div>
      
      <div className="flex items-center gap-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">
          Ordenar por:
        </label>
        <div className="relative group min-w-[180px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none transition-transform group-hover:scale-110">
            <ArrowUpDown size={14} strokeWidth={2.5} />
          </div>
          <select 
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/30 transition-all cursor-pointer appearance-none"
          >
            <option value="newest">Mais recentes</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="area_desc">Maior Área</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
