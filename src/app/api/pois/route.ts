import { NextRequest, NextResponse } from 'next/server';

// Known neighborhood coordinates for reliable fallback
const KNOWN_COORDS: Record<string, { lat: string; lon: string }> = {
  // Governador Valadares
  'belvedere': { lat: '-18.8500', lon: '-41.9550' },
  'centro': { lat: '-18.8551', lon: '-41.9492' },
  'vila bretas': { lat: '-18.8480', lon: '-41.9380' },
  'grã-duquesa': { lat: '-18.8400', lon: '-41.9350' },
  'ilha dos araújos': { lat: '-18.8650', lon: '-41.9400' },
  'altinópolis': { lat: '-18.8700', lon: '-41.9600' },
  'santos dumont': { lat: '-18.8620', lon: '-41.9520' },
  'esplanada': { lat: '-18.8580', lon: '-41.9430' },
  'lagoa santa': { lat: '-18.8350', lon: '-41.9300' },
  'parque das nações': { lat: '-18.8450', lon: '-41.9450' },
  'melo viana': { lat: '-18.8530', lon: '-41.9510' },
  'caladinho': { lat: '-18.8600', lon: '-41.9480' },
  'governador valadares': { lat: '-18.8551', lon: '-41.9492' },
  // Coronel Fabriciano
  'coronel fabriciano': { lat: '-19.5189', lon: '-42.6291' },
  // Ipatinga
  'ipatinga': { lat: '-19.4682', lon: '-42.5368' },
  // Distrito Industrial
  'distrito industrial': { lat: '-18.8800', lon: '-41.9700' },
};

function findLocalCoords(location: string): { lat: string; lon: string } | null {
  const lower = location.toLowerCase();
  for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
    if (lower.includes(key)) return coords;
  }
  return null;
}

// Geocode using Nominatim with robust retry
async function geocode(location: string): Promise<{ lat: string; lon: string } | null> {
  // 1. Try local coords first (instant, no API call)
  const local = findLocalCoords(location);
  if (local) return local;

  // 2. Try Nominatim
  const queries = [
    `${location}, Brasil`,
    location,
    location.split(',').slice(-1)[0]?.trim() + ', Minas Gerais, Brasil',
  ];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`,
        {
          headers: {
            'User-Agent': 'CarlaoImoveisWebsite/2.0 (https://www.carlaoimoveismg.com.br; carlaoimoveisva@gmail.com)',
            'Accept': 'application/json',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Referer': 'https://www.carlaoimoveismg.com.br',
          },
          next: { revalidate: 86400 },
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      if (data && data.length > 0 && data[0].lat && data[0].lon) {
        return { lat: data[0].lat, lon: data[0].lon };
      }
    } catch {
      continue;
    }
  }

  // 3. Ultimate fallback: center of Gov. Valadares
  if (location.toLowerCase().includes('valadares') || location.toLowerCase().includes('mg')) {
    return KNOWN_COORDS['governador valadares'];
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'location is required' }, { status: 400 });
  }

  try {
    // 1. Geocode
    const coords = await geocode(location);

    if (!coords) {
      return NextResponse.json({ groups: [] });
    }

    const { lat, lon } = coords;

    // 2. Overpass API — query nearby POIs
    const overpassQuery = `
      [out:json][timeout:15];
      (
        node["amenity"~"school|university|hospital|clinic|pharmacy|supermarket|bakery|restaurant|bank|fuel"](around:2000,${lat},${lon});
        way["amenity"~"school|university|hospital|clinic|pharmacy|supermarket"](around:2000,${lat},${lon});
        node["shop"~"supermarket|bakery|convenience"](around:2000,${lat},${lon});
        node["leisure"~"park|fitness_centre|sports_centre|playground"](around:2000,${lat},${lon});
      );
      out center body;
    `;

    const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!overpassRes.ok) {
      return NextResponse.json({ groups: [] });
    }

    const overpassData = await overpassRes.json();

    // 3. Calculate distances and group
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const rawPois = (overpassData.elements || [])
      .map((el: any) => {
        const elLat = el.lat ?? el.center?.lat;
        const elLon = el.lon ?? el.center?.lon;
        if (!elLat || !elLon) return null;
        const dist = calculateDistance(parseFloat(lat), parseFloat(lon), elLat, elLon);
        const amenity = el.tags?.amenity;
        const shop = el.tags?.shop;
        const leisure = el.tags?.leisure;
        return {
          name: el.tags?.name || amenity || shop || leisure || 'Estabelecimento',
          category: amenity || shop || leisure,
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
        items: rawPois.filter((p: any) => ['school', 'university'].includes(p.category)).slice(0, 4).map((p: any) => ({ name: p.name, dist: formatDist(p.distance) })),
      },
      {
        category: 'Saúde',
        color: 'red',
        items: rawPois.filter((p: any) => ['hospital', 'clinic', 'pharmacy'].includes(p.category)).slice(0, 4).map((p: any) => ({ name: p.name, dist: formatDist(p.distance) })),
      },
      {
        category: 'Lazer',
        color: 'green',
        items: rawPois.filter((p: any) => ['park', 'fitness_centre', 'sports_centre', 'playground'].includes(p.category)).slice(0, 4).map((p: any) => ({ name: p.name, dist: formatDist(p.distance) })),
      },
      {
        category: 'Serviços',
        color: 'amber',
        items: rawPois.filter((p: any) => ['supermarket', 'bakery', 'convenience', 'restaurant', 'bank', 'fuel'].includes(p.category)).slice(0, 4).map((p: any) => ({ name: p.name, dist: formatDist(p.distance) })),
      },
    ].filter(g => g.items.length > 0);

    return NextResponse.json(
      { groups },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      }
    );
  } catch (err) {
    console.error('Error fetching POIs:', err);
    return NextResponse.json({ groups: [] });
  }
}
