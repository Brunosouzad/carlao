"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, MapPin } from "lucide-react";

interface POI {
  name: string;
  category: string;
  distance: string;
}

interface CategoryGroup {
  category: string;
  icon: React.ReactNode;
  items: { name: string; dist: string }[];
}

export default function NeighborhoodPOIs({ location }: { location: string }) {
  const [poiGroups, setPoiGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPOIs = async () => {
      try {
        // 1. Geocode the address
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location + ", Brasil")}&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "CarlaoImoveis/1.0"
            }
          }
        );
        const geoData = await geoRes.json();
        
        if (geoData.length === 0) {
          setLoading(false);
          return;
        }

        const { lat, lon } = geoData[0];

        // 2. Query Overpass API for nearby POIs
        // Querying for: school, university, hospital, pharmacy, supermarket, park, gym, bakery
        const overpassQuery = `
          [out:json][timeout:25];
          (
            node["amenity"~"school|university|hospital|pharmacy|supermarket|park|gym|bakery"](around:1500, ${lat}, ${lon});
            way["amenity"~"school|university|hospital|pharmacy|supermarket|park|gym|bakery"](around:1500, ${lat}, ${lon});
            node["shop"~"supermarket|bakery"](around:1500, ${lat}, ${lon});
            node["leisure"~"park|fitness_centre"](around:1500, ${lat}, ${lon});
          );
          out body;
        `;

        const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: overpassQuery,
        });
        const overpassData = await overpassRes.json();

        // 3. Process and Group POIs
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // km
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);
          const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        const rawPois = overpassData.elements
          .map((el: any) => {
            const elLat = el.lat || el.center?.lat;
            const elLon = el.lon || el.center?.lon;
            if (!elLat || !elLon) return null;

            const dist = calculateDistance(parseFloat(lat), parseFloat(lon), elLat, elLon);
            return {
              name: el.tags.name || el.tags.amenity || el.tags.shop || el.tags.leisure || "Estabelecimento",
              category: el.tags.amenity || el.tags.shop || el.tags.leisure,
              distance: dist,
            };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => a.distance - b.distance);

        // Group by theme
        const groups: CategoryGroup[] = [
          {
            category: "Educação",
            icon: <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Check size={18} strokeWidth={3} /></div>,
            items: rawPois
              .filter((p: any) => ["school", "university"].includes(p.category))
              .slice(0, 3)
              .map((p: any) => ({ name: p.name, dist: p.distance < 1 ? `${Math.round(p.distance * 1000)}m` : `${p.distance.toFixed(1)}km` })),
          },
          {
            category: "Saúde",
            icon: <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Check size={18} strokeWidth={3} /></div>,
            items: rawPois
              .filter((p: any) => ["hospital", "pharmacy"].includes(p.category))
              .slice(0, 3)
              .map((p: any) => ({ name: p.name, dist: p.distance < 1 ? `${Math.round(p.distance * 1000)}m` : `${p.distance.toFixed(1)}km` })),
          },
          {
            category: "Lazer",
            icon: <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Check size={18} strokeWidth={3} /></div>,
            items: rawPois
              .filter((p: any) => ["park", "gym", "fitness_centre"].includes(p.category))
              .slice(0, 3)
              .map((p: any) => ({ name: p.name, dist: p.distance < 1 ? `${Math.round(p.distance * 1000)}m` : `${p.distance.toFixed(1)}km` })),
          },
          {
            category: "Serviços",
            icon: <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Check size={18} strokeWidth={3} /></div>,
            items: rawPois
              .filter((p: any) => ["supermarket", "bakery"].includes(p.category))
              .slice(0, 3)
              .map((p: any) => ({ name: p.name, dist: p.distance < 1 ? `${Math.round(p.distance * 1000)}m` : `${p.distance.toFixed(1)}km` })),
          },
        ].filter(g => g.items.length > 0);

        setPoiGroups(groups);
      } catch (err) {
        console.error("Error fetching POIs:", err);
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

  if (poiGroups.length === 0) {
    return null;
  }

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
              {cat.icon}
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
