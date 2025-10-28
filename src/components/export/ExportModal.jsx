import { useState } from 'react';
import { exportService } from '../../services/exportService';
import './ExportModal.css';

function ExportModal({ quiz, onClose }) {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [embedData, setEmbedData] = useState(null);

  useState(() => {
    const generatedHtml = exportService.generateHTML(quiz);
    const generatedEmbed = exportService.generateEmbedCode(quiz);
    setHtmlCode(generatedHtml);
    setEmbedData(generatedEmbed);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${quiz.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyEmbed = () => {
    if (embedData) {
      navigator.clipboard.writeText(embedData.embedCode).then(() => {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
      });
    }
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2>🚀 Exportar Quiz</h2>
          <button className="export-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="export-modal-body">
          <div className="export-tabs">
            <button
              className={`export-tab ${activeTab === 'html' ? 'active' : ''}`}
              onClick={() => setActiveTab('html')}
            >
              📄 HTML Completo
            </button>
            <button
              className={`export-tab ${activeTab === 'embed' ? 'active' : ''}`}
              onClick={() => setActiveTab('embed')}
            >
              🔗 Código Embed (Hosting)
            </button>
          </div>

          {activeTab === 'html' && (
            <>
              <div className="export-info">
                <h3>✅ Quiz Listo para WordPress</h3>
                <p>
                  Código HTML completo y autónomo. Pégalo directamente en WordPress.
                </p>
              </div>

          <div className="export-actions">
            <button className="btn btn-primary" onClick={handleCopy}>
              {copied ? '✓ Copiado!' : '📋 Copiar HTML'}
            </button>
            <button className="btn btn-secondary" onClick={handleDownload}>
              💾 Descargar .html
            </button>
          </div>

          <div className="export-code-container">
            <div className="code-header">
              <span className="code-title">Código HTML Completo</span>
              <span className="code-size">
                {(new Blob([htmlCode]).size / 1024).toFixed(1)} KB
              </span>
            </div>
            <pre className="export-code">
              <code>{htmlCode}</code>
            </pre>
          </div>

          <div className="export-instructions">
            <h3>📝 Instrucciones de Uso:</h3>
            <ol>
              <li>Copia todo el código HTML usando el botón de arriba</li>
              <li>Ve a tu WordPress y crea/edita una página o entrada</li>
              <li>Agrega un bloque "HTML Personalizado" (Custom HTML)</li>
              <li>Pega el código completo en el bloque</li>
              <li>Publica la página y tu quiz estará funcionando</li>
            </ol>

            <div className="export-tips">
              <h4>💡 Consejos:</h4>
              <ul>
                <li>El quiz es completamente autónomo (incluye estilos y JavaScript)</li>
                <li>No necesitas instalar plugins adicionales</li>
                <li>Funciona en cualquier tema de WordPress</li>
                <li>Es responsive y se adapta a móviles</li>
                <li>Puedes tener múltiples quizzes en diferentes páginas</li>
              </ul>
            </div>
          </div>
            </>
          )}

          {activeTab === 'embed' && embedData && (
            <>
              <div className="export-info">
                <h3>🔗 Código Embed (Solo {(embedData.embedCode.length / 1024).toFixed(1)} KB)</h3>
                <p>
                  <strong>⭐ RECOMENDADO:</strong> Código súper corto que carga el quiz desde tu hosting.
                  Actualiza el quiz sin tocar WordPress.
                </p>
              </div>

              <div className="export-actions">
                <button className="btn btn-primary" onClick={handleCopyEmbed}>
                  {copiedEmbed ? '✓ Copiado!' : '📋 Copiar Código Embed'}
                </button>
              </div>

              <div className="export-code-container">
                <div className="code-header">
                  <span className="code-title">Código para WordPress</span>
                  <span className="code-size" style={{color: '#10b981'}}>
                    Solo {embedData.embedCode.length} caracteres
                  </span>
                </div>
                <pre className="export-code embed-code">
                  <code>{embedData.embedCode}</code>
                </pre>
              </div>

              <div className="export-instructions">
                <h3>📝 Instrucciones:</h3>
                <ol>
                  <li><strong>PRIMERO:</strong> Descarga el archivo <code>quizpro-loader.js</code> de la carpeta <code>dist/</code></li>
                  <li><strong>Edita el archivo</strong> y reemplaza <code>TU_ANON_KEY_AQUI</code> con tu clave de Supabase</li>
                  <li><strong>Sube el archivo</strong> a tu hosting en: <code>/quizpro/quizpro-loader.js</code></li>
                  <li><strong>En el código de arriba,</strong> reemplaza <code>tudominio.com</code> con tu dominio real</li>
                  <li><strong>Copia el código</strong> y pégalo en WordPress (Bloque "HTML Personalizado")</li>
                  <li><strong>¡Publica!</strong> El quiz se cargará automáticamente</li>
                </ol>

                <div className="export-tips">
                  <h4>✨ Ventajas del Código Embed:</h4>
                  <ul>
                    <li><strong>Código ultra corto:</strong> Solo 2 líneas vs {(htmlCode.length / 1024).toFixed(0)}KB del HTML completo</li>
                    <li><strong>Actualizaciones automáticas:</strong> Editas el quiz → Guardas → Se actualiza automáticamente en WordPress</li>
                    <li><strong>Sin re-subir archivos:</strong> Todo se guarda en Supabase, no necesitas tocar el hosting</li>
                    <li><strong>Un solo archivo:</strong> Subes <code>quizpro-loader.js</code> una sola vez</li>
                    <li><strong>Reutilizable:</strong> El mismo loader funciona para TODOS tus quiz</li>
                  </ul>

                  <h4>🔧 Ubicación de Archivos:</h4>
                  <div className="file-structure">
                    <code>
                      tudominio.com/<br/>
                      └── quizpro/<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;└── quizpro-loader.js ← Sube este archivo
                    </code>
                  </div>

                  <h4>📍 ID de este Quiz:</h4>
                  <div className="quiz-id-box">
                    <code>{quiz.id}</code>
                  </div>
                </div>

                <div className="export-warning">
                  <strong>⚠️ Importante:</strong> Revisa las instrucciones completas en el archivo <code>INSTRUCCIONES-HOSTING.md</code>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
