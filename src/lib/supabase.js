import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Initializing Supabase client...');
console.log('URL:', supabaseUrl || '❌ NOT SET');
console.log('Key:', supabaseAnonKey ? `✅ ${supabaseAnonKey.substring(0, 30)}...` : '❌ NOT SET');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Make sure you have a .env file with:');
  console.error('VITE_SUPABASE_URL=your_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_key');
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

console.log('✅ Supabase client initialized');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
