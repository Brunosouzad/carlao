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

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCategories() {
  const categoriesToTest = ["Chácara", "Chacara", "Sítio", "Sitio", "Fazenda", "Lote", "Área", "Area"];
  
  for (const cat of categoriesToTest) {
    console.log(`Testing category: ${cat}`);
    const { error } = await supabase
      .from('properties')
      .insert([{
        code: `TEST-${cat}`,
        title: `Test ${cat}`,
        location: "Test Location",
        price: "0",
        type: "Venda",
        category: cat,
        image: "https://example.com/test.jpg"
      }]);
    
    if (error) {
      console.log(`❌ Failed: ${error.message}`);
    } else {
      console.log(`✅ Success!`);
      // Delete it afterwards
      await supabase.from('properties').delete().eq('code', `TEST-${cat}`);
    }
  }
}

testCategories();
