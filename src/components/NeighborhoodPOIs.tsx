"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface CategoryGroup {
  category: string;
  color: string;
  items: { name: string; dist: string }[];
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  red: 'bg-red-50 text-red-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
};

const emojiMap: Record<string, string> = {
  'Educação': '🎓',
  'Saúde': '🏥',
  'Lazer': '🌳',
  'Serviços': '🛒',
};

export default function NeighborhoodPOIs({ location }: { location: string }) {
  const [poiGroups, setPoiGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) return;

    const fetchPOIs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/pois?location=${encodeURIComponent(location)}`);
        const data = await res.json();
        setPoiGroups(data.groups || []);
      } catch (err) {
        console.error('Error fetching POIs:', err);
        setPoiGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPOIs();
  }, [location]);

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-slate-100">
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
          <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
          <p className="text-slate-400 font-medium font-oswald uppercase tracking-widest text-xs">Mapeando o entorno...</p>
        </div>
      </div>
    );
  }

  if (poiGroups.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-secondary font-bold tracking-widest text-[10px] uppercase mb-1 block font-oswald">Conveniência e Estilo de Vida</span>
          <h3 className="text-2xl font-bold text-primary font-oswald uppercase">O que tem por perto</h3>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider max-w-[200px] md:text-right">Dados reais integrados ao OpenStreetMap.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {poiGroups.map((cat, i) => (
          <div key={i} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-10 h-10 ${colorMap[cat.color] || 'bg-slate-50 text-slate-600'} rounded-xl flex items-center justify-center text-lg`}>
                {emojiMap[cat.category] || '📍'}
              </div>
              <h4 className="font-bold text-primary font-oswald uppercase tracking-wider">{cat.category}</h4>
            </div>
            <div className="space-y-4">
              {cat.items.map((item, j) => (
                <div key={j} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium capitalize truncate max-w-[180px]">{item.name.toLowerCase()}</span>
                  <span className="text-slate-400 font-bold bg-white px-2 py-1 rounded-lg border border-slate-100 text-[10px] whitespace-nowrap">{item.dist}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
