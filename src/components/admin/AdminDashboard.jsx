import { useState, useEffect } from 'react';
import { hybridStorageService as storageService } from '../../services/hybridStorageService';
import { quizService } from '../../services/quizService';
import { sampleQuizzes } from '../../data/sampleQuizzes';
import { diagnosticSupabase } from '../../utils/diagnosticSupabase';
import './AdminDashboard.css';

function AdminDashboard({ onEditQuiz, onLogout }) {
  const [quizzes, setQuizzes] = useState({});
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAndLoad();

    // Expose diagnostic tool to window for easy console access
    window.diagnosticSupabase = diagnosticSupabase;
    console.log('💡 Tip: Run diagnosticSupabase.runFullDiagnostic() in console to test Supabase');
  }, []);

  const initializeAndLoad = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Inicializar Supabase
      const connected = await storageService.initialize();
      setIsSupabaseConnected(connected);

      if (connected) {
        console.log('✅ Supabase conectado');
      } else {
        console.warn('⚠️ Usando solo LocalStorage');
      }

      // Cargar quizzes
      await loadQuizzes();
    } catch (err) {
      console.error('Error al inicializar:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuizzes = async () => {
    try {
      const allQuizzes = await storageService.getAllQuizzes();
      setQuizzes(allQuizzes);
      console.log('Quizzes cargados:', Object.keys(allQuizzes).length);
    } catch (err) {
      console.error('Error cargando quizzes:', err);
      setError('Error al cargar los quizzes: ' + err.message);
    }
  };

  const handleCreateNewQuiz = () => {
    const newQuiz = quizService.createNewQuiz('Mi Nuevo Quiz');
    loadQuizzes();
    onEditQuiz(newQuiz.id);
  };

  const handleLoadSample = (sampleKey) => {
    const sample = sampleQuizzes[sampleKey];
    const newQuiz = storageService.importQuiz(sample);
    loadQuizzes();
    setShowSampleModal(false);
    onEditQuiz(newQuiz.id);
  };

  const handleDuplicateQuiz = (quizId, e) => {
    e.stopPropagation();
    storageService.duplicateQuiz(quizId);
    loadQuizzes();
  };

  const handleDeleteQuiz = (quizId, e) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar este quiz?')) {
      storageService.deleteQuiz(quizId);
      loadQuizzes();
    }
  };

  const handleExportQuiz = (quizId, e) => {
    e.stopPropagation();
    const json = storageService.exportQuiz(quizId);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${quizId}.json`;
    a.click();
  };

  const handleImportQuiz = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const newQuiz = storageService.importQuiz(event.target.result);
          loadQuizzes();
          onEditQuiz(newQuiz.id);
        } catch (error) {
          alert('Error al importar el quiz: ' + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const quizzesArray = Object.values(quizzes);

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Cargando quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>⚡ QuizPro</h1>
            <p className="subtitle">Generador de Quizzes para WordPress</p>
          </div>
          <div className="header-right">
            <div className="connection-status">
              {isSupabaseConnected ? (
                <span className="status-badge status-online">
                  🟢 Supabase Conectado
                </span>
              ) : (
                <span className="status-badge status-offline">
                  🟡 Solo LocalStorage
                </span>
              )}
            </div>
            {onLogout && (
              <button className="logout-button" onClick={onLogout} title="Cerrar Sesión">
                🚪 Salir
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {error && (
          <div className="error-banner">
            <strong>⚠️ Error:</strong> {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
        <div className="actions-bar">
          <button className="btn btn-primary" onClick={handleCreateNewQuiz}>
            ➕ Crear Nuevo Quiz
          </button>
          <button className="btn btn-secondary" onClick={() => setShowSampleModal(true)}>
            📋 Cargar Template
          </button>
          <button className="btn btn-secondary" onClick={handleImportQuiz}>
            📥 Importar JSON
          </button>
        </div>

        {quizzesArray.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No hay quizzes todavía</h2>
            <p>Crea tu primer quiz o carga un template de ejemplo</p>
            <div className="empty-actions">
              <button className="btn btn-primary" onClick={handleCreateNewQuiz}>
                Crear Mi Primer Quiz
              </button>
              <button className="btn btn-secondary" onClick={() => setShowSampleModal(true)}>
                Ver Templates
              </button>
            </div>
          </div>
        ) : (
          <div className="quizzes-grid">
            {quizzesArray.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-card"
                onClick={() => onEditQuiz(quiz.id)}
              >
                <div className="quiz-card-header">
                  <h3>{quiz.title}</h3>
                  <div className="quiz-card-actions">
                    <button
                      className="icon-btn"
                      onClick={(e) => handleDuplicateQuiz(quiz.id, e)}
                      title="Duplicar"
                    >
                      📋
                    </button>
                    <button
                      className="icon-btn"
                      onClick={(e) => handleExportQuiz(quiz.id, e)}
                      title="Exportar JSON"
                    >
                      📥
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={(e) => handleDeleteQuiz(quiz.id, e)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <p className="quiz-description">
                  {quiz.description || 'Sin descripción'}
                </p>

                <div className="quiz-meta">
                  <span className="meta-item">
                    📝 {quiz.questions?.length || 0} preguntas
                  </span>
                  <span className="meta-item">
                    🎯 {quiz.scoring?.results?.length || 0} resultados
                  </span>
                </div>

                <div className="quiz-date">
                  Actualizado: {new Date(quiz.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSampleModal && (
        <div className="modal-overlay" onClick={() => setShowSampleModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Selecciona un Template</h2>
              <button className="close-btn" onClick={() => setShowSampleModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="samples-grid">
                {Object.entries(sampleQuizzes).map(([key, sample]) => (
                  <div key={key} className="sample-card" onClick={() => handleLoadSample(key)}>
                    <h3>{sample.title}</h3>
                    <p>{sample.description}</p>
                    <div className="sample-meta">
                      {sample.questions.length} preguntas
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
