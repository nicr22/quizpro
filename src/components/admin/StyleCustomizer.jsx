import { useState } from 'react';
import './StyleCustomizer.css';

function StyleCustomizer({ styling, onUpdate }) {
  const fonts = [
    'Poppins',
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Arial',
    'Helvetica'
  ];

  const presetThemes = [
    {
      name: 'Moderno Azul',
      colors: {
        primaryColor: '#4361ee',
        secondaryColor: '#7209b7',
        backgroundColor: '#ffffff',
        textColor: '#1a365d'
      }
    },
    {
      name: 'Verde Profesional',
      colors: {
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        backgroundColor: '#ffffff',
        textColor: '#1f2937'
      }
    },
    {
      name: 'Naranja Vibrante',
      colors: {
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
        backgroundColor: '#fffbeb',
        textColor: '#78350f'
      }
    },
    {
      name: 'Violeta Elegante',
      colors: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#7c3aed',
        backgroundColor: '#ffffff',
        textColor: '#5b21b6'
      }
    }
  ];

  const handleColorChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleFontChange = (value) => {
    onUpdate({ fontFamily: value });
  };

  const handleStyleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const applyTheme = (theme) => {
    onUpdate(theme.colors);
  };

  return (
    <div className="style-customizer">
      <h2>Personalización de Estilos</h2>

      <div className="style-section">
        <h3>Temas Predefinidos</h3>
        <div className="themes-grid">
          {presetThemes.map((theme, index) => (
            <div
              key={index}
              className="theme-card"
              onClick={() => applyTheme(theme)}
            >
              <div className="theme-colors">
                <div
                  className="theme-color-dot"
                  style={{ backgroundColor: theme.colors.primaryColor }}
                />
                <div
                  className="theme-color-dot"
                  style={{ backgroundColor: theme.colors.secondaryColor }}
                />
              </div>
              <div className="theme-name">{theme.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="style-section">
        <h3>Colores Personalizados</h3>

        <div className="color-controls">
          <div className="color-control">
            <label>Color Primario (Botones)</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={styling.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={styling.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="color-text"
                placeholder="#4361ee"
              />
            </div>
          </div>

          <div className="color-control">
            <label>Color Secundario (Hover)</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={styling.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={styling.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="color-text"
                placeholder="#7209b7"
              />
            </div>
          </div>

          <div className="color-control">
            <label>Color de Fondo</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={styling.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={styling.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="color-text"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="color-control">
            <label>Color de Texto</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={styling.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={styling.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="color-text"
                placeholder="#1a365d"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="style-section">
        <h3>Tipografía</h3>

        <div className="font-control">
          <label>Fuente</label>
          <select
            value={styling.fontFamily || 'Poppins'}
            onChange={(e) => handleFontChange(e.target.value)}
            className="font-select"
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div className="font-control">
          <label>Tamaño de Texto - Preguntas</label>
          <div className="size-control">
            <input
              type="range"
              min="16"
              max="36"
              value={styling.questionFontSize || 20}
              onChange={(e) => handleStyleChange('questionFontSize', e.target.value)}
              className="size-slider"
            />
            <span className="size-value">{styling.questionFontSize || 20}px</span>
          </div>
        </div>

        <div className="font-control">
          <label>Tamaño de Texto - Respuestas</label>
          <div className="size-control">
            <input
              type="range"
              min="12"
              max="24"
              value={styling.answerFontSize || 16}
              onChange={(e) => handleStyleChange('answerFontSize', e.target.value)}
              className="size-slider"
            />
            <span className="size-value">{styling.answerFontSize || 16}px</span>
          </div>
        </div>
      </div>

      <div className="style-section">
        <h3>Estilo de Botones</h3>

        <div className="button-style-control">
          <label>Tipo de Botón</label>
          <select
            value={styling.buttonStyle || 'solid'}
            onChange={(e) => handleStyleChange('buttonStyle', e.target.value)}
            className="font-select"
          >
            <option value="solid">Sólido (relleno completo)</option>
            <option value="outline">Outline (solo borde)</option>
            <option value="transparent">Transparente con borde</option>
          </select>
        </div>

        <div className="button-style-control">
          <label>Grosor del Borde</label>
          <div className="size-control">
            <input
              type="range"
              min="1"
              max="5"
              value={styling.buttonBorderWidth || 2}
              onChange={(e) => handleStyleChange('buttonBorderWidth', e.target.value)}
              className="size-slider"
            />
            <span className="size-value">{styling.buttonBorderWidth || 2}px</span>
          </div>
        </div>

        <div className="button-style-control">
          <label>Redondeo de Esquinas</label>
          <div className="size-control">
            <input
              type="range"
              min="0"
              max="50"
              value={styling.buttonBorderRadius || 8}
              onChange={(e) => handleStyleChange('buttonBorderRadius', e.target.value)}
              className="size-slider"
            />
            <span className="size-value">{styling.buttonBorderRadius || 8}px</span>
          </div>
        </div>
      </div>

      <div className="style-section">
        <h3>Vista Previa</h3>
        <div className="preview-container" style={{
          backgroundColor: styling.backgroundColor,
          color: styling.textColor,
          fontFamily: styling.fontFamily
        }}>
          <h2 style={{
            color: styling.textColor,
            fontSize: `${styling.questionFontSize || 20}px`
          }}>
            ¿Pregunta de Ejemplo?
          </h2>
          <div className="preview-buttons">
            <button
              className="preview-btn"
              style={{
                backgroundColor: styling.buttonStyle === 'solid' ? styling.primaryColor : (styling.buttonStyle === 'transparent' ? 'transparent' : 'white'),
                color: styling.buttonStyle === 'solid' ? 'white' : styling.primaryColor,
                border: `${styling.buttonBorderWidth || 2}px solid ${styling.primaryColor}`,
                borderRadius: `${styling.buttonBorderRadius || 8}px`,
                fontSize: `${styling.answerFontSize || 16}px`
              }}
              onMouseEnter={(e) => {
                if (styling.buttonStyle === 'solid') {
                  e.target.style.backgroundColor = styling.secondaryColor;
                  e.target.style.borderColor = styling.secondaryColor;
                } else {
                  e.target.style.backgroundColor = styling.primaryColor;
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (styling.buttonStyle === 'solid') {
                  e.target.style.backgroundColor = styling.primaryColor;
                  e.target.style.borderColor = styling.primaryColor;
                } else {
                  e.target.style.backgroundColor = styling.buttonStyle === 'transparent' ? 'transparent' : 'white';
                  e.target.style.color = styling.primaryColor;
                }
              }}
            >
              Opción de Ejemplo
            </button>
          </div>
          <div
            className="preview-progress"
            style={{
              background: `linear-gradient(90deg, ${styling.primaryColor}, ${styling.secondaryColor})`
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StyleCustomizer;
