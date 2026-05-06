"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import SearchFilter from "@/components/SearchFilter";
import SortFilter, { SortOption } from "@/components/SortFilter";
import { useProperties } from "@/store/PropertiesContext";
import { X } from "lucide-react";

function PesquisaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { properties, loading } = useProperties();
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Parâmetros de busca
  const typeParam     = searchParams.get("type") || "";
  const categoryParam = searchParams.get("category") || "";
  const locationParam = searchParams.get("location") || "";
  const bedsParam     = searchParams.get("beds") || "";
  const bathsParam    = searchParams.get("baths") || "";
  const garagesParam  = searchParams.get("garages") || "";
  const codeParam     = searchParams.get("code") || "";
  const minAreaParam  = searchParams.get("minArea") || "";
  const maxAreaParam  = searchParams.get("maxArea") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const qParam        = searchParams.get("q") || ""; // tag search from property detail

  // Filtro completo
  const filteredProperties = useMemo(() => {
    const filtered = properties.filter((p) => {
      // Texto livre (tag ou q)
      if (qParam) {
        const q = qParam.toLowerCase();
        const inTitle    = p.title.toLowerCase().includes(q);
        const inLocation = p.location.toLowerCase().includes(q);
        const inDesc     = p.description?.toLowerCase().includes(q) ?? false;
        const inFeature  = (p.features || []).some(f => f.toLowerCase() === q);
        const inTag      = (p.tag || "").toLowerCase() === q;
        const inType     = p.type.toLowerCase() === q;
        if (!inTitle && !inLocation && !inDesc && !inFeature && !inTag && !inType) return false;
      }

      // Código exato
      if (codeParam && !p.code.toLowerCase().includes(codeParam.toLowerCase())) return false;

      // Tipo (Venda / Aluguel)
      if (typeParam && p.type !== typeParam) return false;

      // Categoria (Casa, Apartamento...)
      if (categoryParam && p.category !== categoryParam) return false;

      // Localização (substring)
      if (locationParam && !p.location.toLowerCase().includes(locationParam.toLowerCase())) return false;

      // Quartos mínimos
      if (bedsParam) {
        const min = parseInt(bedsParam, 10);
        if (!isNaN(min) && p.beds < min) return false;
      }

      // Banheiros mínimos
      if (bathsParam) {
        const min = parseInt(bathsParam, 10);
        if (!isNaN(min) && p.baths < min) return false;
      }

      // Garagens mínimas
      if (garagesParam) {
        const min = parseInt(garagesParam, 10);
        if (!isNaN(min) && p.garages < min) return false;
      }

      // Área mínima
      if (minAreaParam) {
        const min = parseFloat(minAreaParam);
        if (!isNaN(min) && p.area < min) return false;
      }

      // Área máxima
      if (maxAreaParam) {
        const max = parseFloat(maxAreaParam);
        if (!isNaN(max) && p.area > max) return false;
      }

      // Preço mínimo
      if (minPriceParam) {
        const min = parseFloat(minPriceParam);
        if (!isNaN(min) && parseFloat(p.price) < min) return false;
      }

      // Preço máximo
      if (maxPriceParam) {
        const max = parseFloat(maxPriceParam);
        if (!isNaN(max) && parseFloat(p.price) > max) return false;
      }

      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        return [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price_desc":
        return [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "area_desc":
        return [...filtered].sort((a, b) => b.area - a.area);
      case "newest":
      default:
        return filtered;
    }
  }, [properties, qParam, codeParam, typeParam, categoryParam, locationParam, bedsParam, bathsParam, garagesParam, minAreaParam, maxAreaParam, minPriceParam, maxPriceParam, sortBy]);

  // Chips de filtros ativos
  const activeFilters: { label: string; param: string }[] = [];
  if (qParam)         activeFilters.push({ label: `Tag: ${qParam}`, param: "q" });
  if (typeParam)      activeFilters.push({ label: typeParam, param: "type" });
  if (categoryParam)  activeFilters.push({ label: categoryParam, param: "category" });
  if (locationParam)  activeFilters.push({ label: `Local: ${locationParam}`, param: "location" });
  if (bedsParam)      activeFilters.push({ label: `${bedsParam}+ quartos`, param: "beds" });
  if (bathsParam)     activeFilters.push({ label: `${bathsParam}+ banheiros`, param: "baths" });
  if (garagesParam)   activeFilters.push({ label: `${garagesParam}+ vagas`, param: "garages" });
  if (minAreaParam)   activeFilters.push({ label: `Área mín. ${minAreaParam}m²`, param: "minArea" });
  if (maxAreaParam)   activeFilters.push({ label: `Área máx. ${maxAreaParam}m²`, param: "maxArea" });
  if (codeParam)      activeFilters.push({ label: `Código: ${codeParam}`, param: "code" });

  const removeFilter = (param: string) => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete(param);
    router.push(`/pesquisa?${current.toString()}`);
  };

  const clearAll = () => router.push("/pesquisa");

  return (
    <>
      <Navbar />

      <div className="pt-32 pb-12 bg-slate-50 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Resultados da Pesquisa</h1>
            <p className="text-slate-500">
              {filteredProperties.length === 0
                ? "Nenhum imóvel encontrado para os filtros aplicados."
                : `${filteredProperties.length} imóvel${filteredProperties.length !== 1 ? "is" : ""} encontrado${filteredProperties.length !== 1 ? "s" : ""}.`}
            </p>
          </div>

          {/* Chips de filtros ativos */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {activeFilters.map(f => (
                <span
                  key={f.param}
                  className="inline-flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/20 text-sm font-semibold px-4 py-1.5 rounded-full"
                >
                  {f.label}
                  <button
                    onClick={() => removeFilter(f.param)}
                    className="hover:text-red-500 transition-colors cursor-pointer"
                    title={`Remover filtro ${f.label}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-red-500 text-sm font-semibold px-3 py-1.5 rounded-full border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
              >
                <X size={14} /> Limpar tudo
              </button>
            </div>
          )}

          {/* Widget de busca */}
          <div className="mb-12">
            <SearchFilter compact />
          </div>

          {!loading && filteredProperties.length > 0 && (
            <SortFilter 
              currentSort={sortBy} 
              onSortChange={setSortBy} 
              totalResults={filteredProperties.length} 
            />
          )}

          {/* Grid de resultados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}

            {filteredProperties.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="text-6xl mb-4">🏡</div>
                <p className="text-slate-500 text-lg font-medium mb-2">Nenhum imóvel encontrado</p>
                <p className="text-slate-400 text-sm mb-6">Tente ajustar os filtros para ver mais resultados.</p>
                <button
                  onClick={clearAll}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Ver todos os imóveis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function PesquisaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary font-bold text-xl animate-pulse">Buscando imóveis...</div>
      </div>
    }>
      <PesquisaContent />
    </Suspense>
  );
}
