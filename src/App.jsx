import { useState } from 'react';
import './App.css';
import AdminDashboard from './components/admin/AdminDashboard';
import QuizEditor from './components/admin/QuizEditor';
import Login from './components/auth/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const { user, loading, signOut } = useAuth();

  const handleEditQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedQuizId(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentView('dashboard');
      setSelectedQuizId(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner-large"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no hay usuario, mostrar login
  if (!user) {
    return <Login />;
  }

  // Usuario autenticado - mostrar app normal
  return (
    <div className="app">
      {currentView === 'dashboard' ? (
        <AdminDashboard onEditQuiz={handleEditQuiz} onLogout={handleLogout} />
      ) : (
        <QuizEditor
          quizId={selectedQuizId}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
