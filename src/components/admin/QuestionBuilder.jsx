import { useState } from 'react';
import './QuestionBuilder.css';

function QuestionBuilder({ question, index, totalQuestions, onUpdate, onDelete, onMove }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleQuestionTextChange = (text) => {
    onUpdate({ ...question, question: text });
  };

  const handleTypeChange = (type) => {
    let newOptions = question.options;

    // Ajustar opciones según el tipo
    if (type === 'text') {
      newOptions = [];
    } else if (type === 'multiple-choice' && newOptions.length === 0) {
      newOptions = [
        { text: 'Opción 1', score: 1 },
        { text: 'Opción 2', score: 2 },
        { text: 'Opción 3', score: 3 }
      ];
    } else if (type === 'select' && newOptions.length === 0) {
      newOptions = [
        { text: 'Selecciona...', score: 0 },
        { text: 'Opción A', score: 0 },
        { text: 'Opción B', score: 0 }
      ];
    }

    onUpdate({ ...question, type, options: newOptions });
  };

  const handleAddOption = () => {
    const newOption = {
      text: `Opción ${question.options.length + 1}`,
      score: 0,
      image: '' // Support for image-based options
    };
    onUpdate({ ...question, options: [...question.options, newOption] });
  };

  const handleImageUpload = (file, type, index = null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      if (type === 'question') {
        // Upload image for question
        onUpdate({ ...question, image: base64String });
      } else if (type === 'option' && index !== null) {
        // Upload image for option
        const newOptions = [...question.options];
        newOptions[index] = {
          ...newOptions[index],
          image: base64String
        };
        onUpdate({ ...question, options: newOptions });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputTypeChange = (inputType) => {
    onUpdate({ ...question, inputType });
  };

  const handleAnswerModeChange = (answerMode) => {
    onUpdate({ ...question, answerMode });
  };

  const handleUpdateOption = (optionIndex, field, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      [field]: field === 'score' ? Number(value) : value
    };
    onUpdate({ ...question, options: newOptions });
  };

  const handleDeleteOption = (optionIndex) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    onUpdate({ ...question, options: newOptions });
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      'multiple-choice': '🔘 Selección Múltiple',
      'select': '📋 Lista Desplegable',
      'text': '✏️ Texto Libre'
    };
    return labels[type] || type;
  };

  return (
    <div className="question-builder">
      <div className="question-header">
        <div className="question-header-left">
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
          <span className="question-number">Pregunta {index + 1}</span>
          <span className="question-type-badge">{getQuestionTypeLabel(question.type)}</span>
        </div>
        <div className="question-header-right">
          <button
            className="move-btn"
            onClick={() => onMove('up')}
            disabled={index === 0}
            title="Mover arriba"
          >
            ↑
          </button>
          <button
            className="move-btn"
            onClick={() => onMove('down')}
            disabled={index === totalQuestions - 1}
            title="Mover abajo"
          >
            ↓
          </button>
          <button className="delete-btn" onClick={onDelete} title="Eliminar">
            🗑️
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="question-body">
          <div className="form-group">
            <label>Tipo de Pregunta</label>
            <select
              value={question.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="select-input"
            >
              <option value="multiple-choice">Selección Múltiple (botones)</option>
              <option value="select">Lista Desplegable (select)</option>
              <option value="text">Texto Libre (input)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Texto de la Pregunta</label>
            <textarea
              value={question.question}
              onChange={(e) => handleQuestionTextChange(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              rows="2"
              className="question-text-input"
            />
          </div>

          <div className="form-group">
            <label>Imagen de la Pregunta (opcional)</label>
            <div className="image-upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], 'question')}
                className="file-input"
                id={`question-image-${index}`}
              />
              <label htmlFor={`question-image-${index}`} className="file-input-label">
                📷 {question.image ? 'Cambiar Imagen' : 'Subir Imagen'}
              </label>
              {question.image && (
                <div className="image-preview">
                  <img src={question.image} alt="Preview" />
                  <button
                    className="remove-image-btn"
                    onClick={() => onUpdate({ ...question, image: '' })}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {question.type !== 'text' && (
            <div className="options-section">
              <div className="options-header">
                <label>Opciones de Respuesta</label>
                <div className="options-controls">
                  <select
                    value={question.answerMode || 'text'}
                    onChange={(e) => handleAnswerModeChange(e.target.value)}
                    className="select-input-small"
                  >
                    <option value="text">📝 Texto</option>
                    <option value="image">🖼️ Imágenes</option>
                  </select>
                  <button className="btn-small btn-primary" onClick={handleAddOption}>
                    ➕ Agregar Opción
                  </button>
                </div>
              </div>

              <div className="options-list">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className={`option-item ${question.answerMode === 'image' ? 'option-item-image' : ''}`}>
                    <div className="option-number">{optionIndex + 1}</div>

                    {question.answerMode === 'image' ? (
                      <div className="option-image-upload">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0], 'option', optionIndex)}
                          className="file-input"
                          id={`option-image-${index}-${optionIndex}`}
                        />
                        <label htmlFor={`option-image-${index}-${optionIndex}`} className="file-input-label-small">
                          📷 {option.image ? 'Cambiar' : 'Subir'}
                        </label>
                        {option.image && (
                          <div className="option-image-preview">
                            <img src={option.image} alt={`Opción ${optionIndex + 1}`} />
                          </div>
                        )}
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleUpdateOption(optionIndex, 'text', e.target.value)}
                          placeholder="Descripción (opcional)"
                          className="option-text-input-small"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleUpdateOption(optionIndex, 'text', e.target.value)}
                        placeholder="Texto de la opción"
                        className="option-text-input"
                      />
                    )}

                    <div className="score-input-wrapper">
                      <label className="score-label">Puntos:</label>
                      <input
                        type="number"
                        value={option.score}
                        onChange={(e) => handleUpdateOption(optionIndex, 'score', e.target.value)}
                        className="score-input"
                        min="0"
                        step="1"
                      />
                    </div>
                    <button
                      className="delete-option-btn"
                      onClick={() => handleDeleteOption(optionIndex)}
                      disabled={question.options.length <= 1}
                      title="Eliminar opción"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {question.options.length === 0 && (
                <div className="empty-options">
                  <p>No hay opciones. Agrega al menos una.</p>
                </div>
              )}
            </div>
          )}

          {question.type === 'text' && (
            <div className="text-question-options">
              <div className="form-group">
                <label>Tipo de Entrada</label>
                <select
                  value={question.inputType || 'text'}
                  onChange={(e) => handleInputTypeChange(e.target.value)}
                  className="select-input"
                >
                  <option value="text">Texto (cualquier caracter)</option>
                  <option value="number">Solo Números (ej: WhatsApp)</option>
                  <option value="tel">Teléfono</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div className="text-question-note">
                <p>ℹ️ Las preguntas de texto libre no tienen puntaje. La respuesta se capturará según el tipo seleccionado.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionBuilder;
