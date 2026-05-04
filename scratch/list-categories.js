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

async function listCategories() {
  const { data, error } = await supabase
    .from('properties')
    .select('category');

  if (error) {
    console.error(error);
    return;
  }

  const categories = [...new Set(data.map(p => p.category))];
  console.log("Categorias existentes no banco:", categories);
}

listCategories();
