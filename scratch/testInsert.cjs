require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testInsert() {
  // Test plain insert instead of upsert
  const { error: pErr } = await supabase.from('profiles').insert({ id: '00000000-0000-0000-0000-000000000000', role: 'lead' });
  console.log("Profile Insert Error:", pErr);
}

testInsert();
