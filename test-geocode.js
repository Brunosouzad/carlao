async function testGeocode() {
  const location = "Rua Efigênia Moreira Quirino, 100 - Nossa Senhora da Penha, Coronel Fabriciano";
  const url = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(location + ", Brasil") + "&format=json&limit=1";
  
  console.log("Fetching:", url);
  
  try {
    const res = await fetch(url, { 
      headers: { 
        "Accept-Language": "pt-BR",
        "User-Agent": "CarlaoImoveis/1.0"
      } 
    });
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.error("Error:", e);
  }
}

testGeocode();
