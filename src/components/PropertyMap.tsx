"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom pin: teal marker with orange house icon
const getCustomIcon = () => {
  if (typeof window === 'undefined') return null;
  return L.divIcon({
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
};

interface PropertyMapProps {
  location: string;
  title?: string;
  className?: string;
}

export default function PropertyMap({ location, title, className = "h-[350px]" }: PropertyMapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Geocode the address using Nominatim (OpenStreetMap free geocoder)
    const geocode = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        const data = await res.json();
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      } finally {
        setLoading(false);
      }
    };
    geocode();
  }, [location]);

  if (loading) {
    return (
      <div className={`${className} rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center`}>
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Carregando mapa...</span>
        </div>
      </div>
    );
  }

  if (!coords) {
    return (
      <div className={`${className} rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center`}>
        <span className="text-slate-400 text-sm">Não foi possível localizar o endereço no mapa.</span>
      </div>
    );
  }

  const [mapEnabled, setMapEnabled] = useState(false);

  return (
    <div className={`${className} rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0`}>
      {/* Interaction Lock for Mobile */}
      {!mapEnabled && (
        <div 
          onClick={() => setMapEnabled(true)}
          className="absolute inset-0 z-10 bg-black/5 flex items-center justify-center cursor-pointer group md:hidden"
        >
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 transition-transform group-active:scale-95">
            <span className="text-xs font-bold text-primary">Toque para interagir com o mapa</span>
          </div>
        </div>
      )}

      <MapContainer
        center={coords}
        zoom={15}
        scrollWheelZoom={false}
        dragging={typeof window !== 'undefined' && window.innerWidth < 768 ? mapEnabled : true}
        touchZoom={typeof window !== 'undefined' && window.innerWidth < 768 ? mapEnabled : true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords} icon={getCustomIcon() as L.DivIcon}>
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
