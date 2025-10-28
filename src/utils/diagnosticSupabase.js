/**
 * Script de diagnóstico para Supabase
 * Ejecuta esto en la consola del navegador para ver qué está fallando
 *
 * USO:
 * import { diagnosticSupabase } from './src/utils/diagnosticSupabase.js';
 * await diagnosticSupabase.runFullDiagnostic();
 */

import { supabase } from '../lib/supabase';

export const diagnosticSupabase = {
  /**
   * Test completo de conexión
   */
  async runFullDiagnostic() {
    console.log('🔍 Iniciando diagnóstico de Supabase...\n');

    const results = {
      connection: false,
      tableExists: false,
      canRead: false,
      canWrite: false,
      error: null
    };

    // 1. Test de conexión básica
    console.log('1️⃣ Probando conexión a Supabase...');
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('count')
        .limit(0);

      if (error) {
        console.error('❌ Error de conexión:', error.message);
        results.error = error;

        // Verificar si es problema de tabla
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('⚠️ La tabla "quizzes" no existe en Supabase');
          console.log('📋 Necesitas ejecutar el SQL en Supabase Dashboard');
        }

        // Verificar si es problema de permisos
        if (error.message.includes('permission') || error.message.includes('denied')) {
          console.log('⚠️ Problema de permisos (RLS)');
        }

        return results;
      }

      console.log('✅ Conexión exitosa');
      results.connection = true;
      results.tableExists = true;

    } catch (err) {
      console.error('❌ Error fatal:', err);
      results.error = err;
      return results;
    }

    // 2. Test de lectura
    console.log('\n2️⃣ Probando lectura de datos...');
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .limit(5);

      if (error) {
        console.error('❌ Error de lectura:', error.message);
      } else {
        console.log('✅ Lectura exitosa. Quizzes encontrados:', data.length);
        results.canRead = true;
      }
    } catch (err) {
      console.error('❌ Error de lectura:', err);
    }

    // 3. Test de escritura
    console.log('\n3️⃣ Probando escritura de datos...');
    const testQuiz = {
      id: `test_${Date.now()}`,
      title: 'Quiz de Prueba',
      description: 'Test de diagnóstico',
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
        console.error('❌ Error de escritura:', error.message);
        console.log('Detalles:', error);
      } else {
        console.log('✅ Escritura exitosa');
        results.canWrite = true;

        // Limpiar test
        await supabase
          .from('quizzes')
          .delete()
          .eq('id', testQuiz.id);

        console.log('🧹 Quiz de prueba eliminado');
      }
    } catch (err) {
      console.error('❌ Error de escritura:', err);
    }

    // Resumen final
    console.log('\n📊 RESUMEN:');
    console.log('═══════════════════════════════════════');
    console.log(`Conexión: ${results.connection ? '✅' : '❌'}`);
    console.log(`Tabla existe: ${results.tableExists ? '✅' : '❌'}`);
    console.log(`Puede leer: ${results.canRead ? '✅' : '❌'}`);
    console.log(`Puede escribir: ${results.canWrite ? '✅' : '❌'}`);
    console.log('═══════════════════════════════════════');

    if (!results.connection) {
      console.log('\n🔧 SOLUCIÓN:');
      console.log('1. Ve a https://supabase.com/dashboard');
      console.log('2. Abre SQL Editor');
      console.log('3. Ejecuta TODO el contenido de supabase-schema.sql');
    } else if (!results.canWrite) {
      console.log('\n🔧 SOLUCIÓN:');
      console.log('Problema de permisos. Verifica:');
      console.log('1. Que RLS está configurado correctamente');
      console.log('2. Que las políticas permiten INSERT sin autenticación');
    } else if (results.canWrite) {
      console.log('\n🎉 ¡Todo funciona correctamente!');
    }

    return results;
  },

  /**
   * Verificar variables de entorno
   */
  checkEnvVars() {
    console.log('🔍 Verificando variables de entorno...\n');

    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('VITE_SUPABASE_URL:', url ? '✅ Configurada' : '❌ Falta');
    console.log('VITE_SUPABASE_ANON_KEY:', key ? '✅ Configurada' : '❌ Falta');

    if (url) console.log('  URL:', url);
    if (key) console.log('  Key:', key.substring(0, 20) + '...');

    if (!url || !key) {
      console.log('\n❌ Variables de entorno faltantes!');
      console.log('Verifica que el archivo .env existe y contiene:');
      console.log('VITE_SUPABASE_URL=https://wzhhlhorhgfneszljkwm.supabase.co');
      console.log('VITE_SUPABASE_ANON_KEY=tu_key_aqui');
    }
  },

  /**
   * Test rápido
   */
  async quickTest() {
    console.log('⚡ Test rápido...\n');

    try {
      const { error } = await supabase
        .from('quizzes')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ Error:', error.message);
        return false;
      }

      console.log('✅ Supabase funciona correctamente');
      return true;
    } catch (err) {
      console.error('❌ Error fatal:', err.message);
      return false;
    }
  }
};

// Para usar en la consola del navegador:
// import { diagnosticSupabase } from './src/utils/diagnosticSupabase.js';
// await diagnosticSupabase.runFullDiagnostic();
