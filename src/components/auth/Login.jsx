import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        throw error;
      }

      console.log('✅ Login exitoso:', data.user.email);
      // El estado de autenticación se maneja automáticamente por Supabase
      // y el AuthContext lo detectará

    } catch (error) {
      console.error('❌ Error en login:', error);

      // Mensajes de error más amigables
      if (error.message.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor, confirma tu email antes de iniciar sesión');
      } else {
        setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>QuizPro</h1>
          <p>Panel de Administración</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Acceso restringido solo para administradores</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
