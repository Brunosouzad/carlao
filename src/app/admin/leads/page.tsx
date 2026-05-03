"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, Search, Filter, Mail, Phone, Calendar, 
  CheckCircle2, Clock, AlertCircle, Trash2, ExternalLink 
} from "lucide-react";
import Link from "next/link";
import ConfirmModal from "@/components/admin/ConfirmModal";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: string;
  property_title: string;
  status: 'novo' | 'em_atendimento' | 'finalizado' | 'cancelado';
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({ isOpen: false, id: null });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Lead['status']) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error("Erro ao excluir lead:", err);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.property_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || l.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: Lead['status']) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'em_atendimento': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'finalizado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelado': return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Excluir Lead"
        message="Tem certeza que deseja excluir este lead permanentemente? Esta ação não pode ser desfeita."
        onConfirm={() => {
          if (confirmModal.id) deleteLead(confirmModal.id);
        }}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Users className="text-secondary" /> CRM de Leads
          </h1>
          <p className="text-slate-500 mt-1">Gerencie os contatos e solicitações recebidas pelo site.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou imóvel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-slate-400 shrink-0" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:w-48 py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none text-sm font-medium text-slate-600 bg-slate-50"
          >
            <option value="todos">Todos os Status</option>
            <option value="novo">Novo</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Lead / Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Imóvel de Interesse</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="font-bold text-primary">{lead.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Calendar size={12} />
                      {formatDate(lead.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-accent-blue transition-colors">
                        <Mail size={14} className="text-slate-400" /> {lead.email}
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-accent-blue transition-colors">
                          <Phone size={14} className="text-slate-400" /> {lead.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="max-w-xs">
                      <div className="text-sm font-semibold text-slate-700 line-clamp-1">{lead.property_title}</div>
                      {lead.property_id && (
                        <Link 
                          href={`/imovel/${lead.property_id}`}
                          target="_blank"
                          className="text-[10px] font-bold text-accent-blue hover:underline flex items-center gap-1 mt-1"
                        >
                          VER IMÓVEL <ExternalLink size={10} />
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <select 
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value as any)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer outline-none ${getStatusStyle(lead.status)}`}
                    >
                      <option value="novo">NOVO</option>
                      <option value="em_atendimento">EM ATENDIMENTO</option>
                      <option value="finalizado">FINALIZADO</option>
                      <option value="cancelado">CANCELADO</option>
                    </select>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => setConfirmModal({ isOpen: true, id: lead.id })}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Excluir Lead"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {loading && Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-8 h-20 bg-slate-50/20"></td>
                </tr>
              ))}
              
              {!loading && filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Users size={48} />
                      <p className="text-lg font-bold">Nenhum lead encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
