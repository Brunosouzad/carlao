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

async function checkProperty() {
  const id = 'ad94516d-e9a0-441f-9366-dd3bc995f182';
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id);

  console.log(JSON.stringify(data, null, 2));
}

checkProperty();
