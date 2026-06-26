import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xeboqhzzaamgdnpkkzat.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYm9xaHp6YWFtZ2RucGtremF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTIwMjAsImV4cCI6MjA5NzM2ODAyMH0.iryrY6VhpGJ6-yVa3fWFFKyf4QRegMgx3E4ngWaT6js';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const randomEmail = `test_${Math.floor(Math.random() * 10000)}@vendly.com`;
  console.log('Testing signup with email:', randomEmail);
  const { data, error } = await supabase.auth.signUp({
    email: randomEmail,
    password: 'password123',
    options: {
      data: {
        full_name: 'Test Admin',
        role: 'admin',
        mobile: null
      }
    }
  });

  if (error) {
    console.error('Signup Error:', error);
    console.error('Error stringified:', JSON.stringify(error, null, 2));
  } else {
    console.log('Signup Success:', data);
  }
}

testSignup();
