const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ouzcyedqgkgpdolfrrov.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_f4MI9T-VTNVg4o0i4EkEFA_oi0etSi_';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log("Checking Supabase connection to:", supabaseUrl);
  try {
    const { data, error } = await supabase.from('User').select('*').limit(1);
    if (error) {
      console.log("Supabase REST API Connected. Table check response:", error.message);
    } else {
      console.log("Supabase User table data:", data);
    }
  } catch (err) {
    console.error("Connection error:", err);
  }
}

checkConnection();
