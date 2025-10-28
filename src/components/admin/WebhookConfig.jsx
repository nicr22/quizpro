import { useState } from 'react';
import './WebhookConfig.css';

function WebhookConfig({ webhooks = [], onUpdate }) {
  const [webhookList, setWebhookList] = useState(
    webhooks.length > 0 ? webhooks : [{ url: '', events: ['quiz_completed', 'email_captured'], name: 'Webhook 1' }]
  );
  const [testingWebhook, setTestingWebhook] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const handleAddWebhook = () => {
    const newWebhook = {
      url: '',
      events: ['quiz_completed', 'email_captured'],
      name: `Webhook ${webhookList.length + 1}`
    };
    const updatedList = [...webhookList, newWebhook];
    setWebhookList(updatedList);
    onUpdate(updatedList);
  };

  const handleRemoveWebhook = (index) => {
    const updatedList = webhookList.filter((_, i) => i !== index);
    setWebhookList(updatedList);
    onUpdate(updatedList);
  };

  const handleUpdateWebhook = (index, field, value) => {
    const updatedList = [...webhookList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setWebhookList(updatedList);
    onUpdate(updatedList);
  };

  const handleTest = async (index) => {
    const webhook = webhookList[index];

    if (!webhook.url.trim()) {
      alert('Por favor ingresa una URL primero');
      return;
    }

    setTestingWebhook(index);
    setTestResult(null);

    try {
      const testData = {
        test: true,
        email: 'test@example.com',
        timestamp: new Date().toISOString(),
        quiz_id: 'test_quiz',
        total_score: 15,
        max_score: 30,
        message: 'Este es un test del webhook'
      };

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        setTestResult({ index, success: true, message: 'Webhook respondió correctamente' });
      } else {
        setTestResult({ index, success: false, message: `Error: ${response.status} ${response.statusText}` });
      }
    } catch (error) {
      setTestResult({ index, success: false, message: `Error de conexión: ${error.message}` });
    } finally {
      setTestingWebhook(null);
    }
  };

  return (
    <div className="webhook-config">
      <div className="webhook-header">
        <h2>Configuración de Webhooks</h2>
        <button className="btn btn-primary" onClick={handleAddWebhook}>
          ➕ Agregar Webhook
        </button>
      </div>

      <div className="webhook-info">
        <p>
          Los webhooks te permiten enviar los datos del quiz a múltiples sistemas externos (CRM, email marketing, base de datos, etc.)
        </p>
      </div>

      <div className="webhooks-list">
        {webhookList.map((webhook, index) => (
          <div key={index} className="webhook-item">
            <div className="webhook-item-header">
              <input
                type="text"
                value={webhook.name}
                onChange={(e) => handleUpdateWebhook(index, 'name', e.target.value)}
                className="webhook-name-input"
                placeholder={`Webhook ${index + 1}`}
              />
              {webhookList.length > 1 && (
                <button
                  className="btn-remove-webhook"
                  onClick={() => handleRemoveWebhook(index)}
                  title="Eliminar webhook"
                >
                  🗑️
                </button>
              )}
            </div>

            <div className="form-group">
              <label>URL del Webhook</label>
              <input
                type="url"
                value={webhook.url}
                onChange={(e) => handleUpdateWebhook(index, 'url', e.target.value)}
                placeholder="https://tu-servidor.com/webhook/endpoint"
                className="webhook-input"
              />
              <small className="form-hint">
                Los datos se enviarán mediante POST en formato JSON
              </small>
            </div>

            <div className="webhook-actions">
              <button
                className="btn btn-secondary"
                onClick={() => handleTest(index)}
                disabled={testingWebhook === index || !webhook.url.trim()}
              >
                {testingWebhook === index ? '⏳ Probando...' : '🧪 Probar Webhook'}
              </button>
            </div>

            {testResult && testResult.index === index && (
              <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                <strong>{testResult.success ? '✓ Éxito:' : '✗ Error:'}</strong>
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="webhook-payload-example">
        <h3>Ejemplo de Payload (JSON)</h3>
        <pre className="code-block">
{`{
  "email": "usuario@ejemplo.com",
  "timestamp": "2024-01-15T10:30:00Z",
  "quiz_id": "quiz_123",
  "quiz_title": "Nombre del Quiz",
  "total_score": 25,
  "max_score": 30,
  "result_level": "Nivel 3",
  "result_message": "Excelente resultado",
  "redirect_url": "https://ejemplo.com/nivel-3",
  "question_path": [
    {
      "question": 1,
      "answer": "Opción A",
      "score": 3
    }
  ],
  "responses": {
    "quiz-question-1": {
      "question": "¿Pregunta 1?",
      "answer": "Opción A",
      "score": 3
    }
  },
  "utm_source": "facebook",
  "utm_medium": "cpc",
  "utm_campaign": "campaña1"
}`}
        </pre>
      </div>

      <div className="webhook-help">
        <h3>💡 Información Útil:</h3>
        <ul>
          <li>El webhook se ejecuta cuando el usuario completa el quiz y envía su email</li>
          <li>Los datos incluyen respuestas, puntaje, parámetros UTM y más</li>
          <li>Usa servicios como Zapier, Make, n8n o tu propio servidor</li>
          <li>Asegúrate de que tu endpoint acepte requests POST con JSON</li>
        </ul>
      </div>
    </div>
  );
}

export default WebhookConfig;
