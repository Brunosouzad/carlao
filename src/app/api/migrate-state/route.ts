import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Rota temporária para adicionar coluna state na tabela properties
// Chamar uma única vez via: GET /api/migrate-state
export async function GET() {
  try {
    // Testa se a coluna já existe fazendo uma query simples
    const { data: testData, error: testError } = await supabase
      .from('properties')
      .select('state')
      .limit(1);

    if (!testError) {
      return NextResponse.json({ 
        ok: true, 
        message: 'Coluna state já existe na tabela properties.' 
      });
    }

    // Se deu erro (coluna não existe), usa rpc para executar SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE properties ADD COLUMN IF NOT EXISTS state VARCHAR(2);`
    });

    if (error) {
      // Tenta via SQL direto (pode não funcionar com anon key)
      return NextResponse.json({ 
        ok: false, 
        message: 'Não foi possível adicionar a coluna automaticamente. Execute o SQL abaixo no Supabase SQL Editor:',
        sql: 'ALTER TABLE properties ADD COLUMN IF NOT EXISTS state VARCHAR(2);',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Coluna state adicionada com sucesso!' 
    });
  } catch (e: any) {
    return NextResponse.json({ 
      ok: false,
      message: 'Execute o SQL abaixo no Supabase SQL Editor:',
      sql: 'ALTER TABLE properties ADD COLUMN IF NOT EXISTS state VARCHAR(2);',
      error: e.message 
    }, { status: 500 });
  }
}
