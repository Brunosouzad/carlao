async function testGeocode() {
  const location = "Rua Efigênia Moreira Quirino, 100 - Nossa Senhora da Penha, Coronel Fabriciano";
  const street = "Rua Efigênia Moreira Quirino";
  const neighborhood = "Nossa Senhora da Penha";
  const city = "Coronel Fabriciano";
  
  const fallbacks = [
    location + ", Brasil",
    street + ", " + city + ", Brasil",
    neighborhood + ", " + city + ", Brasil",
    city + ", Brasil"
  ];
  
  for (const query of fallbacks) {
    const url = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(query) + "&format=json&limit=1";
    console.log("Trying:", query);
    try {
      const res = await fetch(url, { 
        headers: { 
          "Accept-Language": "pt-BR",
          "User-Agent": "CarlaoImoveis/1.0"
        } 
      });
      const data = await res.json();
      if (data && data.length > 0) {
        console.log("Found:", data[0].display_name, "Lat:", data[0].lat, "Lon:", data[0].lon);
        return;
      } else {
        console.log("Not found.");
      }
    } catch(e) {
      console.error("Error:", e);
    }
    // sleep a bit to respect Nominatim API limits
    await new Promise(r => setTimeout(r, 1000));
  }
}

testGeocode();
