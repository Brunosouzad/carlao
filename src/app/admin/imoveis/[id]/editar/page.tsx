"use client";

import { useParams } from "next/navigation";
import { useProperties } from "@/store/PropertiesContext";
import PropertyForm from "@/components/admin/PropertyForm";

export default function EditarImovel() {
  const { id } = useParams();
  const { properties } = useProperties();
  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-lg">Imóvel não encontrado.</p>
      </div>
    );
  }

  return <PropertyForm property={property} mode="edit" />;
}
