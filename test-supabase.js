/**
 * Test Supabase Connection
 * Run this with: node test-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 30) + '...\n');

// Create client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
async function testConnection() {
  console.log('🔌 Testing connection to Supabase...\n');

  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Connection error:', error.message);
      console.error('Details:', error);
      return false;
    }

    console.log('✅ Connection successful!');
    console.log('Quizzes found:', data.length);
    return true;
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    return false;
  }
}

// Test insert
async function testInsert() {
  console.log('\n📝 Testing INSERT operation...\n');

  const testQuiz = {
    id: `test_${Date.now()}`,
    title: 'Test Quiz',
    description: 'Connection test',
    questions: [],
    settings: {},
    styling: {},
    scoring: { results: [] },
    webhooks: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('quizzes')
      .insert(testQuiz)
      .select();

    if (error) {
      console.error('❌ Insert error:', error.message);
      console.error('Details:', error);
      return false;
    }

    console.log('✅ Insert successful!');
    console.log('Quiz ID:', data[0].id);

    // Clean up
    await supabase
      .from('quizzes')
      .delete()
      .eq('id', testQuiz.id);

    console.log('🧹 Test quiz cleaned up');
    return true;
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const connectionOk = await testConnection();

  if (!connectionOk) {
    console.log('\n❌ Connection failed. Please check:');
    console.log('1. Supabase project is active');
    console.log('2. Table "quizzes" exists');
    console.log('3. RLS policies allow access');
    process.exit(1);
  }

  const insertOk = await testInsert();

  if (!insertOk) {
    console.log('\n⚠️ Connection works but INSERT failed. This might be:');
    console.log('1. RLS policies blocking INSERT');
    console.log('2. Missing permissions');
    console.log('3. Schema mismatch');
    process.exit(1);
  }

  console.log('\n🎉 All tests passed! Supabase is working correctly.');
}

runTests();
