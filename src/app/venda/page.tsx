"use client";

import { Suspense, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import SearchFilter from "@/components/SearchFilter";
import SortFilter, { SortOption } from "@/components/SortFilter";
import Pagination from "@/components/Pagination";
import { useProperties } from "@/store/PropertiesContext";

export default function VendaPage() {
  const { activeProperties: properties, loading } = useProperties();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const propertiesForSale = useMemo(() => {
    const filtered = properties.filter((p) => p.type === "Venda");
    
    switch (sortBy) {
      case "price_asc":
        return [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price_desc":
        return [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "area_desc":
        return [...filtered].sort((a, b) => b.area - a.area);
      case "newest":
      default:
        return filtered; // Context already returns newest first
    }
  }, [properties, sortBy]);

  return (
    <>
      <Navbar />
      
      <div className="pt-32 pb-12 bg-slate-50 min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Imóveis à Venda</h1>
            <p className="text-slate-500">Encontre a casa dos seus sonhos com as melhores condições.</p>
          </div>
          
          <div className="mb-8">
            <Suspense fallback={<div className="h-20 bg-slate-100 animate-pulse rounded-xl" />}>
              <SearchFilter compact />
            </Suspense>
          </div>

          {!loading && propertiesForSale.length > 0 && (
            <SortFilter 
              currentSort={sortBy} 
              onSortChange={setSortBy} 
              totalResults={propertiesForSale.length} 
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            ) : (
              <>
                {propertiesForSale.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
                {propertiesForSale.length === 0 && (
                  <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-6xl mb-4">🏡</div>
                    <p className="text-slate-500 text-lg font-medium mb-2">Nenhum imóvel encontrado</p>
                    <p className="text-slate-400 text-sm">Tente ajustar os filtros para ver mais resultados.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {!loading && propertiesForSale.length > itemsPerPage && (
            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(propertiesForSale.length / itemsPerPage)}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
