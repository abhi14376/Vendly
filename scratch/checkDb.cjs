const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xeboqhzzaamgdnpkkzat.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYm9xaHp6YWFtZ2RucGtremF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTIwMjAsImV4cCI6MjA5NzM2ODAyMH0.iryrY6VhpGJ6-yVa3fWFFKyf4QRegMgx3E4ngWaT6js';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log("Checking profiles...");
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, role').limit(5);
  console.log(pErr || profiles);
  
  console.log("Checking leads...");
  const { data: leads, error: lErr } = await supabase.from('leads').select('id').limit(5);
  console.log(lErr || leads);
  
  console.log("Checking users...");
  const { data: users, error: uErr } = await supabase.from('users').select('id').limit(5);
  console.log(uErr || users);
}

checkDb();
