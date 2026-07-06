const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xeboqhzzaamgdnpkkzat.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYm9xaHp6YWFtZ2RucGtremF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTIwMjAsImV4cCI6MjA5NzM2ODAyMH0.iryrY6VhpGJ6-yVa3fWFFKyf4QRegMgx3E4ngWaT6js';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_foreign_keys');
  console.log("RPC Error:", error);
  
  // Alternative: just try to insert a profile for the user
  const { data: userAuth } = await supabase.auth.signInWithPassword({
    email: 'test@example.com', // just checking what happens
    password: 'password'
  });
  console.log(userAuth);
}
checkSchema();
