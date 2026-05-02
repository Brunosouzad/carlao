const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Usage: node test.js <url> <key>');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing connection to:', supabaseUrl);
  const { data, error } = await supabase.from('properties').select('*', { count: 'exact', head: true });
  if (error) {
    console.error('Connection failed:', error.message);
  } else {
    console.log('Connection successful! Properties found.');
  }
}

test();
