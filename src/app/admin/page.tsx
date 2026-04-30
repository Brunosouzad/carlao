"use client";

import { useProperties } from "@/store/PropertiesContext";
import { Building, DollarSign, Home, TrendingUp, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { INITIAL_PROPERTIES } from "@/data/properties";
import { formatPrice } from "@/utils/format";

export default function AdminDashboard() {
  const { properties, loading, refreshProperties } = useProperties();
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");

  const totalProperties = properties.length;
  const totalVenda = properties.filter(p => p.type === "Venda").length;
  const totalAluguel = properties.filter(p => p.type === "Aluguel").length;

  const totalValueVenda = properties
    .filter(p => p.type === "Venda")
    .reduce((acc, curr) => acc + Number(String(curr.price).replace(/\D/g, '') || 0), 0);

  const handleSync = async () => {
    if (!confirm("Deseja enviar os dados iniciais para o Supabase? Isso pode criar duplicatas se a tabela não estiver vazia.")) return;
    
    setSyncing(true);
    setSyncStatus("idle");
    
    try {
      // Remove IDs para o Supabase gerar novos UUIDs e ajusta nomes de colunas
      const dataToSync = INITIAL_PROPERTIES.map(({ id, ...rest }) => {
        return {
          code: rest.code,
          title: rest.title,
          location: rest.location,
          price: rest.price,
          beds: rest.beds,
          baths: rest.baths,
          garages: rest.garages,
          area: rest.area,
          type: rest.type,
          category: rest.category,
          image: rest.image,
          images: rest.images || [],
          features: rest.features || [],
          tag: rest.tag || null,
          description: rest.description || null,
          video_url: rest.videoUrl || null
        };
      });
      
      const { error } = await supabase
        .from('properties')
        .insert(dataToSync);

      if (error) throw error;
      
      setSyncStatus("success");
      await refreshProperties();
    } catch (e: any) {
      console.error("Erro completo na sincronização:", e);
      alert(`Erro: ${e.message || "Erro desconhecido"}. Verifique o console para detalhes.`);
      setSyncStatus("error");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncStatus("idle"), 5000);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
        
        <button 
          onClick={handleSync}
          disabled={syncing}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
            syncStatus === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
            syncStatus === "error" ? "bg-red-50 border-red-200 text-red-600" :
            "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          } cursor-pointer`}
        >
          {syncing ? <RefreshCw size={18} className="animate-spin" /> : 
           syncStatus === "success" ? <CheckCircle2 size={18} /> :
           syncStatus === "error" ? <AlertCircle size={18} /> :
           <RefreshCw size={18} />}
          {syncing ? "Sincronizando..." : 
           syncStatus === "success" ? "Sincronizado!" :
           syncStatus === "error" ? "Erro ao Sincronizar" :
           "Sincronizar Dados Iniciais"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Building size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total de Imóveis</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : totalProperties}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">À Venda</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : totalVenda}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Home size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Para Aluguel</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : totalAluguel}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">VGV (Vendas)</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {loading ? "..." : formatPrice(totalValueVenda)}
            </h3>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-primary mb-6">Imóveis Adicionados Recentemente</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Código</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Título</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tipo</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Preço</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.slice(0, 5).map((prop) => (
              <tr key={prop.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{prop.code}</td>
                <td className="px-6 py-4 text-sm text-primary font-medium">{prop.title}</td>
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
              </tr>
            ))}
            {!loading && properties.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Nenhum imóvel cadastrado no Supabase. Use o botão de sincronizar acima para popular os dados iniciais.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500 animate-pulse">
                  Carregando imóveis...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
