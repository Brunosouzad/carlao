"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import SearchFilter from "@/components/SearchFilter";
import { useProperties } from "@/store/PropertiesContext";

export default function VendaPage() {
  const { properties, loading } = useProperties();
  const propertiesForSale = properties.filter((p) => p.type === "Venda");

  return (
    <>
      <Navbar />
      
      <div className="pt-32 pb-12 bg-slate-50">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Imóveis à Venda</h1>
            <p className="text-slate-500">Encontre a casa dos seus sonhos com as melhores condições.</p>
          </div>
          
          <div className="mb-12">
            <Suspense fallback={<div className="h-20 bg-slate-100 animate-pulse rounded-xl" />}>
              <SearchFilter compact />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            ) : (
              <>
                {propertiesForSale.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
                {propertiesForSale.length === 0 && (
                  <div className="col-span-full py-24 text-center">
                    <p className="text-slate-500 text-lg">Nenhum imóvel encontrado.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
