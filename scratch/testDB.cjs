require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testDB() {
  // 1. Login with a dummy user or just try to insert without auth
  // Since we don't have the user's password, we can't easily authenticate.
  // But we can check if we can insert a profile anonymously (probably fails)
  const { error: pErr } = await supabase.from('profiles').upsert({ id: '00000000-0000-0000-0000-000000000000', role: 'lead' });
  console.log("Anon Profile Upsert Error:", pErr);

  // 2. Try to insert an opportunity without lead_id
  const { error: oppErr } = await supabase.from('opportunities').insert([{
    title: 'Test Opp',
    publisher: 'Test',
    industry: 'Test',
    location: 'Test',
    budget: '0',
    work_type: 'tender',
    status: 'Open',
    description: 'Test',
    deadline: new Date().toISOString()
  }]);
  console.log("Opp Insert without lead_id Error:", oppErr);
}

testDB();
