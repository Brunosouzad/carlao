import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// O createClient exige uma URL válida para não dar erro de execução imediata.
// Usamos placeholders caso o .env ainda não tenha sido carregado corretamente.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn("AVISO: Supabase está usando URL de placeholder. Verifique seu arquivo .env.local e REINICIE o servidor (npm run dev).");
}
