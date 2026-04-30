"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Minus, Plus, MapPin, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProperties } from "@/store/PropertiesContext";

interface SearchWidgetProps {
  compact?: boolean;
}

export default function SearchWidget({ compact }: SearchWidgetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties } = useProperties();
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Basic States
  const [finalidade, setFinalidade] = useState(searchParams.get("type") || "Venda");
  const [tipo, setTipo] = useState(searchParams.get("category") || "Todos os tipos");
  const [cidade, setCidade] = useState(searchParams.get("location")?.split(',')[0] || "");
  const [bairro, setBairro] = useState(searchParams.get("neighborhood") || searchParams.get("location")?.split(',')[1]?.trim() || "");
  const [valorMax, setValorMax] = useState("");

  // Get unique cities from properties
  const availableCities = useMemo(() => {
    const cities = properties.map(p => {
      if ((p as any).city) return (p as any).city;
      
      // Try to extract city: typically "Neighborhood, City - State" or "Neighborhood - City"
      const parts = p.location.split(/[,\-/]/);
      if (parts.length >= 2) {
        // If 3 parts, city is likely the second one (e.g., Bairro, Cidade, Estado)
        // If 2 parts, city is the second one
        const cityIndex = parts.length >= 3 ? 1 : 1;
        return parts[cityIndex].trim();
      }
      return "";
    }).filter(Boolean);
    return Array.from(new Set(cities)).sort();
  }, [properties]);

  // Get unique neighborhoods for the selected city
  const availableNeighborhoods = useMemo(() => {
    if (!cidade) return [];
    const neighborhoods = properties
      .filter(p => {
        if ((p as any).city) return (p as any).city === cidade;
        const pParts = p.location.split(/[,\-/]/);
        const pCity = pParts.length >= 2 ? (pParts.length >= 3 ? pParts[1].trim() : pParts[1].trim()) : "";
        return pCity.toLowerCase() === cidade.toLowerCase();
      })
      .map(p => {
        if ((p as any).neighborhood) return (p as any).neighborhood;
        return p.location.split(/[,\-/]/)[0]?.trim();
      })
      .filter(Boolean);
    return Array.from(new Set(neighborhoods)).sort();
  }, [properties, cidade]);

  // Reset neighborhood when city changes
  useEffect(() => {
    if (cidade && availableNeighborhoods.length > 0 && !availableNeighborhoods.includes(bairro)) {
      setBairro("");
    }
  }, [cidade, availableNeighborhoods]);

  // Advanced States
  const [beds, setBeds] = useState(searchParams.get("beds") || "Qualquer");
  const [baths, setBaths] = useState(searchParams.get("baths") || "Qualquer");
  const [garages, setGarages] = useState(searchParams.get("garages") || "Qualquer");
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 10000000);
  const [minArea, setMinArea] = useState(searchParams.get("minArea") || "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") || "");
  const [propertyId, setPropertyId] = useState(searchParams.get("code") || "");

  // Sync with URL on load
  useEffect(() => {
    const maxP = searchParams.get("maxPrice");
    if (maxP && !isAdvanced) {
      const val = parseInt(maxP);
      if (!isNaN(val)) setValorMax(val.toLocaleString('pt-BR'));
    }
  }, [searchParams, isAdvanced]);

  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    if (!numeric) return "";
    const amount = parseInt(numeric);
    return amount.toLocaleString('pt-BR');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorMax(formatCurrency(e.target.value));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (finalidade) params.set("type", finalidade);
    if (tipo !== "Todos os tipos") params.set("category", tipo);
    const locParts = [cidade, bairro].filter(Boolean);
    if (locParts.length > 0) params.set("location", locParts.join(", "));
    
    if (isAdvanced) {
      if (beds !== "Qualquer") params.set("beds", beds);
      if (baths !== "Qualquer") params.set("baths", baths);
      if (garages !== "Qualquer") params.set("garages", garages);
      if (minArea.trim()) params.set("minArea", minArea.trim());
      if (maxArea.trim()) params.set("maxArea", maxArea.trim());
      if (propertyId.trim()) params.set("code", propertyId.trim());
      params.set("minPrice", String(minPrice));
      params.set("maxPrice", String(maxPrice));
    } else if (valorMax) {
      const numeric = valorMax.replace(/\D/g, "");
      params.set("maxPrice", numeric);
    }
    
    router.push(`/pesquisa?${params.toString()}`);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 relative z-20 ${compact ? 'scale-95 origin-top' : ''}`}>
      <div className={`bg-white shadow-[0_8px_30px_-10px_rgba(0,0,0,0.12)] transition-all duration-300 ${isAdvanced ? 'rounded-[2rem] p-6 lg:p-8' : 'rounded-[1.5rem] p-4 lg:p-6 lg:px-8'}`}>
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          
          {/* Main Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            
            {/* Finalidade */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-widest ml-1">Finalidade</label>
              <div className="relative">
                <select 
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  className="w-full h-11 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-3 text-xs font-bold text-[#4C4D4F] focus:outline-none focus:ring-1 focus:ring-secondary/20 appearance-none cursor-pointer"
                >
                  <option value="Venda">Venda</option>
                  <option value="Aluguel">Aluguel</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C4D4F]/30 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Tipo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-widest ml-1">Tipo</label>
              <div className="relative">
                <select 
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full h-11 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-3 text-xs font-bold text-[#4C4D4F] focus:outline-none focus:ring-1 focus:ring-secondary/20 appearance-none cursor-pointer"
                >
                  <option value="Todos os tipos">Todos os tipos</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Área">Área</option>
                  <option value="Barracão">Barracão</option>
                  <option value="Casa">Casa</option>
                  <option value="Chácara">Chácara</option>
                  <option value="Fazenda">Fazenda</option>
                  <option value="Galpão">Galpão</option>
                  <option value="Loja">Loja</option>
                  <option value="Lote">Lote</option>
                  <option value="Prédio">Prédio</option>
                  <option value="Sala">Sala</option>
                  <option value="Sítio">Sítio</option>
                  <option value="Quitinete">Quitinete</option>
                  <option value="Pousada">Pousada</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C4D4F]/30 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Cidade */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-widest ml-1">Cidade</label>
              <div className="relative">
                <select 
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full h-11 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-3 pr-8 text-xs font-bold text-[#4C4D4F] focus:outline-none focus:ring-1 focus:ring-secondary/20 appearance-none cursor-pointer"
                >
                  <option value="">Todas cidades</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C4D4F]/30 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Bairro */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-widest ml-1">Bairro</label>
              <div className="relative">
                <select 
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  disabled={!cidade}
                  className="w-full h-11 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl px-3 pr-8 text-xs font-bold text-[#4C4D4F] focus:outline-none focus:ring-1 focus:ring-secondary/20 appearance-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">Todos bairros</option>
                  {availableNeighborhoods.map(nb => (
                    <option key={nb} value={nb}>{nb}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C4D4F]/30 pointer-events-none" size={14} />
              </div>
            </div>

            {/* Valor Máximo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-widest ml-1">Valor Máximo</label>
              {isAdvanced ? (
                <div className="h-11 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-bold text-secondary truncate">
                  {minPrice > 0 ? `R$ ${minPrice.toLocaleString()} - ` : ""} R$ {maxPrice.toLocaleString()}
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#4C4D4F]/30">R$</span>
                  <input 
                    type="text"
                    placeholder="0,00"
                    value={valorMax}
                    onChange={handlePriceChange}
                    className="w-full h-11 bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl pl-8 pr-4 text-xs font-bold text-[#4C4D4F] focus:outline-none focus:ring-1 focus:ring-secondary/20 placeholder:text-[#4C4D4F]/30"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button 
                type="submit"
                className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-secondary/10"
              >
                <Search size={16} strokeWidth={3} />
                BUSCAR
              </button>
            </div>

          </div>

          <AnimatePresence>
            {isAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t border-slate-100 mt-2 space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-wider">Faixa de Preço</span>
                      <span className="text-xs font-bold text-secondary">
                        R$ {minPrice.toLocaleString('pt-BR')} — R$ {maxPrice.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="relative h-4 flex items-center">
                      <div className="absolute w-full h-1 bg-slate-100 rounded-full" />
                      <div 
                        className="absolute h-1 bg-secondary rounded-full" 
                        style={{ 
                          left: `${(minPrice / 10000000) * 100}%`, 
                          right: `${100 - (maxPrice / 10000000) * 100}%` 
                        }} 
                      />
                      
                      {/* Min Slider */}
                      <input 
                        type="range" min="0" max="10000000" step="50000" 
                        value={minPrice} 
                        onChange={e => setMinPrice(Math.min(Number(e.target.value), maxPrice - 50000))}
                        className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto" 
                      />
                      
                      {/* Max Slider */}
                      <input 
                        type="range" min="0" max="10000000" step="50000" 
                        value={maxPrice} 
                        onChange={e => setMaxPrice(Math.max(Number(e.target.value), minPrice + 50000))}
                        className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { label: "Quartos", state: beds, setState: setBeds, options: ["Qualquer", "1", "2", "3", "4"] },
                      { label: "Banheiros", state: baths, setState: setBaths, options: ["Qualquer", "1", "2", "3"] },
                      { label: "Garagens", state: garages, setState: setGarages, options: ["Qualquer", "1", "2", "3"] },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-widest ml-1">{item.label}</label>
                        <div className="relative">
                          <select value={item.state} onChange={(e) => item.setState(e.target.value)} className="w-full h-10 bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg px-3 text-[11px] font-bold text-[#4C4D4F] focus:outline-none appearance-none cursor-pointer">
                            {item.options.map(opt => <option key={opt} value={opt}>{opt}{opt !== "Qualquer" ? "+" : ""}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4C4D4F]/30 pointer-events-none" size={12} />
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-widest ml-1">Área (m²)</label>
                      <div className="flex gap-1.5">
                        <input type="number" placeholder="Min" value={minArea} onChange={e => setMinArea(e.target.value)} className="w-full h-10 bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg px-3 text-[11px] font-bold text-[#4C4D4F] focus:outline-none" />
                        <input type="number" placeholder="Max" value={maxArea} onChange={e => setMaxArea(e.target.value)} className="w-full h-10 bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg px-3 text-[11px] font-bold text-[#4C4D4F] focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-[#4C4D4F]/50 uppercase tracking-widest ml-1">Código</label>
                      <input type="text" placeholder="Ex: CV-123" value={propertyId} onChange={e => setPropertyId(e.target.value)} className="w-full h-10 bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg px-3 text-[11px] font-bold text-[#4C4D4F] focus:outline-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Secondary Links Row */}
          <div className="flex items-center gap-4 mt-1 ml-1">
            <button 
              type="button"
              onClick={() => { setIsAdvanced(true); setTimeout(() => document.querySelector<HTMLInputElement>('input[placeholder="Ex: CV-123"]')?.focus(), 300); }}
              className="text-[9px] font-bold text-[#4C4D4F]/40 hover:text-secondary uppercase tracking-[0.1em] flex items-center gap-1.5 transition-colors"
            >
              <Search size={10} strokeWidth={3} />
              Busca por código
            </button>
            <div className="w-1 h-1 bg-slate-100 rounded-full"></div>
            <button 
              type="button"
              onClick={() => setIsAdvanced(!isAdvanced)}
              className="text-[9px] font-bold text-[#4C4D4F]/40 hover:text-secondary uppercase tracking-[0.1em] transition-colors flex items-center gap-1.5"
            >
              {isAdvanced ? <Minus size={10} strokeWidth={3} /> : <Plus size={10} strokeWidth={3} />}
              {isAdvanced ? "Menos filtros" : "Mais filtros"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
