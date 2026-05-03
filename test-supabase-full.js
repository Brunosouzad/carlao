const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envs = {};
envLocal.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) {
    envs[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = envs['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envs['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const dummyData = {
    code: "TEST-02",
    title: "Test Property Full",
    location: "Test Location",
    city: "Test City",
    neighborhood: "Test Neighborhood",
    street: "Test Street",
    number: "123",
    complement: "Test Complement",
    zip_code: "12345-678",
    price: "100",
    beds: 2,
    baths: 2,
    garages: 2,
    area: 100,
    type: "Venda",
    category: "Casa",
    image: "https://example.com/image.jpg",
    images: ["https://example.com/image.jpg"],
    features: ["Piscina"],
    tag: "Destaque",
    description: "Test Description",
    video_url: "https://youtube.com/watch?v=123"
  };

  console.log("Attempting to insert full data...");

  const { data, error } = await supabase
    .from('properties')
    .insert([dummyData])
    .select();

  if (error) {
    console.error("Insert failed:", error);
  } else {
    console.log("Insert succeeded:", data);
  }
}

testInsert();
