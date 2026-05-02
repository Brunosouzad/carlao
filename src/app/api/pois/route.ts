import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'location is required' }, { status: 400 });
  }

  try {
    // 1. Geocode via Nominatim (server-side, sem CORS)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location + ', Brasil')}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'CarlaoImoveis/1.0 (carlaoimoveisva@gmail.com)',
          'Accept-Language': 'pt-BR,pt;q=0.9',
        },
      }
    );
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json({ groups: [] });
    }

    const { lat, lon } = geoData[0];

    // 2. Overpass API (server-side)
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"~"school|university|hospital|pharmacy|supermarket|bakery"](around:1500,${lat},${lon});
        way["amenity"~"school|university|hospital|pharmacy|supermarket|bakery"](around:1500,${lat},${lon});
        node["shop"~"supermarket|bakery"](around:1500,${lat},${lon});
        node["leisure"~"park|fitness_centre"](around:1500,${lat},${lon});
      );
      out body;
    `;

    const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      headers: { 'Content-Type': 'text/plain' },
    });
    const overpassData = await overpassRes.json();

    // 3. Calcular distâncias e agrupar
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const rawPois = overpassData.elements
      .map((el: any) => {
        const elLat = el.lat ?? el.center?.lat;
        const elLon = el.lon ?? el.center?.lon;
        if (!elLat || !elLon) return null;
        const dist = calculateDistance(parseFloat(lat), parseFloat(lon), elLat, elLon);
        return {
          name: el.tags?.name || el.tags?.amenity || el.tags?.shop || el.tags?.leisure || 'Estabelecimento',
          category: el.tags?.amenity || el.tags?.shop || el.tags?.leisure,
          distance: dist,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.distance - b.distance);

    const formatDist = (d: number) => (d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)}km`);

    const groups = [
      {
        category: 'Educação',
        color: 'blue',
        items: rawPois.filter((p: any) => ['school', 'university'].includes(p.category)).slice(0, 3).map((p: any) => ({ name: p.name, dist: formatDist(p.distance) })),
      },
      {
        category: 'Saúde',
        color: 'red',
        items: rawPois.filter((p: any) => ['hospital', 'pharmacy'].includes(p.category)).slice(0, 3).map((p: any) => ({ name: p.name, dist: formatDist(p.distance) })),
      },
      {
        category: 'Lazer',
        color: 'green',
        items: rawPois.filter((p: any) => ['park', 'gym', 'fitness_centre'].includes(p.category)).slice(0, 3).map((p: any) => ({ name: p.name, dist: formatDist(p.distance) })),
      },
      {
        category: 'Serviços',
        color: 'amber',
        items: rawPois.filter((p: any) => ['supermarket', 'bakery'].includes(p.category)).slice(0, 3).map((p: any) => ({ name: p.name, dist: formatDist(p.distance) })),
      },
    ].filter(g => g.items.length > 0);

    return NextResponse.json({ groups });
  } catch (err) {
    console.error('Error fetching POIs:', err);
    return NextResponse.json({ groups: [] });
  }
}
