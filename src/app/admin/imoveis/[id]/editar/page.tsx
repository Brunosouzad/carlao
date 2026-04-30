"use client";

import React from "react";
import { useProperties } from "@/store/PropertiesContext";
import PropertyForm from "@/components/admin/PropertyForm";

export default function EditarImovel({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { properties } = useProperties();
  const property = properties.find(p => String(p.id) === String(id));

  if (!property) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-lg">Imóvel não encontrado.</p>
      </div>
    );
  }

  return <PropertyForm property={property} mode="edit" />;
}
