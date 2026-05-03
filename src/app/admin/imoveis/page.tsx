"use client";

import { useProperties } from "@/store/PropertiesContext";
import Link from "next/link";
import { Edit, Trash2, Plus } from "lucide-react";
import { formatPrice } from "@/utils/format";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useState } from "react";

export default function AdminImoveis() {
  const { properties, deleteProperty } = useProperties();
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({ isOpen: false, id: null });

  const handleDelete = (id: string) => {
    deleteProperty(id);
  };

  return (
    <div>
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Excluir Imóvel"
        message="Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita."
        onConfirm={() => {
          if (confirmModal.id) handleDelete(confirmModal.id);
        }}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Imóveis</h1>
        <Link 
          href="/admin/imoveis/novo" 
          className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus size={20} />
          Novo Imóvel
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Foto</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Código / Título</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tipo</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Preço</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((prop) => (
              <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-200">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-primary">{prop.title}</p>
                  <p className="text-xs text-slate-500 font-medium">{prop.code} • {prop.location}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    prop.type === 'Venda' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {prop.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {formatPrice(prop.price)}
                  {prop.type === "Aluguel" && <span className="text-xs text-slate-400 ml-1">/mês</span>}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/imoveis/${prop.id}/editar`}
                    className="inline-flex p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => setConfirmModal({ isOpen: true, id: prop.id })}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  Nenhum imóvel encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
