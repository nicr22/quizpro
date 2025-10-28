import { useState, useEffect } from 'react';
import { hybridStorageService as storageService } from '../../services/hybridStorageService';
import { quizService } from '../../services/quizService';
import { exportService } from '../../services/exportService';
import QuestionBuilder from './QuestionBuilder';
import ScoringConfig from './ScoringConfig';
import StyleCustomizer from './StyleCustomizer';
import WebhookConfig from './WebhookConfig';
import ExportModal from '../export/ExportModal';
import Toast from '../common/Toast';
import './QuizEditor.css';

function QuizEditor({ quizId, onBack }) {
  const [quiz, setQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    // Auto-save cada 30 segundos si hay cambios
    if (unsavedChanges && !saving) {
      const timer = setTimeout(() => {
        saveQuiz();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [unsavedChanges, quiz, saving]);

  const loadQuiz = async () => {
    try {
      const loadedQuiz = await storageService.getQuiz(quizId);
      if (loadedQuiz) {
        setQuiz(loadedQuiz);
        console.log('Quiz cargado:', loadedQuiz.title);
      }
    } catch (error) {
      console.error('Error cargando quiz:', error);
      setSaveError('Error al cargar el quiz');
    }
  };

  const saveQuiz = async () => {
    if (quiz && !saving) {
      try {
        setSaving(true);
        setSaveError(null);
        await storageService.saveQuiz(quiz);
        setUnsavedChanges(false);
        console.log('✅ Quiz guardado:', quiz.id);
        setToast({ message: 'Quiz guardado exitosamente', type: 'success' });
      } catch (error) {
        console.error('❌ Error guardando quiz:', error);
        setSaveError('Error al guardar: ' + error.message);
        setToast({ message: 'Error al guardar: ' + error.message, type: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const updateQuiz = (updates) => {
    setQuiz({ ...quiz, ...updates });
    setUnsavedChanges(true);
  };

  const updateQuizSettings = (settings) => {
    updateQuiz({ settings: { ...quiz.settings, ...settings } });
  };

  const updateQuizStyling = (styling) => {
    updateQuiz({ styling: { ...quiz.styling, ...styling } });
  };

  const updateQuizScoring = (scoring) => {
    updateQuiz({ scoring: { ...quiz.scoring, ...scoring } });
  };

  const updateQuizWebhooks = (webhooks) => {
    updateQuiz({ webhooks });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: quiz.questions.length + 1,
      type: 'multiple-choice',
      question: '¿Nueva pregunta?',
      options: [
        { text: 'Opción 1', score: 1 },
        { text: 'Opción 2', score: 2 },
        { text: 'Opción 3', score: 3 }
      ],
      required: true
    };

    updateQuiz({
      questions: [...quiz.questions, newQuestion]
    });
  };

  const handleUpdateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index] = updatedQuestion;
    updateQuiz({ questions: newQuestions });
  };

  const handleDeleteQuestion = (index) => {
    if (confirm('¿Eliminar esta pregunta?')) {
      const newQuestions = quiz.questions.filter((_, i) => i !== index);
      // Recalcular IDs
      newQuestions.forEach((q, i) => {
        q.id = i + 1;
      });
      updateQuiz({ questions: newQuestions });
    }
  };

  const handleMoveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= quiz.questions.length) return;

    const newQuestions = [...quiz.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];

    // Recalcular IDs
    newQuestions.forEach((q, i) => {
      q.id = i + 1;
    });

    updateQuiz({ questions: newQuestions });
  };

  const handleExport = () => {
    const validation = quizService.validateQuiz(quizId);
    if (!validation.isValid) {
      alert('Errores en el quiz:\n\n' + validation.errors.join('\n'));
      return;
    }
    saveQuiz();
    setShowExportModal(true);
  };

  if (!quiz) {
    return (
      <div className="quiz-editor-loading">
        <div className="loader"></div>
        <p>Cargando quiz...</p>
      </div>
    );
  }

  return (
    <div className="quiz-editor">
      <div className="editor-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ← Volver
          </button>
          <div className="quiz-title-section">
            <input
              type="text"
              className="quiz-title-input"
              value={quiz.title}
              onChange={(e) => updateQuiz({ title: e.target.value })}
              placeholder="Título del quiz"
            />
            {unsavedChanges && <span className="unsaved-badge">●</span>}
          </div>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary" onClick={saveQuiz}>
            💾 Guardar
          </button>
          <button className="btn btn-success" onClick={handleExport}>
            🚀 Exportar HTML
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-sidebar">
          <nav className="editor-tabs">
            <button
              className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              📝 Preguntas
              <span className="tab-badge">{quiz.questions.length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'scoring' ? 'active' : ''}`}
              onClick={() => setActiveTab('scoring')}
            >
              🎯 Resultados
              <span className="tab-badge">{quiz.scoring.results?.length || 0}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
              onClick={() => setActiveTab('style')}
            >
              🎨 Estilo
            </button>
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Configuración
            </button>
            <button
              className={`tab-btn ${activeTab === 'webhook' ? 'active' : ''}`}
              onClick={() => setActiveTab('webhook')}
            >
              🔗 Webhook
            </button>
          </nav>
        </div>

        <div className="editor-content">
          {activeTab === 'questions' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Preguntas del Quiz</h2>
                <button className="btn btn-primary" onClick={handleAddQuestion}>
                  ➕ Agregar Pregunta
                </button>
              </div>

              {quiz.questions.length === 0 ? (
                <div className="empty-questions">
                  <p>No hay preguntas todavía</p>
                  <button className="btn btn-primary" onClick={handleAddQuestion}>
                    Crear Primera Pregunta
                  </button>
                </div>
              ) : (
                <div className="questions-list">
                  {quiz.questions.map((question, index) => (
                    <QuestionBuilder
                      key={question.id}
                      question={question}
                      index={index}
                      totalQuestions={quiz.questions.length}
                      onUpdate={(updatedQuestion) => handleUpdateQuestion(index, updatedQuestion)}
                      onDelete={() => handleDeleteQuestion(index)}
                      onMove={(direction) => handleMoveQuestion(index, direction)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'scoring' && (
            <ScoringConfig
              quiz={quiz}
              onUpdate={updateQuizScoring}
            />
          )}

          {activeTab === 'style' && (
            <StyleCustomizer
              styling={quiz.styling}
              onUpdate={updateQuizStyling}
            />
          )}

          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2>Configuración del Quiz</h2>

              <div className="settings-section">
                <h3>Descripción</h3>
                <textarea
                  className="quiz-description-input"
                  value={quiz.description}
                  onChange={(e) => updateQuiz({ description: e.target.value })}
                  placeholder="Descripción del quiz (opcional)"
                  rows="3"
                />
              </div>

              <div className="settings-section">
                <h3>Opciones de Visualización</h3>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={quiz.settings.showProgressBar}
                    onChange={(e) => updateQuizSettings({ showProgressBar: e.target.checked })}
                  />
                  <span>Mostrar barra de progreso</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={quiz.settings.showScore}
                    onChange={(e) => updateQuizSettings({ showScore: e.target.checked })}
                  />
                  <span>Mostrar puntuación final</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={quiz.settings.randomizeQuestions}
                    onChange={(e) => updateQuizSettings({ randomizeQuestions: e.target.checked })}
                  />
                  <span>Aleatorizar orden de preguntas</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={quiz.settings.randomizeAnswers}
                    onChange={(e) => updateQuizSettings({ randomizeAnswers: e.target.checked })}
                  />
                  <span>Aleatorizar orden de respuestas</span>
                </label>
              </div>

              <div className="settings-section">
                <h3>Captura de Email</h3>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={quiz.settings.requireEmail}
                    onChange={(e) => updateQuizSettings({ requireEmail: e.target.checked })}
                  />
                  <span>Solicitar email antes de mostrar resultados</span>
                </label>

                {quiz.settings.requireEmail && (
                  <>
                    <div className="form-group">
                      <label>Título de la pantalla de email</label>
                      <input
                        type="text"
                        value={quiz.settings.emailQuestion || ''}
                        onChange={(e) => updateQuizSettings({ emailQuestion: e.target.value })}
                        placeholder="🌟 ¡Acabas de completar tu prueba!"
                      />
                    </div>
                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea
                        value={quiz.settings.emailDescription || ''}
                        onChange={(e) => updateQuizSettings({ emailDescription: e.target.value })}
                        rows="4"
                        placeholder="Escribe tu correo para recibir tu diagnóstico personalizado"
                      />
                    </div>
                    <div className="form-group">
                      <label>Texto del botón</label>
                      <input
                        type="text"
                        value={quiz.settings.emailButtonText || ''}
                        onChange={(e) => updateQuizSettings({ emailButtonText: e.target.value })}
                        placeholder="QUIERO CONOCER MI DIAGNÓSTICO"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="settings-section">
                <h3>Pantalla de Resultados Finales</h3>
                <div className="form-group">
                  <label>Título principal</label>
                  <input
                    type="text"
                    value={quiz.settings.resultsTitle || ''}
                    onChange={(e) => updateQuizSettings({ resultsTitle: e.target.value })}
                    placeholder="✨ ¡Resultados Enviados! ✨"
                  />
                </div>
                <div className="form-group">
                  <label>Mensaje principal</label>
                  <textarea
                    value={quiz.settings.resultsMessage || ''}
                    onChange={(e) => updateQuizSettings({ resultsMessage: e.target.value })}
                    rows="3"
                    placeholder="🎯 Revisa tu correo electrónico para ver tu análisis completo"
                  />
                </div>
                <div className="form-group">
                  <label>Texto del botón de redirección</label>
                  <input
                    type="text"
                    value={quiz.settings.redirectButtonText || ''}
                    onChange={(e) => updateQuizSettings({ redirectButtonText: e.target.value })}
                    placeholder="🚀 IR AHORA A MI ANÁLISIS PERSONALIZADO"
                  />
                </div>
                <div className="form-group">
                  <label>Mensaje de cuenta regresiva</label>
                  <input
                    type="text"
                    value={quiz.settings.countdownMessage || ''}
                    onChange={(e) => updateQuizSettings({ countdownMessage: e.target.value })}
                    placeholder="Redirigiendo automáticamente en {countdown} segundos..."
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    Usa {'{countdown}'} donde quieres que aparezca el número
                  </small>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhook' && (
            <WebhookConfig
              webhooks={quiz.webhooks}
              onUpdate={updateQuizWebhooks}
            />
          )}
        </div>
      </div>

      {showExportModal && (
        <ExportModal
          quiz={quiz}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default QuizEditor;
