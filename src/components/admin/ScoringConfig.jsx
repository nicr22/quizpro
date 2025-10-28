import { useState } from 'react';
import { scoringService } from '../../services/scoringService';
import './ScoringConfig.css';

function ScoringConfig({ quiz, onUpdate }) {
  const [expandedRange, setExpandedRange] = useState(null);

  const maxPossibleScore = scoringService.calculateMaxScore(quiz.questions);
  const results = quiz.scoring?.results || [];

  const handleAddRange = () => {
    const newResults = [...results];

    let minScore = 0;
    if (newResults.length > 0) {
      const lastRange = newResults[newResults.length - 1];
      minScore = lastRange.maxScore + 1;
    }

    const newRange = {
      minScore,
      maxScore: Math.min(minScore + 5, maxPossibleScore),
      level: `Nivel ${newResults.length + 1}`,
      message: '🎯 Revisa tu correo para ver los resultados',
      redirectUrl: ''
    };

    newResults.push(newRange);
    onUpdate({ results: newResults });
    setExpandedRange(newResults.length - 1);
  };

  const handleUpdateRange = (index, field, value) => {
    const newResults = [...results];
    newResults[index] = {
      ...newResults[index],
      [field]: field === 'minScore' || field === 'maxScore' ? Number(value) : value
    };
    onUpdate({ results: newResults });
  };

  const handleDeleteRange = (index) => {
    if (confirm('¿Eliminar este rango de resultados?')) {
      const newResults = results.filter((_, i) => i !== index);
      onUpdate({ results: newResults });
    }
  };

  const validation = scoringService.validateScoringConfig(quiz.questions, results);

  return (
    <div className="scoring-config">
      <div className="content-header">
        <h2>Configuración de Resultados</h2>
        <button className="btn btn-primary" onClick={handleAddRange}>
          ➕ Agregar Rango
        </button>
      </div>

      <div className="scoring-info">
        <div className="info-card">
          <div className="info-label">Puntaje Máximo Posible</div>
          <div className="info-value">{maxPossibleScore} puntos</div>
        </div>
        <div className="info-card">
          <div className="info-label">Total de Preguntas</div>
          <div className="info-value">{quiz.questions.length}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Rangos Configurados</div>
          <div className="info-value">{results.length}</div>
        </div>
      </div>

      {!validation.isValid && (
        <div className="validation-errors">
          <h3>⚠️ Errores en la configuración:</h3>
          <ul>
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 ? (
        <div className="empty-scoring">
          <p>No hay rangos de resultados configurados</p>
          <p className="empty-hint">
            Los rangos de resultados definen qué mensaje y redirección recibe el usuario según su puntuación.
          </p>
          <button className="btn btn-primary" onClick={handleAddRange}>
            Crear Primer Rango
          </button>
        </div>
      ) : (
        <div className="ranges-list">
          {results.map((range, index) => (
            <div key={index} className="range-card">
              <div
                className="range-header"
                onClick={() => setExpandedRange(expandedRange === index ? null : index)}
              >
                <div className="range-header-left">
                  <span className="range-expand-icon">
                    {expandedRange === index ? '▼' : '▶'}
                  </span>
                  <span className="range-title">{range.level}</span>
                  <span className="range-score-badge">
                    {range.minScore} - {range.maxScore} puntos
                  </span>
                </div>
                <button
                  className="delete-range-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRange(index);
                  }}
                >
                  🗑️
                </button>
              </div>

              {expandedRange === index && (
                <div className="range-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Puntaje Mínimo</label>
                      <input
                        type="number"
                        value={range.minScore}
                        onChange={(e) => handleUpdateRange(index, 'minScore', e.target.value)}
                        min="0"
                        max={maxPossibleScore}
                        className="score-range-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Puntaje Máximo</label>
                      <input
                        type="number"
                        value={range.maxScore}
                        onChange={(e) => handleUpdateRange(index, 'maxScore', e.target.value)}
                        min="0"
                        max={maxPossibleScore}
                        className="score-range-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Nombre del Nivel</label>
                    <input
                      type="text"
                      value={range.level}
                      onChange={(e) => handleUpdateRange(index, 'level', e.target.value)}
                      placeholder="Ej: Nivel 1 - Principiante"
                      className="text-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Mensaje del Resultado</label>
                    <textarea
                      value={range.message}
                      onChange={(e) => handleUpdateRange(index, 'message', e.target.value)}
                      placeholder="Mensaje que verá el usuario con este puntaje..."
                      rows="3"
                      className="text-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>URL de Redirección</label>
                    <input
                      type="url"
                      value={range.redirectUrl}
                      onChange={(e) => handleUpdateRange(index, 'redirectUrl', e.target.value)}
                      placeholder="https://ejemplo.com/resultado-nivel-1"
                      className="text-input"
                    />
                    <small className="form-hint">
                      El usuario será redirigido a esta URL después de ver sus resultados (opcional)
                    </small>
                  </div>

                  <div className="range-preview">
                    <strong>Vista Previa:</strong>
                    <div className="preview-box">
                      <div className="preview-level">{range.level}</div>
                      <div className="preview-score">{range.minScore} - {range.maxScore} puntos</div>
                      <div className="preview-message">{range.message}</div>
                      {range.redirectUrl && (
                        <div className="preview-redirect">↗ {range.redirectUrl}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="scoring-help">
        <h3>💡 Consejos:</h3>
        <ul>
          <li>Asegúrate de que los rangos cubran todos los posibles puntajes</li>
          <li>Los rangos no deben solaparse (el máximo de uno debe ser menor que el mínimo del siguiente)</li>
          <li>Puedes crear tantos rangos como necesites (Ej: Bajo, Medio, Alto)</li>
          <li>Las URLs de redirección son opcionales pero recomendadas para landing pages específicas</li>
        </ul>
      </div>
    </div>
  );
}

export default ScoringConfig;
