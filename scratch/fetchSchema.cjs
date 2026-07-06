const fs = require('fs');

async function fetchSchema() {
  const url = 'https://xeboqhzzaamgdnpkkzat.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYm9xaHp6YWFtZ2RucGtremF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3OTIwMjAsImV4cCI6MjA5NzM2ODAyMH0.iryrY6VhpGJ6-yVa3fWFFKyf4QRegMgx3E4ngWaT6js';
  const response = await fetch(url);
  const data = await response.json();
  fs.writeFileSync('schema.json', JSON.stringify(data, null, 2));
  console.log("Schema fetched");
}
fetchSchema();
