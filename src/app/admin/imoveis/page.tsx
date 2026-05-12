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
  
  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Todos");
  const [filterCategory, setFilterCategory] = useState("Todas");

  const handleDelete = (id: string) => {
    deleteProperty(id);
  };

  // Lógica de filtragem
  const filteredProperties = properties.filter(prop => {
    const matchesSearch = 
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "Todos" || prop.type === filterType;
    const matchesCategory = filterCategory === "Todas" || prop.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Lista de categorias únicas presentes nos imóveis
  const categories = ["Todas", ...Array.from(new Set(properties.map(p => p.category)))].sort();

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
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-oswald uppercase tracking-tight">Gerenciar <span className="text-secondary">Imóveis</span></h1>
        <Link 
          href="/admin/imoveis/novo" 
          className="bg-primary text-white px-5 py-2.5 rounded-none flex items-center gap-2 hover:bg-slate-900 transition-all font-bold font-oswald uppercase tracking-widest text-sm shadow-lg shadow-slate-200"
        >
          <Plus size={20} />
          Novo Imóvel
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-4 border border-slate-100 shadow-sm">
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Buscar por Título, Código ou Local</label>
          <input 
            type="text" 
            placeholder="Ex: IMOV 123 ou Centro..."
            className="w-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Tipo</label>
          <select 
            className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Todos">Todos os tipos</option>
            <option value="Venda">Venda</option>
            <option value="Aluguel">Aluguel</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Categoria</label>
          <select 
            className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary transition-colors cursor-pointer"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === "Todas" ? "Todas categorias" : cat}</option>
            ))}
          </select>
        </div>
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
            {filteredProperties.map((prop) => (
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
            {filteredProperties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-slate-500 font-medium">Nenhum imóvel encontrado para os filtros aplicados.</p>
                  {(searchTerm || filterType !== "Todos" || filterCategory !== "Todas") && (
                    <button 
                      onClick={() => { setSearchTerm(""); setFilterType("Todos"); setFilterCategory("Todas"); }}
                      className="text-secondary font-bold text-xs uppercase tracking-widest mt-4 hover:underline"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
