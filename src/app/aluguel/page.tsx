"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import SearchFilter from "@/components/SearchFilter";
import { useProperties } from "@/store/PropertiesContext";

export default function AluguelPage() {
  const { properties, loading } = useProperties();
  const propertiesForRent = properties.filter((p) => p.type === "Aluguel");

  return (
    <>
      <Navbar />
      
      <div className="pt-32 pb-12 bg-slate-50">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Imóveis para Aluguel</h1>
            <p className="text-slate-500">As melhores opções de locação para você ou sua empresa.</p>
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
                {propertiesForRent.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
                {propertiesForRent.length === 0 && (
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
