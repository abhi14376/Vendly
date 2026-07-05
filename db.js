require('dotenv').config({ path: '.env.local' }); // Load env variables if you are using dotenv, otherwise we can hardcode for testing

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xeboqhzzaamgdnpkkzat.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYm9xaHp6YWFtZ2RucGtremF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTIwMjAsImV4cCI6MjA5NzM2ODAyMH0.iryrY6VhpGJ6-yVa3fWFFKyf4QRegMgx3E4ngWaT6js';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('Connecting to Supabase...');
  
  // Replacing 'your_table' with 'opportunities' as requested
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .limit(5);
    
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  
  console.log('Successfully fetched data from "opportunities" table:');
  console.log(data);
}

testDatabaseConnection();
