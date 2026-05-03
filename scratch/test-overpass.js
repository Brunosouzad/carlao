

const overpassQuery = `[out:json][timeout:15]; node["amenity"~"school"](around:2000,-18.8551,-41.9492); out center body;`;

fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: `data=${encodeURIComponent(overpassQuery)}`,
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'CarlaoImoveisWebsite/2.0 (https://www.carlaoimoveismg.com.br; carlaoimoveisva@gmail.com)'
  }
}).then(r => r.text()).then(console.log).catch(console.error);
