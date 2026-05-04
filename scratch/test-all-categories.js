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

const allCategories = [
  "Apartamento", "Área", "Barracão", "Casa", "Chácara", 
  "Fazenda", "Galpão", "Loja", "Lote", "Prédio", 
  "Sala", "Sítio", "Quitinete", "Pousada"
];

async function testAll() {
  const results = { success: [], fail: [] };
  
  for (const cat of allCategories) {
    const { error } = await supabase
      .from('properties')
      .insert([{
        code: `T-${cat.substring(0,3)}`,
        title: `Test ${cat}`,
        location: "Test",
        price: "0",
        type: "Venda",
        category: cat,
        image: "https://example.com/test.jpg"
      }]);
    
    if (error) {
      results.fail.push(cat);
    } else {
      results.success.push(cat);
      await supabase.from('properties').delete().eq('code', `T-${cat.substring(0,3)}`);
    }
  }
  
  console.log("✅ Permitidos:", results.success);
  console.log("❌ Bloqueados:", results.fail);
}

testAll();
