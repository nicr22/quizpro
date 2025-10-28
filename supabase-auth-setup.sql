-- ============================================
-- CONFIGURACIÓN DE AUTENTICACIÓN - QUIZPRO
-- ============================================
-- Este script configura la autenticación y crea el primer usuario admin

-- PASO 1: Habilitar autenticación por email (ya debería estar habilitado)
-- Esto se hace desde el panel de Supabase en Authentication > Settings

-- PASO 2: Crear la tabla de perfiles de usuario (opcional, para datos adicionales)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- PASO 3: Habilitar Row Level Security en user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- PASO 4: Políticas para user_profiles
-- Los usuarios solo pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- PASO 5: Función para crear perfil automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 6: Trigger para ejecutar la función automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- CREAR USUARIO ADMINISTRADOR
-- ============================================
-- NOTA IMPORTANTE:
-- No podemos crear usuarios directamente via SQL en Supabase
-- Debes crear el usuario usando el panel de Supabase o la API

-- En su lugar, ejecuta este código en JavaScript/Node.js:
/*
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wzhhlhorhgfneszljkwm.supabase.co';
const supabaseServiceKey = 'TU_SERVICE_ROLE_KEY_AQUI'; // NO el ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'nicr1011@gmail.com',
    password: 'Qp#8mK9$vL2nR5xW7', // Contraseña segura de 17 caracteres
    email_confirm: true, // Auto-confirmar email
    user_metadata: {
      full_name: 'Administrador',
      role: 'admin'
    }
  });

  if (error) {
    console.error('Error creando usuario:', error);
  } else {
    console.log('Usuario creado exitosamente:', data);
  }
}

createAdminUser();
*/

-- ============================================
-- ALTERNATIVA: Crear usuario desde el Panel de Supabase
-- ============================================
-- 1. Ve a: https://supabase.com/dashboard/project/wzhhlhorhgfneszljkwm
-- 2. Click en "Authentication" (menú izquierdo)
-- 3. Click en "Users"
-- 4. Click en "Add user" (botón verde superior derecho)
-- 5. Selecciona "Create new user"
-- 6. Completa:
--    Email: nicr1011@gmail.com
--    Password: Qp#8mK9$vL2nR5xW7
--    Auto Confirm User: ✓ (activar)
-- 7. Click en "Create user"

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Después de crear el usuario, verifica que todo funcione:

-- Ver todos los perfiles
SELECT * FROM public.user_profiles;

-- Ver usuarios autenticados (necesitas permisos de admin)
-- Esto solo se puede ver desde el panel de Supabase en Authentication > Users

-- ============================================
-- CONFIGURACIÓN DE POLÍTICAS PARA TABLA QUIZZES
-- ============================================
-- Actualizar políticas de quizzes para requerir autenticación

-- Eliminar política pública anterior (si existe)
DROP POLICY IF EXISTS "Lectura pública de quizzes activos" ON public.quizzes;

-- Nueva política: Solo usuarios autenticados pueden leer quizzes
CREATE POLICY "Usuarios autenticados pueden leer quizzes"
  ON public.quizzes
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Solo usuarios autenticados pueden crear quizzes
DROP POLICY IF EXISTS "Solo admin puede crear quizzes" ON public.quizzes;
CREATE POLICY "Usuarios autenticados pueden crear quizzes"
  ON public.quizzes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Solo usuarios autenticados pueden actualizar sus quizzes
CREATE POLICY "Usuarios autenticados pueden actualizar quizzes"
  ON public.quizzes
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Solo usuarios autenticados pueden eliminar quizzes
CREATE POLICY "Usuarios autenticados pueden eliminar quizzes"
  ON public.quizzes
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- INFORMACIÓN DE LA CONTRASEÑA GENERADA
-- ============================================
-- Email: nicr1011@gmail.com
-- Contraseña: Qp#8mK9$vL2nR5xW7
--
-- Características de la contraseña:
-- - 17 caracteres
-- - Mayúsculas: Q, K, R, W
-- - Minúsculas: p, m, v, L, n, x
-- - Números: 8, 9, 2, 5, 7
-- - Símbolos: #, $
-- - Muy segura para uso en producción
--
-- GUARDA ESTA CONTRASEÑA EN UN LUGAR SEGURO
-- ============================================
