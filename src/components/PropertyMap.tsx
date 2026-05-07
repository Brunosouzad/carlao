"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom pin: teal marker with orange house icon
const createCustomIcon = () =>
  L.divIcon({
    className: "",
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -52],
    html: `
      <svg width="40" height="52" viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C8.954 0 0 8.954 0 20c0 14.36 18.18 30.76 18.95 31.44a1.5 1.5 0 0 0 2.1 0C21.82 50.76 40 34.36 40 20 40 8.954 31.046 0 20 0z" fill="#1B8A9E"/>
        <circle cx="20" cy="19" r="13" fill="white"/>
        <path d="M20 11l-8 7h2v6h4v-4h4v4h4v-6h2l-8-7z" fill="#E8913A"/>
      </svg>
    `,
  });

interface PropertyMapProps {
  location: string;
  title?: string;
  className?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
}

export default function PropertyMap({ location, title, className = "h-[350px]", city, neighborhood, street }: PropertyMapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth < 768);
    
    // Geocode the address using Nominatim (OpenStreetMap free geocoder)
    const geocode = async () => {
      try {
        let extractedCity = city;
        let extractedNeighborhood = neighborhood;
        let extractedStreet = street;
        
        // Se as props não existirem, tentar extrair da string location
        // Formato comum: "Rua X, 100 - Bairro, Cidade" ou "Bairro, Cidade"
        if (!extractedCity && location) {
          const parts = location.split(/[,\\-]/).map(p => p.trim());
          if (parts.length >= 3) {
             extractedCity = parts[parts.length - 1];
             extractedNeighborhood = parts[parts.length - 2];
             extractedStreet = parts.slice(0, parts.length - 2).join(', ');
          } else if (parts.length === 2) {
             extractedCity = parts[1];
             extractedNeighborhood = parts[0];
          } else {
             extractedCity = location;
          }
        }

        const baseLocation = location.replace(/[-–—]/g, ',').split(',').map(s => s.trim()).filter(Boolean).join(', ');
        
        const fallbacks = [
          baseLocation + ", Minas Gerais, Brasil",
          location + ", Brasil",
          `${extractedStreet}, ${extractedCity}, Minas Gerais, Brasil`,
          `${extractedNeighborhood}, ${extractedCity}, Minas Gerais, Brasil`,
          `${extractedCity}, Minas Gerais, Brasil`,
          "Coronel Fabriciano, MG, Brasil" // Último recurso se tudo falhar e for na região
        ];
        
        const uniqueFallbacks = Array.from(new Set(fallbacks));
        
        for (const query of uniqueFallbacks) {
          if (query.length < 3) continue;
          
          try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
            const res = await fetch(url, {
              headers: {
                "Accept-Language": "pt-BR"
              }
            });
            
            if (!res.ok) continue;
            
            const data = await res.json();
            if (data && data.length > 0) {
              setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
              setLoading(false);
              return;
            }
          } catch (fetchErr) {
            console.warn("Geocoding try failed:", query, fetchErr);
          }
          
          await new Promise(r => setTimeout(r, 800));
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      } finally {
        setLoading(false);
      }
    };
    geocode();
  }, [location, street, neighborhood, city]);

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className={`${className} rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center`}>
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Carregando mapa...</span>
        </div>
      </div>
    );
  }

  if (!coords) {
    return (
      <div className={`${className} rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center`}>
        <span className="text-slate-400 text-sm">Não foi possível localizar o endereço no mapa.</span>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-none overflow-hidden border border-slate-200 shadow-sm relative z-0`}>
      <MapContainer
        key={`${coords[0]}-${coords[1]}`}
        center={coords}
        zoom={15}
        scrollWheelZoom={false}
        dragging={!isMobile}
        touchZoom={!isMobile}
        doubleClickZoom={!isMobile}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords} icon={createCustomIcon()}>
          <Popup>
            <strong>{title || "Imóvel"}</strong>
            <br />
            <span className="text-xs">{location}</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
